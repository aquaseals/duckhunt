function startGame() {
    myGameArea.start();

    duck1 = new duck(10, 7, ["/assets/frame1.png", "/assets/frame2.png", "/assets/frame3.png"], 50, 60)
    duck1.walk()
}

var myGameArea = {
    canvas : document.getElementById("map"),
    start : function() {
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20)
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}

function duck(width, height, frames, x, y) {
    this.width = width
    this.height = height
    this.x = x
    this.y = y

    this.image = new Image()
    this.image.src = frames[0]
    this.update = function() {
        ctx = myGameArea.context
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    this.walk = function() {
        let i = 0
        let animate = setInterval(() => {
            if (i >= frames.length) {
                i = 0
            }
            this.image.src = frames[i]
            i++
        }, 100)
    }
}

function updateGameArea()  {
    myGameArea.clear()
    duck1.x += 1
    duck1.update()
}