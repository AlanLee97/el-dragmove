
export interface DragMoveConfig {
  targetEl: HTMLElement
  rootDom?: Document
  limitMoveBorder?: boolean
  moveMode?: 'transform' | 'position'
  h5?: boolean
  disableMoveEl?: boolean
  maxMoveX?: number
  maxMoveY?: number
}

/**
 * 拖动模型
 * */
export default class DragMoveModel {
  startX = 0 // 按下的鼠标x值
  startY = 0 // 按下的鼠标y值
  moveInsX = 0 // 移动的x的值（从0开始累加）
  moveInsY = 0 // 移动的y的值（从0开始累加）
  isMousedown = false // 是否按下鼠标
  targetEl = null // 目标元素
  targetElTx = 0 // 目标元素的translate的x的值
  targetElTy = 0 // 目标元素的translate的y的值
  initTargetElTop = 0 // 目标元素的初始top值
  initTargetElLeft = 0 // 目标元素的初始left值
  limitMoveBorder = false // 限制移动边界
  moveMode = 'transform' // transform为transform-translate方式移动，position为top,left方式移动
  callback = null // 回调函数，用于获取鼠标移动距离
  h5 = false // 是否用于h5
  disableMoveEl = false // 是否限制移动
  maxMoveX = 1000000 // x轴最大移动距离
  maxMoveY = 1000000 // y轴最大移动距离
  rootDom = document // 根文档

  constructor(config = {} as DragMoveConfig, callback = () => { }) {
    this._initConfig(config)
    this._initEvent()
    this._initTragetElInfo()
    this.callback = callback
  }

  // 初始化配置
  _initConfig(config: DragMoveConfig) {
    this.targetEl = config.targetEl || this.rootDom.body
    this.limitMoveBorder = !!config.limitMoveBorder
    this.moveMode = config.moveMode || 'transform'
    this.h5 = !!config.h5
    this.disableMoveEl = !!config.disableMoveEl
    this.maxMoveX = config.maxMoveX || this.maxMoveX
    this.maxMoveY = config.maxMoveY || this.maxMoveY
    this.rootDom = config.rootDom || this.rootDom
  }

  // 初始化目标元素相关信息
  _initTragetElInfo() {
    if (this.targetEl) {
      const { top, left } = this.targetEl.getBoundingClientRect()
      this.initTargetElTop = top
      this.initTargetElLeft = left
      this.targetEl.style['will-change'] = this.moveMode === 'transform' ? 'transform' : 'left, top'
    }
  }

  // 获取style的transform的属性值translate
  _getStyleTransformProp(transform: string = '', prop = 'scale') {
    transform = transform.replace(/, /g, ',').trim()
    let strArr = transform.split(' ')
    let res = ''
    strArr.forEach(str => {
      if (str.indexOf(prop) > -1) {
        res = str
      }
    })
    return res
  }

  // 计算元素的translate的值
  _calcTargetTranlate = () => {
    if (this.targetEl) {
      let translate = this._getStyleTransformProp(this.targetEl.style.transform, 'translate3d')
      if (translate.indexOf('translate3d') > -1) {
        let reg = /\((.*)\)/g
        let res = reg.exec(translate)
        if (res) {
          translate = res[1].replace(/, /g, ',')
        }
        let translateArr = translate.replace('(', '').replace(')', '').split(',')
        this.targetElTx = +translateArr[0].replace('px', '') || 0
        this.targetElTy = +translateArr[1].replace('px', '') || 0
      }
    }
  }

  // 设置transform属性
  _setTransformProp(transform = '', prop = '', value = '') {
    let reg = new RegExp(`${prop}\((.*)\)`, 'g')
    if (transform.indexOf(prop) > -1) {
      let propList = transform.replace(/, /g, ',').trim().split(' ')
      let newPropList = propList.map(item => item.replace(reg, `${prop}(${value})`))
      transform = newPropList.join(' ')
    } else {
      transform = `${prop}(${value}) ` + transform
    }
    return transform
  }

  // translate移动元素
  _translateMoveEl() {
    if (this.targetEl) {
      let tx = this.targetElTx + this.moveInsX
      let ty = this.targetElTy + this.moveInsY

      // 工具函数：限制移动边界
      const limitBorder = () => {
        const { width, height } = this.targetEl.getBoundingClientRect()
        if (tx + width + this.initTargetElLeft > window.innerWidth) { // 限制右边界
          tx = window.innerWidth - width - this.initTargetElLeft // 窗口宽度-元素宽度-元素初始时的左偏移距离
        }
        if (tx < -this.initTargetElLeft) { // 限制左边界
          tx = -this.initTargetElLeft
        }
        if (ty + height + this.initTargetElTop > window.innerHeight) { // 限制下边界
          ty = window.innerHeight - height - this.initTargetElTop
        }
        if (ty < -this.initTargetElTop) { // 限制上边界
          ty = -this.initTargetElTop
        }
      }

      if (this.limitMoveBorder) {
        limitBorder()
      }

      let transform = this.targetEl.style.transform
      transform = transform ? this._setTransformProp(transform, 'translate3d', `${tx}px, ${ty}px, 0px`) : `translate3d(${tx}px, ${ty}px, 0px)`
      this.targetEl.style.transform = transform
    }
  }

