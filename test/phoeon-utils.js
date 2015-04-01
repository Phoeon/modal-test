//phoeon-utils.js
/**
工具方法:
日期格式化 Date.toFmtString
**/
Date.prototype.toFmtString = function(){
	var fmt = arguments[0]||"yyyy-MM-dd";

	var map = {
		y : {fn : "getFullYear" ,l  : 4},
		M : {fn : "getMonth"	,l  : 2 , inc : 1},
		d : {fn : "getDate" 	,l  : 2},
		h : {fn : "getHours" 	,l  : 2},
		m : {fn : "getMinutes" 	,l  : 2},
		s : {fn : "getSeconds"	,l  : 2}
	}
	for(var k in map){
		var matches =  fmt.match(k+"+","g") ,v;
		if(matches)
		{
			if(matches[0].length>map[k].l||matches[0].length<map[k].l/2){
				throw new Error("日期格式错误："+matches[0])
				fmt = undefined;
				break;
			}
			v = this[map[k].fn]()+(map[k].inc||0) ;
			v = (v<10?"0"+v:v)+"";
			v = v.slice(map[k].l-matches[0].length);
			fmt = fmt.replace(matches[0],v) ;
		}
	}
	return fmt ;
}