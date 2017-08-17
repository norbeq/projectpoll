Ext.define('PP.util.Security', {
    singleton: true,

    token: null,
    token_payload: null,

    payload: null,

    socket: null,

    checkCookieToken: function () {
        var token = Ext.util.Cookies.get('auth'),
            result = false;
        Ext.Ajax.request({
            async: false,
            url: 'api/check_token',
            method: "GET",
            defaultHeaders: {'Content-Type': 'application/json', 'auth': token},
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                if(obj.success) {
                    result = true;
                }
            }
        });
        return result;
    },

    getToken: function () {
        return this.token;
    },

    initToken: function (token) {
        Ext.util.Cookies.set('auth', token);
        this.token = token;
        this.payload = Ext.decode(atob(token.split(".")[1]));

        this.socket = Ext.create('PP.util.SocketIO', {
            "host": "http://poll.mianor.pl",
            "port": 80,
            "reconnect": true,
            "reconnection delay": 500,
            "max reconnection attempts": 999
        });
    }
});