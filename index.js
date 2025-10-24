document.addEventListener("DOMContentLoaded", ()=>{
    const gameArena = document.getElementById("game-arena");
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0;
    let gameStarted = false;
    let food = {x:300, y:200};
    let snake = [{x:160, y:200}, {x:140, y:200}, {x:120, y:200}];
    let dx = cellSize;
    let dy = 0;

    function drawScoreBoard(){
        const scoreBoard = document.getElementById("Score-board");
        scoreBoard.textContent = `Score: ${score}`
    }

    function drawDiv(x, y, className){
        const div = document.createElement("div");
        div.classList.add(className);
        div.style.top = `${y}px`;
        div.style.left = `${x}px`;
        return div;
    }
    function drawfoodAndSnake(){
        gameArena.innerHTML = ''; // if previously something is drawn remove it 
        // wipe out everything and redraw when snake is move

        snake.forEach((snakeCell) => {
            const element = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(element);
        });
        const foodElement = drawDiv(food.x, food.y, "food");
        gameArena.appendChild(foodElement);
    }

    function moveFood(){
        let newX, newY;
        do{
            newX = Math.floor(Math.random() * ((arenaSize - cellSize)/cellSize) * cellSize);
            newY = Math.floor(Math.random() * ((arenaSize - cellSize)/cellSize) * cellSize);
        }while(snake.some(snakeCell => (snakeCell.x == newX && snakeCell.y == newY)));

        food = {x: newX, y:newY};
    }
    function updateSnake(){
        // calculate new coordinate the snake head will go
        const newHead = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(newHead); // add new head
        if(newHead.x == food.x && newHead.y == food.y){
            // collission 
            score+=5;
            // don't pop the tail
            moveFood();
            // move the head
        }
        else{
            snake.pop(); // remove the cell
        }
    }
    function gameLoop(){
        setInterval(() => {
            updateSnake();
            drawScoreBoard();
            drawfoodAndSnake();
        }, 1000);
    }
    function runGame(){
        gameStarted = true;
        gameLoop();
    }
    function initiateGame(){
        const scoreBoard = document.createElement("div");
        scoreBoard.id = "Score-board";
        // scoreBoard.textContent = "10";
        document.body.insertBefore(scoreBoard, gameArena);

        const startButton = document.createElement("button");
        startButton.textContent = "Start Game";
        startButton.classList.add("Start-button");
        document.body.appendChild(startButton);

        startButton.addEventListener('click', ()=>{
            startButton.style.display = "none";
            runGame();
        })
    }
    initiateGame();
});