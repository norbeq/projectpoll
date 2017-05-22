/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('PP.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    onItemSelected: function (sender, record) {
        var socket = io('http://' + document.domain + ':' + location.port);
        socket.connect();

        socket.on('connect', function () {
            console.log('aaaaa');
            socket.emit('messages', {type: 'ijioj', fruit: '8yu89y8'});
        });
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    }
});
