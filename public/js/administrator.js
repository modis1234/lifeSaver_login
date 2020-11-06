define([
    "jquery",
    "underscore",
    "backbone",
    "w2ui",
    "text!views/administrator",
    "css!cs/stylesheets/admin/ad_layout.css",
    "css!cs/stylesheets/admin/ad_main.css",
    "css!cs/stylesheets/admin/w2uiCustom.css"
], function (
    $,
    _,
    Backbone,
    w2ui,
    HTML
) {
    
    var SiteModel = Backbone.Model.extend({
        url: '/site/sites',
        parse: function (result) {
            return result;
        }
    });

    var ServerModel = Backbone.Model.extend({
        url: '/server/servers',
        parse: function (result) {
            return result;
        }
    });

    return Backbone.View.extend({
        el: '.admin-component',
        siteObj: undefined,
        siteCombo: undefined,
        siteList: undefined,
        serverObj: undefined,
        serverCombo: undefined,
        serverList: undefined,
        versionCombo: [
            { id: 1, text: 'LS-V1' },
            { id: 2, text: 'LS-V2' }
        ],
        w2uiConfig: {
            sidebar: {
                name: 'menu',
                img: null,
                nodes: [
                    {
                        id: 'setting', text: '관리자 설정', img: 'icon-folder', expanded: true, group: true, groupShowHide: false, collapsible: false,
                        nodes: [
                            { id: 'siteInfo', text: '업체 관리', icon: 'fas fa-building' },
                            { id: 'account', text: '계정 관리', icon: 'fas fa-user-circle' },
                            { id: 'sensorInfo', text: '센서장비 관리', icon: 'fas fa-desktop' },
                            { id: 'serverInfo', text: '서버 관리', icon: 'fas fa-server' }
                        ]
                    }
                ],
                onClick: function (event) {
                    window.main.view.setMenu(event.target);
                }
            } // end sidebar
        },
        initialize: function () {
            var _this = this;
            this.$el.html(HTML);
            this.render();

            this.siteModel = new SiteModel();
            this.listenTo(this.siteModel, "sync", this.getSiteList);
            this.siteModel.fetch();

            this.serverModel = new ServerModel();
            this.listenTo(this.serverModel, "sync", this.getServerList);
            this.serverModel.fetch();


        },
        events: {

        },
        render: function () {
            var _this = this;
            _this.$el.find('#menu-bottom').w2sidebar(_this.w2uiConfig['sidebar']);
            _this.$el.find('#sidebar_menu_focus').remove();

        },
        getSiteList: function(model, response){
            var _this =this
            var result = response;

            var _siteCombo = [];
            _this.siteObj ={};
            for( i in result ){
                var _id = result[i]['id'];
                var _name = result[i]['name'];
                var _siteIndex = result[i]['site_index'];
                var _serverIndex = result[i]['server_index'];
                var obj = {};
                obj['id'] = _siteIndex;
                obj['text'] = _name;
                obj['server'] = _serverIndex;
                _siteCombo.push(obj);

                //siteList
                var siteIndex = result[i]['site_index'];
                _this.siteObj[siteIndex] = result[i];
            }
            _this.siteCombo = _siteCombo;
            _this.siteList = result;


        },
        getServerList: function(model, response){
            var _this =this
            var result = response;

            var _serverCombo = [];
            _this.serverObj ={};
            for( i in result ){
                var _id = result[i]['id'];
                var _serverIndex = result[i]['server_index'];
                var obj = {};
                obj['id'] = _serverIndex;
                obj['text'] = _serverIndex;
                _serverCombo.push(obj);

                //siteList
                var serverIndex = result[i]['site_index'];
                _this.serverObj[_serverIndex] = result[i];
            }
            _this.serverCombo = _serverCombo;
            _this.serverList = result;


        },
        setMenu: function (target) {
            var _this = this;
            var _target = target;
            if (_this.adminTarget == _target) {
                return false;
            } else {
                _this.adminTarget = _target;
                var adminView = this.adminView;
                if (adminView) adminView.destroy();
                var url = _target;
                requirejs([
                    'js/admin/' + url
                ], function (Admin) {
                    var adminView = new Admin();
                    _this.adminView = adminView;

                });
            }
        },
        destroy: function () {
            var _this = this;
           if(_this.adminView){
                _this.adminView.destroy();
           }
            var sidebarName = _this.w2uiConfig.sidebar['name'];
            if (window.w2ui.hasOwnProperty('menu')) {
                window.w2ui['menu'].destroy()
            }
            this.undelegateEvents();
        }
    });
});