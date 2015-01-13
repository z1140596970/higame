var timer;		//定时器
var s = new snake();	//实例化函数
window.onload = function(){		
	s.init();	//页面加载时进行初始化	
}

//键盘事件
document.onkeydown = function(__event) {
	__event=__event||window.event;
	keycode =  __event.which||__event.keyCode;
	switch(keycode){
		case 13://Enter回车（ie6无法输出回车键的keycode）
		case 82://R重置
		case 229://R重置(safari键值)
			clearInterval(timer);
			hiddenStartPage();
			$("pause").style.display = "none";
			s.resetGame();
			break;
		case 32://Space暂停
			if(s.over == false){
				checkPause();	//点击一次暂停，再点击开始
			}			
			break;
		case 37://left
			hiddenStartPage();
			if(s.over == false){
				//当前执行向左动作，禁止向右
				if(s.action != "r"){
					s.action = "l";
					s.pause = false;
					checkPause();	
				}else{
					return false;
				}
			}
			break;
		case 38://top
			hiddenStartPage();
			if(s.over == false){
				//当前执行向上动作，禁止向下
				if(s.action != "b"){
					s.action = "t";
					s.pause = false;
					checkPause();
				}else{
					return false;
				}	
			}
			break;
		case 39://right	
			hiddenStartPage();
			if(s.over == false){
				//当前执行向右动作，禁止向左
				if(s.action != "l"){
					s.action = "r";	
					s.pause = false;
					checkPause();
				}else{
					return false;
				}
			}
			break;
		case 40://bottom
			hiddenStartPage();
			if(s.over == false){
				//当前执行向下动作，禁止向上
				if(s.action != "t"){
					s.action = "b";	
					s.pause = false;
					checkPause();
				}else{
					return false;
				}
			}
			break;
	}
}

function moveDir(dir){
	clearInterval(timer);	//每次按键先清除之前的定时器
	s.pause = false;			//暂停状态变为否
	s.checkBody();			//判断是否吃到食物增加长度
	
	//按照传入的方向参数判断执行哪个动作，长按方向键加速(Opera无效)
	if(dir == "l"){		
		s.left();
		timer = setInterval(function(){if(s.over == true){clearInterval(timer); return;};s.left()},s.speed);	
	}
	if(dir == "t"){		
		s.top();
		timer = setInterval(function(){if(s.over == true){clearInterval(timer); return;}s.top()},s.speed);	
	}
	if(dir == "r"){
		s.right();
		timer = setInterval(function(){if(s.over == true){clearInterval(timer); return;}s.right()},s.speed);
	}
	if(dir == "b"){		
		s.bottom();
		timer = setInterval(function(){if(s.over == true){clearInterval(timer); return;}s.bottom()},s.speed);	
	}
}

function checkPause(){
	if(s.pause == false){
		moveDir(s.action);	//传入暂停前方向参数，开始
		s.pause = true;	//状态变为未暂停
		$("pause").style.display = "none";
		
	}else{			
		clearInterval(timer);	//清除定时器，暂停
		s.pause = false;			//状态变为暂停
		$("pause").style.display = "block";
		hiddenStartPage();
	}	
}

function hiddenStartPage(){
	if($("start").style.display != "none"){
		$("start").style.display = "none";
	}	
}