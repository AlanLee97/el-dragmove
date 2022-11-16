# 使用文档 | Usage

![拖动模型.gif](https://cdn.nlark.com/yuque/0/2022/gif/743297/1667698967145-6341c3a8-58d6-4225-8cd1-7c02178cf863.gif#averageHue=%23d9d8d8&clientId=u4ef5f103-1e0f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=883&id=ue204ed0f&margin=%5Bobject%20Object%5D&name=%E6%8B%96%E5%8A%A8%E6%A8%A1%E5%9E%8B.gif&originHeight=883&originWidth=1344&originalType=binary&ratio=1&rotation=0&showTitle=false&size=481399&status=done&style=none&taskId=u02d99430-12c9-4114-ae9f-fc5605ed464&title=&width=1344#averageHue=%23d9d8d8&crop=0&crop=0&crop=1&crop=1&id=xwaSU&originHeight=883&originWidth=1344&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## 在线demo | Online Demo

- PC👉 [PC Online Demo](https://unpkg.com/el-dragmove@latest/example/index.html)
- H5👉 [H5 Online Demo](https://unpkg.com/el-dragmove@latest/example/h5.html)

## 使用示例
### CDN方式使用 | Using with CDN
```html
<div id="rect-1" class="rect">1</div>

<script src="https://unpkg.com/el-dragmove@latest/dist/index.min.js"></script>
<script>
  const targetEl = document.getElementById('rect-1')
  const moveModel = new DragMoveModel({ targetEl: targetEl }, (x, y, z) => console.log(x, y, z))
</script>
```

### 模块化项目中使用 | Using in Project

1. 安装 | install
```bash
npm i el-dragmove@latest -S
```

2. 引入 | import el-dragmove
```javascript
import Dragmove from 'el-dragmove/dist/es'

const el = document.getElementById('test')
const elDragmove = new Dragmove({
  targetEl: el
})

// 销毁监听事件
// elDragmove.destroy()
```
## 构造函数初始化参数 | Initialize some parameters

- config，个性化配置
- callback， 回调函数，获取鼠标移动距离

### config参数配置 | config`s properties
| 属性 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| targetEl | 目标元素，需要拖动的元素
The element that needs to be dragged | HTMLElement | document.body |  |
| limitMoveBorder | 是否限制拖动边界
Whether to restrict drag boundaries | Boolean | false |  |
| moveMode | 拖动实现方式，transform为transform-translate方式移动，position为top,left方式移动
Drag implementation | String | transform | `transform`
,`position` |
| h5 | 是否是h5
Whether it is H5 or not | Boolean | false |  |
| disableMoveEl | 是否限制移动
Whether to restrict movement | Boolean | false |  |
| maxMoveX | x轴最大移动距离
Maximum distance traveled on the x-axis | Number | 1000000 |  |
| maxMoveY | y轴最大移动距离
Maximum distance traveled on the y-axis | Number | 1000000 |  |


## 销毁方法 | Destroy

```javascript
moveModel.destroy()
```

# 实现原理解析 | How to implement
[https://juejin.cn/post/7165405623725588493](https://juejin.cn/post/7165405623725588493)
