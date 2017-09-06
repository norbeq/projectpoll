Ext.define('PP.view.home.HomeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.home',

    requires: [
        'Ext.data.Store',
        'Ext.data.field.Integer',
        'Ext.data.field.String',
        'Ext.data.field.Boolean'
    ],

    stores: {
        pollinfo: {
            autoLoad: true,
            model: 'PP.model.PollInfo',
            proxy: {
                type: 'api',
                url: 'api/poll/info'
            }

        }
    }
});
