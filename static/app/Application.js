Ext.define('PP.Application', {
    extend: 'Ext.app.Application',

    name: 'PP',

    stores: [
        'NavigationTree',
        'Pages',
        'Forms',
        'FormsDeleted',
        'RespondentInfo',
        'GlobalInfo'
    ],

    models: [
        "PollInfo"
    ],

    requires: [
        "PP.util.SocketIO",
        "PP.util.Security",
        "Ext.button.Segmented",
        "Ext.list.Tree",
        //charts
        "Ext.chart.PolarChart",
        //proxy
        "PP.proxy.API",
        //layouts
        "Ext.layout.container.HBox",
        "Ext.layout.container.VBox",
        "Ext.button.Button",
        "Ext.container.Container",
        "Ext.form.Label",
        "Ext.form.field.Text",
        "Ext.form.field.Checkbox",
        "Ext.toolbar.Spacer",
        "Ext.chart.interactions.ItemHighlight",
        "Ext.grid.plugin.RowExpander"
    ],

    views: [
        //Main
        "main.Main",
        "main.MainController",
        "main.MainContainerWrap",
        "main.MainModel",
        //Home
        "home.Home",
        "home.HomeController",
        "home.Informations",
        "home.HomeLogged",
        "home.Settings",
        "home.SettingsController",
        //Authentication
        "authentication.Login",
        "authentication.Dialog",
        "authentication.Register",
        "authentication.AuthenticationModel",
        "authentication.AuthenticationController",
        "authentication.PasswordReset",
        //Faq
        "pages.FAQ",
        "pages.NoFormWindow",
        //Forms
        "form.Forms",
        "form.FormController",
        "form.FormsDeleted",
        "form.FormDeletedController",
        //Poll
        "poll.Poll",
        "poll.PollController"
    ],

    launchMain: function () {
        Ext.create('PP.view.main.Main', {
            id: 'main'
        });
    },

    launchPoll: function (password) {
        var me = this,
            password = password || null;

        const regex = /#poll\/([a-zA-Z0-9-]*)/g;
        const str = window.location.hash;
        var m;
        var form_uuid = null;

        while ((m = regex.exec(str)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            m.forEach(function (match, groupIndex) {
                if (groupIndex == 1) {
                    form_uuid = match;
                }
            });
        }
        var params = {"form_uuid": form_uuid};
        if (password) {
            params['password'] = password;
        }

        if (form_uuid) {
            Ext.Ajax.request({
                url: 'api/respondent/start',
                method: "POST",
                params: Ext.util.JSON.encode(params),
                defaultHeaders: {'Content-Type': 'application/json'},
                success: function (response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (obj.success) {
                        if (obj.password_needed === true) {
                            Ext.MessageBox.prompt('Hasło', 'Podaj hasło', function (btn, text) {
                                if (btn === "ok" && text !== "") {
                                    me.launchPoll(text);
                                }
                            }, this);
                        } else if (obj.ip_address_restricted === true) {
                            PP.util.Toast.show('Brak dostępu do ankiety.', 'Błąd', 't');
                        } else if (obj.restricted === true) {
                            PP.util.Toast.show('Nie możesz wypełniać tego formularza', 'Błąd', 't');
                        } else {
                            Ext.create('PP.view.poll.Poll', {
                                id: 'poll',
                                guest_uuid: obj.data.guest_uuid,
                            }).mask();
                        }
                    } else {
                        location.reload();
                        window.location.href = window.location.origin + "/#noform";
                    }
                },
                failure: function (response, opts) {
                    location.reload();
                    window.location.href = window.location.origin + "/#noform";
                }
            });
        }


    },

    launch: function () {
        if (window.location.hash.indexOf('poll') !== -1) {
            this.launchPoll();
        } else {
            this.launchMain();
        }

    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Aktualizacja aplikacji', 'Aplikacja została zaktualizowana, przeładować?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
})
;
