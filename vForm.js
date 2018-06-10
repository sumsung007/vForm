(function (global) {
    function VForm() {
        //--------------------Attributes------------------
        /* 表单当前数据 */
        //this.data = {};
        /* 表单最新配置 */
        this.curSetting = {};
        /* 初始化设置 */
        this.baseSetting = {};
        /* vForm 状态 */
        this.status = {
            name: "vForm"
            , version: [0, 0, 1]                 //版本号
            , debug: {
                isdebug: true                //是否调试模式
            }
        };
        this.widgets = [];
        this.dom = null;

        //APIs
        /* 根据配置初始化 */
        this.Init = _vf_init;
        /* 动态更新配置 */
        this.SetOption = _vfAPISetOption;
        this.GetOption = _vfAPIGetOption;

        /* 拿到表单数据 */
        this.GetData = _vfAPIGetDAta;
        /* 设置表单数据 */
        this.SetData = _vfAPISetDAta;
        /*  */
        /*  */
        /*  */
        /*  */

        /* 检查表单数据有效性
        返回：true / [{name,errinfo},...]
         */
        this.Check = _vfAPICheck;

        //init
        _constructor(this);
        return this;
    }

    //构造函数
    var _constructor = (function () {
        return function (vf) {
            //debug工具，接管console
            if (console) {
                if (console.trustees != undefined) return;
                var _console = console;
                console = {};
                for (var a in _console) {
                    if (typeof _console[a] !== "function")
                        console[a] = _console[a];
                    else
                    (function (a) {
                        console[a] = function (x, y, z) {
                            if (!vf.status.debug.isdebug) return;
                            if (a != "trace") _console.trace();
                            return _console[a](x, y, z);
                        }
                    })(a);
                }
                console.trustees = vf.status.name;
            } else {
                window.console = {
                    trustees: vf.status.name
                    , log: function () { }
                    , debug: function () { }
                }
            }
        }
    })();

    //根据配置初始化
    var _vf_init = (function () {
        return function (config) {
            this.baseSetting = config;
            this.SetOption(config);

            var s = this.curSetting;
            for (var i = 0; i < config.widgets.length; i++) {
                var widget = VFWidgetFactory.GetWidget(config.widgets[i], this);
                this.widgets.push(widget);
            }

            this.dom = document.createElement("div");
            if(s.theme === undefined) s.theme = "light";
            if (s.title) {
                var tt = document.createElement("h4");
                tt.innerText = s.title;
                tt.className = "headtitle"+" bg-"+s.theme;
                this.dom.appendChild(tt);
            }
            var r = null;
            for (var i = 0; i < this.widgets.length; i++) {
                if (i % s.column == 0 || r == null) {
                    r = document.createElement("div");
                    r.className = "row vform_row";
                    this.dom.appendChild(r)
                }
                r.appendChild(this.widgets[i].dom);
            }

            this.dom.className = "container vform";
            document.body.appendChild(this.dom);
        }
    })();
    //根据配置初始化
    var _vfAPISetOption = function (config) {
        for (var cf in config) {
            this.curSetting[cf] = config[cf];
        }
    }
    var _vfAPIGetOption = function () {
        var r = {};
        for (var cf in this.curSetting) {
            if (typeof (this.curSetting[cf]) !== "function" && cf != "widgets")
                r[cf] = this.curSetting[cf];
        }
        return r;
    }
    //取得表单数据
    var _vfAPIGetDAta = function () {
        var d = {};
        for (var i = 0; i < this.widgets.length; i++) d[this.widgets[i].GetOption().id] = this.widgets[i].GetData();
        return d;
    }
    //设置表单数据
    var _vfAPISetDAta = function () {

    };
    //检查表单数据有效性
    //返回：true / [{name,errinfo},...]
    var _vfAPICheck = function () {

    }


    global.VForm = VForm;

    console.log(global);
    return VForm;
}(typeof window !== "undefined" ? window : this));