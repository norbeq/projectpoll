Ext.define('PP.view.form.FormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form',

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
    },

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
    },

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
    },

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
    },

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
    },

    remove_question: function (grid, rowIndex) {
        var rec = grid.getStore().getAt(rowIndex),
            store = grid.getStore(),
            me = this;
        console.log("dada");
        Ext.MessageBox.show({
            title: "Usunięcie pytania",
            msg: 'Czy na pewno chcesz usunąć pytanie ?',
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
    },

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
                    xtype: "textfield",
                    fieldLabel: "Rodzaj",
                    name: "type"
                }, {
                    xtype: "numberfield",
                    fieldLabel: "Pozycja",
                    name: "position"
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
    },

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

    },

    remove_form: function (grid, rowIndex) {
        var rec = grid.getStore().getAt(rowIndex),
            store = Ext.getStore('Forms'),
            me = this;
        Ext.MessageBox.show({
            title: "Usunięcie formularza",
            msg: 'Czy na pewno chcesz usunąć formularz ?',
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
    },

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
                                itemId:"not_active",
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
        if (rec.get('active') === false){
            win.down('#not_active').setValue(true);
        }
    },

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
    },


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
    },

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
});
