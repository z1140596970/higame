function snake(){
	this.snakeBody = [188,189,190];	//蛇身编号集合
	this.initSnakeBody = [];		//记录初始蛇身，方便重置
	this.headNum = this.snakeBody[parseInt(this.snakeBody.length-1)];	//蛇头所在单元格编号(默认为最右边一格)
	this.tdArr = null;				//所有单元格的集合
	this.preId = "box";				//单元格id前缀 
	this.hiddenBox = 0;				//每次移动消失单元格
	this.food = 0;					//食物单元格
	this.action = "r";				//l、r、t、b分别代表左右上下,默认向右
	this.speed = 800;				//游戏速度
	this.pause = true;				//暂停开关(true-暂停，false-开始)
	this.over = false;				//游戏是否结束
	
	////初始化
	
	this.init = function(){
		//记录蛇身初始编号
		if(this.initSnakeBody.length == 0){
			for(var i in this.snakeBody){
				this.initSnakeBody.push(this.snakeBody[i]);
			}
		}		
		this.tdArr = $("canvas").getElementsByTagName("td");		//获取单元格的集合
		//为每个单元格附id
		for(var i=0; i< this.tdArr.length; i++){	
			this.tdArr[i].id = this.getId(i);
		}
		//显示蛇身
		for(var j=0; j<this.snakeBody.length-1; j++){
			$(this.getId(this.snakeBody[j])).className = "b";
		}			
		$(this.getId(this.snakeBody[this.snakeBody.length-1])).className = "head";
		$("loadingTip").style.display = "none";		//初始化完成后隐藏加载信息
		this.getFood();		//生成食物
	}	
	
	////生成食物
	
	this.getFood = function(){
		this.food = parseInt(Math.random()*399);		//生成一个0~399之间的随机数
		for(var i in this.snakeBody){					//遍历蛇身数组，如果生成的食物坐标与蛇身重叠就重新生成
			if(this.food == this.snakeBody[i]){
				//this.food = parseInt(Math.random()*399);	
				this.getFood();
				return false;
			}
		}
		$(this.getId(this.food)).className = "food";
	}
	
	////生成单元格id
	
	this.getId = function(num){		//参数：单元格编号
		return this.preId + num;
	}
	
	////获取蛇身长度
	
	this.getBodyLen = function(){
		return this.snakeBody.length;
	}
		
	////吞食食物，增加长度
	
	this.checkBody = function(){
		if(this.headNum == this.food){	//如果蛇头位置与食物重叠
			$(this.getId(this.hiddenBox)).className = "b";		//将刚才隐藏掉的蛇尾重新显示
			this.snakeBody.unshift(this.hiddenBox);				//蛇尾编号插入数组第一位，身长+1
			this.getFood();										//重新生成食物
			if(this.getBodyLen()%10 == 0){						//没增加10个长度加快一次速度
				this.setSpeed();
			}
		}
	}
	
	////根据蛇身长度设置游戏速度
	
	this.setSpeed = function(){
		this.speed = this.speed - parseInt(this.speed/4);		//每次加速1/4
	}
	
	////判断是否撞上自身
	
	this.checkCollided = function(){
		if(this.headNum==this.hiddenBox){	//判断蛇身是否头尾相接
			$(this.getId(this.hiddenBox)).className = "head";
			this.resetBody();	//死前恢复上次蛇身位置
			this.gameOver();
		}else{
			for(var i=0; i<this.snakeBody.length-1; i++){	//循环不包括数组最后一项蛇头
				if(this.headNum == this.snakeBody[i]){
					this.resetBody();	//死前恢复上次蛇身位置
					this.gameOver();
					break;
				}	
			}		
		}
		
	}
	
	////显示蛇身(参数表示上下左右移动的偏移量，初始为0)
	
	this.show = function(num){		
		this.headNum += num;
		this.hiddenBox = this.snakeBody.shift();	//数组去掉第一个值
		this.snakeBody.push(this.headNum);			//数组追加新值
			
		for(var i=0; i<this.snakeBody.length-1; i++){
			$(this.getId(this.snakeBody[i])).className = "b";
		}	
		$(this.getId(this.snakeBody[this.snakeBody.length-1])).className = "head";
		$(this.getId(this.hiddenBox)).className = "";
		this.checkBody();		//检查是否吃到食物
		this.checkCollided();	//检查是否撞到自身
	}
	
	////重置游戏
	
	this.resetGame = function(){		
		this.over = false;	
		this.speed = 800;	//重置速度
		$("over").style.display = "none";
		//清除所有单元格样式
		for(var i=0; i< this.tdArr.length; i++){		
			$(this.getId(i)).className = "";
		}
		this.snakeBody.length = 0;		//清空蛇身数组
		for(var k in this.initSnakeBody){	//将蛇身赋初值
			this.snakeBody.push(this.initSnakeBody[k]);
		}
		this.headNum = this.snakeBody[parseInt(this.snakeBody.length-1)];
		this.action = "r";	//动作默认为向右
		//显示蛇身
		for(var j=0; j<this.snakeBody.length; j++){
			$(this.getId(this.snakeBody[j])).className = "b";
		}	
		$(this.getId(this.snakeBody[this.snakeBody.length-1])).className = "head";
		this.getFood();		//生成食物
	}
	
	////角色死亡后执行方法
	
	this.gameOver = function(){	
		this.over = true;	//游戏结束
		$("over").style.display = "block";
	}
	
	////恢复上一次动作，结束游戏，否则蛇头会移动出表格（上下边界需要判断）
	
	this.resetBody = function(){
		this.snakeBody.unshift(this.hiddenBox);
		this.snakeBody.pop();
		for(var i=0; i<this.snakeBody.length-1; i++){
			$(this.getId(this.snakeBody[i])).className = "b";
		}	
		$(this.getId(this.snakeBody[this.snakeBody.length-1])).className = "head";
	}
	
	////向左
	
	this.left = function(){
		//判断左边越界
		if((this.headNum)%20 == 0){
			this.gameOver();
			return false;
		}		
		this.show(-1);
		
	}	
		
	////向上
	
	this.top = function(){
		try{
			this.show(-20);
		}catch(e){	//上边越界
			this.resetBody();	//死前恢复上次蛇身位置
			this.gameOver();
		}		
	}	
		
	////向右
	
	this.right = function(){
		//判断右边越界
		if((this.headNum+1)%20 == 0){
			this.gameOver();
			return false;
		}
		this.show(1);	
	}	
		
	////向下
	
	this.bottom = function(){
		try{
			this.show(20);
		}catch(e){	//下边越界
			this.resetBody();	//死前恢复上次蛇身位置
			this.gameOver();
		}
	}		
}

//封装get方法
function $(_id){
	return document.getElementById(_id);
}