define([
	"jquery",
	"jquery-mobile",
    "underscore",
	"backbone",
	"css!cs/stylesheets/mobile/main.css"
], function (
	$,
	$mobile,
	_,
	Backbone
) {
	return Backbone.View.extend({
		el: 'body',
		view: undefined,
		sensorList: undefined,
		initialize: function () {
			this.render();
		},
		events: {
		
		},
        render: function(){
			var _this = this;
			var view = this.view;
			this.$el.find('.header-container').remove();
            if(view) view.destroy();
            var url = 'login_mobile';
            var _title = $(url).text();
            requirejs([
				'js/' + url
			], function(View){
				var view = new View();
				_this.view = view;
			});
		
		},
		destroy: function () {
			if(view) view.destroy();
			this.undelegateEvents();
        }
	});
});