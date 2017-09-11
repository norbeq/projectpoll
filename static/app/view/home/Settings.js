Ext.define('PP.view.home.Settings', {
    extend: 'Ext.panel.Panel',
    xtype: 'settings',
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
                        inputValue: false
                    },
                    {
                        boxLabel: 'Nie',
                        name: 'password_change',
                        inputValue: true,
                        checked: true
                    }
                ]
            }, {
                xtype: "textfield",
                fieldLabel: "Nowe hasło",
                name: "password",
                disabled: true
            }]
        }

    ],
    buttons: [{
        text: "Zatwierdź zmiany"
    }]
})
;
