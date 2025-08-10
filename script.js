let playerSpeed = 2
let river

function startGame() {
    myGameArea.start();

    duck1 = new component(50, 40, ["/assets/frame1.PNG", "/assets/frame2.PNG"], 50, 60);
    duck1.walk();

    river = new component(1200, 500, ["/assets/river.png", "/assets/river.png"], 0, 500)

}

var myGameArea = {
    canvas : document.getElementById("map"),
    start : function() {
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// function obstacle(width, height, x, y, newSpeed, color) {
//     this.width = width
//     this.height = height
//     this.x = x
//     this.y = y
//     this.color = color

//     ctx = myGameArea.context;
//     ctx.fillStyle = color;
//     ctx.fillRect(this.x, this.y, this.width, this.height);

//     this.update = function() {
//         ctx = myGameArea.context;
//         ctx.fillStyle = this.color;
//         ctx.fillRect(this.x, this.y, this.width, this.height);
//     };
// }

function component(width, height, frames, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.frames = frames

    this.image = new Image();
    this.image.src = this.frames[0];
    this.image.onload = () => { // Ensure image is loaded before drawing
        this.update();
    };
    this.update = function() {
        let ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    this.walk = function() {
        let i = 0;
        setInterval(() => {
            if (i >= this.frames.length) {
                i = 0;
            }
            this.image.src = this.frames[i];
            i++;
        }, 100);
    };
}

// Track pressed keys
let keys = {};

document.addEventListener("keydown", function(e) {
    keys[e.key] = true;
});

document.addEventListener("keyup", function(e) {
    keys[e.key] = false;
});

function updateGameArea() {
    myGameArea.clear();

    river.update()

    // Movement
    if (keys["ArrowUp"]) duck1.y -= playerSpeed;
    if (keys["ArrowDown"]) duck1.y += playerSpeed;
    if (keys["ArrowLeft"]) duck1.x -= playerSpeed;
    if (keys["ArrowRight"]) duck1.x += playerSpeed;

    duck1.update();
}




