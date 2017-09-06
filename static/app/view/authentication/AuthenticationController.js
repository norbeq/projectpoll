Ext.define('PP.view.authentication.AuthenticationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authentication',


    onLoggedIn: function (token) {
        PP.util.Security.initToken(token);
        Ext.util.Cookies.set("auth", token);
        PP.util.Toast.show('Zalogowano do aplikacji pomyślnie.', 'Sukces', 't');
        this.redirectTo('home-logged', true);
    },

    onResetClick: function () {
        var me = this,
            params = {
                "email": this.lookup('reset_email').getValue()
            };
        Ext.Ajax.request({
            url: 'api/reset',
            method: "POST",
            params: Ext.util.JSON.encode(params),
            defaultHeaders: {'Content-Type': 'application/json'},
            success: function (response, opts) {
                PP.util.Toast.show('Hasło zostało wysłane na podany adres email', 'Błąd', 't')
            },
            failure: function (response, opts) {
                PP.util.Toast.show('Błąd resetowania hasła', 'Błąd', 't')
            }
        });
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
                        PP.util.Toast.show('Błąd autentykacji.', 'Błąd', 't')
                    }
                });
            },
            failure: function (response, opts) {
                PP.util.Toast.show('Błąd autentykacji.', 'Błąd', 't')
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
                if (obj.success) {
                    PP.util.Toast.show('Udało się', 'Sukces', 't');
                    me.redirectTo('login', true);
                } else {
                    PP.util.Toast.show('Błąd rejestracji.', 'Błąd', 't')
                }
            },
            failure: function (response, opts) {
                PP.util.Toast.show('Błąd rejestracji.', 'Błąd', 't')
            }
        });

    }
});