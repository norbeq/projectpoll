Ext.define('PP.util.SocketIO', {
    extend: 'Ext.util.Observable',

    constructor: function (config) {
        var me = this;
        me.superclass.constructor.call(
            this
        );

        me.socket = io.connect(config['host'], {
            'port': config['port'],
            'reconnect': config['reconnect'],
            'reconnection delay': config['reconnection delay'],
            'max reconnection attempts': config['max reconnection attemps'],
            'transports': ['websocket', 'flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling'],
            extraHeaders: {
                auth: PP.util.Security.getToken()
            }
        });

        me.socket.on('connect', function () {
            me.fireEvent('socketconnect', me, this, arguments);
        });

        me.socket.on('disconnect', function () {
            me.fireEvent('socketdisconnect', me, this, arguments);
        });

        me.socket.on('message', function (data) {
            me.message(data);
        });

        me.socket.on('vote', function (data) {
            console.log("Przyszedl vote");
            console.log(data);
        });
    },

    message: function (data) {
        console.log(data);
    }
});