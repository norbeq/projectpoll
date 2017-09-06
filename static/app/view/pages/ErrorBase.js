Ext.define('PP.view.pages.ErrorBase', {
    extend: 'Ext.window.Window',

    requires: [
        'PP.view.authentication.AuthenticationController',
        'Ext.container.Container',
        'Ext.form.Label',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Spacer'
    ],

    controller: 'authentication',
    autoShow: true,
    cls: 'error-page-container',
    header: false,
    closable: false,
    maximized: true,
    modal: true,

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    }
});
