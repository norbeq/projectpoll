Ext.define('PP.view.pages.Error500Window', {
    extend: 'PP.view.pages.ErrorBase',
    xtype: 'page500',


    items: [
        {
            xtype: 'container',
            width: 600,
            cls: 'error-page-inner-container',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'label',
                    cls: 'error-page-top-text',
                    text: '500'
                },
                {
                    xtype: 'label',
                    cls: 'error-page-desc',
                    html: '<div>Ups, coś poszło nie tak!</div><div>Wróć do strony<a href="#home"> Głównej </a></div>'
                },
                {
                    xtype: 'tbspacer',
                    flex: 1
                }
            ]
        }
    ]
});
