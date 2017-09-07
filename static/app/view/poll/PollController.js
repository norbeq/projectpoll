Ext.define('PP.view.poll.PollController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.poll',

    guest_uuid: null,
    current_question_id: null,

    save_and_next: function () {
        var me = this,
            answer = this.lookup("poll_form").getValues()['answer'];
        Ext.Ajax.request({
            url: 'api/respondent/question/' + this.guest_uuid + "/vote",
            method: "POST",
            params: Ext.util.JSON.encode({
                answer: answer,
                question_id: me.current_question_id
            }),
            defaultHeaders: {'Content-Type': 'application/json'},
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                console.log(obj);
                if (obj.success) {
                    me.getQuestion();
                }
            },
            failure: function (response, opts) {
                console.log("nn");
            }
        });

    },

    generateView: function (data) {
        var me = this;
        Ext.getCmp('poll').unmask();

        if (this.lookup('poll_panel')) {
            this.lookup('poll_panel').destroy();
        }

        Ext.getCmp('poll').insert(1, {
            flex: 20,
            xtype: "panel",
            layout: 'fit',
            reference: "poll_panel",
            scrollable: true,
            items: [{
                height: "100%",
                xtype: "form",
                reference: "poll_form",
                padding: 15,
                scrollable: true
            }],
            padding: 5

        });

        switch (data.type) {
            case "custom":
                me.lookup('poll_form').add({
                    xtype: "component",
                    html: "<h2><center>" + data.name + "</center></h2>",
                    anchor: "100%"
                });
                me.lookup('poll_form').add({
                    xtype: "component",
                    html: "<center>" + data.description + "</center>",
                    anchor: "100%"
                });
                 me.lookup('poll_form').add(
                    {
                        xtype: 'fieldset',
                        defaults: {
                            flex: 1
                        },
                        layout: 'vbox',
                        items: [{
                            xtype: "textarea",
                            width: "100%",
                            name: "answer"
                        }]
                    }
                );
                break;
            case "select":
                me.lookup('poll_form').add({
                    xtype: "component",
                    html: "<h2><center>" + data.name + "</center></h2>",
                    anchor: "100%"
                });
                me.lookup('poll_form').add({
                    xtype: "component",
                    html: "<center>" + data.description + "</center>",
                    anchor: "100%"
                });

                var answers = [];

                Ext.Array.forEach(data.answers, function (answer) {
                    var ans = {};
                    ans.name = "answer";
                    ans.boxLabel = answer.name;
                    ans.inputValue = answer.id;
                    answers.push(ans);
                });

                me.lookup('poll_form').add(
                    {
                        xtype: 'fieldset',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'vbox',
                        items: answers
                    }
                );
                break;
        }
    },

    endPoll: function () {
        if (this.lookup('poll_panel')) {
            this.lookup('poll_panel').destroy();
        }
        Ext.getCmp('poll').insert(1, {
            flex: 20,
            xtype: "panel",
            layout: 'fit',
            padding: 30,
            html: "<h1><center>Dziękujemy za wypełnienie ankiety.</center></h1>"
        });
        this.lookup('next_button').disable();
    },

    getQuestion: function () {
        var me = this;
        Ext.Ajax.request({
            url: 'api/respondent/question/' + this.guest_uuid,
            method: "GET",
            defaultHeaders: {'Content-Type': 'application/json'},
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    if (obj.data !== null) {
                        me.current_question_id = obj.data.id;
                        me.generateView(obj.data);
                    } else {
                        me.endPoll();
                    }
                } else {
                    console.log("nn");
                }
            },
            failure: function (response, opts) {
                console.log("nn");
            }
        });
    },

    onPollRender: function (a) {
        this.guest_uuid = a.guest_uuid;
        this.getQuestion(this.guest_uuid);
    }
});