  // 使用top，left的方式移动元素
  _topLeftMoveTargetEl = () => {
    let left = this.moveInsX + this.initTargetElLeft
    let top = this.moveInsY + this.initTargetElTop

    // 工具函数：限制移动边界
    const limitBorder = () => {
      const { width, height } = this.targetEl.getBoundingClientRect()

      if (top < 0) {
        top = 0
      }
      if (top > (window.innerHeight - height)) {
        top = window.innerHeight - height
      }
      if (left < 0) {
        left = 0
      }
      if (left > (window.innerWidth - width)) {
        left = window.innerWidth - width
      }
    }
    if (this.limitMoveBorder) {
      limitBorder()
    }
    this.targetEl.style.left = left + 'px'
    this.targetEl.style.top = top + 'px'
  }

  // 鼠标移动事件
  _mousemoveHandler = (e) => {
    const pageX = this.h5 ? e.changedTouches[0].pageX : e.pageX
    const pageY = this.h5 ? e.changedTouches[0].pageY : e.pageY
    if (this.isMousedown) {
      // 往左
      if (pageX < this.startX) {
        this.moveInsX = this.moveInsX > -this.maxMoveX ? pageX - this.startX : -this.maxMoveX
      }
      // 往右
      if (pageX > this.startX) {
        this.moveInsX = this.moveInsX < this.maxMoveX ? pageX - this.startX : this.maxMoveX
      }
      // 往上
      if (pageY < this.startY) {
        this.moveInsY = this.moveInsY > -this.maxMoveY ? pageY - this.startY : -this.maxMoveY
      }
      // 往下
      if (pageY > this.startY) {
        this.moveInsY = this.moveInsY < this.maxMoveY ? pageY - this.startY : this.maxMoveY
      }
      if(!this.disableMoveEl) {
        if (this.moveMode === 'position') {
          this._topLeftMoveTargetEl()
        } else {
          this._translateMoveEl()
        }
      }
      
      // 计算第三边的长度（勾股定理 a^2 + b^2 = c^2）
      let c = Math.round(Math.pow((this.moveInsX * this.moveInsX + this.moveInsY * this.moveInsY), 0.5))
      this.callback(this.moveInsX, this.moveInsY, c)
    }
  }

  // 鼠标按下事件
  _mousedownHandler = (e) => {
    const pageX = this.h5 ? e.changedTouches[0].pageX : e.pageX
    const pageY = this.h5 ? e.changedTouches[0].pageY : e.pageY
    this.startX = pageX // 记录鼠标起始位置x
    this.startY = pageY // 记录鼠标起始位置y
    this.moveInsX = 0 // 将x轴移动距离清零
    this.moveInsY = 0 // 将y轴移动距离清零
    this.isMousedown = true // 标记鼠标按下状态

    // 计算目标元素的translate的值
    this._calcTargetTranlate()

    if (this.moveMode === 'position') {
      this._initTragetElInfo()
    }
  }

  // 鼠标松开事件
  _mouseupHandler = (e) => {
    this.isMousedown = false // 标记鼠标松开状态
    this.startX = 0 // 将x轴鼠标起始位置清零
    this.startY = 0 // 将y轴鼠标起始位置清零
  }

  // 初始化监听事件
  _initEvent() {
    const moveEvent = this.h5 ? 'touchmove' : 'mousemove'
    const downEvent = this.h5 ? 'touchstart' : 'mousedown'
    const upEvent = this.h5 ? 'touchend' : 'mouseup'
    this.rootDom.addEventListener(moveEvent, this._mousemoveHandler)
    this.targetEl && this.targetEl.addEventListener(downEvent, this._mousedownHandler)
    this.rootDom.addEventListener(upEvent, this._mouseupHandler)
  }

  // 销毁方法
  destroy() {
    const moveEvent = this.h5 ? 'touchmove' : 'mousemove'
    const downEvent = this.h5 ? 'touchstart' : 'mousedown'
    const upEvent = this.h5 ? 'touchend' : 'mouseup'
    this.targetEl && this.targetEl.removeEventListener(moveEvent, this._mousedownHandler)
    this.rootDom.removeEventListener(downEvent, this._mousemoveHandler)
    this.rootDom.removeEventListener(upEvent, this._mouseupHandler)
  }
}
