define([
    "text!views/server",
    "text!views/serverForm"
], function (
    HTML,
    serverForm
) {

    var ServerModel = Backbone.Model.extend({
        url: '/server/servers',
        parse: function (result) {
            return result;
        }
    });

    return Backbone.View.extend({
        el: '.component-box',
        versionCombo: [
            { id: 1, text: 'LS-V1' },
            { id: 2, text: 'LS-V2' }
        ],
        config: {
            grid: {
                name: 'serverGrid',
                recid: "id",
                recordHeight: 30,
                show: {
                    toolbar: true,
                    footer: true,
                    selectColumn: true
                },
                columns: [
                    { field: 'server_index', caption: '서버번호', size: '25%', attr: "align=center" },
                    // { field: 'version_text', caption: 'Ver.', size: '10%', attr: "align=center" },
                    { field: 'address', caption: '주소', size: '35%', attr: "align=center" },
                    { field: 'number', caption: '등록수', size: '10%', attr: "align=center" },
                    { field: 'description', caption: '비고', size: '20%', attr: "align=center" }
                ],
                records: undefined,
                toolbar: {
                    items: [
                        { type: "button", id: "deleteBtn", caption: "Delete", icon: 'fas fa-times-circle' },
                    ],
                    onClick: function (evt) {
                        var target = evt.target;
                        if (target === 'w2ui-reload') {
                            window.main.view.serverModel.fetch()
                        }
                        else if (target === 'deleteBtn') {
                            var grid = window.w2ui['serverGrid'];
                            var selectIdArr = grid.getSelection();
                            var _selectIdCnt = selectIdArr.length;
                            if (_selectIdCnt) {
                                var options = {
                                    msg: "선택 된 " + _selectIdCnt + "개 데이터를 삭제하시겠습니까?",
                                    title: '서버 삭제',
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
                    var form = w2ui['serverForm'];
                    event.onComplete = function () {
                        var sel = grid.getSelection();
                        if (sel.length == 1) {
                            form.grid = sel[0];
                            var record = grid.get(sel[0]);
                            var _address = record['address'];
                            var protocal = _address.substring(7);
                            record['address'] = protocal;

                            form.record = $.extend(true, {}, record);
                            record['address'] = _address;
                            form.refresh();

                            $('#search-btn').css('display', 'none');
                            $('#update-btn').css('display', 'inline-block');
                            $('button#overlap-btn').css('display', 'none');
                            $('button#reInput-btn').css('display', 'inline-block');
                            $('input#server_index').prop('readonly',true);
                            $('button#overlap-btn').attr('ischecked','true');

                        } else {
                            form.clear();
                            // $('.w2ui-btn-blue').prop('disabled', true);
                            $('.w2ui-field').find('input').removeClass('w2ui-error');
                            window.main.view.adminView.initForm();
                            $('button#overlap-btn').css('display', 'inline-block');
                            $('button#reInput-btn').css('display', 'none');
                            $('input#server_index').prop('readonly',false);



                        }
                    }
                }
            },
            form: {
                name: 'serverForm',
                formHTML: serverForm,
                header: '서버 정보',
                fields: undefined,
                actions: {
                    'reset': function () {
                        var form = this;
                        form.clear();
                        window.w2ui['serverGrid'].selectNone();
                        window.main.view.adminView.initForm();

                    },
                    'save': function () {
                        // 등록
                        var form = this;
                        var record = form.record;
                        var _serverIndex = record['server_index'];
                        var _address = 'http://'+record['address'];
                        // var _version = record['version']['id'];

                        if(!_serverIndex){
                            $('input[name=server_index]').w2tag('서버번호를 입력하세요.');
                            $('input[name=server_index]').addClass('w2ui-error');
                            return false;
                        }
                        if(!_address){
                            $('input[name=address]').w2tag('서버주소를 입력하세요.');
                            $('input[name=address]').addClass('w2ui-error');
                            return false;
                        }

                        var _doOverlapChecked = $('button#overlap-btn').attr('ischecked');

                        if (_doOverlapChecked === 'false') {
                            $('input[name=server_index]').w2tag('중복체크가 필요합니다.',{position:'bottom'});
                            setTimeout(function () {
                                $('input[name=server_index]').w2tag();
                            }, 1000);
                            return false
                        }

                        var recordObj = {}
                        recordObj['server_index'] = _serverIndex;
                        recordObj['address'] = _address;
                        // recordObj['version'] = _version;
                        recordObj['number'] = 0;
                        var options = {
                            msg: "새로운 서버를 등록 하시겠습니까?",
                            title: '서버 등록',
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
                        var _serverIndex = record['server_index'];
                        var _address = 'http://'+record['address'];
                        // var _version = record['version']['id'];
                        if(!_serverIndex){
                            $('input[name=server_index]').w2tag('서버번호를 입력하세요.');
                            $('input[name=server_index]').addClass('w2ui-error');
                            return false;
                        }
                        if(!_address){
                            $('input[name=address]').w2tag('서버주소를 입력하세요.');
                            $('input[name=address]').addClass('w2ui-error');
                            return false;
                        }

                        var _doOverlapChecked = $('button#overlap-btn').attr('ischecked');

                        if (_doOverlapChecked === 'false') {
                            $('input[name=server_index]').w2tag('중복체크가 필요합니다.',{position:'bottom'});
                            setTimeout(function () {
                                $('input[name=server_index]').w2tag();
                            }, 1000);
                            return false
                        }

                        var recordObj = {}
                        recordObj['id'] = _id;
                        recordObj['server_index'] = _serverIndex;
                        recordObj['address'] = _address;
                        // recordObj['version'] = _version;
                        recordObj['number'] = record['number'];
                        var options = {
                            msg: "서버을 수정 하시겠습니까?",
                            title: '서버 수정',
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
                    if(target === 'server_index'){
                        var _serverIndexValue = $('input#server_index').val();
                        _serverIndexValue = _serverIndexValue.toUpperCase();
                        $('input#server_index').val(_serverIndexValue);
                    }

                }
            }, // end form
            newGrid: {
                name: 'newserverGrid',
                columns: [
                    { field: 'server_index', caption: '서버번호', size: '25%', attr: "align=center" },
                    // { field: 'version_text', caption: 'Ver.', size: '10%', attr: "align=center" },
                    { field: 'address', caption: '주소', size: '35%', attr: "align=center" },
                    { field: 'number', caption: '등록수', size: '10%', attr: "align=center" },
                    { field: 'description', caption: '비고', size: '20%', attr: "align=center" }
                ],
                multiSearch: true,
                records: undefined,
                recid: "id",
            }

        },
        initialize: function () {
            this.$el.html(HTML);

            this.serverModel = new ServerModel();
            this.listenTo(this.serverModel, "sync", this.getServerList);
            this.serverModel.fetch();

            this.render();

        },
        events: {
            'keypress input#tel': 'inputPhoneNumber',
            'click button#overlap-btn': 'overlapHandler',
            'click button#reInput-btn': 'reInputHandler'
        },
        getServerList: function (model, response) {
            var _this = this;
            var result = response;

            // var _versionCombo = _this.versionCombo;
            // for (i in result) {
            //     var version = result[i]['version'];
            //     for(j in _versionCombo){
            //         var _id = _versionCombo[j]['id'];
            //         if(version === _id){
            //             result[i]['version_text'] = _versionCombo[j]['text'];
            //         }
            //     }
            // }



            var gridName = _this.config.grid['name'];
            window.w2ui[gridName].records = result;
            window.w2ui[gridName].refresh();

            window.w2ui[gridName].off('onDblClick');

        },
        render: function () {
            var _this = this;
            var gridOption = _this.config.grid;
            _this.$el.find('#server_grid').w2grid(gridOption);

            var formOption = _this.config.form;
            var _fields = [
                { name: 'server_index', type: 'text' },
                // { name: 'version', type: 'list', options: { items: _this.versionCombo } },
                { name: 'address', type: 'text' },
            ];
            formOption['fields'] = _fields;
            _this.$el.find('#server_form').w2form(formOption);

            var newGridOption = _this.config.newGrid;
            _this.$el.find('#newServer_grid').w2grid(newGridOption);

            _this.initForm();
            _this.initGrid();
        },
        initForm: function () {
            var _this = this;

            // _this.$el.find('input[name=version]').w2field().setIndex(0);

            // $('.w2ui-btn-blue').prop('disabled', true);
            _this.$el.find('#search-btn').css('display', 'inline-block');
            _this.$el.find('#update-btn').css('display', 'none');
            _this.$el.find('#error_text').css('display', 'none');

            _this.$el.find('button#overlap-btn').css('display', 'inline-block');
            _this.$el.find('button#overlap-btn').attr('ischecked', "false");
            _this.$el.find('button#reInput-btn').css('display', 'none');
            _this.$el.find('#overlap-error').css('display', 'none');
            _this.$el.find('#overlap-success').css('display', 'none');
            _this.$el.find('input#server_index').prop('readonly', false);
            _this.$el.find('input#server_index').removeClass('w2ui-error');

        },
        initGrid: function () {
            var _this = this;
            _this.$el.find('#tb_serverGrid_toolbar_item_w2ui-search').css('display', 'none');

        },
        insert: function (obj) {
            var _this = this;
            var model = new ServerModel();
            model.set(obj);
            model.save({}, {
                success: function (modle, response) {
                    var result = response;
                    // var _version = result['version'];
                    // var _versionCombo = _this.versionCombo;
                    // for(j in _versionCombo){
                    //     var _id = _versionCombo[j]['id'];
                    //     if(_version === _id){
                    //         result['version_text'] = _versionCombo[j]['text'];
                    //     }
                    // }

                    var gridName = _this.config.grid['name'];
                    var formName = _this.config.form['name'];
                    var newGridName = _this.config.newGrid['name'];
                    window.w2ui[gridName].add(result);
                    window.w2ui[formName].clear();
                    window.w2ui[newGridName].add(result);
                    window.main.view.serverModel.fetch();
                    _this.initForm();
                },
                error: function () {

                }
            });
        },
        update: function (obj) {
            var _this = this;
            var model = new ServerModel();
            model.url += "/" + obj.id;

            model.set(obj);
            model.save({}, {
                success: function (model, response) {
                    var result = response;

                    // var _version = result['version'];
                    // var _versionCombo = _this.versionCombo;
                    // for(j in _versionCombo){
                    //     var _id = _versionCombo[j]['id'];
                    //     if(_version === _id){
                    //         result['version_text'] = _versionCombo[j]['text'];
                    //     }
                    // }

                    var gridName = _this.config.grid['name'];
                    window.w2ui[gridName].set(obj['id'], obj);

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
            var model = new ServerModel();
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
                    window.main.view.serverModel.fetch();


                },
                error: function () {

                },
            });
        },   
        overlapHandler: function () {
            var _this = this;
            var obj = {};
            var _serverIndex = $('input#server_index').val();
            if (!_serverIndex) {
                $('input[name=server_index]').w2tag('아이디를 입력하세요.');
                return false;
            }
            obj['server_index'] = _serverIndex;

            var model = new ServerModel();
            model.url += '/checked';
            model.set(obj);
            model.save({}, {
                success: function (modle, response) {
                    var result = response;
                    var _isAccount = result['isDate'];
                    if (_isAccount) {
                        _this.$el.find('input#server_index').addClass('w2ui-error');
                        _this.$el.find('#overlap-error').css('display', 'block');
                        _this.$el.find('#overlap-success').css('display', 'none');

                    } else {
                        _this.$el.find('input#server_index').removeClass('w2ui-error');
                        _this.$el.find('input#server_index').prop('readonly', true);

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
            _this.$el.find('input#server_index').prop('readonly', false);
            _this.$el.find('button#overlap-btn').attr('ischecked', "false");
            _this.$el.find('button#overlap-btn').css('display', 'inline-block');
            _this.$el.find('button#reInput-btn').css('display', 'none');

            _this.$el.find('#overlap-success').css('display', 'none');

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
            var newGridName = _this.config.newGrid['name'];
            if (window.w2ui.hasOwnProperty(newGridName)) {
                window.w2ui[newGridName].destroy()
            }

            this.undelegateEvents();
        },
    });
});