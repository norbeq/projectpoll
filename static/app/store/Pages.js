Ext.define('PP.store.Pages', {
    extend: 'Ext.data.TreeStore',

    storeId: 'Pages',

    fields: [{
        name: 'text'
    }],

    root: {
        expanded: true,
        children: [
            {
                text: 'Strona glówna',
                iconCls: 'x-fa fa-desktop',
                rowCls: 'nav-tree-badge nav-tree-badge-new',
                viewType: 'home',
                routeId: 'home',
                leaf: true
            },
            {
                text: 'Login',
                iconCls: 'x-fa fa-check',
                viewType: 'login'
            },
            {
                text: 'Register',
                iconCls: 'x-fa fa-pencil-square-o',
                viewType: 'register'
            },
            {
                text: "Home Logged In",
                viewType: 'home-logged'
            },
            {
                text: "Form",
                viewType: 'forms'
            },
            {
                text: "Password Reset",
                viewType: 'passwordreset'
            }
        ]
    }
});
