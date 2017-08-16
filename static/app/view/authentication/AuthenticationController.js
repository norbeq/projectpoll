Ext.define('PP.view.authentication.AuthenticationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authentication',

    onLoggedIn: function (token) {
        Ext.toast('Zalogowano do aplikacji pomyślnie.', 'Sukces', 't')
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


        // this.redirectTo('home', true);
    },

    onLoginAsButton: function () {
        this.redirectTo('login', true);
    },

    onNewAccount: function () {
        this.redirectTo('register', true);
    },

    onSignupClick: function () {
        this.redirectTo('home', true);
    },

    onResetClick: function () {
        this.redirectTo('home', true);
    }
});