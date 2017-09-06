Ext.define('PP.store.RespondentInfo', {
    extend: 'Ext.data.Store',

    storeId: 'respondent-info',
    autoLoad: true,

    fields: [
        {name: 'os_platform', type: 'string'},
        {name: 'count', type: 'int'}
    ],
    proxy: {
        type: 'api',
        url: 'api/respondent/info'
    }
});
