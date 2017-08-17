
# 街机游戏
===============================

### 游戏简介
玩家通过键盘上下左右键控制角色，躲过小虫子，最后进入小河。**项目地址**[github](https://github.com/bobojun87/ArcadeGameClone)

### 游戏菜单
* GAME START / CONTINUE
  1. 通过鼠标点击菜单文字开始游戏或继续游戏。
* OPTION 
  1. 未实现功能；
  2. 后期考虑实现游戏难度选择功能；
  3. 角色选择功能；
  4. 关卡选择功能
* EXIT
  1. 未实现功能
  2. 关闭窗口？

### 游戏菜单的实现
菜单通过往画布上添加艺术字的形式实现，通过添加mousemove事件改变菜单字体颜色，通过添加mousedown事件实现菜单点击功能。代码如下：
```javascript
//游戏菜单类
var Menu = function (gameMenu, j) {
    this.name = gameMenu;
    this.x = 253;
    this.y = 200 + 60 * j;
    this.mouseMove = false; //鼠标移动到菜单范围内时的判断true为鼠标滑动到菜单文字上
    this.gamePause = true;  //控制画布刷新的变量，true为画布暂停刷新
    this.gameContinue = false;//监控暂停按钮事件，true为触发暂停按钮事件
}

//显示游戏菜单
Menu.prototype.render = function() {
    
    ctx.fillStyle = "blue";
    ctx.save();

    ctx.font = "36pt Impact";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    if(this.mouseMove == true){
        ctx.restore();
    }
    if (this.gameContinue == true) {
        this.name = "CONTINUE";
    }
    this.width = ctx.measureText(this.name).width;
    ctx.fillText(this.name, this.x, this.y);
    ctx.strokeText(this.name, this.x, this.y);
}
//鼠标移动事件，鼠标移动时游戏菜单文字颜色变化
document.addEventListener("mousemove", function(e){
    //var canvas = document.querySelector("canvas");
    this.x = e.clientX - canvas.offsetLeft;
    this.y = e.clientY;
    checkMenuPos(this.x, this.y);
    menu.render();
});

//鼠标按下事件，鼠标按下相应菜单时触发事件，目前只处理了游戏开始/继续菜单事件
document.addEventListener("mousedown", function(){
    var menuGS = allMenus[0];
    if(menuGS.mouseMove == true){
        menuGS.gamePause = false;
        document.getElementById("message").innerHTML = "游戏开始";
    }
});
```

### 碰撞检测
通过检测每一个Enemy对象与Player对象之间的X轴距离和Y轴距离，判断是否发生了碰撞。代码示例如下：
```javascript
//检测碰撞函数
function checkCollisions(){
	allEnemies.forEach(function(enemy){
		var enX = enemy.x,
	        enY = enemy.y,
	        plX = player.x,
	        plY = player.y;
	    var absX = Math.abs(enX - plX),
	        absY = Math.abs(enY - plY);
	    if (absX <= 70 && absY <= 50) {
          var playerPos = setTimeout(function () {
              //alert("不幸身亡");
              player.x = 200;
              player.y = 405;
          }, 50); 
	    }
	});
}
```

### 游戏结束动画
玩家成功入河后出现动画效果，实现代码如下：
```javascript
/*
*游戏胜利后动画效果
*动画需要的对象类
*/
var Student = function(sprite, k) {

    this.sprite = sprite;

    this.angle = k * 1.2 ; // 旋转的角度
    this.centerX = 200;
    this.centerY = 170;
    this.radius = 150; // 定义半径
    this.speed = 0.02; // 每帧旋转角度的增加值
}
//绕圆运动
Student.prototype.update = function(dt) {
   this.x = this.centerX + Math.sin(this.angle)*this.radius;
   this.y = this.centerY + Math.cos(this.angle)*this.radius;

   //角度增加
   this.angle += this.speed;
}
```
## 写在最后
游戏功能正在完善中，会让游戏的可玩性越来越强。进行中......
