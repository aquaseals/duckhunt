let playerSpeed = 2;
let duck1;
let terrainObjects = [];

// Terrain types with speed effects
const TERRAIN_EFFECTS = {
    SPEED_UP: { speedMultiplier: 1.8 },    // Fast areas like water
    SLOW_DOWN: { speedMultiplier: 0.4 },   // Slow areas like mud
    OBSTACLE: { speedMultiplier: 0 }        // Impassable obstacles
};

// Create terrain objects with images
function createTerrainObject(imageSrc, x, y, width, height, effect) {
    return {
        image: new Image(),
        src: imageSrc,
        x: x,
        y: y,
        width: width,
        height: height,
        effect: effect,
        loaded: false
    };
}

// Initialize terrain objects - you can modify these or add more
function initializeTerrain() {
    // Example terrain objects - replace image paths with your own
    terrainObjects = [
        // Water/speed up areas
        //createTerrainObject("/assets/water1.png", 100, 100, 120, 80, TERRAIN_EFFECTS.SPEED_UP),
        //createTerrainObject("/assets/water2.png", 300, 200, 100, 100, TERRAIN_EFFECTS.SPEED_UP),
        createTerrainObject("/assets/river.png", 0, 0, 900, 480, TERRAIN_EFFECTS.SPEED_UP),
        
        // Mud/slow down areas  
        // createTerrainObject("/assets/mud1.png", 50, 250, 80, 60, TERRAIN_EFFECTS.SLOW_DOWN),
        // createTerrainObject("/assets/mud2.png", 400, 150, 70, 70, TERRAIN_EFFECTS.SLOW_DOWN),
        // createTerrainObject("/assets/puddle.png", 600, 400, 90, 50, TERRAIN_EFFECTS.SLOW_DOWN),
        
        // // Obstacles
        // createTerrainObject("/assets/rock1.png", 200, 300, 60, 60, TERRAIN_EFFECTS.OBSTACLE),
        // createTerrainObject("/assets/tree.png", 450, 50, 80, 120, TERRAIN_EFFECTS.OBSTACLE),
        // createTerrainObject("/assets/bush.png", 350, 450, 70, 50, TERRAIN_EFFECTS.OBSTACLE)
    ];
    
    // Load all images
    terrainObjects.forEach(obj => {
        obj.image.onload = function() {
            obj.loaded = true;
        };
        obj.image.src = obj.src;
    });
}

function startGame() {
    initializeTerrain();
    myGameArea.start();
    duck1 = new component(50, 40, ["/assets/duck_frame1.PNG", "/assets/duck_frame2.PNG"], 50, 60);
    duck1.walk();
}

var myGameArea = {
    canvas : document.getElementById("map"),
    start : function() {
        this.context = this.canvas.getContext("2d");
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    drawBackground: function() {
        // Draw grass background
        const ctx = this.context;
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    drawTerrain: function() {
        const ctx = this.context;
        
        // Draw all terrain objects
        terrainObjects.forEach(obj => {
            if (obj.loaded) {
                ctx.drawImage(obj.image, obj.x, obj.y, obj.width, obj.height);
            } else {
                // Fallback colored rectangles while images load
                if (obj.effect === TERRAIN_EFFECTS.SPEED_UP) {
                    ctx.fillStyle = '#4682B4'; // Blue for water
                } else if (obj.effect === TERRAIN_EFFECTS.SLOW_DOWN) {
                    ctx.fillStyle = '#8B4513'; // Brown for mud
                } else if (obj.effect === TERRAIN_EFFECTS.OBSTACLE) {
                    ctx.fillStyle = '#654321'; // Dark brown for obstacles
                }
                ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            }
        });
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

function getCurrentTerrain(x, y) {
    // Check which terrain object the duck is currently on
    for (let obj of terrainObjects) {
        if (x >= obj.x && x <= obj.x + obj.width &&
            y >= obj.y && y <= obj.y + obj.height) {
            return obj.effect;
        }
    }
    return { speedMultiplier: 1.0 }; // Default grass speed
}

function checkCollision(newX, newY) {
    // Check if the new position would collide with any obstacles
    const duckCenterX = newX + duck1.width/2;
    const duckCenterY = newY + duck1.height/2;
    
    for (let obj of terrainObjects) {
        if (obj.effect === TERRAIN_EFFECTS.OBSTACLE) {
            if (duckCenterX >= obj.x && duckCenterX <= obj.x + obj.width &&
                duckCenterY >= obj.y && duckCenterY <= obj.y + obj.height) {
                return true; // Collision detected
            }
        }
    }
    return false; // No collision
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
    myGameArea.drawBackground();
    myGameArea.drawTerrain();

    // Check current terrain and adjust speed
    const currentTerrain = getCurrentTerrain(duck1.x + duck1.width/2, duck1.y + duck1.height/2);
    const currentSpeed = playerSpeed * currentTerrain.speedMultiplier;

    // Calculate potential new positions
    let newX = duck1.x;
    let newY = duck1.y;
    
    if (keys["ArrowUp"]) newY -= currentSpeed;
    if (keys["ArrowDown"]) newY += currentSpeed;
    if (keys["ArrowLeft"]) newX -= currentSpeed;
    if (keys["ArrowRight"]) newX += currentSpeed;

    // Keep duck within canvas bounds
    newX = Math.max(0, Math.min(newX, myGameArea.canvas.width - duck1.width));
    newY = Math.max(0, Math.min(newY, myGameArea.canvas.height - duck1.height));

    // Only move if no collision with obstacles
    if (!checkCollision(newX, newY)) {
        duck1.x = newX;
        duck1.y = newY;
    }

    duck1.update();
}