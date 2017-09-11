Ext.define('PP.view.pages.NoFormWindow', {
    extend: 'PP.view.pages.ErrorBase',
    xtype: 'noform',

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
                    html: '<div>Formularz nie istnieje <br>lub nie jest aktywowany!</div><div>Idź do strony<a href="#home"> Głównej </a></div>'
                },
                {
                    xtype: 'tbspacer',
                    flex: 1
                }
            ]
        }
    ]
});
