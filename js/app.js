// 这是我们的玩家要躲避的敌人 
var Enemy = function() {
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = Math.floor(Math.random() * 3) * 85 + 90;
    this.speed = 50 + Math.random() * 50;
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 判定Enemy对象位置，使其无限循环在屏幕内移动
    if (this.x > 505) {
        this.x = -100;
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
    this.x = 200;
    this.y = 405;
};
//限定玩家的移动范围
Player.prototype.update = function(){
    if (this.x < 0) {
        this.x = 0;
    }else if(this.x > 400){
        this.x = 400;
    }else if(this.y < -10){
        this.y = -10;
    }else if (this.y > 405) {
        this.y = 405;
    }
};
//负责在屏幕上画出玩家
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//玩家的动作,定义每次触发键盘事件上下左右移动的距离
Player.prototype.handleInput = function(allowedKey){
    switch (allowedKey)
    {
        case 'left':
            this.x -= 100;
            break;
        case 'right':
            this.x += 100;
            break;
        case 'up':
            this.y -= 83;
            break;
        case 'down':
            this.y += 83;
            break;
    }


};

// 定义数组，实例化敌人的对象放进数组
var allEnemies = [];
for (var i = 0; i < 5; i++) {
    var enemy = new Enemy();
    allEnemies.push(enemy);
}
//实例化玩家对象
var player = new Player();


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
