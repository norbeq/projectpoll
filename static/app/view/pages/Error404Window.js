Ext.define('PP.view.pages.Error404Window', {
    extend: 'PP.view.pages.ErrorBase',
    xtype: 'page404',

    items: [
        {
            xtype: 'container',
            width: 400,
            cls:'error-page-inner-container',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'label',
                    cls: 'error-page-top-text',
                    text: '404'
                },
                {
                    xtype: 'label',
                    cls: 'error-page-desc',
                    html: '<div>Strony nie znaleziono!</div><div>Wróć do strony<a href="#home"> Głównej </a></div>'
                },
                {
                    xtype: 'tbspacer',
                    flex: 1
                }
            ]
        }
    ]
});
