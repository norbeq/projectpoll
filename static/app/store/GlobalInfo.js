Ext.define('PP.store.GlobalInfo', {
    extend: 'Ext.data.Store',

    storeId: 'global-info',
    autoLoad: true,

    fields: [
        {
            name: 'forms'
        },
        {
            name: 'forms_completed'
        },
        {
            name: 'questions'
        },
        {
            name: 'respondents'
        }
    ],
    proxy: {
        type: 'api',
        url: 'api/poll/info'
    },
    listeners: {
        load: function (st) {
            if (st.count() > 0) {
                var rec = st.getAt(0);
                if (Ext.getCmp("global-informations")) {
                    Ext.getCmp("global-informations").setHtml("Ilość respondentów: <h1>" + rec.get('respondents') + "</h1><br>" +
                        "Ilość formularzy: <h1>" + rec.get('forms') + "</h1><br>" +
                        "Ilość pytań: <h1>" + rec.get('questions') + "</h1><br>" +
                        "Zarejestrowanych użytkowników: <h1>" + rec.get('users') + "</h1>"
                    );
                }
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
});
