var ENEMY_START_X = -100,   //敌人起始位置x坐标
    PLAYER_START_X = 200,   //玩家起始位置x坐标
    PLAYER_START_Y = 405,   //玩家起始位置y坐标
    PLAYER_MOVE_X = 100,    //玩家x坐标一次移动距离
    PLAYER_MOVE_Y = 83;     //玩家y坐标一次移动距离

// 这是我们的玩家要躲避的敌人 
var Enemy = function() {
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
    this.x = ENEMY_START_X;
    this.y = Math.floor(Math.random() * 3) * 85 + 90;
    this.speed = 50 + Math.random() * 50;
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 判定Enemy对象位置，使其无限循环在屏幕内移动
    if (this.x > ctx.canvas.width) {
        this.x = ENEMY_START_X;
        this.y = Math.floor(Math.random() * 3) * 85 + 90;
        this.speed = 50 + Math.random() * 50;
    }
    // 给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x += this.speed * dt;
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 80, 130);
};

// 玩家类
var Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
};

//限定玩家的移动范围
Player.prototype.update = function(){
    if (this.x < 0) {
        this.x = 0;
    }else if(this.x > ctx.canvas.width - 105){
        this.x = ctx.canvas.width - 105;
    }else if(this.y < -10){
        this.y = -10;
    }else if (this.y > PLAYER_START_Y) {
        this.y = PLAYER_START_Y;
    }
};

//负责在屏幕上画出玩家
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//玩家的动作,定义每次触发键盘事件上下左右移动的距离
Player.prototype.handleInput = function(allowedKey){
    if (this.y < 10) {
        return;
    }
    switch (allowedKey)
    {
        case 'left':
            this.x -= PLAYER_MOVE_X;
            break;
        case 'right':
            this.x += PLAYER_MOVE_X;
            break;
        case 'up':
            this.y -= PLAYER_MOVE_Y;
            break;
        case 'down':
            this.y += PLAYER_MOVE_Y;
            break;
    }


};

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

// 定义数组，实例化敌人的对象放进数组
var allEnemies = [];
for (var i = 0; i < 5; i++) {
    var enemy = new Enemy();
    allEnemies.push(enemy);
}

//实例化玩家对象
var player = new Player();

//定义菜单对象数组
var allMenus = [];

//定义菜单字典数组
var gameMenu = [
    "GAME START",
    "OPTION",
    "EXIT"
];

//实例化菜单对象
for (var j = 0; j < gameMenu.length; j++) {
    var menu = new Menu(gameMenu[j], j);
    allMenus.push(menu);
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

//暂停按钮事件，当点击暂停按钮时画布停止刷新，游戏菜单文字变化
document.getElementById("pause").addEventListener("click", function(){
    if(allMenus[0].gamePause != true){
        allMenus[0].gamePause = true;
        allMenus[0].gameContinue = true;
        document.getElementById("message").innerHTML = "游戏暂停";
    }
});

//检测鼠标位置在哪个菜单上
function checkMenuPos(x, y) {
    allMenus.forEach(function(menu){
        var menuWidth = menu.width;
        var menuX = menu.x - menuWidth / 2,
            menuY = menu.y - 60;
        var posX = x - menuX,
            posY = y - menuY;
        if(posX > 0 && posX < menuWidth && posY > 20 && posY < 60){
            menu.mouseMove = true;
        }else{
            menu.mouseMove = false;
        }
        
    });
}

// 监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到
// Play.handleInput()方法里面。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

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
//在画布上显示
Student.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    document.getElementById("message").innerHTML = "成功入河！";
};
//人物图片数组
var studentArr = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];
//人物对象数组
var allStudents = [];
//实例化人物对象
for (var k = 0; k < studentArr.length; k++) {
    var student = new Student(studentArr[k], k);
    allStudents.push(student);
}
