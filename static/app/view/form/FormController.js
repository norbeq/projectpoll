Ext.define('PP.view.form.FormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form',

    monitoring: function (grid, rowIndex) {
        var rec = grid.getStore().getAt(rowIndex);

        Ext.Ajax.request({
            url: 'api/form/' + rec.id + '/votes',
            method: "GET",
            defaultHeaders: {'Content-Type': 'application/json', 'auth': Ext.util.Cookies.get('auth')},
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {


                    var question_answer_store = Ext.create('Ext.data.Store', {
                        storeId: 'poll_questions_answer_' + rec.id,
                        data: obj.question_answers_grouped,
                        fields: [
                            {name: "form_question_id", type: "int"},
                            {name: "form_question_answer_id", type: "int", allowNull: true},
                            {name: "form_question_name", type: "string"},
                            {name: "answer", type: "string"},
                            {name: "custom_answer", type: "string", allowNull: true},
                            {name: "count", type: "int"}
                        ]
                    });

                    var questions = [];
                    var question_charts = [];
                    Ext.iterate(obj.questions, function (_, question) {
                        questions.push(question);
                        if (question.type === "select") {
                            var ss = Ext.create("Ext.data.ChainedStore", {
                                source: question_answer_store,
                                filters: [function (item) {
                                    return item.get('form_question_id') == question.id;
                                }]
                            });
                            question_charts.push({
                                innerPadding: 10,
                                xtype: 'polar',
                                height: 350,
                                store: ss,
                                background: '#f6f6f6',
                                legend: {
                                    type: 'sprite',
                                    docked: 'bottom',
                                    background: '#f6f6f6'
                                },
                                title: question.name,
                                tools: [{
                                    type: 'print',
                                    tooltip: 'Zapisz wykres',
                                    callback: function (panel, tool, event) {
                                        panel.download();
                                    }
                                }],
                                interactions: ['rotate', 'itemhighlight'],
                                series: [{
                                    type: 'pie',
                                    animation: {
                                        easing: 'easeOut',
                                        duration: 500
                                    },
                                    opacity: 0.8,
                                    donut: 30,
                                    distortion: 0.60,
                                    thickness: 10,
                                    angleField: 'count',
                                    clockwise: false,
                                    highlight: {
                                        margin: 20
                                    },
                                    label: {
                                        field: 'answer',
                                        display: 'outside',
                                        fontSize: 16
                                    },
                                    style: {
                                        strokeStyle: 'white',
                                        lineWidth: 1
                                    },
                                    tooltip: {
                                        trackMouse: true,
                                        renderer: function (tooltip, record, item) {
                                            tooltip.setHtml(record.get('answer') + ': ' + record.get('count'));
                                        }
                                    }
                                }]
                            });
                        }
                    });
                    var question_store = Ext.create('Ext.data.Store', {
                        storeId: 'poll_questions_' + rec.id,
                        data: questions,
                        fields: [
                            {name: "id", type: "int"},
                            {name: "name", type: "string"},
                            {name: "description", type: "string"},
                            {name: "type", type: "string"},
                            {name: "answers", type: "auto"}
                        ]
                    });


                    // var answers = {};

                    var respondents = [];
                    Ext.iterate(obj.respondents, function (respondent_id, respondent) {
                        var a = {};
                        a.id = respondent_id;
                        a.completed = respondent.completed;

                        Ext.iterate(respondent.answers, function (key, val) {
                            a[key] = val;
                        });
                        respondents.push(a);
                    });

                    var fields = [{name: 'id', type: 'int'}, {name: 'completed', type: 'boolean'}];
                    Ext.Array.forEach(questions, function (q) {
                        if (q.type === "select") {
                            fields.push({name: q.name, type: 'int', allowNull: true});
                        } else {
                            fields.push({name: q.name, type: 'string', allowNull: true});
                        }
                    });


                    var win = Ext.create('Ext.window.Window', {
                        width: 800,
                        treeToHtml: function (tree) {
                            if (tree.category) {
                                return ['<ul>',
                                    '<li>',
                                    '<a href="#">',
                                    '<b>', tree.category, '</b>',
                                    '</a>',
                                    '</li>',
                                    '</ul>'].join('');
                            }

                            return ['<ul>',
                                '<li>',
                                '<a href="#">',
                                '<b>', tree.attribute, ' ', tree.predicateName, ' ', tree.pivot, ' ?</b>',
                                '</a>',
                                '<ul>',
                                '<li>',
                                '<a href="#">Tak</a>',
                                win.treeToHtml(tree.match),
                                '</li>',
                                '<li>',
                                '<a href="#">Nie</a>',
                                win.treeToHtml(tree.notMatch),
                                '</li>',
                                '</ul>',
                                '</li>',
                                '</ul>'].join('');
                        },
                        respondents: respondents,
                        height: 600,
                        modal: true,
                        defaults: {
                            padding: 10
                        },
                        id: "form_monitoring",
                        form_id: rec.get('id'),
                        maximizable: true,
                        title: "Monitoring " + rec.get("name"),
                        border: false,
                        resizable: true,
                        constrainHeader: true,
                        controller: "form",
                        scrollable: true,
                        layout: 'accordion',
                        items: [{
                            title: "Wykresy szczegółowe",
                            scrollable: true,
                            items: question_charts
                        }, {
                            title: "Drzewo decyzyjne",
                            scrollable: true,
                            dockedItems: [{
                                items: "toolbar",
                                layout: "vbox",
                                items: [{
                                    xtype: 'combobox',
                                    fieldLabel: "Wybierz Pytanie",
                                    store: Ext.create("Ext.data.ChainedStore", {
                                        source: question_store,
                                        filters: [function (item) {
                                            return item.get('type') == "select";
                                        }]
                                    }),
                                    queryMode: "local",
                                    displayField: "name",
                                    itemId: "current_question",
                                    listeners: {
                                        change: function (a, value) {
                                            var decisionTree = new dt.DecisionTree({
                                                trainingSet: respondents,
                                                categoryAttr: value,
                                                ignoredAttributes: ['id', 'completed'],
                                                maxTreeDepth: 5
                                            });

                                            a.up('window').down('#tree-container').getEl().fadeOut();
                                            a.up('window').down('#tree-container').setHtml('<div class="tree">' + win.treeToHtml(decisionTree.root) + '</div>');
                                            a.up('window').down('#tree-container').getEl().fadeIn();
                                        }
                                    }
                                }, {
                                    xtype: 'button',
                                    text: "Pobierz",
                                    width: "100%",
                                    handler: function () {
                                        console.log(this.up('window').down('#tree-container'));
                                        var tree_container = this.up('window').down('#tree-container').el.dom.innerHTML,
                                            current_question = this.up('window').down('#current_question').getValue() || "Drzewo decyzyjne";
                                        a = new Blob(["<style>.tree li,.tree ul{position:relative;transition:all .5s}.tree ul{padding-top:20px;-webkit-transition:all .5s;-moz-transition:all .5s}.tree li{white-space:nowrap;float:left;text-align:center;list-style-type:none;padding:20px 5px 0;-webkit-transition:all .5s;-moz-transition:all .5s}.tree li::after,.tree li::before,.tree ul ul::before{content:'';position:absolute;top:0;height:20px}.tree li::after,.tree li::before{right:50%;border-top:1px solid #ccc;width:50%}.tree li::after{right:auto;left:50%;border-left:1px solid #ccc}.tree li:only-child::after,.tree li:only-child::before{display:none}.tree li:only-child{padding-top:0}.tree li:first-child::before,.tree li:last-child::after{border:0}.tree li:last-child::before{border-right:1px solid #ccc;border-radius:0 5px 0 0;-webkit-border-radius:0 5px 0 0;-moz-border-radius:0 5px 0 0}.tree li:first-child::after{border-radius:5px 0 0;-webkit-border-radius:5px 0 0;-moz-border-radius:5px 0 0}.tree ul ul::before{left:50%;border-left:1px solid #ccc;width:0}.tree li a{border:1px solid #ccc;padding:5px 10px;text-decoration:none;color:#666;font-family:arial,verdana,tahoma;font-size:11px;display:inline-block;border-radius:5px;-webkit-border-radius:5px;-moz-border-radius:5px;transition:all .5s;-webkit-transition:all .5s;-moz-transition:all .5s}.tree li a:hover,.tree li a:hover+ul li a{background:#c8e4f8;color:#000;border:1px solid #94a0b4}.tree li a:hover+ul li::after,.tree li a:hover+ul li::before,.tree li a:hover+ul ul::before,.tree li a:hover+ul::before{border-color:#94a0b4}</style>" + tree_container], {type: "text/html; charset=utf-8"})
                                        saveAs(a, current_question + ".html");
                                    }
                                }]
                            }],
                            items: [{
                                xtype: "container",
                                itemId: "tree-container",
                                scrollable: true
                            }]
                        }]
                    }).show();
                }
            },
            failure: function (response, opts) {
                PP.util.Toast.show('Błąd monitoringu', 'Błąd', 't')
            }
        });


    },

    generate_link: function (grid, rowIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        var link = window.location.origin + "/#poll/" + rec.get('form_uuid');
        var win = Ext.create('Ext.window.Window', {
            width: 450,
            height: 150,
            modal: true,
            defaults: {
                padding: 10
            },
            title: "Wygeneraowany link",
            border: false,
            resizable: true,
            alwaysOnTop: true,
            style: {
                opacity: 0.9
            },
            layout: 'vbox',
            constrainHeader: true,
            controller: "form",
            scrollable: true,
            items: [{
                html: "Wygenerowany link: <br><a target='_BLANK' href='" + link + "'>" + link + "</a>"
            }]
        }).show();
    }
    ,

    remove_question_answer: function (grid, rowIndex) {
        var store = grid.getStore(),
            rec = store.getAt(rowIndex);
        store.remove(rec);

        store.sync({
            success: function (batch, options) {
                PP.util.Toast.show('Odpowiedź została usunięta pomyślnie', 'Sukces', 't');
            },
            failure: function (batch, options) {
                PP.util.Toast.show('Usunięcie odpowiedzi nie powiodło się', 'Błąd', 't');
                store.rejectChanges();
            }
        });
    }
    ,

    add_question_answer: function () {
        var store = this.lookup('question_answer_grid').getStore();
        store.add(this.lookup('add_answer_form').getValues());
        store.sync({
            success: function (batch, options) {
                PP.util.Toast.show('Odpowiedź została utworzona pomyślnie', 'Sukces', 't');
            },
            failure: function (batch, options) {
                PP.util.Toast.show('Utworzenie odpowiedzi nie powiodło się', 'Błąd', 't');
                store.rejectChanges();
            }
        });
    }
    ,

    question_answers: function (grid, rowIndex) {
        var rec = grid.getStore().getAt(rowIndex),
            me = this;

        console.log(rec);

        var store = Ext.create('Ext.data.Store', {
            storeId: 'question_answers_' + rec.id,

            fields: [
                {name: 'id', type: 'int'},
                {name: 'name', type: 'string', allowNull: false}
            ],
            proxy: {
                type: 'rest',
                url: 'api/form/' + rec.get('form_id') + '/question/' + rec.id + '/answer',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                writer: {
                    writeRecordId: false
                }
            }
        }).load();

        var win = Ext.create('Ext.window.Window', {
            width: 600,
            height: 500,
            modal: true,
            defaults: {
                padding: 10
            },
            title: "Dodaj odpowiedź",
            border: false,
            resizable: true,
            alwaysOnTop: true,
            style: {
                opacity: 0.9
            },
            layout: 'vbox',
            constrainHeader: true,
            controller: "form",
            scrollable: true,
            items: [{
                xtype: "form",
                reference: "add_answer_form",
                width: "100%",
                items: [{
                    xtype: "textfield",
                    fieldLabel: "Nazwa",
                    name: "name"
                }],
                buttons: [{
                    text: "Dodaj odpowiedź",
                    handler: "add_question_answer"
                }]
            }, {
                xtype: "fieldcontainer",
                width: "100%",
                items: [{

                    reference: "question_answer_grid",
                    scrollable: true,
                    width: "100%",
                    xtype: "grid",
                    store: store,
                    columns: [{
                        text: 'Nazwa',
                        flex: 1,
                        dataIndex: 'name'
                    }, {
                        xtype: 'actioncolumn',
                        width: 80,
                        items: [{
                            getClass: function () {
                                return 'x-fa fa-trash';
                            },
                            tooltip: 'Usuń',
                            handler: "remove_question_answer"
                        }]
                    }]
                }]

            }
            ]
        }).show();
    }
    ,

    add_question: function () {
        var question_store = this.lookup('question_add_form').question_grid.getStore(),
            me = this;
        question_store.add(this.lookup('question_add_form').getValues());
        question_store.sync({
            success: function (batch, options) {
                PP.util.Toast.show('Pytanie zostało utworzone pomyślnie', 'Sukces', 't');
                me.getView().close();
            },
            failure: function (batch, options) {
                PP.util.Toast.show('Utworzenie pytania nie powiodło się', 'Błąd', 't');
                question_store.rejectChanges();
            }
        });
    }
    ,

    remove_question: function (grid, rowIndex) {
        var rec = grid.getStore().getAt(rowIndex),
            store = grid.getStore(),
            me = this;
        console.log("dada");
        Ext.MessageBox.show({
            title: "Usunięcie pytania",
            msg: Ext.String.format('Czy na pewno chcesz usunąć pytanie {0}?', rec.get('name')),
            buttons: Ext.MessageBox.YESNO,
            buttonText: {
                yes: "Tak",
                no: "Nie"
            },
            scope: this,
            fn: function (btn, text) {
                console.log(store);
                console.log(rec);
                if (btn === "yes") {
                    store.remove(rec);
                    store.sync({
                        success: function (batch, options) {
                            PP.util.Toast.show('Pytanie zostało usunięte pomyślnie', 'Sukces', 't');
                        },
                        failure: function (batch, options) {
                            PP.util.Toast.show('Usunięcie pytania nie powiodło się', 'Błąd', 't');
                            store.rejectChanges();
                        }
                    });
                }
            }
        }).toFront();
    }
    ,

    create_question: function () {
        var question_grid = this.lookup('question_grid');

        var win = Ext.create('Ext.window.Window', {
            width: 600,
            height: 500,
            modal: true,
            defaults: {
                padding: 10
            },
            title: "Dodaj pytanie",
            border: false,
            resizable: true,
            alwaysOnTop: true,
            style: {
                opacity: 0.9
            },
            layout: 'vbox',
            constrainHeader: true,
            controller: "form",
            buttons: [{
                text: "Dodaj pytanie",
                handler: "add_question"
            }],
            scrollable: true,
            items: [{
                xtype: "form",
                reference: "question_add_form",
                question_grid: question_grid,
                width: "100%",
                items: [{
                    xtype: "textfield",
                    fieldLabel: "Nazwa",
                    name: "name"
                }, {
                    xtype: "textfield",
                    fieldLabel: "Opis",
                    name: "description"
                }, {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Rodzaj',
                    defaultType: 'radiofield',
                    defaults: {
                        flex: 1
                    },
                    layout: 'hbox',
                    items: [
                        {
                            boxLabel: 'Wybór',
                            name: 'type',
                            inputValue: "select",
                            checked: true
                        },
                        {
                            boxLabel: 'Opis',
                            name: 'type',
                            inputValue: "custom"
                        }
                    ]
                }, {
                    xtype: "numberfield",
                    fieldLabel: "Pozycja",
                    name: "position",
                    minValue: 1,
                    value: 1
                }]
            }
                // , {
                //     xtype: "fieldcontainer",
                //     width: "100%",
                //     items: [{
                //
                //         reference: "question_answer_grid",
                //         scrollable: true,
                //         width: "100%",
                //         xtype: "grid",
                //         store: Ext.create("Ext.data.Store", {
                //             fields: [
                //                 {name: 'name', type: 'string'},
                //
                //             ],
                //         }),
                //         buttons: [{
                //             text: "Dodaj odpowiedź"
                //         }],
                //         columns: [{
                //             text: 'Nazwa',
                //             flex: 1,
                //             dataIndex: 'name'
                //         }, {
                //             xtype: 'actioncolumn',
                //             width: 80,
                //             items: [{
                //                 getClass: function () {
                //                     return 'x-fa fa-trash';
                //                 },
                //                 tooltip: 'Usuń',
                //                 handler: function (grid, rowIndex) {
                //                     var rec = grid.getStore().getAt(rowIndex);
                //                     grid.getStore().remove(rec);
                //                 }
                //             }]
                //         }]
                //     }]
                //
                // }
            ]
        }).show();
    }
    ,

    questions: function (grid, rowIndex) {
        var rec = grid.getStore().getAt(rowIndex);

        var store = Ext.create('Ext.data.Store', {
            storeId: 'questions_' + rec.id,

            fields: [
                {name: 'id', type: 'int'},
                {name: 'name', type: 'string', allowNull: false},
                {name: 'description', type: 'string', allowNull: true},
                {name: 'type', type: 'string', allowNull: false},
                {name: 'position', type: 'int'},
                {name: 'form_id', type: 'int', persist: true}
            ],
            proxy: {
                type: 'rest',
                url: 'api/form/' + rec.id + '/question',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                writer: {
                    writeRecordId: false
                }
            }
        }).load();

        var win = Ext.create('Ext.window.Window', {
            width: 600,
            height: 500,
            defaults: {
                padding: 10
            },
            title: "Pytania",
            border: false,
            resizable: true,
            modal: true,
            style: {
                opacity: 0.9
            },
            layout: 'fit',
            constrainHeader: true,
            controller: "form",
            buttons: [{
                text: "Dodaj pytanie",
                handler: "create_question"
            }],

            items: [{
                form_id: rec.id,
                reference: "question_grid",
                scrollable: true,
                xtype: "grid",
                store: store,
                columns: [{
                    text: 'Nazwa',
                    flex: 1,
                    dataIndex: 'name'
                }, {
                    text: 'Description',
                    dataIndex: 'opis'
                }, {
                    text: 'Rodzaj',
                    flex: 1,
                    dataIndex: 'type'
                }, {
                    text: 'Pozycja',
                    flex: 1,
                    dataIndex: 'position'
                }, {
                    xtype: 'actioncolumn',
                    width: 80,
                    items: [{
                        getClass: function () {
                            return 'x-fa fa-check';
                        },
                        tooltip: 'Odpowiedzi',
                        handler: "question_answers"
                    }, {
                        getClass: function () {
                            return 'x-fa fa-trash';
                        },
                        tooltip: 'Usuń',
                        handler: "remove_question"
                    }]
                }]
            }]
        }).show();

    }
    ,

    remove_form: function (grid, rowIndex) {
        var rec = grid.getStore().getAt(rowIndex),
            store = Ext.getStore('Forms'),
            me = this;
        Ext.MessageBox.show({
            title: "Usunięcie formularza",
            msg: Ext.String.format("Czy na pewno chcesz usunąć formularz <u>{0}</u>?", rec.get('name')),
            buttons: Ext.MessageBox.YESNO,
            buttonText: {
                yes: "Tak",
                no: "Nie"
            },
            scope: this,
            fn: function (btn, text) {
                if (btn === "yes") {
                    store.remove(rec);
                    store.sync({
                        success: function (batch, options) {
                            PP.util.Toast.show('Formularz został usunięty pomyślnie', 'Sukces', 't');
                        },
                        failure: function (batch, options) {
                            PP.util.Toast.show('Usunięcie formularza nie powiodło się', 'Błąd', 't');
                            store.rejectChanges();
                        }
                    });
                }
            }
        });
    }
    ,

    edit_form: function (grid, rowIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        var win = Ext.create('Ext.window.Window', {
            width: 600,
            height: 500,
            modal: true,
            defaults: {
                padding: 10
            },
            title: "Edycja formularzu",
            border: false,
            resizable: true,
            alwaysOnTop: true,
            style: {
                opacity: 0.9
            },
            layout: 'fit',
            constrainHeader: true,
            controller: "form",
            items: [{
                scrollable: true,
                xtype: 'form',
                reference: "formEdit",
                itemId: "formEdit",
                buttons:
                    [{
                        text: "Zapisz",
                        handler: "save_form"
                    }],
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: "Nazwa",
                        maxLength: "45",
                        name: "name"
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Aktywny',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items: [
                            {
                                boxLabel: 'Tak',
                                name: 'active',
                                inputValue: true
                            },
                            {
                                boxLabel: 'Nie',
                                name: 'active',
                                itemId: "not_active",
                                inputValue: false
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Kolejność pytań',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items: [
                            {
                                boxLabel: 'Wg pozycji',
                                name: 'order',
                                inputValue: 'position'
                            },
                            {
                                boxLabel: 'Losowa',
                                name: 'order',
                                inputValue: 'random'
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Powiadomienie (na adres email) po wypełnieniu formularza',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items: [
                            {
                                boxLabel: 'Tak',
                                name: 'completion_notify',
                                inputValue: true
                            },
                            {
                                boxLabel: 'Nie',
                                name: 'completion_notify',
                                inputValue: false,
                                itemId: "not_completion_notify"
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Zabezpieczenie hasłem',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items: [
                            {
                                boxLabel: 'Tak',
                                name: 'password_restriction',
                                inputValue: true
                            }, {
                                boxLabel: 'Nie',
                                name: 'password_restriction',
                                itemId: "not_password_restriction",
                                inputValue: false
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: "Hasło",
                        maxLength: "128",
                        name: "password"
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Blokowanie wypełnień z jednego komputera za pomocą IP oraz Cookie',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items: [
                            {
                                boxLabel: 'Tak',
                                name: 'cookie_restriction',
                                inputValue: true
                            }, {
                                boxLabel: 'Nie',
                                itemId: "not_cookie_restriction",
                                name: 'cookie_restriction',
                                inputValue: false
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Zabezpieczenie z danego adresu ip',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items: [
                            {
                                boxLabel: 'Tak',
                                name: 'ip_address_restriction',
                                inputValue: true
                            }, {
                                boxLabel: 'Nie',
                                itemId: "not_ip_address_restriction",
                                name: 'ip_address_restriction',
                                inputValue: false
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: "Adres IP",
                        name: "ip_address"
                    }

                ]
            }]

        }).show();
        win.down('#formEdit').loadRecord(rec);
        if (rec.get('ip_address_restriction') === false) {
            console.log(win.down('#not_ip_address_restriction'));
            win.down('#not_ip_address_restriction').setValue(true);
        }
        if (rec.get('cookie_restriction') === false) {
            win.down('#not_cookie_restriction').setValue(true);
        }
        if (rec.get('password_restriction') === false) {
            win.down('#not_password_restriction').setValue(true);
        }
        if (rec.get('active') === false) {
            win.down('#not_active').setValue(true);
        }
        if (rec.get('completion_notify') === false) {
            win.down('#not_completion_notify').setValue(true);
        }
    }
    ,

    save_form: function () {
        var values = this.lookup('formEdit').getValues(),
            record = this.lookup('formEdit').getRecord(),
            store = Ext.getStore('Forms'),
            me = this;
        record.set(values);
        store.sync({
            success: function (batch, options) {
                PP.util.Toast.show('Formularz został zaktualizowany pomyślnie', 'Sukces', 't');
                me.getView().close();
            },
            failure: function (batch, options) {
                PP.util.Toast.show('Zaktualizowanie formularza nie powiodło się', 'Błąd', 't');
                store.rejectChanges();
            }
        });
    }
    ,


    add_form: function () {
        var values = this.lookup('formAdd').getValues(),
            store = Ext.getStore('Forms'),
            me = this;
        store.add(values);
        store.sync({
            success: function (batch, options) {
                PP.util.Toast.show('Formularz został utworzony pomyślnie', 'Sukces', 't');
                me.getView().close();
            },
            failure: function (batch, options) {
                PP.util.Toast.show('Utworzenie formularza nie powiodło się', 'Błąd', 't');
                store.rejectChanges();
            }
        });
    }
    ,

    create_poll: function (a, b) {
        Ext.create('Ext.window.Window', {
            width: 600,
            height: 600,
            modal: true,
            defaults: {
                padding: 10
            },
            title: "Dodaj formularz ankietowy",
            border: false,
            resizable: true,
            alwaysOnTop: true,
            style: {
                opacity: 0.9
            },
            layout: 'fit',
            constrainHeader: true,
            controller: "form",
            items: [{
                scrollable: true,
                xtype: 'form',
                reference: "formAdd",
                buttons:
                    [{
                        text: "Zapisz",
                        handler: "add_form"
                    }],
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: "Nazwa",
                        maxLength: "45",
                        name: "name"
                    },
                    {
                        xtype: 'textareafield',
                        name: 'description',
                        fieldLabel: 'Opis',
                        width: "90%"
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Kolejność pytań',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items: [{
                            boxLabel: 'Wg pozycji',
                            name: 'order',
                            inputValue: 'position',
                            checked: true
                        },
                            {
                                boxLabel: 'Losowa',
                                name: 'order',
                                inputValue: 'random'
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Powiadomienie (na adres email) po wypełnieniu formularza',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items: [
                            {
                                boxLabel: 'Tak',
                                name: 'completion_notify',
                                inputValue: true
                            },
                            {
                                boxLabel: 'Nie',
                                name: 'completion_notify',
                                inputValue: false,
                                checked: true
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Zabezpieczenie hasłem',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items: [
                            {
                                boxLabel: 'Tak',
                                name: 'password_restriction',
                                inputValue: true
                            }, {
                                boxLabel: 'Nie',
                                name: 'password_restriction',
                                inputValue: false,
                                checked: true
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: "Hasło",
                        maxLength: "128",
                        name: "password"
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Blokowanie wypełnień z jednego komputera za pomocą IP oraz Cookie',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items: [
                            {
                                boxLabel: 'Tak',
                                name: 'cookie_restriction',
                                inputValue: true
                            }, {
                                boxLabel: 'Nie',
                                name: 'cookie_restriction',
                                inputValue: false,
                                checked: true
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Zabezpieczenie z danego adresu ip',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items: [
                            {
                                boxLabel: 'Tak',
                                name: 'ip_address_restriction',
                                inputValue: true
                            }, {
                                boxLabel: 'Nie',
                                name: 'ip_address_restriction',
                                inputValue: false,
                                checked: true
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: "Adres IP",
                        name: "ip_address"
                    }

                ]
            }]

        }).show();


    }
})
;
