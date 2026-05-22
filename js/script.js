

const canvas = document.getElementById('snake-game');

const ctx = canvas.getContext('2d');

const gridSize = 20;

const tileCount = 20;

const snake = []

const technologies = [
    'C#',
    'JS',
    'C++',
    'CSS',
    'HTML',
    'Py'
];

const points = document.getElementById('points');

const soundButton = document.getElementById('sound-button');

const imagens = document.querySelectorAll(".img-proj");

const modal = document.getElementById("imageModal");

const modalImg = document.getElementById("modalImg");

const fechar = document.querySelector(".close-modal");

const cards = document.querySelectorAll(".info-projeto");



let soundEnabled = false;

let idleTime= 0;

let autoPlay = false;

let canChangeDirection = true;

let currentFood = technologies[0];

let score = 0;

let gameOver = false;

let restarting = false;

let food = { 
    x: 200, 
    y: 200
 };

let foodPulse = 0;

let dx = 0;
let dy = 0;

soundButton.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundButton.textContent = soundEnabled ? "🔊" : "🔇";
})

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {

    idleTime = 0;
    autoPlay = false;

    event.preventDefault();

    const key = event.key;

    if (!canChangeDirection) return;

    if (key === 'ArrowUp' && dy === 0) {

        dx = 0;
        dy = -20;

        canChangeDirection = false;
    }

    if (key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = 20;

        canChangeDirection = false;
    }

    if (key === 'ArrowLeft' && dx === 0) {
        dx = -20;
        dy = 0;

        canChangeDirection = false;
    }

    if (key === 'ArrowRight' && dx === 0) {
        dx = 20;
        dy = 0;

        canChangeDirection = false;
    }

}


canvas.width = 400;
canvas.height = 400;


function drawSnake() {
    
    ctx.fillstyle = 'white';
    snake.forEach((part,index) => {
        ctx.beginPath();

        ctx.roundRect(
         part.x,
         part.y,
         gridSize,
         gridSize,
          5
);

ctx.fill();

    if (index === 0) {
        ctx.fillStyle = 'black';

        ctx.beginPath();
        ctx.arc(part.x + 6, part.y + 7, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(part.x + 14, part.y + 7, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
    }
    });
}

function drawFood() {
    ctx.fillStyle = 'white';
    ctx.font = '17px Arial';

    ctx.shadowColor = "white";
    ctx.shadowBlur = 10 + Math.sin(foodPulse) * 5;

    ctx.fillText(currentFood, food.x, food.y + 15);

    ctx.shadowBlur = 0;
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '17px Arial';
    ctx.fillText("Skills: " + score, 10, 20);
}

function randomFood() {
    food.x = Math.floor(Math.random() * tileCount) * gridSize;
    food.y = (Math.floor(Math.random() * (tileCount-2))+2) * gridSize;
}

function moveSnake() {
    const head = { 
        x: snake[0].x + dx, 
        y: snake[0].y + dy };

    for (let i = 2; i < snake.length; i++) { //if da colisão com corpo
        if (head.x === snake[i].x && 
            head.y === snake[i].y) {    
            gameOver = true;
        }

    if ( //if da colisão com parede
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
    ) {
        gameOver = true;
    }
    }

    snake.unshift(head);

   const textWidth = ctx.measureText(currentFood).width;

if (

    head.x < food.x + textWidth &&
    head.x + gridSize > food.x &&

    head.y < food.y + 20 &&
    head.y + gridSize > food.y


) {  //adcionar um novo segmento à cobra, tocar audio, aumentar a pontuação e gerar uma nova comida
    
    if (soundEnabled) {
        points.currentTime = 0;
        points.play();
    }
    score++;
    currentFood = technologies[Math.floor(Math.random() * technologies.length)];
    randomFood();
    }  else {
    snake.pop();
}
}

function autoMove(){

    const head = snake[0];

    if (!autoPlay) return;

    if (score >= 15) return;

    if ( head.x < food.x && dx === 0) {
        dx = gridSize;
        dy = 0;
    }
    else if ( head.x > food.x && dx===0 ){
        dx = -gridSize;
        dy = 0;
    }
    else if ( head.y < food.y && dy === 0) {
        dx = 0;
        dy = gridSize;
    }
    else if (head.y > food.y && dy ===0) {
        dx = 0;
        dy = -gridSize;
    }
}

function gameLoop() {

    const head = snake[0];

    foodPulse += 0.1;

    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
        
        if (!restarting) {
            restarting = true;
            setTimeout(() => {
                resetGame();
                restarting = false;
            }, 5000);
        }

        return;
    }


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    autoMove();

    moveSnake();

    canChangeDirection = true;

    if (
        snake[0].x < 0 ||
        snake[0].x >= canvas.width ||
        snake[0].y < 0 ||
        snake[0].y >= canvas.height
    ){
        gameOver = true;
    }

    drawSnake();

    drawFood();

    drawScore();

    idleTime++;

    if (idleTime > 30) {
        autoPlay = true;
    }

}


function resetGame() {

    snake.length = 0;
    snake.push({ x: 200, y: 200 });
    dx = 0;
    dy = 0;
    score = 0;
    gameOver = false;
    randomFood();

    idleTime = 0;
    autoPlay = false;
}

resetGame();

    setInterval(gameLoop, 150);



imagens.forEach( img => {

    img.addEventListener( "click", () => {

        modal.style.display = "flex";
        modalImg.src = img.src;
    });

});

fechar.addEventListener( "click", () => {
    modal.style.display = "none";
})

modal.addEventListener ( "click", (e) => {
    if (e.target === modal){
        modal.style.display ="none";
    }

});

cards.forEach(card => {

    card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
    });

});