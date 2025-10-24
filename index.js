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
    let gameSpeed = 200;
    let IntervalId;

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
            newX = Math.floor(Math.random() * ((arenaSize - cellSize)/cellSize)) * cellSize;
            newY = Math.floor(Math.random() * ((arenaSize - cellSize)/cellSize)) * cellSize;
        }while(snake.some(snakeCell => (snakeCell.x == newX && snakeCell.y == newY)));

        food = {x: newX, y: newY};
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
            if(gameSpeed > 30){
                clearInterval(IntervalId);
                gameSpeed-=10;

                gameLoop();
            }
        }
        else{
            snake.pop(); // remove the cell
        }
    }

    function isGameOver(){
        // check snake body hit
        for(let i=1; i<snake.length;i++){
            if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
                return true;
            }
        }

        let isHittingleftwall = snake[0].x < 0;
        let isHittingTopwall = snake[0].y < 0;
        let isHittingRightwall = snake[0].x >= arenaSize;
        let isHittingBottomwall = snake[0].y >= arenaSize;

        return isHittingRightwall || isHittingleftwall || isHittingBottomwall || isHittingTopwall;

    }
    function gameLoop(){
        IntervalId = setInterval(() => {
            if(!gameStarted) return;
            if(isGameOver()){
                gameStarted = false;
                alert(`Game Over! Score: ${score}`);
                window.location.reload();
                return;
            }
            updateSnake();
            drawScoreBoard();
            drawfoodAndSnake();
        }, gameSpeed);
    }
    
    function changeDirection(e){
        let LEFT_KEY = 37;
        let UP_KEY = 38;
        let RIGHT_KEY = 39;
        let DOWN_KEY = 40;

        const keypress = e.keyCode;

        const isGoingUp = dy == -cellSize;
        const isGoingDown = dy == cellSize;
        const isGoingLeft = dx == -cellSize;
        const isGoingRight = dx == cellSize;

        if(keypress == LEFT_KEY && !isGoingRight) {dy = 0, dx = -cellSize};

        if(keypress == RIGHT_KEY && !isGoingLeft) {dy = 0, dx = cellSize};

        if(keypress == UP_KEY && !isGoingDown) {dy = -cellSize, dx = 0};

        if(keypress == DOWN_KEY && !isGoingUp) {dy = cellSize, dx = 0};
    }
    function runGame(){
        if(!gameStarted){
            gameStarted = true;
            gameLoop();
            document.addEventListener("keydown", changeDirection);
        }
       
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