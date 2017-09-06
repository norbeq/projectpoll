Ext.define('PP.view.poll.Poll', {
    extend: 'Ext.Viewport',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    viewModel: true,
    listeners: {
        render: 'onPollRender'
    },
    controller: 'poll',
    items: [
        {
            xtype: 'toolbar',
            flex: 1,
            minHeight: 64,
            padding: 0,
            width: "100%",
            items: [
                {
                    xtype: 'component',
                    cls: 'poll-header',
                    html: '<div class="main-logo"><img src="resources/images/logo.png">Ankiety</div>',
                    width: "100%"
                }
            ]
        }, {
            flex: 1,
            xtype: 'toolbar',
            minHeight: 42,
            padding: 5,
            width: "100%",
            items: [{
                reference: "next_button",
                xtype: "button",
                text: "Dalej",
                height: "100%",
                width: "100%",
                handler: "save_and_next"
            }]
        }
    ],
})
;
