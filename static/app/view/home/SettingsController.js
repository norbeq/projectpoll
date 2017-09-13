Ext.define('PP.view.home.SettingsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settings',

    onRender: function () {
        var me = this;
        Ext.Ajax.request({
            url: 'api/user',
            method: "GET",
            defaultHeaders: {'Content-Type': 'application/json'},
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    me.lookup('setting_form').getForm().setValues(obj.data);
                }
            }
        });
    },

    onPasswordChange: function (field, checked) {
         var me = this;
        if (checked) {
            me.lookup('new_password').enable();
        } else {
            me.lookup('new_password').disable();
        }
    },

    save: function () {
        var me = this,
            form = me.lookup('setting_form'),
            values = form.getValues(),
            new_values = {};


        new_values = values;
        if (!values['password_change']) {
            delete values['password'];
        }
        delete values['password_change'];

            Ext.Ajax.request({
                url: 'api/user',
                method: "PUT",
                params: Ext.util.JSON.encode(new_values),
                defaultHeaders: {'Content-Type': 'application/json'},
                success: function (response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (obj.success) {
                        me.lookup('setting_form').getForm().setValues(obj.data);
                        me.lookup('password_change').setValue(true);
                        PP.util.Toast.show('Dane zostały zaktualizowane pomyślnie', 'Sukces', 't');
                    }
                }
            });
    }

});
