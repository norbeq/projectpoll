Ext.define('PP.view.form.Forms', {
    extend: 'Ext.panel.Panel',
    xtype: 'forms',
    listeners: {
        render: function () {
            Ext.getStore('Forms').load();
        }
    },
    controller: "form",
    items: [
        {
            xtype: 'grid',
            store: "Forms",
            plugins: [{
                ptype: 'rowexpander',
                rowBodyTpl: new Ext.XTemplate('<p><b>Opis:</b> {description}</p>')
            }],

            columns:
                [
                    {
                        text: 'Nazwa',
                        sortable: false,
                        hideable: false,
                        dataIndex: 'name',
                        flex: 2
                    },
                    {
                        text: 'Data utworzenia',
                        sortable: false,
                        hideable: false,
                        dataIndex: 'created_date',
                        flex: 2
                    },
                    {
                        text: 'Kolejność',
                        sortable: false,
                        hideable: false,
                        dataIndex: 'order',
                        renderer: function (val, meta) {
                            if (val == "random") {
                                return "Losowa";
                            } else {
                                return "Wg pozycji";
                            }
                        },
                        flex: 1
                    },
                    {
                        text: 'Aktywna',
                        sortable: false,
                        hideable: false,
                        dataIndex: 'active',
                        renderer: function (val, meta) {
                            if (val == true) {
                                return "Tak";
                            } else {
                                return "Nie";
                            }
                        },
                        flex: 1
                    },
                    {
                        text: 'Zabezpieczone hasłem',
                        sortable: false,
                        hideable: false,
                        dataIndex: 'password_restriction',
                        renderer: function (val, meta) {
                            if (val == true) {
                                return "Tak";
                            } else {
                                return "Nie";
                            }
                        },
                        flex: 1
                    },
                    {
                        text: 'Restrykcja IP',
                        sortable: false,
                        hideable: false,
                        dataIndex: 'ip_address_restriction',
                        renderer: function (val, meta) {
                            if (val == true) {
                                return "Tak";
                            } else {
                                return "Nie";
                            }
                        },
                        flex: 1
                    },
                    {
                        text: 'Restrykcja Ciasteczek (cookie)',
                        sortable: false,
                        hideable: false,
                        dataIndex: 'cookie_restriction',
                        renderer: function (val, meta) {
                            if (val == true) {
                                return "Tak";
                            } else {
                                return "Nie";
                            }
                        },
                        flex: 1
                    },
                    {
                        text: 'Zakończona ',
                        sortable: false,
                        hideable: false,
                        dataIndex: 'completed',
                        renderer: function (val, meta) {
                            if (val == true) {
                                return "Tak";
                            } else {
                                return "Nie";
                            }
                        },
                        flex: 1
                    },
                    {
                        text: 'Data zakończenia',
                        sortable: false,
                        hideable: false,
                        dataIndex: 'complete_date',
                        flex: 1
                    },
                    {
                        xtype: 'actioncolumn',
                        width: 160,
                        items: [{
                            getClass: function () {
                                return 'x-fa fa-television';
                            },
                            tooltip: 'Monitoruj',
                            handler: "monitoring"
                        }, {
                            getClass: function () {
                                return 'x-fa fa-file-text-o';
                            },
                            tooltip: 'Raport CSV',
                            handler: "report_csv"
                        }, {
                            getClass: function () {
                                return 'x-fa fa-file-code-o';
                            },
                            tooltip: 'Raport HTML',
                            handler: "report_html"
                        }, {
                            getClass: function () {
                                return 'x-fa fa-cog';
                            },
                            tooltip: 'Edytuj',
                            handler: "edit_form"
                        }, {
                            getClass: function () {
                                return 'x-fa fa-question-circle';
                            },
                            tooltip: 'Pytania',
                            handler: "questions"
                        }, {
                            getClass: function () {
                                return 'x-fa fa-link';
                            },
                            tooltip: 'Pokaż link',
                            handler: "generate_link"
                        }, {
                            getClass: function () {
                                return 'x-fa fa-trash';
                            },
                            tooltip: 'Usuń',
                            handler: "remove_form"
                        }]
                    }

                ]

        }
    ],
    dockedItems: [{
        xtype: 'toolbar',
        items: [{
            xtype: 'button',
            text: "Stwórz ankietę",
            handler: "create_poll"
        }]
    }]
})
;
