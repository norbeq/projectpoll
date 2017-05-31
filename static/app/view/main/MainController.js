/**
 * Created by Norbert on 2017-05-25.
 */
Ext.define('PP.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    routes: {
        // 'login': {
        //     action: "onLogin"
        // },
        // 'home': {
        //     action: "onHome"
        // },

        ':page': {
            action: "changeCard",
            conditions: {
                ':page': "([a-zA-Z0-9]+)"
            }
        }
    },

    listen: {
        controller: {
            '*': {
                // We delegate all changes of router history to this controller by firing
                // the "changeroute" event from other controllers.
                changeroute: 'changeRoute',

                unmatchedroute: 'onUnmatchedRoute'
            }
        }
    },

    changeCard: function (card) {
        this.lookup(this.lookup('mainMenuContainer').activeItemReference).setUI('menu');

        switch (card) {
            case "home":
                this.lookup('mainMenuContainer').activeItemReference = "menu_home";
                this.lookup('menu_home').setUI('menu-active');
                this.lookup('mainMenuContainer').setActiveItem(0);
                break;
            case "login":
                this.lookup('mainMenuContainer').activeItemReference = "menu_login";
                this.lookup('menu_login').setUI('menu-active');
                this.onLogin();
                break;
            default:
                console.log('nothing to do');
                break;
        }
    },


    changeRoute: function (controller, route) {
        console.log(route);
        // // Since we parse
        // if (route.substring(0, 1) !== '!') {
        //     route = '!' + route;
        // }
        //
        // this.redirectTo(route);
    },


    onUnmatchedRoute: function (token) {
        console.log(token);
        // if (token) {
        //     this.onBadRoute();
        // }
    },

    onMenuBarClick: function () {
        var mainMenuBar = this.lookup('mainMenu'),
            newWidth = 360;
        if (mainMenuBar.state === 'closed') {
            if (window.innerWidth < 360) {
                newWidth = window.innerWidth;
            }
            mainMenuBar.setWidth(newWidth);
            mainMenuBar.state = "open";
        } else {
            mainMenuBar.setWidth(0);
            mainMenuBar.state = "closed";
        }
    },
    onMainCardClick: function () {
        var mainMenuBar = this.lookup('mainMenu');
        mainMenuBar.setWidth(0);
        mainMenuBar.state = "closed";
    },
    onLogin: function () {
        if (!Ext.getCmp('login')) {
            Ext.widget('login', {
                modal: true,
                íd: 'login',
                listeners: {
                    close: "onLoginClose"
                }
            });
        }
    },
    onLoginClose: function () {
        this.redirectTo("home")
    },
    onHome: function () {
        if (Ext.getCmp('login')) {
            Ext.getCmp('login').close();
        }
        this.changeCard('home');
    }
});