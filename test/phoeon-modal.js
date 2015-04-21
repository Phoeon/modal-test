/** 
  * author : fuyue
**/
(function(win,$){
var root = win.top;
root.modal_ = {
	//实例存放数组
	modalInstancesCount : 0
};
var Modal = root.Modal = function(conf){
	this.initialize(conf) ;
}

Modal.prototype = {
	initialize:function(conf){
		//合并配置项
		this.extend(this.conf_,conf) ;
	},
	//组件内部试用native参数
	sysConf_ :{
		closeFlag : 1 ,
		//  弹窗类型
		dialogType : {
			"open"		: 0,
			"window" 	: 1,
			"confirm" 	: 2,
			"alert"		: 3,
			"popup"		: 4
		},
		resizeDir : {
			n : "n",
			s : "s",
			w : "w",
			e : "e",
			se : "se"
		},
		template : "<div class=\"phoeon-modal {$ data.showMask?'':'hideMask' $} {$ data.theme $}\"><div class=\"phoeon-dialog\">{$ if(data.showHeader){ $}<div class=\"phoeon-dialog-bar phoeon-dialog-header\"><h3 class=\"phoeon-dialog-header-title\"  title=\"{$ data.textResource.header $}\">{$ data.textResource.header $}</h3><div class=\"phoeon-dialog-movehandler\"></div><div class=\"phoeon-dialog-opers\">{$ if(data.header.showMaxBtn){ $}<label class=\"phoeon-oper phoeon-max-action\" data-text=\"﹣\">□</label>{$ } $}{$ if(data.header.showCloseBtn){ $}<label class=\"phoeon-oper phoeon-close-btn phoeon-close-action\">×</label>{$ } $}</div></div>{$ } $}<div class=\"phoeon-dialog-body\"><div class=\"content\">{$ data.textResource.body $}</div></div>{$ if(data.showFooter){ $}<div class=\"phoeon-dialog-bar phoeon-dialog-footer\"><h3 class=\"phoeon-dialog-footer-title\"  title=\"{$ data.textResource.footer $}\">{$ data.textResource.footer $}</h3><div class=\"phoeon-operation\">{$ if(data.footer.showOkBtn){ $}<label class=\"phoeon-btn phoeon-ok-btn phoeon-ok-action\">{$ data.textResource.done $}</label>{$ } $}{$ if(data.footer.showCancelBtn){ $}<label class=\"phoeon-btn phoeon-cancel-btn phoeon-close-action\">{$ data.textResource.cancel $}</label>{$ } $}</div></div>{$ } $}</div></div>"
	},
	//自定义配置接受参数
	conf_ : {
		//主题样式风格 默认blue，可选grey
		theme : "",
		//content渲染类型远程或得渲染内容
		url : "",
		//模版路径
		templatePath : "./template.html" ,
		// templatePath : "" ,
		//是否可以移动
		moveable : true ,
		//关闭时，是否移除dom
		destroy : false,
		//当最大化的时候，窗口调整时候，是否自适应
		windowResize : true,
		//是否显示背景层
		showMask : true,
		//是否显示header
		showHeader : true,
		//是否显示footer
		showFooter : true,
		//默认dialog宽度
		width : 250 ,
		//默认dialog高度
		height : 90 ,
		//配置resize方向
		resizeDir : {
			n : false ,
			s : true  ,
			w : false ,
			e : true  ,
			se : true
		},
		//文本资源
		textResource : {
			header : '系统提示！' , //title提示文本
			body   : '' ,			//body提示文本  仅用于测试
			footer : '' ,			//footer提示文本
			done   : '确定' , 		//提交按钮提示文本
			cancel : '取消'		//取消按钮提示文本
		},
		//header 区的配置
		header : {
			showCloseBtn : true , //是否显示顶部右上角的关闭按钮
			showMaxBtn	 : true   //是否显示顶部右上角的最大化按钮
		},
		//body 区的样式
		bodyStyle : {
			// "padding" : "15px",
			// "text-align":"center",
			// "text-indent":"25px"
		},
		//内容区 样式
		bodyContentStyle : {
			// "text-indent":"25px"
		},
		//footer 区的配置
		footer : {
			showOkBtn : true , //是否显示确定按钮
			showCancelBtn : true //是否显示取消按钮
		},
		//关闭操作回调
		beforeClose : function(){
			return true;
		},
		//确定操作回调
		beforeSubmit : function(){
			return true;
		},
		//取消操作回调
		beforeCancel : function(){
			return true;
		},
		closeCallback : function(){

		}

	},
	//用来快速定位元素
	uiMap : {
		"moveHandler" 				 : ".phoeon-dialog-movehandler"	,
		"moveObj" 					 : ".phoeon-dialog"			,
		"mask"						 : ".phoeon-modal"			,
		"header" 					 : ".phoeon-dialog-header"	,
		"footer" 					 : ".phoeon-dialog-footer"	,
		"body" 						 : ".phoeon-dialog-body" 	,
		"content"					 : ".content"				,
		"cancelBtn"					 : ".phoeon-cancel-btn" 	,
		"submitBtn"         		 : ".phoeon-ok-action"  	,
		"closeBtn"					 : ".phoeon-close-btn"  	,
		"maxBtn"					 : ".phoeon-max-action"		,
		"resizeBar"					 : ".resize-bar"
	},
	ui : {
		"click .phoeon-close-action" 		: "cancel" 			,	//右上角关闭按钮和footer区取消和关闭按钮事件
		"click .phoeon-ok-action"    		: "submit" 			,	//footer区确定或者提交按钮事件
		"click .phoeon-max-action"	 		: "toggleMaxBtn"	,	//右上角最大化按钮事件
		"dblclick .phoeon-dialog-movehandler"	: "toggleMaxBtn",		//右上角最大化按钮事件
		"dragstart .phoeon-dialog-movehandler"	: "stopDragStart",		//禁用拖动默认行为
		// "selectstart .phoeon-dialog-header" : "stopSelectStart"
	},
	//显示ui基本入口
	open:function(){
		var self = this ;
		//绑定回调
		this.conf_.closeCallback = (arguments[1]&&typeof arguments[1]=="function")?arguments[1]:this.conf_.closeCallback ;
		//防止同一个实例同时调用多个渲染接口
		if(this.isShow){
			var tip = "不可以同时调用该实例的多个渲染接口" ;
			throw new Error(tip) ;
			return ;
		}
		else {
			this.isShow = true ;
		}
		//多个弹窗则后者不显示mask
		if(root.modal_.modalInstancesCount>0){
			this.extend(this.conf_,{
				showMask : false 
			})
		}
		root.modal_.modalInstancesCount++;
		//阻止直接访问该入口
		if(!arguments[0]){
			var tip = "请不要直接访问该入口！！！" ;
			throw new Error(tip) ;
			return false ;
		}
		//如果不是popup弹窗
		//限制弹窗最小高度
		if(arguments[0]!=this.sysConf_.dialogType.popup){
			this.extend(this.conf_,{
				width : Math.max(this.conf_.width,250),
				height: Math.max(this.conf_.height,90)
			})	
		}
		//远程获取渲染内容text/plain||text/html
		if(this.conf_.url!=""){
			try{
				$.ajax({
					url:this.conf_.url
				}).done(function(data){
					self.conf_.textResource.body = data ;
					self.initView(self.conf_);
					self.$el.show();
				})
			}catch(e){
				this.conf_.textResource.body = "<p>数据请求错误！！！:&nbsp;&nbsp;<strong  style='color:red'>"+e.message+"</strong></p>" ;
				this.initView(this.conf_);
				this.$el.show();
			}
		}else{
			this.initView(this.conf_);
			this.$el.show();
		}
	},
	//关闭ui入口
	close:function(closeFlag){
		if(this.conf_["beforeClose"]){
			var flag = this.conf_["beforeClose"].call(this) ;
			if(flag){
				this.conf_.closeCallback.call(this,closeFlag);
				this.isShow = false ;
				if(this.conf_.destroy===true){
					this.$el.remove();
					root.modal_.modalInstancesCount--;
					return ;
				}
				this.$el.hide() ;
			}
		}
	},
	//确定或者提交并且关闭操作入口
	submit : function(){
		if(this.conf_["beforeSubmit"]){
			var flag = this.conf_["beforeSubmit"].call(this) ;
			if(flag){
				this.close(this.sysConf_eFlag) ;
			}
		}
	},
	//footer区 取消并且关闭操作入口
	cancel : function(){
		if(this.conf_["beforeCancel"]){
			var flag = this.conf_["beforeCancel"].call(this) ;
			if(flag){
				this.close() ;
			}
		}
	},
	//绑定dialog窗口拖拽入口
	drag : function() {
		var self = this ;
		this.$el.delegate(this.uiMap.moveHandler,"mousedown", function(e){
			self.enableMove = true ;
			// 	mousedownTimer = self.dialog.data("mousedownTimer");
			// if(mousedownTimer)clearTimeout(mousedownTimer);
			// self.dialog.data("mousedownTimer",setTimeout(function(){
			// },50));
			self.toggleActiveClass(true);
			self.dialog.data("oex",e.clientX - parseFloat(self.dialog.css("left"))) ;
			self.dialog.data("oey",e.clientY - parseFloat(self.dialog.css("top"))) ;
		})
	
		this.$el.mousemove(function(e){
			var t = self.dialog ;
			if(!self.enableMove)return true ;
			var left = (e.clientX-t.data("oex")) ,
				top = (e.clientY-t.data("oey")) ;
				
			self.dialog.css({
				left : left ,
				top  : top 
			});
		})	
		
		this.$el.mouseup(function(e){
			self.toggleActiveClass();
			self.enableMove = false ;
		})
		this.$el.mouseleave(function(e){
			self.toggleActiveClass();
			self.enableMove = false ;
		})
	},
	resize : function(){
		var self = this ;
		this.$el.delegate(this.uiMap.resizeBar,"mousedown", function(e){
			self.enableResize = true ;
			var t = $(e.currentTarget) ,
				w = self.dialog.width(),
				h = self.dialog.height();
			self.resizeDir = t.attr("data-dir");

			self.dialog.data("ex",e.clientX) ;
			self.dialog.data("ey",e.clientY) ;
			self.dialog.data("w",w) ;
			self.dialog.data("h",h) ;
			// self.dialog.data("rightPos",self.$el.width()-w-self.dialog.offset().left) ;
			// self.dialog.data("bottomPos",self.$el.width()-h-self.dialog.offset().top) ;
		})
	
		this.$el.mousemove(function(e){
			var t = self.dialog ;
			if(!self.enableResize)return true ;
			var width = (e.clientX-t.data("ex")+t.data("w")) ,
				height = (e.clientY-t.data("ey")+t.data("h")) ,
				dimen = {};
			switch(self.resizeDir){
				case self.sysConf_.resizeDir.n : {
					// dimen.height  =  height;
					// dimen.top = t.data("topPos")+e.clientY-t.data("eY");
					// dimen.bottom = t.data("bottomPos");
					break;
				};
				case self.sysConf_.resizeDir.s : {
					dimen.height = height;
					break;
				}
				case self.sysConf_.resizeDir.w : {
					// dimen.width  =  width;
					// dimen.left  =  parseFloat(t.data("left"))+width;
					break;
				};
				case self.sysConf_.resizeDir.e : {
					dimen.width = width;
					break;
				};
				case self.sysConf_.resizeDir.se : {
					dimen.width = width;
					dimen.height = height;
					break;
				} 
			}
			self.dialog.css(dimen);
		})	
		
		this.$el.mouseup(function(e){
			self.toggleActiveClass();
			self.enableResize = false ;
		})
		this.$el.mouseleave(function(e){
			self.toggleActiveClass();
			self.enableResize = false ;
		})
	},
	//窗口改变的时候，重新调整dialog最大化尺寸
	windowResize : function(){
		var self = this ;
		window.onresize = function(){
			if(self.resizeTimeOut)clearTimeout(self.resizeTimeOut)
			self.resizeTimeOut = setTimeout(function(){
				var conf = {
					width : self.$el.width(),
					height : self.$el.height()
				}
				//超出部分隐藏
				if(self.maxBtn.data("maxFlag")===true){
					self.position_(conf);
				}
			},100);
		}
	},
	//toggle最大化最小化操作入口
	toggleMaxBtn : function(e){
		if(!this.conf_.header.showMaxBtn){
			return true;
		}
		var t = this.maxBtn ,
			flag = t.data("maxFlag") ,
			conf ,
			text = t.text();
			t.text(t.attr("data-text")) ;
			t.attr("data-text",text);
		if(flag){
			//复原
			t.data("maxFlag",false);
			//溢出滚动
			this.$el.css({overflow: "auto"});
		}else {
			//最大化
			conf = {
				width : this.$el.width(),
				height : this.$el.height()
			}
			t.data("maxFlag",true);
			//超出部分隐藏
			this.$el.css({overflow: "hidden"});
		}
		this.position_(conf);
	},
	//禁用拖动默认行为
	stopDragStart : function(e){
		e.preventDefault();
		return false;
	},
	stopSelectStart : function(e){
		return false ;
	},
	//绑定ui事件入口
	bindEvents:function(){
		for(var key in this.ui){
			var key_ = key.match(/\S+/g) ;
			if(key_&&key_.length==2){
				this.$el.delegate(key_[1],key_[0],$.proxy(this,this.ui[key]));
			}
		}
		if(this.conf_.moveable)
		this.drag();
		if(this.conf_.windowResize)
		this.windowResize();
		this.resize();
		// //禁用拖动默认行为
		// this.$el.bind("dragstart",function(e){
		// 	e.preventDefault();
		// 	return false;
		// })
	},
	//初始化ui渲染入口，
	//决定部分ui现实隐藏，
	//内容区添加自定义样式
	//初始化dialog弹窗定位
	initView : function(){

		var conf = this.conf_ ,
			//编译初始化模版
			baseTpl = this.initBaseTpl();
		//$l == mask遮罩层
		this.$el = $(baseTpl);
		//添加body
		this.$el.appendTo($(root.document.body)) ;
		//初始化 一些常用$dom
		this.dialog 	 = this.$el.find(this.uiMap.moveObj) ;		//可见区dialog
		this.body 		 = this.$el.find(this.uiMap.body);			//body区
		this.moveHandler = this.$el.find(this.uiMap.moveHandler) ;	//header区||可拖动区
		this.maxBtn 	 = this.$el.find(this.uiMap.maxBtn) ;		//最大化按钮区
		//绑定事件
		this.bindEvents();
		this.body.css(conf.bodyStyle);
		this.body.find(this.uiMap.content).css(conf.bodyContentStyle);
		this.position_(conf);
	},
	//confirm弹窗入口
	confirm : function(){
		var self = this;
		this.extend(this.conf_,{
			width : 300,
			height : 150,
			header : {
				showMaxBtn   : false ,
				showCloseBtn : true
			},
			footer : {
				showOkBtn : true ,
				showCancelBtn : true
			},
			bodyContentStyle :{
				"text-indent" : "25px"
			},
			textResource : arguments[0]
		}) ;
		this.open(this.sysConf_.dialogType.confirm,arguments[1]) ;
	},
	//alert弹窗入口
	alert : function(){
		var self = this;
		this.extend(this.conf_,{
			width : 300,
			height : 150,
			header : {
				showMaxBtn   : false ,
				showCloseBtn : true
			},
			footer : {
				showOkBtn : true ,
				showCancelBtn : false
			},
			bodyContentStyle :{
				"text-indent" : "25px"
			},
			textResource : arguments[0]
		}) ;
		this.open(this.sysConf_.dialogType.alert,arguments[1]) ; 
	},
	//popup弹窗入口
	popup : function(){
		var self = this ,
			w,h;

			var duration = parseInt(arguments[1]) ;
			duration = isNaN(duration)?1000:duration ;

		this.extend(this.conf_,{
			showMask : false,
			showHeader : false,
			showFooter : false,
			width : 300,
			height :"auto",
			bodyContentStyle :{
				"text-indent" : "25px"
			},
			textResource : arguments[0]
		}) ;
		this.open(this.sysConf_.dialogType.popup,arguments[1]) ; 

		w = this.getStyle(this.body[0],"width") ;
		h = this.getStyle(this.body.find(this.uiMap.content)[0],"height") ;
		this.position_({width:w,height:h+20});

		root.setTimeout(function(){
			self.close() ;
		},duration) ;
	},
	//window弹窗入口
	window : function(){
		if(arguments[0]&&arguments[0].body){}
		//若为talent结合，template为jst[xxx]
		else if(this.template){
			 arguments[0] = {body : this.template(this.model.toJSON())};
		}
		this.extend(this.conf_,{
			textResource : arguments[0]
		}) ;
		this.open(this.sysConf_.dialogType.window,arguments[1]) ; 
	},
	//添加弹窗拖拽样式
	toggleActiveClass : function(show){
		if(show){
			this.moveHandler.addClass("active") ;
			this.dialog.addClass("active") ;
		}else{
			this.moveHandler.removeClass("active") ;
			this.dialog.removeClass("active") ;
		}
	},
	//定位弹窗位置的入口{width:num,height:num}
	position_ : function(conf){
		this.body.css({
			top    : this.conf_.showHeader?42:0,
			bottom : this.conf_.showFooter?39:0
		})
		var w = this.conf_.width ,
			h = this.conf_.height ;
			if(conf){
				w = conf.width||w;
				h = conf.height||h;
			}
			//防止窗口太小，弹窗过大，隐藏内容问题
		var top = this.$el.height()-h ;
		this.dialog.css({
			width:w,
			height:h,
			left : (this.$el.width()-w)/2+"px",
			top : (top>0?top:0)/2+"px"
		}) ;
	},
	/** 
	  * 初始化模版
	**/
	initBaseTpl : function(fn){
			var self = this,
				conf = this.conf_ ;
			conf.textResource.header = this.isEmpty(conf.textResource.header)?"&nbsp;":conf.textResource.header ;
			conf.textResource.footer = this.isEmpty(conf.textResource.footer)?"&nbsp;":conf.textResource.footer ;
			// $.ajax({
			// 	url : conf.templatePath
			// }).done(function(tpl){
			// 	var tpl = self.compileTemplate.call(self,tpl);
			// 	fn(tpl) ;
			// });
			var res = {responseText : this.sysConf_.template};
			if(conf.templatePath.length){
				res = $.ajax({
					url : conf.templatePath,
					async : false
				});
			}
			return self.compileTemplate.call(self,res.responseText);
	},
	//同步模版和数据入口
	compileTemplate : function(str){
		str = str.replace(/\n/g,"") ;
		str = str.replace(/\s+/g," ") ;
		str = this.originTemplate(str) ;
		var compile = new Function(str) ;
		return compile(this.conf_);
	},
	/**
	编译原始模版入口
	**/
	originTemplate : function(str){
		console.log(str.replace(/\{\$(.+?)\$\}/g,"【$1】"))

		var r = [],
			lp = new RegExp(/{\$/g),
			rp = new RegExp(/\$}/g),
			lm = null,
			rm = null,
			lidx = 0 ;

		r.push("var data = arguments[0] , t__ = ''  ");
		while(true){
			var m ;
			if((lm = lp.exec(str))!==null&&(rm = rp.exec(str))!==null){
				r.push(" ;  t__ += '"+str.slice(lidx,lm.index)+"'");
				m = str.substring(lm.index+2,rm.index);
				r.push((/[{}]/.test(m)?" ; ":" ;  t__+= ")+m) ;
				lidx = rm.index+2 ;
			}else{
				r.push(" ;  t__+= '"+str.slice(lidx)+"'");
				break;
			}
		}
		r.push("; return t__ ;") ;
		return r.join("");
	},
	
	isEmpty : function(v){
		return (!v||v=="") ;
	},
	/**
	  *对象拷贝 深拷贝
	  *param src : 待拷贝容器
	  *      obj : 拷贝项目
	**/
	extend : function(src,obj){
		if(obj)
		for(var x in obj){
			if(obj[x]!=undefined){
				if(typeof obj[x] == "object"){
					arguments.callee(src[x],obj[x]);
				}else{
					src[x] = obj[x] ;
				}
			}
		}
	},
	/**
	  *获取元素属性值 note ： 只是 width height
	  *param ：ele 元素dom
	  *		   style ：可选值  只是 width height
	**/
	getStyle : function(ele,style){
		if(!ele||!style)return 0;
		var v ;
		if(ele.style){
			v = ele.style[style] ; 
			v = parseFloat(v) ;
			if(!isNaN(v)&&v>0)return v ;
		}
		if(ele.currentStyle){
			v = ele.style[style] ; 
			v = parseFloat(v) ;
			if(!isNaN(v)&&v>0)return v ;
		}
		var defaultView = root.document.defaultView ;
		if(defaultView&&defaultView.getComputedStyle){
			v = defaultView.getComputedStyle(ele,"") ;
			v = v?v.getPropertyValue(style):v;
			v = parseFloat(v) ;
			if(!isNaN(v)&&v>0)return v ;
		}
		return 0;
	},
	//现实配置案例 ，仅供测试查看
	showConfInfos : function(){
		if(console){
			console.log("note : \n")
			console.log("   1:initialize 方法不能被重写\n")
			console.log("   2:配置信息如下\n")
			console.log(this.conf_)
		}else{
			alert("请查看源码了解配置参数")
		}
	}
}
//return Modal ;
})(window,$);