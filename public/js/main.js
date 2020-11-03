define([
	"jquery",
    "underscore",
	"backbone",
	"w2ui",
	"text!views/adminHeader",
	"css!cs/stylesheets/main.css",
	"css!cs/stylesheets/login.css"
], function (
	$,
	_,
	Backbone,
	w2ui,
	Header
) {
	return Backbone.View.extend({
		el: 'body',
		view: undefined,
		initialize: function () {
			var _cookie = document.cookie;
			if(_cookie){
				var logStr = this.getCookie('login');
				logStr = logStr.substr(2, logStr.length - 1);
				var _loginObj = JSON.parse(logStr)
				var role = _loginObj['role'];
				if(role === 0){
					this.adminRender();
				} else if(role === 1) {
					this.render();
				}
			} else {
				this.render();

			}
		},
		events: {
			"click #logout-btn":"logoutHandler"
		},
        render: function(){
			var _this = this;
			var view = this.view;
			this.$el.find('.header-container').remove();
            if(view) view.destroy();
            var url = 'login';
            var _title = $(url).text();
            requirejs([
				'js/' + url
			], function(View){
				//_this.$el.find('.bottom-component').empty();
				var view = new View();
				_this.view = view;

			});
		},
		adminRender: function(){
			var _this = this;
			this.$el.prepend(Header);
            var view = this.view;
            if(view) view.destroy();
            var url = 'administrator';
            var _title = $(url).text();
            requirejs([
				'js/' + url
			], function(AdminView){
				//_this.$el.find('.bottom-component').empty();
				var adminView = new AdminView();
				_this.view = adminView;
			});
		},
		logoutHandler: function(){
			var _this = this;
			location.replace('/logout');
		},
		getCookie: function (cname) {
			var name = cname + "=";
			//var decodedCookie = decodeURIComponent(document.cookie);
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				var _indexOf = c.indexOf(name);
				
				if (c.indexOf(name) == 0) {
					var reuslt = c.substring(name.length, c.length);
					return decodeURIComponent(reuslt)
				}
			}
			return "";
		},
		destroy: function () {
            this.socket.disconnect();
			this.undelegateEvents();
			this.socket.disconnect();
        }
	});
});