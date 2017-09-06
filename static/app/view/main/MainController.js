Ext.define('PP.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onRouteChange'
            }
        }
    },

    routes: {
        ':node': 'onRouteChange'
    },

    lastView: null,

    setCurrentView: function (hashTag) {
        hashTag = (hashTag || '').toLowerCase();

        if (["home", 'login', 'register', 'activation', 'passwordreset', ''].indexOf(hashTag) > -1 || PP.util.Security.checkCookieToken()) {

            var me = this,
                refs = me.getReferences(),
                mainCard = refs.mainCardPanel,
                mainLayout = mainCard.getLayout(),
                navigationList = refs.navigationTreeList,
                store = navigationList.getStore();
            var node = store.findNode('routeId', hashTag) ||
                store.findNode('viewType', hashTag) || Ext.getStore('Pages').findNode('viewType', hashTag),
                view = (node && node.get('viewType')) || 'page404',
                lastView = me.lastView,
                existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
                newView;

            if (lastView && lastView.isWindow) {
                lastView.destroy();
            }

            lastView = mainLayout.getActiveItem();

            if (!existingItem) {
                newView = Ext.create({
                    xtype: view,
                    routeId: hashTag,
                    hideMode: 'offsets'
                });
            }

            if (!newView || !newView.isWindow) {
                if (existingItem) {
                    if (existingItem !== lastView) {
                        mainLayout.setActiveItem(existingItem);
                    }
                    newView = existingItem;
                }
                else {
                    Ext.suspendLayouts();
                    mainLayout.setActiveItem(mainCard.add(newView));
                    Ext.resumeLayouts(true);
                }
            }


            if (node === null) {

            }

            navigationList.setSelection(node);

            if (newView.isFocusable(true)) {
                newView.focus();
            }

            me.lastView = newView;
        } else {
            this.redirectTo('home');
        }

    },

    onNavigationTreeSelectionChange: function (tree, node) {
        var to = node && (node.get('routeId') || node.get('viewType'));

        if (to) {
            this.redirectTo(to);
        }
    },

    onToggleNavigationSize: function () {
        var me = this,
            refs = me.getReferences(),
            navigationList = refs.navigationTreeList,
            wrapContainer = refs.mainContainerWrap,
            collapsing = !navigationList.getMicro(),
            new_width = collapsing ? 64 : 250;

        if (Ext.isIE9m || !Ext.os.is.Desktop) {
            Ext.suspendLayouts();

            refs.pollLogo.setWidth(new_width);

            navigationList.setWidth(new_width);
            navigationList.setMicro(collapsing);

            Ext.resumeLayouts();

            wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
            wrapContainer.updateLayout();
        }
        else {
            if (!collapsing) {

                navigationList.setMicro(false);
            }
            navigationList.canMeasure = false;

            refs.pollLogo.animate({dynamic: true, to: {width: new_width}});


            navigationList.width = new_width;
            wrapContainer.updateLayout({isRoot: true});
            navigationList.el.addCls('nav-tree-animating');

            if (collapsing) {
                navigationList.on({
                    afterlayoutanimation: function () {
                        navigationList.setMicro(true);
                        navigationList.el.removeCls('nav-tree-animating');
                        navigationList.canMeasure = true;
                    },
                    single: true
                });
            }
        }
    },

    onMainViewRender: function () {
        if (window.location.hash.indexOf('activation') !== -1) {
            const regex = /#activation\/([a-zA-Z0-9-]*)\/(.*)/g;
            const str = window.location.hash;
            var m;
            var mail = null;
            var mail_activation = null;

            while ((m = regex.exec(str)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                m.forEach(function (match, groupIndex) {
                    if (groupIndex == 1) {
                        mail_activation = match;
                    }
                    if (groupIndex == 2) {
                        mail = match;
                    }
                });
            }

            if (mail && mail_activation) {
                var me = this,
                    params = {
                        "email": mail,
                        "activation_key": mail_activation
                    };
                Ext.Ajax.request({
                    url: 'api/activation',
                    method: "POST",
                    params: Ext.util.JSON.encode(params),
                    defaultHeaders: {'Content-Type': 'application/json'},
                    success: function (response, opts) {
                        var obj = Ext.decode(response.responseText);
                        if (obj.success) {
                            PP.util.Toast.show('Użytkownik został aktywowany pomyślnie', 'Sukces', 't');
                            me.redirectTo("login");
                        } else {
                            PP.util.Toast.show('Nie udało się aktywować użytkownika', 'Błąd', 't')
                            me.redirectTo('home');
                        }
                    },
                    failure: function (response, opts) {
                        PP.util.Toast.show('Nie udało się aktywować użytkownika', 'Błąd', 't')
                        me.redirectTo('home');
                    }
                });
            }
        } else {
            if (PP.util.Security.checkCookieToken()) {
                PP.util.Security.initToken(Ext.util.Cookies.get('auth'));
                PP.util.Toast.show('Zalogowano do aplikacji pomyślnie.', 'Sukces', 't');
                this.redirectTo("home-logged");
            } else {
                if (window.location.hash === "#home") {
                    this.redirectTo("home");
                } else if (window.location.hash === "#login") {
                    this.redirectTo("login");
                } else if (window.location.hash === "#register") {
                    this.redirectTo("register");
                } else if (window.location.hash === "#passwordreset") {
                    this.redirectTo("passwordreset");
                } else {
                    this.redirectTo("home");
                }

            }
        }
    },

    onRouteChange: function (id) {
        this.setCurrentView(id);
    }
});
