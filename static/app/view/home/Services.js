Ext.define('PP.view.home.Services', {
    extend: 'Ext.panel.Panel',
    xtype: 'services',

    requires: [
        'Ext.chart.series.Pie',
        'Ext.chart.series.sprite.PieSlice',
        'Ext.chart.interactions.Rotate'
    ],

    cls: 'service-type shadow',
    layout: {
        type: 'hbox'
    },
    height: 650,

    bodyPadding: 10,
    items: [{
        flex: 1,
        xtype: 'fieldset',
        title: "Systemy operacyjne respondentów",

        items: [{
            innerPadding: 10,
            xtype: 'polar',
            height: 300,
            reference: 'chart',
            store: "respondent-info",
            background: '#f6f6f6',
            legend: {
                type: 'sprite',
                docked: 'bottom',
                background: '#f6f6f6'
            },
            interactions: ['rotate', 'itemhighlight'],
            series: [{
                type: 'pie3d',
                animation: {
                    easing: 'easeOut',
                    duration: 500
                },
                opacity: 0.8,
                donut: 30,
                distortion: 0.60,
                thickness: 10,
                angleField: 'count',
                clockwise: false,
                highlight: {
                    margin: 20
                },
                label: {
                    field: 'os_platform',
                    display: 'outside',
                    fontSize: 16
                },
                style: {
                    strokeStyle: 'white',
                    lineWidth: 1
                },
                tooltip: {
                    trackMouse: true,
                    renderer: function (tooltip, record, item) {
                        tooltip.setHtml(record.get('os_platform') + ': ' + record.get('count'));
                    }
                }
            }]
        }]
    }, {
        flex: 1,
        width: "100%",
        xtype: 'fieldset',
        title: "Formularze",
        items: [{
            html: "Lorem ipsum"
        }]
    }]
});