Ext.define('PP.util.SocketIO', {
    extend: 'Ext.util.Observable',

    constructor: function (config) {
        var me = this;
        me.superclass.constructor.call(
            this
        );

        me.socket = io.connect(config['host'], {
            'port': config['port'],
            'reconnect': config['reconnect'],
            'reconnection delay': config['reconnection delay'],
            'max reconnection attempts': config['max reconnection attemps'],
            'transports': ['websocket', 'flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling'],
            extraHeaders: {
                auth: PP.util.Security.getToken()
            }
        });

        me.socket.on('connect', function () {
            me.fireEvent('socketconnect', me, this, arguments);
        });

        me.socket.on('disconnect', function () {
            me.fireEvent('socketdisconnect', me, this, arguments);
        });

        me.socket.on('message', function (data) {
            me.message(data);
        });
        me.socket.on('vote-end', function (data) {
            if (data.form_id) {
                var win = Ext.getCmp('form_monitoring');
                if (win) {
                    if (win.form_id === data.form_id) {
                        var found = false;
                        var i = 0;
                        Ext.Array.forEach(win.respondents, function (res) {
                            if (res.id == data.respondent_id) {
                                found = true;
                                return true;
                            }
                            i++;
                        });
                        if (found) {
                            win.respondents[i]['completed'] = true;
                        }
                    }
                }
            }
        });

        me.socket.on('vote', function (data) {

            if (data.form_id) {
                var store = Ext.getStore('poll_questions_answer_' + data.form_id);
                if (store) {
                    var rr = store.findBy(function (record, id) {
                        if (record.get('form_question_id') === data.form_question_id) {
                            if (record.get('form_question_answer_id') === data.form_question_answer_id) {
                                return true;
                            }
                        }
                    });
                    if (rr > -1) {
                        store.getAt(rr).set("count", store.getAt(rr).get('count') + 1);
                    } else {
                        store.add(data);
                    }
                }

                var win = Ext.getCmp('form_monitoring');
                if (win) {
                    if (win.form_id === data.form_id) {
                        if (win.down('#current_question').getValue() !== "" && win.down('#current_question').getValue() !== null) {
                            var respondents = win.respondents;
                            var found = false;
                            var i = 0;
                            Ext.Array.forEach(respondents, function (res) {
                                if (res.id == data.respondent_id) {
                                    found = true;
                                    return true;
                                }
                                i++;
                            });
                            if (found) {

                                win.respondents[i][data.form_question_name] = data.answer;

                            } else {
                                var new_respondent = {'id': data.respondent_id, 'completed': false};
                                new_respondent[data.form_question_name] = data.answer;

                                win.respondents.push(new_respondent);
                            }

                            var decisionTree = new dt.DecisionTree({
                                trainingSet: win.respondents,
                                categoryAttr: win.down('#current_question').getValue(),
                                ignoredAttributes: ['id', 'completed'],
                                maxTreeDepth: 5
                            });

                            win.down('#tree-container').getEl().fadeOut();
                            win.down('#tree-container').setHtml('<div class="tree">' + win.treeToHtml(decisionTree.root) + '</div>');
                            win.down('#tree-container').getEl().fadeIn();
                        }
                    }
                }

            }

        });
    },

    message: function (data) {
        console.log(data);
    }
});