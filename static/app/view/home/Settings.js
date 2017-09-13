Ext.define('PP.view.home.Settings', {
    extend: 'Ext.panel.Panel',
    xtype: 'settings',
    listeners: {
        afterrender: "onRender"
    },
    controller: "settings",
    items: [
        {
            xtype: "form",
            reference: "setting_form",
            width: "50%",
            defaults: {
                padding: 10
            },
            items: [{
                xtype: "textfield",
                fieldLabel: "Nazwa użytkownika",
                name: "username"
            }, {
                xtype: "textfield",
                fieldLabel: "Imię",
                name: "firstname"
            }, {
                xtype: "textfield",
                fieldLabel: "Nazwisko",
                name: "lastname"
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: 'Zmiana hasła',
                defaultType: 'radiofield',
                defaults: {
                    flex: 1
                },
                layout: 'hbox',
                items: [
                    {
                        boxLabel: 'Tak',
                        name: 'password_change',
                        inputValue: true,
                        listeners: {
                            change: "onPasswordChange"
                        }
                    },
                    {
                        boxLabel: 'Nie',
                        name: 'password_change',
                        inputValue: false,
                        checked: true,
                        reference: "password_change"
                    }
                ]
            }, {
                reference: "new_password",
                xtype: "textfield",
                fieldLabel: "Nowe hasło",
                name: "password",
                disabled: true
            }]
        }

    ],
    buttons: [{
        text: "Zatwierdź zmiany",
        handler: "save"
    }]
})
;
