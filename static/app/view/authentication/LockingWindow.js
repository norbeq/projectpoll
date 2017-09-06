Ext.define('PP.view.authentication.LockingWindow', {
    extend: 'Ext.window.Window',
    xtype: 'lockingwindow',

    cls: 'auth-locked-window',
    closable: false,
    resizable: false,
    autoShow: true,
    titleAlign: 'center',
    maximized: true,
    modal: true,

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    controller: 'authentication'
});
