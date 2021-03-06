Ext.define('PP.view.home.Home', {
    extend: 'Ext.window.Window',
    xtype: 'home',

    closable: false,
    resizable: false,
    autoShow: true,
    titleAlign: 'center',
    maximized: true,
    modal: true,

    header: false,

    controller: 'home',
    viewModel: true,

    layout: 'border',

    listeners: {
        hide: 'onHideView'
    },


    items: [{
        region: 'north',
        items: [{
            xtype: "toolbar",
            items: [{
                xtype: 'component',
                html: "Ankiety"
            }, "->", {
                xtype: "button",
                text: "Zaloguj się",
                listeners: {
                    click: 'onLogin'
                }
            }, "LUB", {
                xtype: "button",
                text: "Zarejestruj się",
                listeners: {
                    click: 'onRegister'
                }
            }]
        }],
        border: false,
        margin: '0 0 5 0'
    }, {
        region: 'center',
        xtype: 'panel', // TabPanel itself has no title
        header: false,
        items: [{
            xtype: 'informations',
            userCls: 'big-100 small-50'
        }]
    }]
});
