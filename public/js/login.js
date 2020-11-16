define([
	"text!views/logincomp"
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
		el: '.admin-component',
		view: undefined,
		config: {
			layout: {
				name: 'layout',
				padding: 4,
				panels: [
					// { type: 'left', size: '50%', resizable: true, minSize: 300 },
					{ type: 'main', minSize: 300 }
				]
			},
			grid: {
				name: 'grid',
				recid: 'id',
				recordHeight: 50,
				columns: [
					{ field: 'site_index', caption: '업체번호', size: '40%', sortable: true, attr: "align=center" },
					{ field: 'site_name', caption: '사업장', size: '40%', sortable: true, attr: "align=center" },
					{ field: 'version_name', caption: 'VERSION', size: '20%', sortable: true, attr: "align=center" },
					{ field: 'name', caption: '센서명칭', size: '40%', sortable: true, attr: "align=center" },
					// { field: 'server_href', caption: '연결', size: '40%', sortable: true, attr: "align=center" }
				],
				onClick: function (event) {
					var grid = this;
					event.onComplete = function () {
						var sel = grid.getSelection();
						if (sel.length == 1) {
							var record = grid.get(sel[0]);

							var _siteName = record['site_name'];
							var _sensorName = record['name'];
							var _version = record['version'];

							var options = {
								msg: '<span class="popop-title">'+_siteName+'-'+_sensorName+'</span> <br/><br/>연결하시겠습니까?',
								title: '연   결',
								width: 250,
								height: 220,
								btn_yes: {
									text: '연결',
									class: '',
									style: 'background-image:linear-gradient(#73b6f0 0,#2391dd 100%); color: #fff',
									callBack: function () {
										var _sensorIndex = record['sensor_index'];
										document.cookie = "sensorIndex=" + _sensorIndex;
										document.cookie = "sensorName="+escape(_sensorName);
										document.cookie = "siteName="+escape(_siteName);
										document.cookie = "version="+_version;

										var _server = record['address'];

										location.replace(_server);
									}
								},
								btn_no: {
									text: '취소',
									class: '',
									style: '',
									callBack: function () {
									}
								},
								callBack: null
							};
							w2confirm(options);

						}
					}
				}
			}
		},
		initialize: function () {
			this.$el.html(HTML);
			$().w2layout(this.config.layout);
			$().w2grid(this.config.grid);
		},
		events: {
			"click input#submit-btn": "loginHandler",
			"click #login_check": "loginCheck",
			"keypress .input_n": "loginAction"
		},
		render: function () {

		},
		openPopup: function () {
			var _this = this;
			w2popup.open({
				title: '이동식가스센서 접속',
				width: 900,
				height: 600,
				showMax: true,
				body: '<div id="main" style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px;"></div>',
				onOpen: function (event) {
					event.onComplete = function () {
						$('#w2ui-popup #main').w2render('layout');
						var gridName = _this.config.grid['name'];
						w2ui.layout.content('main', window.w2ui[gridName]);
					};
				},
				onToggle: function (event) {
					event.onComplete = function () {
						w2ui.layout.resize();
					}
				},
				onClose: function(){
					
				}
			});
		},
		loginHandler: function (evt) {
			var _this = this;
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
					if (_resMsg) {

						var _loginSuccess = result['success'] ? result['success'] : null;
						if (_loginSuccess) {
							window.main.userId = result['id']
							window.main.adminRender();

						} else {
							_this.$el.find('.login-overlay').css("display", "block");
							_this.$el.find(".loginFailPop").css("display", "block");
							_this.$el.find('#msgText').text(_resMsg);
							var errorType = result['error'];
							if (errorType === 'password-fail') {
								_this.$el.find('#txtPass').focus();
								_this.$el.find('#txtPass').val();
							} else if (errorType === 'user-fail') {
								_this.$el.find('#txtID').focus();
							}
							_this.$el.find('#txtPass').val('');
							_this.$el.find('#txtPass').focus();
						}

					} else {
						for (i in result) {
							var _address = result[i]['address'];
							var _sensorIndex = result[i]['sensor_index'];
							var _version = result[i]['version'];

							var versionName;
							if (_version === 1) {
								versionName = "LS-V1"
							}
							else if (_version === 2) {
								versionName = "LS-V2"
							}
							result[i]['version_name'] = versionName;

							// var _href = '<a href="#" onclick="window.main.view.redirectedAt()">연결</a>';
							// result[i]['server_href'] = _href
						}

						var gridName = _this.config.grid['name'];
						window.w2ui[gridName].records = result;
						_this.openPopup();
						setTimeout(function () {
							window.w2ui[gridName].refresh();
						}, 500);
					}

				},
				error: function (err) {
					console.log('error')
					console.log(err);
				}
			});

		},
		loginCheck: function () {
			var _this = this;
			_this.$el.find(".login-overlay").css("display", "none");
			_this.$el.find(".loginFailPop").css("display", "none");
		},
		loginAction: function (key) {
			var _this = this;
			if (key.keyCode === 13) {
				_this.loginHandler();
			}
		},
		redirectAction: function (event) {
			var _this = this;
			var _sensorIndex = $(event).attr('value')

			document.cookie = "sensorIndex=" + _sensorIndex;
			// location.replace();

		},
		destroy: function () {
			console.log('login destroy!!!');
			this.undelegateEvents();

		}
	});
});