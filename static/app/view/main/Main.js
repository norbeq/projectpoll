/**
 * Created by Norbert on 2017-05-31.
 */
Ext.define('PP.view.main.Main', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.main',
    viewModel: true,
    controller: 'main',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [{
        xtype: 'toolbar',
        height: 80,
        items: [
            {
                iconCls: 'x-fa fa-bars',
                reference: 'menu',
                ui: 'header',
                tooltip: 'Menu',
                handler: "onMenuBarClick"
            },
            {
                xtype: 'component',
                html: 'Ankiety',
                width: 120
            },
            '->',
            {
                iconCls: 'x-fa fa-question',
                ui: 'header',
                href: '#faq',
                hrefTarget: '_self',
                tooltip: 'FAQ'
            },
            {
                hidden: true,
                iconCls: 'x-fa fa-th-large',
                reference: 'profile',
                ui: 'header',
                href: '#account',
                hrefTarget: '_self',
                tooltip: 'Konto użytkownika'
            },
            {
                hidden: true,
                reference: 'username',
                xtype: 'tbtext',
                text: 'Gość'
            }
        ]
    },
        {
            xtype: 'container',
            flex: 1,
            layout: 'hbox',
            scrollable: true,
            items: [
                {
                    width: 0,
                    cls: "navigationMenu",
                    state: 'closed',
                    reference: 'mainMenu',
                    defaults: {
                        xtype: 'button',
                        ui: 'menu',
                        scale: 'large'
                    },
                    items: [{
                        reference: 'menu_home',
                        iconCls: 'fa fa-home',
                        text: 'Strona główna',
                        href: '#home',
                        hrefTarget: '_self'
                    }, {
                        reference: 'menu_login',
                        iconCls: 'fa fa-sign-in',
                        text: 'Logowanie',
                        href: '#login',
                        hrefTarget: '_self'
                    }]
                },
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'card',
                        anchor: '100%'
                    },
                    activeItem: 0,
                    activeItemReference: "test",
                    reference: "mainMenuContainer",
                    items: [{
                        reference: "test",
                        layout: 'fit',
                        height: '100%',
                        html: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                    }, {
                        reference: 'test2',
                        xtype: 'panel',
                        layout: 'fit',
                        title: 'Test title',
                        html: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                    }],
                    listeners: {
                        click: {
                            element: 'el',
                            fn: "onMainCardClick"
                        }
                    }
                }
            ]
        }
    ]
});