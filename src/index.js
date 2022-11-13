    /**
     * 拖动模型
     * */
     class DragMoveModel {
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
      bounce = false // 是否有弹性
      mvTx = 0
      mvTy = 0

      isMoveLeft = false
      isMoveRight = false
      isMoveUp = false
      isMoveDown = false

      constructor(config = {}, callback = () => {}) {
        this._initConfig(config)
        this._initEvent()
        this._initTragetElInfo()
        this.callback = callback
      }

      // 初始化配置
      _initConfig(config) {
        this.targetEl = config.targetEl || document.body
        this.limitMoveBorder = !!config.limitMoveBorder
        this.moveMode = config.moveMode || 'transform'
        this.h5 = !!config.h5
        this.bounce = !!config.bounce
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

      // 设置鼠标移动方向
      _setMoveDirection(direction = '') {
        this.isMoveLeft = false
        this.isMoveRight = false
        this.isMoveUp = false
        this.isMoveDown = false
        switch (direction) {
          case 'left':
            this.isMoveLeft = true
            break
          case 'right':
            this.isMoveRight = true
            break
          case 'up':
            this.isMoveUp = true
            break
          case 'down':
            this.isMoveDown = true
            break
        }
      }

      // 获取style的transform的属性值translate
      _getStyleTransformProp(transform = '', prop = 'scale') {
        transform = transform.replaceAll(', ', ',').trim()
        let strArr = transform.split(' ')
        let res = ''
        strArr.forEach(str => {
          if (str.includes(prop)) {
            res = str
          }
        })
        return res
      }

      // 计算元素的translate的值
      _calcTargetTranlate = () => {
        if (this.targetEl) {
          let translate = this._getStyleTransformProp(this.targetEl.style.transform, 'translate3d')
          if (translate.includes('translate3d')) {
            let reg = /\((.*)\)/g
            let res = reg.exec(translate)
            if (res) {
              translate = res[1].replaceAll(', ', ',')
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
        if(transform.includes(prop)) {
          let propList = transform.replaceAll(', ', ',').trim().split(' ')
          let newPropList = propList.map(item => item.replaceAll(reg, `${prop}(${value})`))
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
          this.mvTx = tx
          this.mvTy = ty
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
            this._setMoveDirection('left')
            this.moveInsX = pageX - this.startX
          }
          // 往右
          if (pageX > this.startX) {
            this._setMoveDirection('right')
            this.moveInsX = pageX - this.startX
          }
          // 往上
          if (pageY < this.startY) {
            this._setMoveDirection('up')
            this.moveInsY = pageY - this.startY
          }
          // 往下
          if (pageY > this.startY) {
            this._setMoveDirection('down')
            this.moveInsY = pageY - this.startY
          }
          // console.log('moveInsX', this.moveInsX, 'moveInsY', this.moveInsY)
          if(this.moveMode === 'position') {
            this._topLeftMoveTargetEl()
          }else {
            this._translateMoveEl()
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

      timer1 = null
      bounceIns = 0
      // 鼠标松开事件
      _mouseupHandler = (e) => {
        this.isMousedown = false // 标记鼠标松开状态
        this.startX = 0 // 将x轴鼠标起始位置清零
        this.startY = 0 // 将y轴鼠标起始位置清零

        this.timer1 = setInterval(() => {
            // if(this.timer1) clearInterval(this.timer1)
            this.bounceIns += 1

            let tx = this.mvTx
            let ty = this.mvTy
            if(this.isMoveLeft) {
              tx = this.mvTx - this.bounceIns
            }
            if(this.isMoveRight) {
              tx = this.mvTx + this.bounceIns
            }
            if(this.isMoveUp) {
              ty = this.mvTy - this.bounceIns
            }
            if(this.isMoveDown) {
              ty = this.mvTy + this.bounceIns
            }
  
            console.log('bounceIns', this.bounceIns)
            let transform = this.targetEl.style.transform
            transform = transform ? this._setTransformProp(transform, 'translate3d', `${tx}px, ${ty}px, 0px`) : `translate3d(${this.mvTx }px, ${this.mvTy}px, 0px)`
            this.targetEl.style.transform = transform

            if(this.bounceIns > 100) {
              clearInterval(this.timer1)
              this.bounceIns = 0
            }
          }, 1)
      }

      // 初始化监听事件
      _initEvent() {
        const moveEvent = this.h5 ? 'touchmove' : 'mousemove'
        const downEvent = this.h5 ?  'touchstart' : 'mousedown'
        const upEvent = this.h5 ? 'touchend' : 'mouseup'
        document.addEventListener(moveEvent, this._mousemoveHandler)
        this.targetEl && this.targetEl.addEventListener(downEvent, this._mousedownHandler)
        document.addEventListener(upEvent, this._mouseupHandler)
      }

      // 销毁方法
      destroy() {
        const moveEvent = this.h5 ? 'touchmove' : 'mousemove'
        const downEvent = this.h5 ?  'touchstart' : 'mousedown'
        const upEvent = this.h5 ? 'touchend' : 'mouseup'
        this.targetEl && this.targetEl.removeEventListener(moveEvent, this._mousedownHandler)
        this.document.removeEventListener(downEvent, this._mousemoveHandler)
        this.document.removeEventListener(upEvent, this._mouseupHandler)
      }
    }

    const targetEl = document.getElementById('rect-1')
    const moveModel = new DragMoveModel({ targetEl: targetEl, limitMoveBorder: true })

    // const targetEl2 = document.getElementById('rect-2')
    // const moveModel2 = new DragMoveModel({ targetEl: targetEl2, moveMode: 'position', limitMoveBorder: true  })
