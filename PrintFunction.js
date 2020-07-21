(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.FunctionDraw = factory());
})(this, function () {
	function CreateEleemnt(tagName,styles) {
		styles = styles || {}
		var element = document.createElement(tagName)
		for(var item in styles){
			element.style[item] = styles[item]
		}
		return element
	}
	
	//设备类型
	FunctionDraw.prototype.__DeciveType__ = (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent))
	
	//主容器
	FunctionDraw.prototype.__app__ = null;
	
	//canvas对象
	FunctionDraw.prototype.__canvas__ = null;
	
	//context对象
	FunctionDraw.prototype.__context__ = null;
	
	//canvas宽高
	FunctionDraw.prototype.__OffsetSize__ = null
	
	//范围
	FunctionDraw.prototype.__MaxNumber__ = null
	
	//用户参数
	FunctionDraw.prototype.__params__ = null
	
	//x轴，y轴在坐标系中的位置
	FunctionDraw.prototype.__LineOffset__ = null
	
	//动画队列
	FunctionDraw.prototype.__AnimationQueue__ = null
	
	//节点集合
	FunctionDraw.prototype.__PointQueue__ = null
	
	//节点结集合
	FunctionDraw.prototype.__CheckPoinList__ = null
	
	//提示根节点
	FunctionDraw.prototype.__TipElement__ = null
	
	//动画回调
	FunctionDraw.prototype.__Callback__ = null
	
	//划线函数
	FunctionDraw.prototype.__DrawLine__ = function(moveoffsetX,moveoffsetY,endX,endY,color){
		this.__context__.beginPath()
		this.__context__.moveTo(moveoffsetX,moveoffsetY)
		this.__context__.strokeStyle = color
		this.__context__.fillStyle = color
		this.__context__.lineTo(endX,endY)
		this.__context__.closePath()
		this.__context__.stroke()
		//
	}
	
	//绘制刻度函数
	FunctionDraw.prototype.__DrawMark__ = function(lineoffset,crossX,crossY,ColorX,ColorY,persion){
		if(typeof(crossX + crossY) === 'number'){
			//画刻度
			var persinwdt = this.__MaxNumber__.persinwdt, xLineOffset = lineoffset.xLine.y === 0 ? -7 : 7,xTextOffset = lineoffset.xLine.y === this.__OffsetSize__.height ? -13 : 13
			//先绘制x轴负数坐标
			for(var i = 1; i <= parseInt(lineoffset.yLine.x / persinwdt);i++){
				this.__DrawLine__(lineoffset.yLine.x - i * persinwdt,lineoffset.xLine.y,lineoffset.yLine.x - i * persinwdt,lineoffset.xLine.y - xLineOffset,ColorX)
				this.__context__.font = '12px 宋体'
				this.__context__.fillStyle=ColorX
				this.__context__.textAlign = 'center'
				this.__context__.fillText(crossX - i,lineoffset.yLine.x - i * persinwdt,lineoffset.xLine.y + xTextOffset)
				if(i === parseInt(lineoffset.yLine.x / persinwdt)){
						this.__MaxNumber__['minx'] = crossX - i
				}
			}
			//绘制x轴正数坐标
			for(var i = 1;i <= parseInt((this.__OffsetSize__.width - lineoffset.yLine.x) / persinwdt);i++){
				this.__DrawLine__(lineoffset.yLine.x + i * persinwdt,lineoffset.xLine.y,lineoffset.yLine.x + i * persinwdt,lineoffset.xLine.y - xLineOffset,ColorX)
				this.__context__.font = '12px 宋体'
				this.__context__.fillStyle=ColorX
				this.__context__.textAlign = 'center'
				this.__context__.fillText(crossX + i,lineoffset.yLine.x + i * persinwdt,lineoffset.xLine.y + xTextOffset)
				if(i === parseInt((this.__OffsetSize__.width - lineoffset.yLine.x) / persinwdt)){
						this.__MaxNumber__['maxx'] = crossX + i
				}
			}
			//绘制y坐标
			var persinhgt = this.__MaxNumber__.persinhgt, yLineOffset = lineoffset.yLine.x === this.__OffsetSize__.width ? -7 : 7,yTextOffset = lineoffset.yLine.x === this.__OffsetSize__.width ? 17 : lineoffset.yLine.x === 0 ? -17 : 13
			//绘制y轴正数坐标
			for(var i = 1;i <= parseInt(lineoffset.xLine.y / persinhgt);i++){
				this.__DrawLine__(lineoffset.yLine.x,lineoffset.xLine.y - i * persinhgt,lineoffset.yLine.x + yLineOffset,lineoffset.xLine.y - i * persinhgt,ColorY)
				this.__context__.font = '12px 宋体'
				this.__context__.fillStyle=ColorY
				this.__context__.textBaseline = 'middle'
				this.__context__.fillText(crossY + i,lineoffset.yLine.x - yTextOffset,lineoffset.xLine.y - i * persinhgt)
				if(i === parseInt(lineoffset.xLine.y / persinhgt)){
						this.__MaxNumber__['maxy'] = crossY + i
				}
			}
			//绘制y轴负数坐标
			for(var i = 1;i <= parseInt((this.__OffsetSize__.height - lineoffset.xLine.y) / persinhgt);i++){
				this.__DrawLine__(lineoffset.yLine.x,lineoffset.xLine.y + i * persinhgt,lineoffset.yLine.x + yLineOffset,lineoffset.xLine.y + i * persinhgt,ColorY)
				this.__context__.font = '12px 宋体'
				this.__context__.fillStyle=ColorY
				this.__context__.textBaseline = 'middle'
				this.__context__.fillText(crossY - i,lineoffset.yLine.x - yTextOffset,lineoffset.xLine.y + i * persinhgt)
				if(i === parseInt((this.__OffsetSize__.height - lineoffset.xLine.y) / persinhgt)){
						this.__MaxNumber__['miny'] = crossY - i
				}
			} 
		}else{
			console.error("刻度都必须是数字")
		}
	}
	
	FunctionDraw.prototype.ComputX = function(x){
		var Value = x > this.__MaxNumber__.crossx ? this.__LineOffset__.yLine.x + this.__MaxNumber__.persinwdt * (x - this.__MaxNumber__.crossx) : this.__LineOffset__.yLine.x - this.__MaxNumber__.persinwdt * (this.__MaxNumber__.crossx - x)
		return {flag:!(Value > this.__OffsetSize__.width || Value < 0),value:Value}
	}
	
	FunctionDraw.prototype.ComputY = function(y){
		var Value = y > this.__MaxNumber__.crossy ? this.__LineOffset__.xLine.y + this.__MaxNumber__.persinhgt * (this.__MaxNumber__.crossy - y) : this.__LineOffset__.xLine.y - this.__MaxNumber__.persinhgt * (y - this.__MaxNumber__.crossy)
		return {flag:!(Value > this.__OffsetSize__.height || Value < 0),value:Value}
	}
	
	FunctionDraw.prototype.DrawFunction = function(item,id){
		var method = typeof item.method === 'function' ? item.method : item, i = this.__MaxNumber__.minx - 1,prevRes = item.method(i),prevOffsetY = this.ComputY(prevRes).value,HasPrint = false,prevvalue = i,tipColor = item.tipColor || 'black'
		this.__context__.beginPath()
		this.__context__.strokeStyle = item.color || 'black'
		this.__context__.fillStyle = item.color || 'black'
		for(var j = 1;i <= this.__MaxNumber__.maxx;i+=0.01,j+=1){
			i = Number(i.toFixed(5))
			var resultY = method(i),x = this.ComputX(i),y = this.ComputY(resultY)
			if(typeof resultY === 'object' && !resultY){continue}
			if(prevRes === resultY && prevOffsetY === y && HasPrint){
				break
			}else if(x.flag && y.flag){
				if(item.animation){
					this.__AnimationQueue__[id].push({fn:this.__context__.lineTo,x:x.value,y:y.value,color:item.color || 'black',id:item.id})
				}else{
					
					this.__context__.lineTo(x.value,y.value)
				}
				if(parseInt(i * this.__MaxNumber__.accuracy) - parseInt(prevvalue * this.__MaxNumber__.accuracy) > 0){
					this.__PointQueue__[id].push({x:x.value,y:y.value,xval:i,yval:resultY,color:tipColor})
					if(this.__CheckPoinList__[parseInt(x.value / 100)]){
						this.__CheckPoinList__[parseInt(x.value / 100)][parseInt(x.value) + ',' + parseInt(y.value)] = {x:i.toFixed(this.__MaxNumber__.accuracy.toString().length - 1), y:resultY.toFixed(this.__MaxNumber__.accuracy.toString().length - 1),title:item.title}
					}
				}
				HasPrint = true
			}else{
				item.animation ? this.__AnimationQueue__[id].push({fn:this.__context__.moveTo,x:x.value,y:prevOffsetY,color:item.color || 'black',id:item.id}) : this.__context__.moveTo(x.value,prevOffsetY)
			}
			prevRes = resultY
			prevOffsetY = y.value
			prevvalue = i
		}
		this.__context__.stroke()
		this.__context__.closePath()
	}
	
	//清除提示节点
	FunctionDraw.prototype.ClearTips = function(){
		this.__PointQueue__ = this.__PointQueue__.map(item=>[])
		this.__CheckPoinList__ = new Array(this.__OffsetSize__.width % 100 > 0 ? parseInt(this.__OffsetSize__.width / 100) + 1 : this.__OffsetSize__.width / 100)
		for(var item in Array.from(this.__CheckPoinList__)){
			this.__CheckPoinList__[item] = Object.create({})
		}
	}
	
	//标点函数
	FunctionDraw.prototype.DrawTips = function(){
		if(!this.__params__.ShowTips){return}
		var t = null
		this.__PointQueue__.forEach((item)=>{
			item.forEach((_item)=>{
				this.__context__.beginPath()
				this.__context__.fillStyle =_item.color
				this.__context__.strokeStyle =_item.color
				this.__context__.moveTo(_item.x,_item.y)
				this.__context__.arc(_item.x,_item.y,2.5,0,2*Math.PI)
				this.__context__.fill()
				this.__context__.stroke()
				this.__context__.closePath()
			})
		})
	}
	
	//重新绘制画布
	FunctionDraw.prototype.ResetCanvas = function(){
		var params = this.__params__
		//清除画布
		this.__context__.clearRect(0,0,this.__OffsetSize__.width,this.__OffsetSize__.height)
		//绘制X轴
		this.__DrawLine__(0,this.__LineOffset__.xLine.y,this.__OffsetSize__.width,this.__LineOffset__.xLine.y,params.MarkRange.ColorX)
		//绘制Y轴
		this.__DrawLine__(this.__LineOffset__.yLine.x,0,this.__LineOffset__.yLine.x,this.__OffsetSize__.height,params.MarkRange.ColorY)
		//先绘制刻度
		var revise = this.__DrawMark__(this.__LineOffset__,this.__MaxNumber__.crossx,this.__MaxNumber__.crossy,params.MarkRange.ColorX,
		params.MarkRange.ColorY,params.MarkRange.MiddleColor,params.MarkRange.precision)
		//绘制函数图像
		params.Methods.forEach((item,index)=>{this.DrawFunction(item,index)})
	}
	
	//执行动画
	FunctionDraw.prototype.DoAnimate = async function(){
		if(this.__AnimationQueue__.filter(item=>item.length).length){
			var item = this.__AnimationQueue__.shift(),start = -1,end = -1
			item.length || this.DoAnimate()
			for(var i = 0;i < item.length;i++){
				if(item[i].fn === this.__context__.moveTo && start === -1){
					start = i
				}else if(item[i].fn === this.__context__.lineTo && start > -1){
					end = i - 1
					item.splice(start,end-start)
					i -= (end - start)
					start = -1
					end = -1
				}
			}
			if(start > -1){
				item.splice(start,item.length - 1)
			}
			await new Promise((reslove)=>{
				item.forEach(($,index)=>{
					this.__context__.beginPath()
					setTimeout(()=>{
						this.__context__.strokeStyle = $.color
						this.__context__.fillStyle = $.color
						$.fn.call(this.__context__,$.x,$.y)
						this.__context__.stroke()
						if(index === item.length - 1 && this.__AnimationQueue__.filter(item=>item.length).length){
							this.__context__.closePath()
							this.DoAnimate()
						}else if(index === item.length - 1){
							this.__context__.closePath()
							reslove($.id)
						}
					},index * 1.5)
				})
			}).then(this.__Callback__)
		}
		this.BindEvent()
		this.DrawTips()
	}
	
	//绑定事件函数
	FunctionDraw.prototype.BindEvent = function(){
		var DownFlag = false,prevOffsetY = -1,prevOffsetX = -1,t = null,offsetX = 0,offsetY = 0,params = this.__params__,prevScaleX = 0,prevScaleY = 0
		xLineOffsetY = this.__OffsetSize__.height / 2,yLineOffsetX = this.__OffsetSize__.width / 2,t = null
		this.__canvas__.addEventListener(this.__DeciveType__ ? 'touchstart' : 'mousedown',(e)=>{
			prevOffsetY = this.__DeciveType__ ? e.touches[0].clientY : e.offsetY
			prevOffsetX = this.__DeciveType__ ? e.touches[0].clientX : e.offsetX
			DownFlag = true
		},false)
		this.__canvas__.addEventListener(this.__DeciveType__ ? 'touchmove' : 'mousemove',(e)=>{
			if(DownFlag){
				this.__TipElement__.style.display = 'none'
				e.preventDefault()
				this.ClearTips()
				if(this.__DeciveType__){
					if(e.touches.length === 2){
						var currentScaleX = Math.abs(e.touches[0].clientX - e.touches[1].clientX),
						currentScaleY = Math.abs(e.touches[0].clientY - e.touches[1].clientY),
						UpdateFlag = false
						if(Math.abs(prevScaleX + prevScaleY) > 0){
							if(currentScaleX > prevScaleX){
								if(this.__MaxNumber__.persinhgt === 100){return}
								this.__MaxNumber__.persinhgt += 2
								this.__MaxNumber__.persinwdt += 2
								UpdateFlag = true
							}else{
								if(this.__MaxNumber__.persinhgt === 10){return}
								this.__MaxNumber__.persinhgt -= 2
								this.__MaxNumber__.persinwdt -= 2
								UpdateFlag = true
							}
							UpdateFlag ? this.ResetCanvas() : null
						}
						prevScaleX = currentScaleX
						prevScaleY = currentScaleY
						return
					}
				}
				xLineOffsetY += (this.__DeciveType__ ? e.touches[0].clientY : e.offsetY) - prevOffsetY
				yLineOffsetX += (this.__DeciveType__ ? e.touches[0].clientX : e.offsetX) - prevOffsetX
				var numY = offsetY / Math.floor(this.__MaxNumber__.persinhgt),numX = offsetX / Math.floor(this.__MaxNumber__.persinwdt),
						Real_xLineOffsetY = xLineOffsetY > this.__OffsetSize__.height ? this.__OffsetSize__.height : xLineOffsetY < 0 ? 0 : xLineOffsetY
						Real_yLineOffsetX = yLineOffsetX > this.__OffsetSize__.width ? this.__OffsetSize__.width : yLineOffsetX < 0 ? 0 : yLineOffsetX
						offsetX += Real_yLineOffsetX === 0 || Real_yLineOffsetX === this.__OffsetSize__.width ? (this.__DeciveType__ ? e.touches[0].clientX : e.offsetX) - prevOffsetX : 0
						offsetY += Real_xLineOffsetY === 0 || Real_xLineOffsetY === this.__OffsetSize__.height ? (this.__DeciveType__ ? e.touches[0].clientY : e.offsetY) - prevOffsetY : 0,
						offsetX = Real_yLineOffsetX > 0 && Real_yLineOffsetX < this.__OffsetSize__.width ? 0 : offsetX
						offsetY = Real_xLineOffsetY > 0 && Real_xLineOffsetY < this.__OffsetSize__.height ? 0 : offsetY,
						this.__LineOffset__.xLine.y = Real_xLineOffsetY
						this.__LineOffset__.yLine.x = Real_yLineOffsetX
						this.__MaxNumber__.crossy = parseInt(numY)
						this.__MaxNumber__.crossx = parseInt(numX) * -1
						//清除画布
						this.__context__.clearRect(0,0,this.__OffsetSize__.width,this.__OffsetSize__.height)
						//绘制X轴
						this.__DrawLine__(0,Real_xLineOffsetY,this.__OffsetSize__.width,Real_xLineOffsetY,params.MarkRange.ColorX)
						//绘制Y轴
						this.__DrawLine__(Real_yLineOffsetX,0,Real_yLineOffsetX,this.__OffsetSize__.height,params.MarkRange.ColorY)
						//先绘制刻度
						var revise = this.__DrawMark__(this.__LineOffset__,this.__MaxNumber__.crossx,this.__MaxNumber__.crossy,params.MarkRange.ColorX,
						params.MarkRange.ColorY,params.MarkRange.MiddleColor,params.MarkRange.precision)
						//绘制函数图像
						params.Methods.forEach((item,index)=>this.DrawFunction(item,index))
						prevOffsetX = this.__DeciveType__ ? e.touches[0].clientX : e.offsetX
						prevOffsetY = this.__DeciveType__ ? e.touches[0].clientY : e.offsetY
			}
		},false)
		this.__canvas__.addEventListener(this.__DeciveType__ ? 'touchstart' : 'mousemove',(e)=>{
			clearTimeout(t)
			var offsetX = this.__DeciveType__ ? e.touches[0].clientX : e.offsetX,offsetY = this.__DeciveType__ ? e.touches[0].clientY : e.offsetY
			if(this.__CheckPoinList__[parseInt(offsetX / 100)]){
				for(var item in this.__CheckPoinList__[parseInt(offsetX / 100)]){
					if(offsetX < parseInt(item.split(',')[0]) + 10 && offsetX > parseInt(item.split(',')[0]) - 10 && offsetY < parseInt(item.split(',')[1]) + 10 && offsetY > parseInt(item.split(',')[1]) - 10){
						clearTimeout(t)
						this.__canvas__.style.cursor = 'pointer'
						var result = this.__CheckPoinList__[parseInt(offsetX / 100)][item]
						this.__TipElement__.innerHTML = (result.title ? `<span>${result.title}</span><br/>` : '') + `<span>x : ${result.x}</span><br/><span>y : ${result.y}</span>`
						this.__TipElement__.style.display = ''
						this.__TipElement__.style.left = `${offsetX + 10}px`
						this.__TipElement__.style.top = `${offsetY + 10}px`
						return
					}
				}
			}
			t = setTimeout(()=>{this.__TipElement__.style.display = 'none'},500)
			this.__canvas__.style.cursor = 'default'
		},false)
		this.__canvas__.addEventListener(this.__DeciveType__ ? 'touchend' : 'mouseup',()=>{
			DownFlag = false
			prevOffsetX = 0
			prevOffsetY = 0
			prevScaleX = 0
			this.DrawTips()
			prevScaleY = 0
		},false)
		this.__canvas__.addEventListener('mouseleave',()=>{
			DownFlag = false
			prevOffsetX = 0
			prevOffsetY = 0
			this.DrawTips()
		},false)
		this.__canvas__.addEventListener('mousewheel',(e)=>{
			if(e.wheelDelta > 0){
				if(this.__MaxNumber__.persinhgt === 100){return}
				this.__MaxNumber__.persinhgt += 10
				this.__MaxNumber__.persinwdt += 10
			}else{
				if(this.__MaxNumber__.persinhgt === 10){return}
				this.__MaxNumber__.persinhgt -= 10
				this.__MaxNumber__.persinwdt -= 10
			}
			this.ClearTips()
			this.ResetCanvas()
			this.DrawTips()
		})
	}
	
	//初始化方法
	FunctionDraw.prototype.__init__ = function(app,cvs,params){
		this.__canvas__ = cvs
		this.__app__ = app
		this.__context__ = cvs.getContext('2d')
		this.__OffsetSize__ = {width:cvs.offsetWidth,height:cvs.offsetHeight}
		this.__ElementList__ = []
		this.__TipElement__ = CreateEleemnt('div',{
			    'position': 'absolute',
			    'border-style': 'solid',
			    'white-space': 'nowrap',
			    'z-index': '9999999',
			    'transition': 'left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s',
			    'background-color': 'rgba(50, 50, 50, 0.7)',
			    'border-width': '0px',
			    'border-color': 'rgb(51, 51, 51)',
			    'border-radius': '4px',
			    'color': 'rgb(255, 255, 255)',
			    'font': '14px / 21px "Microsoft YaHei"',
			    'padding': '5px',
			    'pointer-events': 'none',
				'display':'none'
		})
		!params.ShowTips || this.__app__.appendChild(this.__TipElement__)
		//设置用户参数
		this.__params__ = params
		//设置交叉坐标
		this.__MaxNumber__ = {maxx:params.MarkRange.StartX,minx:params.MarkRange.EndX,precision:params.MarkRange.precision,crossx:0,crossy:0,persinwdt:50,persinhgt:50,accuracy:params.accuracy}
		//赋值轴位置
		this.__LineOffset__ = {xLine:{x:0,y:this.__OffsetSize__.height / 2},yLine:{x:this.__OffsetSize__.width / 2,y:0}}
		//绘制X轴
		this.__DrawLine__(0,this.__OffsetSize__.height / 2,this.__OffsetSize__.width,this.__OffsetSize__.height / 2,params.MarkRange.ColorX)
		//绘制Y轴
		this.__DrawLine__(this.__OffsetSize__.width / 2,0,this.__OffsetSize__.width / 2,this.__OffsetSize__.height,params.MarkRange.ColorY)
		//绘制刻度
		this.__DrawMark__(this.__LineOffset__,0,0,params.MarkRange.ColorX,params.MarkRange.ColorY,params.MarkRange.MiddleColor,params.MarkRange.precision)
		//绘制函数图像
		this.__AnimationQueue__ = new Array(params.Methods.length)
		//初始化点位列表
		this.__PointQueue__ = new Array(params.Methods.length)
		for(var index in Array.from(this.__AnimationQueue__)){
			this.__AnimationQueue__[index] = new Array()
			this.__PointQueue__[index] = new Array()
		}
		this.ClearTips()
		params.Methods.forEach((item,index)=>{this.DrawFunction(item,index)})
		params.Methods.map((item)=>{typeof item === 'object' && item ? item.animation = false : null})
		//执行动画
		this.DoAnimate()
	};
	
	FunctionDraw.prototype.SetAccuracy = function(num){
		this.__params__.accuracy = this.__MaxNumber__.accuracy = num
		this.ClearTips()
		this.ResetCanvas()
		this.DrawTips()
	}
	
	FunctionDraw.prototype.SetAxisColor = function(ColorX,ColoyY){
		this.__params__.MarkRange.ColorX = ColorX || this.__params__.MarkRange.ColorX
		this.__params__.MarkRange.ColorY = ColoyY || this.__params__.MarkRange.ColorY
		this.ClearTips()
		this.ResetCanvas()
		this.DrawTips()
	}
	
	FunctionDraw.prototype.addFunction = function(params){
		this.__params__.Methods.push(params)
		//重置点位列表
		this.__AnimationQueue__ = this.__PointQueue__ = new Array(this.__params__.Methods.length)
		for(var index in Array.from(this.__AnimationQueue__)){
			this.__AnimationQueue__[index] = new Array()
			this.__PointQueue__[index] = new Array()
		}
		this.ClearTips()
		this.ResetCanvas()
		this.DoAnimate()
		this.__params__.Methods.map((item)=>{typeof item === 'object' && item ? item.animation = false : null})
	}
	
	FunctionDraw.prototype.AnimationCallBack = function(callback){
		this.__Callback__ = callback
	}
	
	FunctionDraw.prototype.removeFunction = function(id){
		var index = this.__params__.Methods.findIndex((item)=>{return item.id === id})
		if(index > -1){
			this.__params__.Methods.splice(index,1)
			this.ClearTips()
			this.ResetCanvas()
			this.DoAnimate()
			return true
		}
		return false
	}
	
	function FunctionDraw(app,params){
		app.style.display = 'block'
		app.style.position = 'relative'
		var canvas = CreateEleemnt('canvas',{'width':'100%','height':'100%'})
		canvas.width = app.offsetWidth
		canvas.height = app.offsetHeight
		app.appendChild(canvas)
		this.__init__(app,canvas,params)
	}
	
	return FunctionDraw
})