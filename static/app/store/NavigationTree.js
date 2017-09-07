Ext.define('PP.store.NavigationTree', {
    extend: 'Ext.data.TreeStore',

    storeId: 'NavigationTree',

    fields: [{
        name: 'text'
    }],

    addItem: function (node) {
        this.getRootNode().appendChild(node);
    },

    root: {
        expanded: true,
        children: [
            {
                text: 'Strona glówna',
                iconCls: 'x-fa fa-desktop',
                rowCls: 'nav-tree-badge nav-tree-badge-new',
                viewType: 'home-logged',
                routeId: 'home-logged',
                leaf: true
            },
            {
                text: 'Ankiety',
                iconCls: 'x-fa fa-area-chart',
                rowCls: 'nav-tree-badge nav-tree-badge-new',
                viewType: 'forms',
                routeId: 'forms',
                leaf: true
            },
            {
                text: 'Ustawienia',
                iconCls: 'x-fa fa-cog',
                rowCls: 'nav-tree-badge nav-tree-badge-new',
                viewType: 'settings',
                routeId: 'settings',
                leaf: true
            }
            // ,
            // {
            //     text: 'FAQ',
            //     iconCls: 'x-fa fa-question',
            //     viewType: 'faq',
            //     leaf: true
            // }
        ]
    }
});
