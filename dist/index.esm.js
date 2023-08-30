var t=function(){function t(t,e){void 0===t&&(t={}),void 0===e&&(e=function(){});var o=this;this.startX=0,this.startY=0,this.moveInsX=0,this.moveInsY=0,this.isMousedown=!1,this.targetEl=null,this.targetElTx=0,this.targetElTy=0,this.initTargetElTop=0,this.initTargetElLeft=0,this.limitMoveBorder=!1,this.moveMode="transform",this.callback=null,this.h5=!1,this.disableMoveEl=!1,this.maxMoveX=1e6,this.maxMoveY=1e6,this.rootDom=document,this.calcTargetTranlate=function(){if(o.targetEl){var t=o.getStyleTransformProp(o.targetEl.style.transform,"translate3d");if(t.indexOf("translate3d")>-1){var e=/\((.*)\)/g.exec(t);e&&(t=e[1].replace(/, /g,","));var i=t.replace("(","").replace(")","").split(",");o.targetElTx=+i[0].replace("px","")||0,o.targetElTy=+i[1].replace("px","")||0}}},this.topLeftMoveTargetEl=function(){var t,e,i,n=o.moveInsX+o.initTargetElLeft,r=o.moveInsY+o.initTargetElTop;o.limitMoveBorder&&(t=o.targetEl.getBoundingClientRect(),e=t.width,i=t.height,r<0&&(r=0),r>window.innerHeight-i&&(r=window.innerHeight-i),n<0&&(n=0),n>window.innerWidth-e&&(n=window.innerWidth-e)),o.targetEl.style.left="".concat(n,"px"),o.targetEl.style.top="".concat(r,"px")},this.mousemoveHandler=function(t){var e=o.h5?t.changedTouches[0].pageX:t.pageX,i=o.h5?t.changedTouches[0].pageY:t.pageY;if(o.isMousedown){e<o.startX&&(o.moveInsX=o.moveInsX>-o.maxMoveX?e-o.startX:-o.maxMoveX),e>o.startX&&(o.moveInsX=o.moveInsX<o.maxMoveX?e-o.startX:o.maxMoveX),i<o.startY&&(o.moveInsY=o.moveInsY>-o.maxMoveY?i-o.startY:-o.maxMoveY),i>o.startY&&(o.moveInsY=o.moveInsY<o.maxMoveY?i-o.startY:o.maxMoveY),o.disableMoveEl||("position"===o.moveMode?o.topLeftMoveTargetEl():o.translateMoveEl());var n=Math.round(Math.pow(o.moveInsX*o.moveInsX+o.moveInsY*o.moveInsY,.5));o.callback(o.moveInsX,o.moveInsY,n)}},this.mousedownHandler=function(t){var e=o.h5?t.changedTouches[0].pageX:t.pageX,i=o.h5?t.changedTouches[0].pageY:t.pageY;o.startX=e,o.startY=i,o.moveInsX=0,o.moveInsY=0,o.isMousedown=!0,o.calcTargetTranlate(),"position"===o.moveMode&&o.initTragetElInfo()},this.mouseupHandler=function(){o.isMousedown=!1,o.startX=0,o.startY=0},this.initConfig(t),this.initEvent(),this.initTragetElInfo(),this.callback=e}return t.prototype.initConfig=function(t){this.targetEl=t.targetEl||this.rootDom.body,this.limitMoveBorder=!!t.limitMoveBorder,this.moveMode=t.moveMode||"transform",this.h5=!!t.h5,this.disableMoveEl=!!t.disableMoveEl,this.maxMoveX=t.maxMoveX||this.maxMoveX,this.maxMoveY=t.maxMoveY||this.maxMoveY,this.rootDom=t.rootDom||this.rootDom},t.prototype.initTragetElInfo=function(){if(this.targetEl){var t=this.targetEl.getBoundingClientRect(),e=t.top,o=t.left;this.initTargetElTop=e,this.initTargetElLeft=o,this.targetEl.style["will-change"]="transform"===this.moveMode?"transform":"left, top"}},t.prototype.getStyleTransformProp=function(t,e){void 0===t&&(t=""),void 0===e&&(e="scale");var o=(t=t.replace(/, /g,",").trim()).split(" "),i="";return o.forEach((function(t){t.indexOf(e)>-1&&(i=t)})),i},t.prototype.setTransformProp=function(t,e,o){void 0===t&&(t=""),void 0===e&&(e=""),void 0===o&&(o="");var i=new RegExp("".concat(e,"((.*))"),"g");if(t.indexOf(e)>-1){var n=t.replace(/, /g,",").trim().split(" ");t=n.map((function(t){return t.replace(i,"".concat(e,"(").concat(o,")"))})).join(" ")}else t="".concat(e,"(").concat(o,") ").concat(t);return t},t.prototype.translateMoveEl=function(){var t,e,o,i=this;if(this.targetEl){var n=this.targetElTx+this.moveInsX,r=this.targetElTy+this.moveInsY;this.limitMoveBorder&&(t=i.targetEl.getBoundingClientRect(),e=t.width,o=t.height,n+e+i.initTargetElLeft>window.innerWidth&&(n=window.innerWidth-e-i.initTargetElLeft),n<-i.initTargetElLeft&&(n=-i.initTargetElLeft),r+o+i.initTargetElTop>window.innerHeight&&(r=window.innerHeight-o-i.initTargetElTop),r<-i.initTargetElTop&&(r=-i.initTargetElTop));var a=this.targetEl.style.transform;a=a?this.setTransformProp(a,"translate3d","".concat(n,"px, ").concat(r,"px, 0px")):"translate3d(".concat(n,"px, ").concat(r,"px, 0px)"),this.targetEl.style.transform=a}},t.prototype.initEvent=function(){var t=this.h5?"touchmove":"mousemove",e=this.h5?"touchstart":"mousedown",o=this.h5?"touchend":"mouseup";this.rootDom.addEventListener(t,this.mousemoveHandler),this.targetEl&&this.targetEl.addEventListener(e,this.mousedownHandler),this.rootDom.addEventListener(o,this.mouseupHandler)},t.prototype.destroy=function(){var t=this.h5?"touchmove":"mousemove",e=this.h5?"touchstart":"mousedown",o=this.h5?"touchend":"mouseup";this.targetEl&&this.targetEl.removeEventListener(t,this.mousedownHandler),this.rootDom.removeEventListener(e,this.mousemoveHandler),this.rootDom.removeEventListener(o,this.mouseupHandler)},t}();export{t as default};