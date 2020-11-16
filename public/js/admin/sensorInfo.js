define([
    "text!views/sensor",
    "text!views/sensorForm"
], function (
    HTML,
    sensorForm
) {

    var SensorModel = Backbone.Model.extend({
        url: '/sensor/sensors',
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
                name: 'sensorGrid',
                recid: "id",
                recordHeight: 30,
                show: {
                    toolbar: true,
                    footer: true,
                    selectColumn: true
                },
                columns: [
                    { field: 'device_index', caption: '관리번호(S/N)', size: '20%', attr: "align=center" },
                    { field: 'site_name', caption: '업체명', size: '30%', attr: "align=center" },
                    { field: 'version_text', caption: 'Ver.', size: '10%', attr: "align=center" },
                    { field: 'name', caption: '센서명', size: '15%', attr: "align=center" },
                    // { field: 'server_index', caption: '서버', size: '15%', attr: "align=center" },
                    { field: 'server_index', caption: '서버', size: '30%', attr: "align=center" },
                    { field: 'fan_address', caption: 'FEN 이름', size: '15%', attr: "align=center" },
                    { field: 'port', caption: 'PORT', size: '15%', attr: "align=center" },
                    { field: 'connect_button', caption: '바로가기', size: '15%', attr: "align=center" }
                ],
                records: undefined,
                toolbar: {
                    items: [
                        { type: "button", id: "deleteBtn", caption: "Delete", icon: 'fas fa-times-circle' },
                    ],
                    onClick: function (evt) {
                        var target = evt.target;
                        if (target === 'w2ui-reload') {
                            window.main.view.sensorModel.fetch()
                        }
                        else if (target === 'deleteBtn') {
                            var grid = window.w2ui['sensorGrid'];
                            var selectIdArr = grid.getSelection();
                            var _selectIdCnt = selectIdArr.length;
                            if (_selectIdCnt) {
                                var options = {
                                    msg: "선택 된 " + _selectIdCnt + "개 데이터를 삭제하시겠습니까?",
                                    title: '센서 삭제',
                                    width: 450,
                                    height: 220,
                                    btn_yes: {
                                        text: '확인',
                                        class: '',
                                        style: 'background-image:linear-gradient(#73b6f0 0,#2391dd 100%); color: #fff',
                                        callBack: function () {
                                            for (var i in selectIdArr) {
                                                var selectRow = grid.get(selectIdArr[i])
                                                window.main.view.adminView.delete(selectRow);
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
                    var form = w2ui['sensorForm'];
                    event.onComplete = function () {
                        var sel = grid.getSelection();
                        if (sel.length == 1) {
                            form.grid = sel[0];
                            var selectRow = grid.get(sel[0]);
                            form.record = $.extend(true, {}, selectRow);
                            form.refresh();
                            
                            console.log(selectRow)
                            var _version = selectRow['version']
                            if(_version === 1){
                                $('.cctv-w2ui-field').css('display', 'none');
                            } else {
                                $('.cctv-w2ui-field').css('display', 'block');
                            }
                            
                            $('#search-btn').css('display', 'none');
                            $('#update-btn').css('display', 'inline-block');
                            $('button#overlap-btn').css('display', 'none');
                            $('button#reInput-btn').css('display', 'inline-block');
                            $('input#sensor_index').prop('readonly', true);
                            $('button#overlap-btn').attr('ischecked', 'true');

                            // $('input[name=server_index]').prop('readonly', true)

                        } else {
                            form.clear();
                            // $('.w2ui-btn-blue').prop('disabled', true);
                            $('.w2ui-field').find('input').removeClass('w2ui-error');
                            window.main.view.adminView.initForm();
                            $('button#overlap-btn').css('display', 'inline-block');
                            $('button#reInput-btn').css('display', 'none');
                            $('input#sensor_index').prop('readonly', false);

                            // $('input[name=server_index]').prop('readonly', false)


                        }
                    }
                }
            },
            form: {
                name: 'sensorForm',
                formHTML: sensorForm,
                header: '센서 정보',
                fields: undefined,
                actions: {
                    'reset': function () {
                        var form = this;
                        form.clear();
                        window.w2ui['sensorGrid'].selectNone();
                        window.main.view.adminView.initForm();

                    },
                    'save': function () {
                        // 등록
                        var form = this;
                        var record = form.record;
                        var _deviceIndex = record['sensor_index'];
                        var _sensorIndex = record['sensor_index'];
                        var _name = record['name'];
                        var _fanAddress = record['fan_address'];
                        var _port = record['port'];
                        // var _serverIndex = record['server_index']['id'];
                        var _siteIndex = record['site_index']['id'];
                        var _serverIndex = record['site_index']['server'];
                        var _version = record['version']['id'];
                        if (!_sensorIndex) {
                            $('input[name=sensor_index]').w2tag('센서인덱스를 입력하세요.');
                            $('input[name=sensor_index]').addClass('w2ui-error');
                            return false;
                        }
                        if (!_name) {
                            $('input[name=name]').w2tag('센서명를 입력하세요.');
                            $('input[name=name]').addClass('w2ui-error');
                            return false;
                        }

                         var _doOverlapChecked = $('button#overlap-btn').attr('ischecked');
                        if (_doOverlapChecked === 'false') {
                            $('input[name=sensor_index]').w2tag('중복체크가 필요합니다.', { position: 'bottom' });
                            setTimeout(function () {
                                $('input[name=sensor_index]').w2tag();
                            }, 1000);
                            return false
                        }

                        var recordObj = {}
                        recordObj['device_index'] = _deviceIndex;
                        recordObj['sensor_index'] = _sensorIndex;
                        recordObj['name'] = _name;
                        // recordObj['server_index'] = _serverIndex;
                        recordObj['site_index'] = _siteIndex;
                        recordObj['version'] = _version;
                        recordObj['server_index'] = _serverIndex;
                        recordObj['fan_address'] = _fanAddress;
                        recordObj['port'] = _port;
                        

                        var options = {
                            msg: "새로운 센서를 등록 하시겠습니까?",
                            title: '센서 등록',
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
                        var _deviceIndex = record['sensor_index'];
                        var _sensorIndex = record['sensor_index'];
                        var _fanAddress = record['fan_address'];
                        var _port = record['port'];
                        var _name = record['name'];
                        // var _serverIndex = record['server_index']['id'];
                        var _siteIndex = record['site_index']['id'];
                        var _serverIndex = record['site_index']['server'];

                        var _version = record['version']['id'];

                        if (!_sensorIndex) {
                            $('input[name=sensor_index]').w2tag('센서인덱스를 입력하세요.');
                            $('input[name=sensor_index]').addClass('w2ui-error');
                            return false;
                        }
                        if (!_name) {
                            $('input[name=name]').w2tag('센서명를 입력하세요.');
                            $('input[name=name]').addClass('w2ui-error');
                            return false;
                        }
                        var _doOverlapChecked = $('button#overlap-btn').attr('ischecked');

                        if (_doOverlapChecked === 'false') {
                            $('input[name=sensor_index]').w2tag('중복체크가 필요합니다.', { position: 'bottom' });
                            setTimeout(function () {
                                $('input[name=sensor_index]').w2tag();
                            }, 1000);
                            return false
                        }

                        var recordObj = {}
                        recordObj['id'] = _id;
                        recordObj['device_index'] = _deviceIndex;
                        recordObj['sensor_index'] = _sensorIndex;
                        recordObj['name'] = _name;
                        // recordObj['server_index'] = _serverIndex;
                        recordObj['site_index'] = _siteIndex;
                        recordObj['version'] = _version;
                        recordObj['server_index'] = _serverIndex;
                        recordObj['fan_address'] = _fanAddress;
                        recordObj['port'] = _port;

                        var options = {
                            msg: "새로운 센서를 수정 하시겠습니까?",
                            title: '센서 등록',
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
                    console.log(target)
                    if (target === 'sensor_index') {
                        var _sensorIndexValue = $('input#sensor_index').val();
                        _sensorIndexValue = _sensorIndexValue.toUpperCase();
                        $('input#sensor_index').val(_sensorIndexValue);
                    } 
                    else if(target === 'version'){
                        var _version = $('input#version').val();
                        if(_version.indexOf('LS-V2') > -1){
                            $('.cctv-w2ui-field').css('display', 'block');
                        } else {
                            $('.cctv-w2ui-field').css('display', 'none');

                        }
                    }

                }
            }, // end form
            newGrid: {
                name: 'newsensorGrid',
                columns: [
                    { field: 'sensor_index', caption: '센서번호', size: '15%', attr: "align=center" },
                    { field: 'name', caption: '센서명', size: '10%', attr: "align=center" },
                    // { field: 'server_index', caption: '서버', size: '15%', attr: "align=center" }
                ],
                multiSearch: true,
                records: undefined,
                recid: "id",
            }

        },
        initialize: function () {
            this.$el.html(HTML);

            this.sensorModel = new SensorModel();
            this.listenTo(this.sensorModel, "sync", this.getSensorList);
            this.sensorModel.fetch();
            this.render();

        },
        events: {
            'keypress input#tel': 'inputPhoneNumber',
            'click button#overlap-btn': 'overlapHandler',
            'click button#reInput-btn': 'reInputHandler'

        },
        connectHandler: function (event) {
            var _this = this;
            console.log("asfasfd-->", event)
            var _recId = _this.$el.find(event).attr('recid');
            var _gridName = _this.config.grid['name'];
            var _record = window.w2ui[_gridName].get(_recId);
            console.log(_record)
            var _sensorIndex = _record['sensor_index'];
            var _sensorName = _record['name'];
            var _siteName = _record['site_name'];
            var _version = _record['version']
            console.log(_sensorName)
            var options = {
                msg: '<span class="popop-title">' + _siteName + '-' + _sensorName + '</span> <br/><br/>연결하시겠습니까?',
                title: '연   결',
                width: 250,
                height: 220,
                btn_yes: {
                    text: '연결',
                    class: '',
                    style: 'background-image:linear-gradient(#73b6f0 0,#2391dd 100%); color: #fff',
                    callBack: function () {
                        document.cookie = "sensorIndex=" + _sensorIndex;
                        document.cookie = "sensorName=" + escape(_sensorName);
                        document.cookie = "siteName=" + escape(_siteName);
                        document.cookie = "version=" + _version;

                        var _server = _record['address'];
                       // var _server = 'http://192.168.0.39:9092'
                       console.log(_server)
                        //location.replace(_server);
                        location.href=_server 
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
        getSensorList: function (model, response) {
            var _this = this;
            var result = response;
            var _versionCombo = window.main.view.versionCombo;
            for (i in result) {
                console.log(result[i])
                result[i]['connect_button'] = '<a class="connect_btn" recid="' + result[i]['id'] + '" onClick="window.main.view.adminView.connectHandler(this)" ><i class="fas fa-link"></i></a>'
                var version = result[i]['version'];
                for (j in _versionCombo) {
                    var _id = _versionCombo[j]['id'];
                    if (version === _id) {
                        result[i]['version_text'] = _versionCombo[j]['text'];
                    }
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
            _this.$el.find('#sensor_grid').w2grid(gridOption);

            var formOption = _this.config.form;
            var _fields = [
                // { name: 'device_index', type: 'text' },
                { name: 'sensor_index', type: 'text' },
                { name: 'version', type: 'list', options: { items: _this.versionCombo } },
                { name: 'name', type: 'text' },
                { name: 'site_index', type: 'list', options: { items: window.main.view.siteCombo } },
                { name: 'fan_address', type: 'text' },
                { name: 'port', type: 'text' },
                // { name: 'server_index', type: 'list', options: { items: window.main.view.serverCombo }}
            ];
            formOption['fields'] = _fields;
            _this.$el.find('#sensor_form').w2form(formOption);

            var newGridOption = _this.config.newGrid;
            _this.$el.find('#newSensor_grid').w2grid(newGridOption);

            _this.initForm();
            _this.initGrid();
        },
        initForm: function () {
            var _this = this;
            _this.$el.find('input[name=version]').w2field().setIndex(0);
            _this.$el.find('input[name=site_index]').w2field().setIndex(0);
            //    _this.$el.find('input[name=server_index]').w2field().setIndex(0);

            // $('.w2ui-btn-blue').prop('disabled', true);
            _this.$el.find('#search-btn').css('display', 'inline-block');
            _this.$el.find('#update-btn').css('display', 'none');
            _this.$el.find('#error_text').css('display', 'none');

            _this.$el.find('button#overlap-btn').css('display', 'inline-block');
            _this.$el.find('button#overlap-btn').attr('ischecked', "false");
            _this.$el.find('button#reInput-btn').css('display', 'none');
            _this.$el.find('#overlap-error').css('display', 'none');
            _this.$el.find('#overlap-success').css('display', 'none');
            _this.$el.find('input#sensor_index').prop('readonly', false);
            _this.$el.find('input#sensor_index').removeClass('w2ui-error');

            // _this.$el.find('input[name=server_index]').prop('readonly', false);

            _this.$el.find('.cctv-w2ui-field').css('display', 'none');

        },
        initGrid: function () {
            var _this = this;
            _this.$el.find('#tb_sensorGrid_toolbar_item_w2ui-search').css('display', 'none');

        },
        insert: function (obj) {
            var _this = this;
            var model = new SensorModel();
            model.set(obj);
            model.save({}, {
                success: function (modle, response) {
                    var result = response;
                    _this.sensorModel.fetch();
                    var formName = _this.config.form['name'];
                    var newGridName = _this.config.newGrid['name'];
                    window.w2ui[formName].clear();
                    window.w2ui[newGridName].add(result);
                    _this.initForm();
                },
                error: function () {

                }
            });
        },
        update: function (obj) {
            var _this = this;
            var model = new SensorModel();
            model.url += "/" + obj.id;

            model.set(obj);
            model.save({}, {
                success: function (model, response) {
                    var result = response;

                    _this.sensorModel.fetch();

                    var gridName = _this.config.grid['name'];
                    window.w2ui[gridName].select(obj['id']);

                },
                error: function (model, response) {

                }
            });
        },
        delete: function (obj) {
            var _this = this;
            var _id = obj.id;
            var _serverIndex = obj['server_index']
            var _sensorIndex = obj['sensor_index']
            var model = new SensorModel();
            model.set(obj);
            model.url += "/" + _sensorIndex + "/" + _serverIndex;
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
            var _sensorIndex = $('input#sensor_index').val();
            if (!_sensorIndex) {
                $('input[name=sensor_index]').w2tag('아이디를 입력하세요.');
                return false;
            }
            obj['sensor_index'] = _sensorIndex;

            var model = new SensorModel();
            model.url += '/checked';
            model.set(obj);
            model.save({}, {
                success: function (modle, response) {
                    var result = response;
                    var _isAccount = result['isDate'];
                    if (_isAccount) {
                        _this.$el.find('input#sensor_index').addClass('w2ui-error');
                        _this.$el.find('#overlap-error').css('display', 'block');
                        _this.$el.find('#overlap-success').css('display', 'none');

                    } else {
                        _this.$el.find('input#sensor_index').removeClass('w2ui-error');
                        _this.$el.find('input#sensor_index').prop('readonly', true);

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
            _this.$el.find('input#sensor_index').prop('readonly', false);
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