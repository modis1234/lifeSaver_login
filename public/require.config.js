requirejs.config({
    paths: {
        jquery : 'plugins/jQuery/jquery-1.12.5',
        jqueryui : 'plugins/jQueryUI/juqery-ui-no-conflict',
        "jquery-ui-src" : 'plugins/jQueryUI/jquery-ui.min',
        "jquery-mobile": 'plugins/jQueryMobile/jquery.mobile-1.4.5.min',
        backbone : 'plugins/backbone/backbone-min',
        underscore : "plugins/underscore/underscore-min",
        text : "plugins/require/text",
        popper : 'plugins/popper/popper.min',
        w2ui : 'plugins/w2ui/w2ui-1.5.rc1',
        views : ".",
        cs : ".",
    },
    shim :{
        w2ui : {
            deps : [
                'css!plugins/w2ui/w2ui-1.5.rc1.min',
                "css!plugins/fontawesome5/css/fontawesome.min",
                "css!plugins/fontawesome5/css/all"
            ]    
        },
        "jquery-mobile": {
            deps : [
                "css!plugins/jQueryMobile/jquery.mobile-1.4.5.min"
            ]
        }
    },
    map: {
        '*': {
            'css': 'plugins/require/css.min'
        }
    	
    }
});
