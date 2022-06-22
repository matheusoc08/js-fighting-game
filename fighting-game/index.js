const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = 0.7;

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite{

    constructor({position, velocity, color = 'red', offset }){
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color;
        this.isAttacking;
    }

    draw(){
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Attack box
        if (this.isAttacking){
            c.fillStyle = 'green';
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update(){
        this.draw('red');
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
        } else{
            this.velocity.y += gravity;
        }
    }

    attack(){
        this.isAttacking = true;
        setTimeout(() =>{
            this.isAttacking = false
        }, 100)
    }

}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
});

const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    color: 'blue'
});

console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}
let lastKey;

function rectangularCollision({ rectahgle1, rectahgle2}){
    return (    
        rectahgle1.attackBox.position.x + rectahgle1.attackBox.width >= 
        rectahgle2.position.x && rectahgle1.attackBox.position.x < rectahgle2.position.x + rectahgle2.width &&
        rectahgle1.attackBox.position.y + rectahgle1.attackBox.height >= rectahgle2.position.y &&
        rectahgle1.attackBox.position.y <= rectahgle2.position.y + rectahgle2.height
    )
}

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5;
    }
    
    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5;
    }

    // Detect colision
    if (rectangularCollision({
        rectahgle1: player,
        rectahgle2: enemy
    }) && player.isAttacking){
        player.isAttacking = false;

        console.log('Player attack successuful');
    }

    if (rectangularCollision({
        rectahgle1: enemy,
        rectahgle2: player
    }) && enemy.isAttacking){
        enemy.isAttacking = false;

        console.log('Enemy attack successuful');
    }
}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.key){
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;

        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;

        case 'w':
            keys.w.pressed = true;
            player.velocity.y = -15;
            break;
        
        case ' ':
            player.attack();
            break;
     
        // Enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;

        case 'ArrowUp':
            keys.ArrowUp.pressed = true;
            enemy.velocity.y = -15;
            break;

        case 'ArrowDown':
            enemy.attack();
            break;
    }
    
})

window.addEventListener('keyup', (event) => {
    switch (event.key){
        case 'd':
            keys.d.pressed = false;
            break;

        case 'a':
            keys.a.pressed = false;
            break;

        case 'w':
            keys.w.pressed = false;
            break;
    }

    // Enemy keys
    switch (event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;

        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
    }
    
})
