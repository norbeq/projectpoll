Ext.define('PP.view.home.Informations', {
    extend: 'Ext.panel.Panel',
    xtype: 'informations',

    requires: [
        'Ext.chart.series.Pie',
        'Ext.chart.series.sprite.PieSlice',
        'Ext.chart.interactions.Rotate'
    ],

    cls: 'service-type shadow',
    layout: {
        type: 'vbox'
    },
    bodyStyle: "background-image:url(resources/images/home.png) !important",
    bodyPadding: 10,
    height: 1800,
    items: [
        {
            xtype: 'panel',
            width: "100%",
            layout: "hbox",
            items: [{
                xtype: "fieldset",
                title: "Rejestracja",
                style: {
                    opacity: 0.8
                },
                html: "<a href='#register'><img src='resources/images/home-2.png' width='757' height='485'></a>"
            }, {
                width: "100%",
                height: "100%",
                xtype: 'fieldset',
                title: "Formularze",
                style: {
                    opacity: 0.8
                },
                items: [{
                    bodyStyle: {
                        "background-color": "#f8f8f8"
                    },
                    style: {
                        opacity: 0.8
                    },
                    id: "global-informations",
                    listeners: {
                        afterrender: function () {
                            var st = Ext.getStore("global-info");
                            if (st.count() > 0) {
                                var rec = st.getAt(0);
                                if (Ext.getCmp("global-informations")) {
                                    Ext.getCmp("global-informations").setHtml("Ilość respondentów: <h1>" + rec.get('respondents') + "</h1><br>" +
                                        "Ilość formularzy: <h1>" + rec.get('forms') + "</h1><br>" +
                                        "Ilość pytań: <h1>" + rec.get('questions') + "</h1><br>" +
                                        "Zarejestrowanych użytkowników: <h1>" + rec.get('users') + "</h1>"
                                    );
                                }
                            }
                        }
                    }
                }]
            }]
        },
        {
            xtype: "panel",
            layout: 'hbox',
            width: "100%",
            style: {
                opacity: 0.8
            },
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
                        type: 'pie',
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
                            fontSize: 16,
                            renderer: function (val) {
                                var record = Ext.getStore("respondent-info").findRecord("os_platform", val);
                                if (record) {
                                    var all = 0;
                                    Ext.getStore("respondent-info").each(function (r) {
                                        all += r.get('count');
                                    });

                                    return val + "(" + (parseFloat(record.get("count") / all) * 100.0).toFixed(2) + ")%";
                                } else {
                                    return val;
                                }
                            }
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
            }]
        }]

});