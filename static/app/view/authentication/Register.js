Ext.define('PP.view.authentication.Register', {
    extend: 'PP.view.authentication.LockingWindow',
    xtype: 'register',

    requires: [
        'PP.view.authentication.Dialog',
        'Ext.button.Button',
        'Ext.form.Label',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Text'
    ],
    header: false,
    defaultFocus: 'authdialog',

    items: [
        {
            xtype: 'authdialog',
            bodyPadding: '20 20',
            width: 455,
            reference: 'registerForm',

            defaultButton: 'submitButton',
            autoComplete: true,
            cls: 'auth-dialog-register',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '10 0',
                selectOnFocus: true
            },
            items: [
                {
                    xtype: 'label',
                    cls: 'lock-screen-top-label',
                    text: 'Utwórz konto w serwisie'
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    hideLabel: true,
                    allowBlank: false,
                    name: 'email',
                    emptyText: 'Adres email',
                    vtype: 'email',
                    bind: '{email}',
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-envelope-trigger'
                        }
                    },
                    reference: 'register_email'
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    hideLabel: true,
                    allowBlank: true,
                    name: 'username',
                    bind: '{username}',
                    emptyText: 'Nazwa użytkownika (wyświetlana)',
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-email-trigger'
                        }
                    },
                    reference: 'register_username'
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    hideLabel: true,
                    allowBlank: false,
                    emptyText: 'Hasło',
                    name: 'password',
                    inputType: 'password',
                    bind: '{password}',
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-password-trigger'
                        }
                    },
                    reference: 'register_password'
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    hideLabel: true,
                    allowBlank: false,
                    emptyText: 'Powtórz hasło',
                    name: 'password2',
                    inputType: 'password',
                    bind: '{password2}',
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-password-trigger'
                        }
                    },
                    validator: function (value) {
                        var password1 = this.previousSibling('[name=password]');
                        return (value === password1.getValue()) ? true : "Podano błędne hasło";
                    }
                },
                {
                    xtype: 'button',
                    scale: 'large',
                    ui: 'soft-blue',
                    formBind: true,
                    reference: 'submitButton',
                    bind: false,
                    margin: '5 0',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: 'Załóż konto',
                    listeners: {
                        click: 'onSignupClick'
                    }
                },
                {
                    xtype: 'component',
                    html: '<div style="text-align:right">' +
                    '<a href="#login" class="link-forgot-password">' +
                    'lub Zaloguj się</a>' +
                    '</div>'
                },
                {
                    xtype: 'box',
                    html: '<a href="#home" class="link-forgot-password" > Powrót do Strony głównej</a>'
                }
            ]
        }
    ]
});
