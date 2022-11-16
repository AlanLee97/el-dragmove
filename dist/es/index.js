/**
 * 拖动模型
 * */
var DragMoveModel = /** @class */ (function () {
    function DragMoveModel(config, callback) {
        if (config === void 0) { config = {}; }
        if (callback === void 0) { callback = function () { }; }
        var _this = this;
        this.startX = 0; // 按下的鼠标x值
        this.startY = 0; // 按下的鼠标y值
        this.moveInsX = 0; // 移动的x的值（从0开始累加）
        this.moveInsY = 0; // 移动的y的值（从0开始累加）
        this.isMousedown = false; // 是否按下鼠标
        this.targetEl = null; // 目标元素
        this.targetElTx = 0; // 目标元素的translate的x的值
        this.targetElTy = 0; // 目标元素的translate的y的值
        this.initTargetElTop = 0; // 目标元素的初始top值
        this.initTargetElLeft = 0; // 目标元素的初始left值
        this.limitMoveBorder = false; // 限制移动边界
        this.moveMode = 'transform'; // transform为transform-translate方式移动，position为top,left方式移动
        this.callback = null; // 回调函数，用于获取鼠标移动距离
        this.h5 = false; // 是否用于h5
        this.disableMoveEl = false; // 是否限制移动
        this.maxMoveX = 1000000; // x轴最大移动距离
        this.maxMoveY = 1000000; // y轴最大移动距离
        this.rootDom = document; // 根文档
        // 计算元素的translate的值
        this._calcTargetTranlate = function () {
            if (_this.targetEl) {
                var translate = _this._getStyleTransformProp(_this.targetEl.style.transform, 'translate3d');
                if (translate.indexOf('translate3d') > -1) {
                    var reg = /\((.*)\)/g;
                    var res = reg.exec(translate);
                    if (res) {
                        translate = res[1].replace(/, /g, ',');
                    }
                    var translateArr = translate.replace('(', '').replace(')', '').split(',');
                    _this.targetElTx = +translateArr[0].replace('px', '') || 0;
                    _this.targetElTy = +translateArr[1].replace('px', '') || 0;
                }
            }
        };
        // 使用top，left的方式移动元素
        this._topLeftMoveTargetEl = function () {
            var left = _this.moveInsX + _this.initTargetElLeft;
            var top = _this.moveInsY + _this.initTargetElTop;
            // 工具函数：限制移动边界
            var limitBorder = function () {
                var _a = _this.targetEl.getBoundingClientRect(), width = _a.width, height = _a.height;
                if (top < 0) {
                    top = 0;
                }
                if (top > (window.innerHeight - height)) {
                    top = window.innerHeight - height;
                }
                if (left < 0) {
                    left = 0;
                }
                if (left > (window.innerWidth - width)) {
                    left = window.innerWidth - width;
                }
            };
            if (_this.limitMoveBorder) {
                limitBorder();
            }
            _this.targetEl.style.left = left + 'px';
            _this.targetEl.style.top = top + 'px';
        };
        // 鼠标移动事件
        this._mousemoveHandler = function (e) {
            var pageX = _this.h5 ? e.changedTouches[0].pageX : e.pageX;
            var pageY = _this.h5 ? e.changedTouches[0].pageY : e.pageY;
            if (_this.isMousedown) {
                // 往左
                if (pageX < _this.startX) {
                    _this.moveInsX = _this.moveInsX > -_this.maxMoveX ? pageX - _this.startX : -_this.maxMoveX;
                }
                // 往右
                if (pageX > _this.startX) {
                    _this.moveInsX = _this.moveInsX < _this.maxMoveX ? pageX - _this.startX : _this.maxMoveX;
                }
                // 往上
                if (pageY < _this.startY) {
                    _this.moveInsY = _this.moveInsY > -_this.maxMoveY ? pageY - _this.startY : -_this.maxMoveY;
                }
                // 往下
                if (pageY > _this.startY) {
                    _this.moveInsY = _this.moveInsY < _this.maxMoveY ? pageY - _this.startY : _this.maxMoveY;
                }
                if (!_this.disableMoveEl) {
                    if (_this.moveMode === 'position') {
                        _this._topLeftMoveTargetEl();
                    }
                    else {
                        _this._translateMoveEl();
                    }
                }
                // 计算第三边的长度（勾股定理 a^2 + b^2 = c^2）
                var c = Math.round(Math.pow((_this.moveInsX * _this.moveInsX + _this.moveInsY * _this.moveInsY), 0.5));
                _this.callback(_this.moveInsX, _this.moveInsY, c);
            }
        };
        // 鼠标按下事件
        this._mousedownHandler = function (e) {
            var pageX = _this.h5 ? e.changedTouches[0].pageX : e.pageX;
            var pageY = _this.h5 ? e.changedTouches[0].pageY : e.pageY;
            _this.startX = pageX; // 记录鼠标起始位置x
            _this.startY = pageY; // 记录鼠标起始位置y
            _this.moveInsX = 0; // 将x轴移动距离清零
            _this.moveInsY = 0; // 将y轴移动距离清零
            _this.isMousedown = true; // 标记鼠标按下状态
            // 计算目标元素的translate的值
            _this._calcTargetTranlate();
            if (_this.moveMode === 'position') {
                _this._initTragetElInfo();
            }
        };
        // 鼠标松开事件
        this._mouseupHandler = function (e) {
            _this.isMousedown = false; // 标记鼠标松开状态
            _this.startX = 0; // 将x轴鼠标起始位置清零
            _this.startY = 0; // 将y轴鼠标起始位置清零
        };
        this._initConfig(config);
        this._initEvent();
        this._initTragetElInfo();
        this.callback = callback;
    }
    // 初始化配置
    DragMoveModel.prototype._initConfig = function (config) {
        this.targetEl = config.targetEl || this.rootDom.body;
        this.limitMoveBorder = !!config.limitMoveBorder;
        this.moveMode = config.moveMode || 'transform';
        this.h5 = !!config.h5;
        this.disableMoveEl = !!config.disableMoveEl;
        this.maxMoveX = config.maxMoveX || this.maxMoveX;
        this.maxMoveY = config.maxMoveY || this.maxMoveY;
        this.rootDom = config.rootDom || this.rootDom;
    };
    // 初始化目标元素相关信息
    DragMoveModel.prototype._initTragetElInfo = function () {
        if (this.targetEl) {
            var _a = this.targetEl.getBoundingClientRect(), top_1 = _a.top, left = _a.left;
            this.initTargetElTop = top_1;
            this.initTargetElLeft = left;
            this.targetEl.style['will-change'] = this.moveMode === 'transform' ? 'transform' : 'left, top';
        }
    };
    // 获取style的transform的属性值translate
    DragMoveModel.prototype._getStyleTransformProp = function (transform, prop) {
        if (transform === void 0) { transform = ''; }
        if (prop === void 0) { prop = 'scale'; }
        transform = transform.replace(/, /g, ',').trim();
        var strArr = transform.split(' ');
        var res = '';
        strArr.forEach(function (str) {
            if (str.indexOf(prop) > -1) {
                res = str;
            }
        });
        return res;
    };
    // 设置transform属性
    DragMoveModel.prototype._setTransformProp = function (transform, prop, value) {
        if (transform === void 0) { transform = ''; }
        if (prop === void 0) { prop = ''; }
        if (value === void 0) { value = ''; }
        var reg = new RegExp("".concat(prop, "((.*))"), 'g');
        if (transform.indexOf(prop) > -1) {
            var propList = transform.replace(/, /g, ',').trim().split(' ');
            var newPropList = propList.map(function (item) { return item.replace(reg, "".concat(prop, "(").concat(value, ")")); });
            transform = newPropList.join(' ');
        }
        else {
            transform = "".concat(prop, "(").concat(value, ") ") + transform;
        }
        return transform;
    };
    // translate移动元素
    DragMoveModel.prototype._translateMoveEl = function () {
        var _this = this;
        if (this.targetEl) {
            var tx_1 = this.targetElTx + this.moveInsX;
            var ty_1 = this.targetElTy + this.moveInsY;
            // 工具函数：限制移动边界
            var limitBorder = function () {
                var _a = _this.targetEl.getBoundingClientRect(), width = _a.width, height = _a.height;
                if (tx_1 + width + _this.initTargetElLeft > window.innerWidth) { // 限制右边界
                    tx_1 = window.innerWidth - width - _this.initTargetElLeft; // 窗口宽度-元素宽度-元素初始时的左偏移距离
                }
                if (tx_1 < -_this.initTargetElLeft) { // 限制左边界
                    tx_1 = -_this.initTargetElLeft;
                }
                if (ty_1 + height + _this.initTargetElTop > window.innerHeight) { // 限制下边界
                    ty_1 = window.innerHeight - height - _this.initTargetElTop;
                }
                if (ty_1 < -_this.initTargetElTop) { // 限制上边界
                    ty_1 = -_this.initTargetElTop;
                }
            };
            if (this.limitMoveBorder) {
                limitBorder();
            }
            var transform = this.targetEl.style.transform;
            transform = transform ? this._setTransformProp(transform, 'translate3d', "".concat(tx_1, "px, ").concat(ty_1, "px, 0px")) : "translate3d(".concat(tx_1, "px, ").concat(ty_1, "px, 0px)");
            this.targetEl.style.transform = transform;
        }
    };
    // 初始化监听事件
    DragMoveModel.prototype._initEvent = function () {
        var moveEvent = this.h5 ? 'touchmove' : 'mousemove';
        var downEvent = this.h5 ? 'touchstart' : 'mousedown';
        var upEvent = this.h5 ? 'touchend' : 'mouseup';
        this.rootDom.addEventListener(moveEvent, this._mousemoveHandler);
        this.targetEl && this.targetEl.addEventListener(downEvent, this._mousedownHandler);
        this.rootDom.addEventListener(upEvent, this._mouseupHandler);
    };
    // 销毁方法
    DragMoveModel.prototype.destroy = function () {
        var moveEvent = this.h5 ? 'touchmove' : 'mousemove';
        var downEvent = this.h5 ? 'touchstart' : 'mousedown';
        var upEvent = this.h5 ? 'touchend' : 'mouseup';
        this.targetEl && this.targetEl.removeEventListener(moveEvent, this._mousedownHandler);
        this.rootDom.removeEventListener(downEvent, this._mousemoveHandler);
        this.rootDom.removeEventListener(upEvent, this._mouseupHandler);
    };
    return DragMoveModel;
}());
export default DragMoveModel;
