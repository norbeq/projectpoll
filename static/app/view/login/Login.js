/**
 * Created by Norbert on 2017-05-31.
 */
Ext.define('PP.view.login.Login', {
    extend: 'Ext.window.Window',
    alias: 'widget.login',
    modal: true,
    controller: 'login',
    title: 'Panel logowania',
    closable: true,
    draggable: false,
    autoShow: true,
    plugins: 'responsive',
    platformConfig: {
        desktop: {
            width: 360,
            height: 240
        },
        '!desktop': {
            height: window.innerHeight,
            width: window.innerWidth
        }
    },
    items: {
        xtype: 'form',
        reference: 'loginForm',
        padding: 10,
        items: [{
            xtype: 'textfield',
            name: 'email',
            fieldLabel: 'Adres email',
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'password',
            inputType: 'password',
            fieldLabel: 'Hasło',
            allowBlank: false
        }]
    },
    buttons: [{
        text: 'Zaloguj się',
        listeners: {
            click: 'onClick'
        },
        platformConfig: {
            desktop: {
                width: 120
            },
            '!desktop': {
                width: "100%"
            }
        }
    }]
});