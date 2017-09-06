Ext.define('PP.view.home.HomeLogged', {
    extend: 'Ext.container.Container',
    xtype: 'home-logged',

    controller: 'home',
    viewModel: {
        type: 'home'
    },

    layout: 'responsivecolumn',
    
    listeners: {
        hide: 'onHideView'
    },

    items: [
    ]
});
