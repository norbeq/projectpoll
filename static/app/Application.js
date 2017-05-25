/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('PP.Application', {
    extend: 'Ext.app.Application',

    name: 'PP',

    controllers: [
        'Login'
    ],

    requires: [
        'Ext.form.Panel',
        'Ext.util.History'
    ],

    launchLoginForm: function () {
          this.mainView = Ext.create('Ext.container.Viewport', {

            renderTo: Ext.getBody(),
            items: [{
                layout: "fit",
                xtype: 'login'
            }]
        });
    },

    launch: function () {
        Ext.History.init();
        var getParams = document.URL.split("?");
        var params = Ext.urlDecode(getParams[getParams.length - 1]);


        console.log(getParams);
        console.log(params);
        this.launchLoginForm();
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
