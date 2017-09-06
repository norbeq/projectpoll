Ext.define('PP.store.Forms', {
    extend: 'Ext.data.Store',

    storeId: 'Forms',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'order', type: 'string'},
        {name: 'form_uuid', type: 'string', allowNull: true},
        {name: 'created_date', type: 'string', allowNull: true},
        {name: 'active', type: 'boolean', allowNull: true},
        {name: 'password_restriction', type: 'boolean'},
        {name: 'password', type: 'string'},
        {name: 'deleted', type: 'boolean', allowNull: true},
        {name: 'cookie_restriction', type: 'boolean'},
        {name: 'ip_address_restriction', type: 'boolean'},
        {name: 'ip_address', type: 'string'},
        {name: 'completed', type: 'boolean', allowNull: true},
        {name: 'complete_date', type: 'string', allowNull: true}
    ],
    proxy: {
        type: 'rest',
        url: 'api/form',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            writeRecordId: false
        }
    }
});
