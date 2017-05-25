/**
 * Created by Norbert on 2017-05-25.
 */
Ext.define('PP.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',
    onClick: function () {
        var values = this.lookup('loginForm').getValues();

        Ext.Ajax.request({
            url: 'api/login',
            method: "POST",
            params: Ext.encode(values),
            defaultHeaders: {'Content-Type': 'application/json'},
            headers: {},
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                console.dir(obj);
            },

            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    }
});