Ext.define('PP.view.authentication.Login', {
    extend: 'PP.view.authentication.LockingWindow',
    xtype: 'login',

    defaultFocus: 'authdialog',
    header: false,
    items: [
        {
            xtype: 'authdialog',
            defaultButton: 'loginButton',
            autoComplete: true,
            bodyPadding: '20 20',
            cls: 'auth-dialog-login',
            header: false,
            width: 415,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaults: {
                margin: '5 0'
            },

            items: [
                {
                    xtype: 'label',
                    text: 'Zaloguj się'
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    name: 'email',
                    vtype: 'email',
                    bind: '{email}',
                    height: 55,
                    hideLabel: true,
                    allowBlank: false,
                    emptyText: 'Adres E-mail',
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-email-trigger'
                        }
                    },
                    reference: "email"
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    hideLabel: true,
                    emptyText: 'Hasło',
                    inputType: 'password',
                    name: 'password',
                    bind: '{password}',
                    allowBlank: false,
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-password-trigger'
                        }
                    },
                    reference: "password"
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'checkboxfield',
                            flex: 1,
                            cls: 'form-panel-font-color rememberMeCheckbox',
                            height: 30,
                            bind: '{persist}',
                            boxLabel: 'Zapamiętaj'
                        },
                        {
                            xtype: 'box',
                            html: '<a href="#passwordreset" class="link-forgot-password"> Zapomniane hasło ?</a>'
                        }
                    ]
                },
                {
                    xtype: 'button',
                    reference: 'loginButton',
                    scale: 'large',
                    ui: 'soft-green',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: 'Zaloguj',
                    formBind: true,
                    listeners: {
                        click: 'onLoginButton'
                    }
                },
                {
                    xtype: 'box',
                    html: '<div class="outer-div"><div class="seperator">Lub</div></div>',
                    margin: '10 0'
                },
                {
                    xtype: 'button',
                    scale: 'large',
                    ui: 'gray',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-user-plus',
                    text: 'Nowe konto',
                    listeners: {
                        click: 'onNewAccount'
                    }
                },
                {
                    xtype: 'box',
                    html: '<a href="#home" class="link-forgot-password" > Powrót do Strony głównej</a>'
                }
            ]
        }
    ],

    initComponent: function () {
        this.addCls('user-login-register-container');
        this.callParent(arguments);
    }
});
