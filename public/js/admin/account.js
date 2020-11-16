define([
    "text!views/account",
    "text!views/accountForm"
], function (
    HTML,
    accountForm
) {
    var AccountModel = Backbone.Model.extend({
        url: '/account/accounts',
        parse: function (result) {
            return result;
        }
    });
    return Backbone.View.extend({
        el: '.component-box',
        roleCombo: [
            { id: 'ADMIN', text: 'ADMIN', role: 0 },
            { id: 'USER', text: 'USER', role: 1 }
        ],

        config: {
            grid: {
                name: 'accountGrid',
                recid: "id",
                recordHeight: 30,
                show: {
                    toolbar: true,
                    footer: true,
                    selectColumn: true
                },
                // columns: [
                //     { field: 'start_time', caption: '시작시각', size: '25%', attr: "align=center" },
                //     { field: 'end_time', caption: '종료시각', size: '25%', attr: "align=center" },
                //     { field: 'delay_time', caption: '사용시간', size: '18%', attr: "align=right" },
                //     { field: 'final_value', caption: '최종 검지 수치', size: '18%', attr: "align=left" },
                // ],
                columns: [
                    { field: 'role_text', caption: '권한', size: '10%', attr: "align=center" },
                    // { field: 'site_index', caption: '현장번호', size: '15%', attr: "align=center" },
                    { field: 'site_name', caption: '현장명', size: '20%', attr: "align=center" },
                    { field: 'user_id', caption: '아이디', size: '15%', attr: "align=center" },
                    { field: 'name', caption: '이름', size: '15%', attr: "align=center" },
                    { field: 'tel', caption: '연락처', size: '20%', attr: "align=center" },
                    { field: 'mail', caption: '메일', size: '25%', attr: "align=center" }
                ],
                records: undefined,
                toolbar: {
                    items: [
                        { type: "button", id: "deleteBtn", caption: "Delete", icon: 'fas fa-times-circle' },
                    ],
                    onClick: function (evt) {
                        var target = evt.target;
                        if (target === 'w2ui-reload') {
                            window.main.view.adminView.accountModel.fetch()
                        }
                        else if (target === 'deleteBtn') {
                            var grid = window.w2ui['accountGrid'];
                            var selectIdArr = grid.getSelection();
                            var _selectIdCnt = selectIdArr.length;
                            if (_selectIdCnt) {
                                var options = {
                                    msg: "선택 된 " + _selectIdCnt + "개 데이터를 삭제하시겠습니까?",
                                    title: '계정 삭제',
                                    width: 450,
                                    height: 220,
                                    btn_yes: {
                                        text: '확인',
                                        class: '',
                                        style: 'background-image:linear-gradient(#73b6f0 0,#2391dd 100%); color: #fff',
                                        callBack: function () {
                                            for (var i in selectIdArr) {
                                                window.main.view.adminView.delete(selectIdArr[i]);

                                            }
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

                            } else {
                                w2alert("삭제할 데이터를 선택하세요");
                            }
                        }
                        else if (target === 'w2ui-column-on-off') {
                            // $('.w2ui-col-on-off tr:nth-child(1)').css('display','none');
                            // $('.w2ui-col-on-off tr:nth-child(7)').css('display','none');

                        }
                    }//end items- onClick
                },
                multiSearch: false,
                onClick: function (event) {
                    var grid = this;
                    var form = w2ui['accountForm'];
                    event.onComplete = function () {
                        var sel = grid.getSelection();
                        if (sel.length == 1) {
                            form.grid = sel[0];
                            form.record = $.extend(true, {}, grid.get(sel[0]));
                            form.refresh();
                            $('.w2ui-btn-blue').prop('disabled', false);
                            $('#search-btn').css('display', 'none');
                            $('#update-btn').css('display', 'block');
                            $('.w2ui-account-form .w2ui-field:nth-child(5)').css('display', 'none');
                            $('.w2ui-account-form .w2ui-field:nth-child(6)').css('display', 'none');
                            $('input#user_id').prop('readonly', true);
                            $('button#overlap-btn').css('display', 'none');
                            $('button#pw-change-btn').css('display', 'inline-block')
                            $('input#user_id').w2tag();
                            $('input.w2ui-input').removeClass('w2ui-error');
                        } else {
                            form.clear();
                            // $('.w2ui-btn-blue').prop('disabled', true);
                            $('.w2ui-field').find('input').removeClass('w2ui-error');
                            window.main.view.adminView.initForm();
                            $('input#user_id').prop('readonly', false);
                            $('button#overlap-btn').css('display', 'inline-block');
                            $('button#pw-change-btn').css('display', 'none')
                        }
                    }
                }
            }, // end grid
            form: {
                name: 'accountForm',
                formHTML: accountForm,
                header: '계정 정보',
                fields: undefined,
                actions: {
                    'reset': function () {
                        var form = this;
                        form.clear();
                        window.w2ui['accountGrid'].selectNone();
                        window.main.view.adminView.initForm();

                    },
                    'save': function () {
                        // 등록
                        var form = this;
                        var record = form.record;
                        var _role = record['role_text'] ? record['role_text']['role'] : null;
                        var _userId = record['user_id'] || null;

                        if (!_userId) {
                            $('input[name=user_id]').w2tag('아이디를 입력하세요.');
                            $('input[name=user_id]').addClass('w2ui-error');
                            return false;
                        }
                        var _doOverlapChecked = $('button#overlap-btn').attr('ischecked');
                        if (_doOverlapChecked === 'false') {
                            $('input[name=user_id]').w2tag('중복체크가 필요합니다.',{position:'bottom'});
                            setTimeout(function () {
                                $('input[name=user_id]').w2tag();
                            }, 1000);
                            return false
                        }

                        var _password = record['password'] || null;
                        if (!_password) {
                            $('input[name=password]').w2tag('비밀번호를 입력하세요.');
                            $('input[name=password]').addClass('w2ui-error');
                            return false;
                        }
                        var _passwordChk = record['password_chk'] || null;
                        if (!_passwordChk) {
                            $('input[name=password_chk]').w2tag('입력 된 비밀번호 확인이 필요합니다.');
                            $('input[name=password_chk]').addClass('w2ui-error');
                            return false;
                        }
                        var _name = record['name'] || null;
                        if (!_name) {
                            $('input[name=name]').w2tag('이름을 입력하세요.');
                            $('input[name=name]').addClass('w2ui-error');
                            return false;
                        }
                        var _tel = record['tel'] || undefined;
                        // if (!_tel) {
                        //     $('input[name=tel]').w2tag('연락처를 입력하세요.');
                        //     $('input[name=tel]').addClass('w2ui-error');
                        //     return false;
                        // }
                        var _mail = record['mail'] || null;
                        // if (!_mail) {
                        //     $('input[name=mail]').w2tag('이메일을 입력하세요.');
                        //     $('input[name=mail]').addClass('w2ui-error');
                        //     return false;
                        // }
                        var _siteIndex = record['site_index']['id'] || null;


                        var recordObj = {};
                        recordObj['role'] = _role;
                        recordObj['user_id'] = _userId;
                        recordObj['password'] = _password;
                        recordObj['name'] = _name;
                        recordObj['tel'] = _tel;
                        recordObj['mail'] = _mail;
                        recordObj['site_index'] = _siteIndex;
                        var options = {
                            msg: "새로운 계정를 등록 하시겠습니까?",
                            title: '계정 등록',
                            width: 450,
                            height: 220,
                            btn_yes: {
                                text: '확인',
                                class: '',
                                style: 'background-image:linear-gradient(#73b6f0 0,#2391dd 100%); color: #fff',
                                callBack: function () {
                                    window.main.view.adminView.insert(recordObj);

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


                    },
                    'update': function () {
                        //수정
                        var form = this;
                        var record = form.record;
                        var _id = record['id'];
                        var _role = record['role_text'] ? record['role_text']['role'] : null;
                        var _userId = record['user_id'] || null;
                        if (!_userId) {
                            $('input[name=user_id]').w2tag('아이디를 입력하세요.');
                            $('input[name=user_id]').addClass('w2ui-error');
                            return false;
                        }

                        var _name = record['name'] || null;
                        if (!_name) {
                            $('input[name=name]').w2tag('이름을 입력하세요.');
                            $('input[name=name]').addClass('w2ui-error');
                            return false;
                        }
                        var _tel = record['tel'] || null;
                        // if (!_tel) {
                        //     $('input[name=tel]').w2tag('연락처를 입력하세요.');
                        //     $('input[name=tel]').addClass('w2ui-error');
                        //     return false;
                        // }
                        var _mail = record['mail'] || null;
                        // if (!_mail) {
                        //     $('input[name=mail]').w2tag('이메일을 입력하세요.');
                        //     $('input[name=mail]').addClass('w2ui-error');
                        //     return false;
                        // }
                        var _siteIndex = record['site_index']['id'] || null;

                        var recordObj = {};
                        recordObj['id'] = _id;
                        recordObj['role'] = _role;
                        recordObj['user_id'] = _userId;
                        recordObj['name'] = _name;
                        recordObj['tel'] = _tel;
                        recordObj['mail'] = _mail;
                        recordObj['site_index'] = _siteIndex;

                        var passwordChangeTF = $('.w2ui-account-form .w2ui-field:nth-child(5)').css('display');
                        if(passwordChangeTF === 'block'){
                            var _password = record['password'] || null;
                            if (!_password) {
                                $('input[name=password]').w2tag('비밀번호를 입력하세요.');
                                $('input[name=password]').addClass('w2ui-error');
                                return false;
                            }
                            if (!_password) {
                                $('input[name=password_chk]').w2tag('비밀번호 확인이 필요합니다.');
                                $('input[name=password_chk]').addClass('w2ui-error');
                                return false;
                            }
                            recordObj['password'] = _password
                        }

                        var options = {
                            msg: _name+"계정를 수정 하시겠습니까?",
                            title: '계정 수정',
                            width: 450,
                            height: 220,
                            btn_yes: {
                                text: '확인',
                                class: '',
                                style: 'background-image:linear-gradient(#73b6f0 0,#2391dd 100%); color: #fff',
                                callBack: function () {
                                    window.main.view.adminView.update(recordObj);

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
                }, //end actions
                onChange: function (event) {
                    var target = event.target;
                    var $target = $('input[name=' + target + ']');
                    var hsaClz = $target.hasClass('w2ui-error');
                    if (hsaClz) {
                        var textLeng = $target.length;
                        if (textLeng !== 0) {
                            $target.removeClass('w2ui-error');
                        }
                    }

                    if (target === 'password_chk') {
                        var pw = $('#password').val();
                        var pwCheck = $('#password_chk').val();
                        if (pw !== pwCheck) {
                            $('#check-error').css('display', 'block');
                            $('#password_chk').addClass('w2ui-error');
                        } else {
                            $('#check-error').css('display', 'none');
                            $('#password_chk').removeClass('w2ui-error');
                        }
                    }
                    else if (target === 'tel') {
                    }

                }
            } // end form

        },
        initialize: function () {
            this.$el.html(HTML);

            this.accountModel = new AccountModel();
            this.listenTo(this.accountModel, "sync", this.getAccountList);
            this.accountModel.fetch();

            this.render();

        },
        events: {
            'keypress input#tel': 'inputPhoneNumber',
            'click button#overlap-btn': 'overlapHandler',
            'click button#reInput-btn': 'reInputHandler',
            'click button#pw-change-btn': 'authPopupOpen'
        },
        getAccountList: function (model, response) {
            var _this = this;
            var result = response;
            for (i in result) {
                var _role = result[i]['role'];
                var roleText;
                if (_role === 0) {
                    roleText = 'ADMIN';
                }
                else if (_role === 1) {
                    roleText = 'USER';
                }
                result[i]['role_text'] = roleText;

                var _siteIndex = result[i]['site_index'];
                if(_siteIndex){
                    var _siteName = window.main.view.siteObj[_siteIndex]['name'];
                    result[i]['site_name'] = _siteName
                }

            }

            var gridName = _this.config.grid['name'];
            window.w2ui[gridName].records = result;
            window.w2ui[gridName].refresh();

            window.w2ui[gridName].off('onDblClick');

        },
        render: function () {
            var _this = this;
            var gridOption = _this.config.grid;
            _this.$el.find('#account_grid').w2grid(gridOption);

            var formOption = _this.config.form;
            var _fields = [
                { name: 'role_text', type: 'list', options: { items: _this.roleCombo }, html: { caption: '권한' } },
                { name: 'site_index', type: 'list', options: { items: window.main.view['siteCombo'], match:'contains' }, html: { caption: '현장' } },
                { name: 'user_id', type: 'text', html: { caption: '아이디', attr: 'style="width: 360px;" ' } },
                { name: 'password', type: 'pass', html: { caption: '비밀번호' } },
                { name: 'password_chk', type: 'password', html: { caption: '비밀번호확인' } },
                { name: 'name', type: 'text', html: { caption: '이름' } },
                { name: 'tel', type: 'text', html: { caption: '연락처' } },
                { name: 'mail', type: 'email', html: { caption: '이메일' } }
            ];
            formOption['fields'] = _fields;
            _this.$el.find('#account_form').w2form(formOption);

            _this.initForm();
            _this.initGrid();
        },
        initForm: function () {
            var _this = this;
            // $('.w2ui-btn-blue').prop('disabled', true);
            $('#search-btn').css('display', 'block');
            $('#update-btn').css('display', 'none');
            $('#error_text').css('display', 'none');
            $('#user_id').removeClass('w2ui-error');
            $('#password_chk').removeClass('w2ui-error');
            $('#role_text').w2field().setIndex(1);
            $('#site_index').w2field().setIndex(1);

            _this.$el.find('button#overlap-btn').css('display', 'inline-block');
            _this.$el.find('button#overlap-btn').attr('ischecked', "false");
            _this.$el.find('button#reInput-btn').css('display', 'none');
            _this.$el.find('#overlap-error').css('display', 'none');
            _this.$el.find('#overlap-success').css('display', 'none');
            _this.$el.find('input#user_id').prop('readonly', false);
            _this.$el.find('input#user_id').removeClass('w2ui-error');

            // _this.$el.find('button#overlap-btn').css('display', 'inline-block');
            // _this.$el.find('button#reInput-btn').css('display', 'none');

        },
        initGrid: function () {
            var _this = this;
            _this.$el.find('#tb_accountGrid_toolbar_item_w2ui-search').css('display', 'none');

        },
        insert: function (obj) {
            var _this = this;
            var model = new AccountModel();
            model.set(obj);
            model.save({}, {
                success: function (modle, response) {
                    var result = response;

                    var _role = result['role'];
                    var roleText;
                    if (_role === 0) {
                        roleText = 'ADMIN';
                    }
                    else if (_role === 1) {
                        roleText = 'USER';
                    }

                    var _siteIndex = result['site_index'];
                    var _siteName = window.main.view.siteObj[_siteIndex]['name'];
                    result['site_name'] = _siteName
                    result['role_text'] = roleText;

                    var gridName = _this.config.grid['name'];
                    var formName = _this.config.form['name'];
                    window.w2ui[gridName].add(result);
                    window.w2ui[formName].clear();

                },
                error: function () {

                }
            });
        },
        update: function (obj) {
            var _this = this;
            var model = new AccountModel();
            model.url += "/" + obj.id;

            model.set(obj);
            model.save({}, {
                success: function (model, response) {
                    var result = response;

                    var _role = result['role'];
                    var roleText;
                    if (_role === 0) {
                        roleText = 'ADMIN';
                    }
                    else if (_role === 1) {
                        roleText = 'USER';
                    }
                    result['role_text'] = roleText;

                    var _siteIndex = result['site_index'];
                    var _siteName = window.main.view.siteObj[_siteIndex]['name'];
                    result['site_name'] = _siteName

                    var gridName = _this.config.grid['name'];
                    window.w2ui[gridName].set(obj['id'], obj);
                   // _this.initForm();
                   $('.w2ui-account-form .w2ui-field:nth-child(5)').css('display', 'none');
                   $('.w2ui-account-form .w2ui-field:nth-child(6)').css('display', 'none');
                   $('input#password').val('');
                   $('input#password_chk').val('');
                   $('.w2ui-account-form #pw-change-btn').css('display', 'inline-block');

                },
                error: function (model, response) {

                }
            });
        },
        delete: function (id) {
            var _this = this;
            var _id = id || 0;
            var obj = {};
            obj.id = _id;
            var model = new AccountModel();
            model.set(obj);
            model.url += "/" + _id;
            model.destroy({
                success: function (model, response) {
                    var gridName = _this.config.grid['name'];
                    var formName = _this.config.form['name'];

                    window.w2ui[gridName].remove(_id);
                    window.w2ui[gridName].selectNone();
                    window.w2ui[formName].clear();

                    _this.initForm();

                },
                error: function () {

                },
            });
        },
        overlapHandler: function () {
            var _this = this;
            var obj = {};
            var _userId = $('input#user_id').val();
            if (!_userId) {
                $('input[name=user_id]').w2tag('아이디를 입력하세요.');
                return false;
            }
            obj['user_id'] = _userId;

            var model = new AccountModel();
            model.url += '/checked';
            model.set(obj);
            model.save({}, {
                success: function (modle, response) {
                    var result = response;

                    var _isAccount = result['isDate'];
                    if (_isAccount) {
                        _this.$el.find('input#user_id').addClass('w2ui-error');
                        _this.$el.find('#overlap-error').css('display', 'block');
                        _this.$el.find('#overlap-success').css('display', 'none');

                    } else {
                        _this.$el.find('input#user_id').removeClass('w2ui-error');
                        _this.$el.find('input#user_id').prop('readonly', true);
                        
                        
                        _this.$el.find('button#overlap-btn').css('display', 'none');
                        _this.$el.find('button#overlap-btn').attr('ischecked', "true");
                        _this.$el.find('button#reInput-btn').css('display', 'inline-block');

                        _this.$el.find('#overlap-error').css('display', 'none');
                        _this.$el.find('#overlap-success').css('display', 'block');
                    }

                },
                error: function () {

                }
            });
        },
        reInputHandler: function () {
            var _this = this;
            _this.$el.find('input#user_id').prop('readonly', false);
            _this.$el.find('button#overlap-btn').attr('ischecked', "false");
            _this.$el.find('button#overlap-btn').css('display', 'inline-block');
            _this.$el.find('button#reInput-btn').css('display', 'none');

            _this.$el.find('#overlap-success').css('display', 'none');

        },
        authPopupOpen: function(){
            w2popup.open({
                width     : 500,
                height    : 200,
                title: '관리자 인증',
                body: '<div class="w2ui-centered"><div class="popup-top-area"><label>관리자 비밀번호: </label>&nbsp&nbsp<input type="password" class="w2ui-input" id="auth-input" onKeyDown="window.main.view.adminView.authAction()" placeholder="관리자 인증이 필요합니다."></div>'
                        +'<div class="popup-bottom-area" style="margin-top:5px;  display:none;"><span style="color:#ff0000; font-size:13px !important;">** 인증되지 않았습니다. 다시 입력하세요. **</span></div></div>',
                buttons: '<button class="w2ui-btn w2ui-btn-blue" id="auth-btn" style="color:#ffffff" onclick="window.main.view.adminView.authHandler(this)">인증</button>',
                showMax: false
            });
        },
        authAction: function(){
            var _this = this;
            if(window.event.keyCode == 13) {
                _this.authHandler();
            }
        },
        authHandler: function(event){
            var _this = this;
            var pw = $('#auth-input').val();
            if(!pw){
                $('input#auth-input').w2tag('비밀번호를 입력하세요.');
                $('input#auth-input').focus();
                return false
            }
            var obj = {}
            obj['user_id'] = window.main.userId;
            obj['password'] = pw
            var model = new AccountModel();
            model.url += '/auth'
            model.set(obj);
            model.save({}, {
                success: function (modle, response) {
                    var result = response;
                    console.log(result)
                    var _auth = result['auth']
                    if(_auth){
                        window.w2popup.close();
                        $('.w2ui-account-form .w2ui-field:nth-child(5)').css('display', 'block');
                        $('.w2ui-account-form .w2ui-field:nth-child(6)').css('display', 'block');
                        $('.w2ui-account-form #pw-change-btn').css('display', 'none');

                    } else {
                        $('.popup-bottom-area').css('display','block')
                      
                    }

                },
                error: function () {

                }
            });

        },
        inputPhoneNumber: function (event) {
            var $target = $(event.target);
            var number = $target.val().replace(/[^0-9]/g, "");
            var phone = "";

            if (number.length < 4) {
                return number;
            } else if (number.length < 7) {
                phone += number.substr(0, 3);
                phone += "-";
                phone += number.substr(3);
            } else if (number.length < 10) {
                phone += number.substr(0, 3);
                phone += "-";
                phone += number.substr(3, 3);
                phone += "-";
                phone += number.substr(6);
            } else {
                phone += number.substr(0, 3);
                phone += "-";
                phone += number.substr(3, 4);
                phone += "-";
                phone += number.substr(7);
            }
            $target.val(phone);

        },
        destroy: function () {
            var _this = this;
            var formName = _this.config.form['name'];
            if (window.w2ui.hasOwnProperty(formName)) {
                window.w2ui[formName].destroy()
            }
            var gridName = _this.config.grid['name'];
            if (window.w2ui.hasOwnProperty(gridName)) {
                window.w2ui[gridName].destroy()
            }
            this.undelegateEvents();
        },
    });
});