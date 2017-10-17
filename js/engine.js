/* Engine.js
* 这个文件提供了游戏循环玩耍的功能（更新敌人和渲染）
 * 在屏幕上画出初始的游戏面板，然后调用玩家和敌人对象的 update / render 函数（在 app.js 中定义的）
 *
 * 一个游戏引擎的工作过程就是不停的绘制整个游戏屏幕。当
 * 玩家在屏幕上移动的时候，整个屏幕被重绘产生动画效果

 * 这个引擎是可以通过 Engine 变量公开访问的，而且它也让 canvas context (ctx) 对象也可以
 * 公开访问，以此使编写app.js的时候更加容易
 */

var Engine = (function(global) {
    /* 定义会在这个作用域用到的变量
     * 创建 canvas 元素，拿到对应的 2D 上下文
     * 设置 canvas 元素的高/宽 然后添加到dom中
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* 这个函数是整个游戏的主入口，负责适当的调用 update / render 函数 */
    function main() {
        /* 如果想要更平滑的动画过度就需要获取时间间隙。因为每个人的电脑处理指令的
         * 速度是不一样的，我们需要一个对每个人都一样的常数（而不管他们的电脑有多快）
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* 调用 update / render 函数， 传递时间间隙给 update 函数因为这样
         * 可以使动画更加顺畅。
         */
        update(dt);
        render();

        /* 设置 lastTime 变量，它会被用来决定 main 函数下次被调用的时间。 */
        lastTime = now;
        //console.log(gamePause);
        /* 在浏览准备好调用重绘下一个帧的时候，用浏览器的 requestAnimationFrame 函数
         * 来调用这个函数
         */
        win.requestAnimationFrame(main);
    }

    /* 这个函数调用一些初始化工作，特别是设置游戏必须的 lastTime 变量，这些工作只用
     * 做一次就够了
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* 这个函数被 main 函数调用，它本身调用所有的需要更新游戏角色 数据的函数 */
    function update(dt) {
        if (allMenus[0].gamePause == true) {
            return;
        }
        updateEntities(dt);
        checkCollisions();
    }

    /* 这个函数会遍历在 app.js 定义的存放所有敌人实例的数组，并且调用他们的 update()
     * 函数，然后，它会调用玩家对象的 update 方法，最后这个函数被 update 函数调用。
     * 这些更新函数应该只聚焦于更新和对象相关的数据/属性。把重绘的工作交给 render 函数。
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        player.update();

        allStudents.forEach(function(student){
            student.update(dt);
        });
        
    }
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
                    player.x = PLAYER_START_X;
                    player.y = PLAYER_START_Y;
                }, 50); 
		    }
    	});
    }
    /* 这个函数做了一些游戏的初始渲染，然后调用 renderEntities 函数。这个函数
     * 在每个游戏的时间间隙都会被调用一次（或者说游戏引擎的每个循环）。
     */
    function render() {
        /* 这个数组保存着游戏关卡的特有的行对应的图片相对路径。 */
        var rowImages = [
                'images/water-block.png',   // 这一行是河。
                'images/stone-block.png',   // 第一行石头
                'images/stone-block.png',   // 第二行石头
                'images/stone-block.png',   // 第三行石头
                'images/grass-block.png',   // 第一行草地
                'images/grass-block.png'    // 第二行草地
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* 遍历上面定义的行和列，用 rowImages 数组，在各自的各个位置绘制正确的图片 */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* 这个 canvas 上下文的 drawImage 函数需要三个参数，第一个是需要绘制的图片
                 * 第二个和第三个分别是起始点的x和y坐标。用资源管理工具来获取
                 * 需要的图片，这样可以享受缓存图片的好处，因为会反复的用到这些图片
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        if (allMenus[0].gamePause == true) {
            allMenus.forEach(function(menu) {
                menu.render();
            });
        }else{
            renderEntities();
        }

    }

    /* 这个函数会在每个时间间隙被 render 函数调用。他的目的是分别调用你在 enemy 和 player
     * 对象中定义的 render 方法。
     */
    function renderEntities() {
        if (player.y < 10) {
            allStudents.forEach(function(student){
                student.render();
            });
        }else{
            /* 遍历在 allEnemies 数组中存放的作于对象然后调用事先定义的 render 函数 */
            allEnemies.forEach(function(enemy) {
                enemy.render();
            });

            player.render();
        }
    }

    //重置player对象和enemy对象
    function reset() {
        allEnemies.forEach(function(enemy) {
            enemy.x = -100;
            enemy.y = Math.floor(Math.random() * 3) * 85 + 90;
            enemy.speed = 50 + Math.random() * 50;
        });
        
        player.x = PLAYER_START_X;
        player.y = PLAYER_START_Y;
    }

    //重新开始按钮事件，当点击按钮时清空画布并重新开始刷新画布
    document.getElementById("reset").addEventListener("click", function(){
        reset();
        //document.getElementById("message").innerHTML = "游戏准备";
    });

    /* 加载需要来绘制游戏关卡的图片。然后把 init 方法设置为回调函数。
     * 当这些图片都已经加载完毕的时候游戏就会开始。
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',

        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ]);
    Resources.onReady(init);

    /* 把 canvas 上下文对象绑定在 global 全局变量上（在浏览器运行的时候就是 window
     * 对象。从而可以在app.js文件里面更容易的使用它。
     */
    global.ctx = ctx;
    global.canvas = canvas;
})(this);
