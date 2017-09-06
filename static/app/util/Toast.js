Ext.define('PP.util.Toast', {
    singleton: true,

    show: function (message, title, align) {
        Ext.toast({
            html: message,
            title: title,
            align: align,
            minHeight: 100
        });
    }
});