define([
    "text!views/login_m",
	"css!cs/stylesheets/mobile/login.css"
], function (
	HTML
) {

	var LoginModel = Backbone.Model.extend({
		url: '/login',
		parse: function (result) {
			return result;
		}
	});

	return Backbone.View.extend({
		el: '.component',
		view: undefined,
		initialize: function () {
			this.render();
		},
        render: function(){
			var _this = this;
			$('.component').html(HTML)
		
		},
		events: {
			'mousedown .ui-input-btn':'focusEvent',
			'mousedown .ui-input-text':'focusEvent',
			"click input#submit-btn": "loginHandler"
		},
		loginHandler: function (){
			var _this =this;
			var _userId = _this.$el.find('#txtID').val();
			var _password = _this.$el.find('#txtPass').val();
			if (!_userId) {
				alert('아이디를 입력하세요.');
				_this.$el.find('#txtID').focus();
				return false
			}
			if (!_password) {
				alert('비밀번호를 입력하세요.');
				_this.$el.find('#txtPass').focus();
				return false
			}
			var obj = {
				userId: _userId,
				password: _password
			}

			var model = new LoginModel();
			model.set(obj);
			model.save({}, {
				success: function (modle, response) {
					var result = response;
					var _resMsg = result['msg'] ? result['msg'] : null;
					if(_resMsg){
						var _loginSuccess = result['success'] ? result['success'] : null;
						if(_loginSuccess){
							// 관리자 로그인 성공
							alert('관리자는 PC에서만 로그인 가능합니다.');
						} else {
							// 로그인 실패!!!
							_this.$el.find('#login-msg').css('display','block');
					
							_this.$el.find('#login-msg').text(_resMsg)
						}
					} else {
						// 사용자 로그인 성공 --> 대시보드로 이동
						window.main.sensorList = result;
				
						var firstSensor = window.main.sensorList[0];
						// document.cookie = "sersorList=" + firstSensor;
						var _server = firstSensor['address']
						location.replace(_server)

					}
				},
				error: function (err) {
					console.log('error')
					console.log(err);
				}
			});

		},
		focusEvent: function(event){
			var _this =this;
			var $target = $(event.currentTarget)
			var isSiblingsClz = $target.siblings().hasClass('ui-focus');
			if(isSiblingsClz){
				$target.siblings().removeClass('ui-focus');
			}
			var isClz = $target.hasClass('ui-focus');
			if(!isClz){
				$target.addClass('ui-focus');
			}
		},
		destroy: function () {
			this.undelegateEvents();
        }
	});
});