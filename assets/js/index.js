const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = 0.7;

canvas.width = 1024;
canvas.height = 576;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './assets/img/shop.png',
    scale: 2.75,
    framesMax: 6
})

c.fillRect(0, 0, canvas.width, canvas.height);

const player = new Fighter({
    position: {
        x: 256,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset:{
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './assets/img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './assets/img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        attack2: {
            imageSrc: './assets/img/samuraiMack/Attack2.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './assets/img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './assets/img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 150,
            y: 0
        },
        width: 100,
        height: 100
    }
});

const enemy = new Fighter({
    position: {
        x: 768,
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
    imageSrc: './assets/img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset:{
        x: 215,
        y: 169
    },
    sprites: {
        idle: {
            imageSrc: './assets/img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './assets/img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/img/kenji/Attack1.png',
            framesMax: 4
        },
        attack2: {
            imageSrc: './assets/img/kenji/Attack2.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './assets/img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './assets/img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 30
        },
        width: 80,
        height: 80
    }
});

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

decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.15)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5;
        player.switchSprite('run');
    }
    else{
        player.switchSprite('idle');
    }

    // Player jump
    if(player.velocity.y < 0){
        player.switchSprite('jump');
    } else if(player.velocity.y > 0){
        player.switchSprite('fall');
    }
    
    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    }
    else{
        enemy.switchSprite('idle');
    }

    // Enemy jump
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump');
    } else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall');
    }

    // Detect for colision and enemy gets hit
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking && player.frameCurrent === 4){
        enemy.takeHit();
        player.isAttacking = false;
        // document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        gsap.to('#p2', {
            width: enemy.health + '%'
        })
    }

    // if player misses

    if (player.isAttacking && player.frameCurrent === 4){
        player.isAttacking = false
    }

    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking && enemy.frameCurrent === 1){
        player.takeHit();
        enemy.isAttacking = false;
        
        // document.querySelector('#playerHealth').style.width = player.health + '%';
        gsap.to('#p1', {
            width: player.health + '%'
        })
    }

    // if enemy misses

    if (enemy.isAttacking && enemy.frameCurrent === 1){
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0){
        determinedWinner({player, enemy, timerId})
    }
}

animate();

window.addEventListener('keydown', (event) => {

    if(!player.dead){
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
        }
    }

    if(!enemy.dead){
        // Enemy keys
        switch (event.key){
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