Ext.define('PP.view.authentication.AuthenticationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authentication',


    onLoggedIn: function (token) {
        PP.util.Security.initToken(token);
        Ext.util.Cookies.set("auth",token);
        Ext.toast('Zalogowano do aplikacji pomyślnie.', 'Sukces', 't');

        Ext.getStore('NavigationTree').getRootNode().insertChild(0, {
            text: 'Strona główna',
            iconCls: 'x-fa fa-desktop',
            rowCls: 'nav-tree-badge nav-tree-badge-new',
            viewType: 'home-logged',
            leaf: true
        });
        Ext.getStore('NavigationTree').getRootNode().findChild("viewType", "home").remove();
        Ext.getStore('NavigationTree').getRootNode().findChild("viewType", "login").remove();

        Ext.getCmp('main').getViewModel().set('username', PP.util.Security.payload.username);
        this.redirectTo('home-logged', true);
    },

    onLoginButton: function () {
        var me = this,
            params = {
                "email": this.lookup('email').getValue()
            };
        Ext.Ajax.request({
            url: 'api/pre_login',
            method: "POST",
            params: Ext.util.JSON.encode(params),
            defaultHeaders: {'Content-Type': 'application/json'},
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                params['digest'] = sha512(sha512(me.lookup('password').getValue()) + ":" + obj.salt);
                Ext.Ajax.request({
                    url: 'api/login',
                    method: "POST",
                    params: Ext.util.JSON.encode(params),
                    defaultHeaders: {'Content-Type': 'application/json'},
                    success: function (response, opts) {
                        var obj = Ext.decode(response.responseText);
                        me.onLoggedIn(obj.token);

                    },
                    failure: function (response, opts) {
                        Ext.toast('Błąd autentykacji.', 'Błąd', 't')
                    }
                });
            },
            failure: function (response, opts) {
                Ext.toast('Błąd autentykacji.', 'Błąd', 't')
            }
        });
    },

    onLoginAsButton: function () {
        this.redirectTo('login', true);
    },

    onNewAccount: function () {
        this.redirectTo('register', true);
    },

    onSignupClick: function () {
        var me = this,
            params = {
                "email": this.lookup('register_email').getValue(),
                "username": this.lookup('register_username').getValue(),
                "password": this.lookup('register_password').getValue()
            };
        Ext.Ajax.request({
            url: 'api/register',
            method: "POST",
            params: Ext.util.JSON.encode(params),
            defaultHeaders: {'Content-Type': 'application/json'},
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                if(obj.success) {
                    Ext.toast('Udało się', 'Sukces', 't');
                    me.redirectTo('login', true);
                } else {
                    Ext.toast('Błąd rejestracji.', 'Błąd', 't')
                }
            },
            failure: function (response, opts) {
                Ext.toast('Błąd rejestracji.', 'Błąd', 't')
            }
        });
    },

    onResetClick: function () {
        this.redirectTo('home', true);
    }
});