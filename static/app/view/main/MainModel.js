Ext.define('PP.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',

    data: {
        currentView: null,
        email: "",
        username: "",
        logged_in: false
    }
});
