define(['talent','templates/home','$','views/common/modal/phoeon-modal-view'],function(Talent,jst,$,PhoeonModal){
	return PhoeonModal.extend({
		template : jst['home/modal-test'],
		// initialize : function(){
		// 	debugger 
		// 	var self = this ;
		// }
	});
})
