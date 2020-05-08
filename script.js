const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
console.log(canvas.width / 2)
console.log(canvas.height / 2)
const ctx = canvas.getContext('2d');
var img = document.getElementById("scream");
const buttonleft = document.getElementById('leftClick');
const buttonright = document.getElementById('rightClick');


let score = 8;

const brickRowCount = 4;
const brickColumnCount = 2;

// Create ball props
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 3,
    dx: 4,
    dy: -4
}

// Create paddle props
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 7,
    dx: 0
};

// Create brick props
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
}

// Create bricks
const bricks = []
for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo }
    }

}

// Draw ball on canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#02b3e4';
    ctx.fill();
    ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#02b3e4';
    ctx.fill();
    ctx.closePath();
}

// Draw score on canvas
function drawScore() {

    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30)
}

// Draw bricks on canvas
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            // ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#02b3e4' : 'transparent';
            ctx.font = '20px Arial';
            ctx.fillText("COVID-19", brick.x, brick.y, brick.w, brick.h);
            // ctx.drawImage(img, brick.x, brick.y, brick.w, brick.h);
            ctx.fill()
            ctx.closePath()
        })
    })
}

// Move paddle on canvas
function movePaddle() {
    paddle.x += paddle.dx;

    // Wall detection
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }

    if (paddle.x < 0) {
        paddle.x = 0
    }
}

buttonleft.addEventListener('click', function () {
    paddle.x += paddle.dx;

    // Wall detection
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }
})

buttonright.addEventListener('click', function () {
    if (paddle.x < 0) {
        paddle.x = 0
    }

    // Wall detection
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }
})

// Move ball on canvas
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (x)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    // // Wall collision (y)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    // // Paddle collision
    // // 390 > 360 && 410 < 440 && 310 > 280
    if (ball.x - ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w
        && ball.y + ball.size > paddle.y) {
        ball.dy = -ball.speed
    }

    // Brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (ball.x - ball.size > brick.x //left brick side check
                    && ball.x + ball.size < brick.x + brick.w // right brick side check
                    && ball.y + ball.size > brick.y // top brick side check
                    && ball.y - ball.size < brick.y + brick.h // bottom brick side check
                ) {
                    ball.dy *= -1
                    brick.visible = false
                    // brick.style.display = 'none'

                    increaseScore();
                }
            }
        })
    })
    // hit bottom wall -lose
    if (ball.y + ball.size > canvas.height) {
        showAllBricks();
        score = 8;
    }
}


// COVID-19 destroyed 100%
const popup = document.querySelector('.popup');
const buttonpopup = document.querySelector('.button-popup');

function coronaDestroyed() {
    if (score % (brickColumnCount * brickRowCount) === 0) {
        popup.style.display = 'block';
        canvas.style.display = 'none'
        // draw.stop()
    }
}

buttonpopup.addEventListener('click', function () {
    popup.style.display = 'none';
    showAllBricks();
    canvas.style.display = 'block'
})


// Increase score
function increaseScore() {
    score--;
    coronaDestroyed()

}

function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => (brick.visible = true))
    })
}

// Draw everything
function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall()
    drawPaddle()
    drawScore()
    drawBricks()

}

// Update canvas drawing and animation
function update() {
    movePaddle()
    moveBall()

    // Draw everything
    draw()

    requestAnimationFrame(update)
}

update()

// Keydown event
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

// Keyup event
function keyUp(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0
    }
}

// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp)

// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'))

closeBtn.addEventListener('click', () => rules.classList.remove('show'))


