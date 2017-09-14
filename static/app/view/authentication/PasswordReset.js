Ext.define('PP.view.authentication.PasswordReset', {
    extend: 'PP.view.authentication.LockingWindow',
    xtype: 'passwordreset',

    requires: [
        'PP.view.authentication.Dialog',
        'Ext.form.Label',
        'Ext.form.field.Text',
        'Ext.button.Button'
    ],

    title: 'Resetowanie hasła',

    defaultFocus : 'authdialog',

    items: [
        {
            xtype: 'authdialog',
            width: 455,
            defaultButton: 'resetPassword',
            autoComplete: true,
            bodyPadding: '20 20',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaults : {
                margin: '10 0'
            },

            cls: 'auth-dialog-login',
            items: [
                {
                    xtype: 'label',
                    cls: 'lock-screen-top-label',
                    text: 'Wprowadź adres email'
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    name: 'email',
                    hideLabel: true,
                    allowBlank: false,
                    emptyText: 'nazwa@konto.pl',
                    reference: "reset_email",
                    vtype: 'email',
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-email-trigger'
                        }
                    }
                },
                {
                    xtype: 'button',
                    reference: 'resetPassword',
                    scale: 'large',
                    ui: 'soft-blue',
                    formBind: true,
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: 'Zresetuj hasło',
                    listeners: {
                        click: 'onResetClick'
                    }
                },
                {
                    xtype: 'component',
                    html: '<div style="text-align:right">' +
                        '<a href="#login" class="link-forgot-password">'+
                            'Powrót do logowania</a>' +
                        '</div>'
                }
            ]
        }
    ]
});
