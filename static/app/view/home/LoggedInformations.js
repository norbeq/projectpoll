Ext.define('PP.view.home.LoggedInformations', {
    extend: 'Ext.panel.Panel',
    xtype: 'logged-informations',

    requires: [
        'Ext.chart.series.Pie',
        'Ext.chart.series.sprite.PieSlice',
        'Ext.chart.interactions.Rotate'
    ],

    cls: 'service-type shadow',
    bodyPadding: 10,
    height: "100%",
    items: [
        {
            xtype: "panel",
            layout: 'hbox',
            items: [{
                flex: 1,
                xtype: 'fieldset',
                title: "Formularze",
                items: [{
                    bodyStyle: {
                        "background-color": "#f8f8f8"
                    },
                    id: "global-informations-logged",
                    listeners: {
                        afterrender: function () {
                            var st = Ext.getStore("global-info");
                            if (st.count() > 0) {
                                var rec = st.getAt(0);
                                if (Ext.getCmp("global-informations-logged")) {
                                    Ext.getCmp("global-informations-logged").setHtml("Ilość respondentów: <h1>" + rec.get('respondents') + "</h1><br>" +
                                        "Ilość formularzy: <h1>" + rec.get('forms') + "</h1><br>" +
                                        "Ilość pytań: <h1>" + rec.get('questions') + "</h1><br>" +
                                        "Zarejestrowanych użytkowników: <h1>" + rec.get('users') + "</h1>"
                                    );
                                }
                            }
                        }
                    }
                }]
            }, {
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