/**
 * Created by Norbert on 2017-05-25.
 */
Ext.define('PP.view.login.Login', {
    extend: 'Ext.window.Window',
    alias: 'widget.login',
    modal: true,
    controller: 'login',
    title: 'Panel logowania',
    closable: false,
    draggable: false,
    autoShow: true,

    items: {
        xtype: 'form',
        reference: 'loginForm',
        padding: 10,
        items: [{
            xtype: 'textfield',
            name: 'username',
            fieldLabel: 'Nazwa użytkownika',
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
        }
    }]
});