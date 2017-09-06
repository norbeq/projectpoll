Ext.define('PP.view.authentication.AuthenticationModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.authentication',

    data: {
        password : '',
        email    : '',
        persist: false
    }
});