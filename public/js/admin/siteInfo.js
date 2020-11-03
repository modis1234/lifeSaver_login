define([
    "text!views/site",
    "text!views/siteForm"
], function (
    HTML,
    siteForm
) {

    var SiteModel = Backbone.Model.extend({
        url: '/site/sites',
        parse: function (result) {
            return result;
        }
    });

    return Backbone.View.extend({
        el: '.component-box',
        config: {
            grid: {
                name: 'siteGrid',
                recid: "id",
                recordHeight: 30,
                show: {
                    toolbar: true,
                    footer: true,
                    selectColumn: true
                },
                columns: [
                    { field: 'site_index', caption: '관리번호', size: '15%', attr: "align=center" },
                    { field: 'name', caption: '업체명', size: '35%', attr: "align=center" },
                    { field: 'server_index', caption: '서버', size: '15%', attr: "align=center" }
                ],
                records: undefined,
                toolbar: {
                    items: [
                        { type: "button", id: "deleteBtn", caption: "Delete", icon: 'fas fa-times-circle' },
                    ],
                    onClick: function (evt) {
                        var target = evt.target;
                        if (target === 'w2ui-reload') {
                            window.main.view.siteModel.fetch()
                        }
                        else if (target === 'deleteBtn') {
                            var grid = window.w2ui['siteGrid'];
                            var selectIdArr = grid.getSelection();
                            var _selectIdCnt = selectIdArr.length;
                            if (_selectIdCnt) {
                                var options = {
                                    msg: "선택 된 " + _selectIdCnt + "개 데이터를 삭제하시겠습니까?",
                                    title: '업체 삭제',
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
                    var form = w2ui['siteForm'];
                    event.onComplete = function () {
                        var sel = grid.getSelection();
                        if (sel.length == 1) {
                            form.grid = sel[0];
                            form.record = $.extend(true, {}, grid.get(sel[0]));
                            form.refresh();

                            $('#search-btn').css('display', 'none');
                            $('#update-btn').css('display', 'inline-block');
                            $('button#overlap-btn').css('display', 'none');
                            $('button#reInput-btn').css('display', 'inline-block');
                            $('input#name').prop('readonly',true);
                            $('button#overlap-btn').attr('ischecked','true');

                        } else {
                            form.clear();
                            // $('.w2ui-btn-blue').prop('disabled', true);
                            $('.w2ui-field').find('input').removeClass('w2ui-error');
                            window.main.view.adminView.initForm();
                            $('button#overlap-btn').css('display', 'inline-block');
                            $('button#reInput-btn').css('display', 'none');
                            $('input#name').prop('readonly',false);
                            // $('button#overlap-btn').attr('ischecked','false');


                        }
                    }
                }
            }, 
            form: {
                name: 'siteForm',
                formHTML: siteForm,
                header: '업체 정보',
                fields: undefined,
                actions: {
                    'reset': function () {
                        var form = this;
                        form.clear();
                        window.w2ui['siteGrid'].selectNone();
                        window.main.view.adminView.initForm();

                    },
                    'save': function () {
                        // 등록
                        var form = this;
                        var record = form.record;
                        var _name = record['name'] || null; 
                        var _serverIndex = record['server_index']['id'];
                        if(!_name){
                            $('input[name=name]').w2tag('업체명을 입력하세요.');
                            $('input[name=name]').addClass('w2ui-error');
                            return false;
                        }
                     
                        var _doOverlapChecked = $('button#overlap-btn').attr('ischecked');
                        if (_doOverlapChecked === 'false') {
                            $('input[name=name]').w2tag('중복체크가 필요합니다.',{position:'bottom'});
                            setTimeout(function () {
                                $('input[name=name]').w2tag();
                            }, 1000);
                            return false
                        }
                        //자동생성 
                        var date = new Date();
                        var getYear = date.getFullYear();
                        var getMonth = date.getMonth()+1;
                        getMonth = getMonth<10?'0'+getMonth:getMonth;

                        var gridName = window.main.view.adminView.config.grid['name'];
                        var gridCount = (window.w2ui[gridName].records.length+1);
                        if(gridCount<10){
                            gridCount = '00'+gridCount
                        }
                        else if(gridCount>=10 && gridCount<100){
                            gridCount = '0'+gridCount
                        }
                        
                        var _siteIndex = 'LST'+getYear+getMonth+'-'+gridCount;

                        var recordObj = {};
                        recordObj['name'] = _name;
                        recordObj['site_index'] = _siteIndex;
                        recordObj['server_index'] = _serverIndex;

                        var options = {
                            msg: "새로운 업체을 등록 하시겠습니까?",
                            title: '업체 등록',
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
                        var _name = record['name'] || null; 
                        var _siteIndex = record['site_index'] || null; 
                        var _serverIndex = record['server_index']['id'];

                        if(!_name){
                            $('input[name=name]').w2tag('업체명을 입력하세요.');
                            $('input[name=name]').addClass('w2ui-error');
                            return false;
                        }
                        // if(!_siteIndex){
                        //     $('input[name=site_index]').w2tag('업체명을 입력하세요.');
                        //     $('input[name=site_index]').addClass('w2ui-error');
                        //     return false;
                        // }
                        var _doOverlapChecked = $('button#overlap-btn').attr('ischecked');

                        if (_doOverlapChecked === 'false') {
                            $('input[name=name]').w2tag('중복체크가 필요합니다.',{position:'bottom'});
                            setTimeout(function () {
                                $('input[name=name]').w2tag();
                            }, 1000);
                            return false
                        }


                        var recordObj = {};
                        recordObj['id'] = _id;
                        recordObj['name'] = _name;
                        recordObj['site_index'] = _siteIndex;
                        recordObj['server_index'] = _serverIndex;

                        var options = {
                            msg: "업체을 수정 하시겠습니까?",
                            title: '업체 수정',
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
                    if(target === 'name'){
                        var _siteIndexValue = $('input#name').val();
                        // _siteIndexValue = _siteIndexValue.toUpperCase();
                        $('input#name').val(_siteIndexValue);
                    }

                }
            }, // end form
            newGrid: {
				name: 'newSiteGrid',
				columns: [
                    { field: 'site_index', caption: '관리번호', size: '15%', attr: "align=center" },
                    { field: 'name', caption: '업체명', size: '35%', attr: "align=center" },
                    { field: 'server_index', caption: '서버', size: '15%', attr: "align=center" }
				],
				multiSearch: true,
				records: undefined,
				recid: "id",
			}

        },
        initialize: function () {
            this.$el.html(HTML);

            this.render();

        },
        events: {
            'keypress input#tel': 'inputPhoneNumber',
            'click button#overlap-btn': 'overlapHandler',
            'click button#reInput-btn': 'reInputHandler'
        },
        render: function () {
            var _this = this;
            var gridOption = _this.config.grid;
            _this.$el.find('#site_grid').w2grid(gridOption);
            window.w2ui['siteGrid'].records = window.main.view.siteList;
            window.w2ui['siteGrid'].refresh();

            var formOption = _this.config.form;
            var _fields = [
                { name: 'site_index', type: 'text', html: { caption: '업체' } },
                { name: 'name', type: 'text', html: { caption: '업체명' } },
                { name: 'server_index', type: 'list', options: { items: window.main.view.serverCombo }}
            ];
            formOption['fields'] = _fields;
            _this.$el.find('#site_form').w2form(formOption);

            var newGridOption = _this.config.newGrid;
            _this.$el.find('#newSite_grid').w2grid(newGridOption);

            _this.initForm();
            _this.initGrid();
        },
        initForm: function () {
            var _this = this;
            // $('.w2ui-btn-blue').prop('disabled', true);
            $('#search-btn').css('display', 'inline-block');
            $('#update-btn').css('display', 'none');
            $('#error_text').css('display', 'none');
            _this.$el.find('input[name=server_index]').w2field().setIndex(0);

            _this.$el.find('button#overlap-btn').css('display', 'inline-block');
            _this.$el.find('button#overlap-btn').attr('ischecked', "false");
            _this.$el.find('button#reInput-btn').css('display', 'none');
            _this.$el.find('#overlap-error').css('display', 'none');
            _this.$el.find('#overlap-success').css('display', 'none');
            _this.$el.find('input#name').prop('readonly', false);
            _this.$el.find('input#name').removeClass('w2ui-error');

            _this.$el.find('input[name=server_index]').prop('readonly', false);


        },
        initGrid: function () {
            var _this = this;
            _this.$el.find('#tb_siteGrid_toolbar_item_w2ui-search').css('display', 'none');

        },
        insert: function (obj) {
            var _this = this;
            var model = new SiteModel();
            model.set(obj);
            model.save({}, {
                success: function (modle, response) {
                    var result = response;
                    var gridName = _this.config.grid['name'];
                    var formName = _this.config.form['name'];
                    var newGridName = _this.config.newGrid['name'];
                    window.w2ui[gridName].add(result);
                    window.w2ui[formName].clear();
                    window.w2ui[newGridName].add(result);
                    window.main.view.siteModel.fetch();
                    _this.initForm();

                },
                error: function () {

                }
            });
        },
        update: function (obj) {
            var _this = this;
            var model = new SiteModel();
            model.url += "/" + obj.id;

            model.set(obj);
            model.save({}, {
                success: function (model, response) {
                    var result = response;

                    var gridName = _this.config.grid['name'];
                    window.w2ui[gridName].set(obj['id'], obj);
                    window.main.view.siteModel.fetch();

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
            var model = new SiteModel();
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
                    window.main.view.siteModel.fetch();


                },
                error: function () {

                },
            });
        },   
        overlapHandler: function () {
            var _this = this;
            var obj = {};
            var _siteIndex = $('input#name').val();
            if (!_siteIndex) {
                $('input[name=name]').w2tag('업체 이름을 입력하세요.');
                return false;
            }
            obj['name'] = _siteIndex;

            var model = new SiteModel();
            model.url += '/checked';
            model.set(obj);
            model.save({}, {
                success: function (modle, response) {
                    var result = response;
                    var _isAccount = result['isDate'];
                    if (_isAccount) {
                        _this.$el.find('input#name').addClass('w2ui-error');
                        _this.$el.find('#overlap-error').css('display', 'block');
                        _this.$el.find('#overlap-success').css('display', 'none');

                    } else {
                        _this.$el.find('input#name').removeClass('w2ui-error');
                        _this.$el.find('input#name').prop('readonly', true);
                        
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
            _this.$el.find('input#name').prop('readonly', false);
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