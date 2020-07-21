##此库是用来生成数学函数图像

###支持移动端的函数生成，拖拽及放大缩小图像，以及悬浮提示（供教学以及演示使用）

###构造函数
	const fd = new FunctionDraw(el:HTMLElement,params:object)
	el:一个节点容器
	params:{//初始化参数
		MarkRange:{
			ColorX: 'black', //X轴颜色：String
			ColorY: 'black'  //Y轴颜色：String
		},
		ShowTips:true,//是否显示标点：Boolean
		Methods:[{//需要绘制的函数列表
			method: function(x) {return 2 / x},//计算函数：Function
			animation: true,//是否开启动画:Boolean
			color: 'red',//函数绘画使用的颜色:String
			tipColor: 'red',//提示标点颜色:Stirng
			title: 'f(x)=2 / x -> 反比例函数',//悬浮显示的标题文字
			id:1//唯一标识，且用于删除：Number
		}],
		accuracy: 1 //精度 1(个位-最佳), 10(十分位-最佳) ,100(百分位) ,1000(千分位) : Number	
	}

###addFunction -> 新增函数(参数同Methods元素对象一致)
	fd.addFunction({
						method: function(x) {return 3 * x},
						animation: true,
						color: 'orange',
						tipColor: 'orange',
						title: 'f(x)=3 * x -> 正比例函数',
						id: 8
					})

###removeFunction -> 删除函数
	//参数id：Number根据ID删除函数，成功返回true，否则为false
	fd.removeFunction(8)

###AnimationCallBack -> 设置动画回调函数
	AnimationCallBack((id) => {//传入是一个回调函数
		//回调函数中的参数是一个id：Number，id是最后一个执行动画的函数的id
	})

###SetAccuracy -> 重新设置精度
	SetAccuracy(num:Number) //num为精度值，设置会发起重绘

###SetAxisColor -> 重新设置x轴或y轴颜色
	SetAxisColor(ColorX:String,ColorY:String) //ColorX:x轴颜色，ColorY:y轴颜色，若设置则覆盖，传null则跳过


范例网站:[](http://129.211.188.25:8080/1.html)

意见邮箱:sdfsdvdac@qq.com