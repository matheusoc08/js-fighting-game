function rectangularCollision({ rectahgle1, rectahgle2}){
    return (    
        rectahgle1.attackBox.position.x + rectahgle1.attackBox.width >= 
        rectahgle2.position.x && rectahgle1.attackBox.position.x < rectahgle2.position.x + rectahgle2.width &&
        rectahgle1.attackBox.position.y + rectahgle1.attackBox.height >= rectahgle2.position.y &&
        rectahgle1.attackBox.position.y <= rectahgle2.position.y + rectahgle2.height
    )
}

function determinedWinner({player, enemy, timerId}){
    clearTimeout(timerId);

    document.querySelector('#displayText').style.display = 'flex';

    if(player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = 'Tie';
    }
    else if(player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
    }
    else{
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
    }
}

let timer = 10;
let timerId;
function decreaseTimer(){
    if(timer > 0){
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer;
    }

    if(timer === 0){
        determinedWinner({player, enemy, timerId});
    }
}