document.getElementById("openGameBtn").addEventListener("click", () => {
  const gameWindow = window.open("about:blank", "_blank");

  gameWindow.document.write(`
    <style>
      body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f0f0f0; }
      canvas { background-color: #d4f1d0; }
    </style>
    <canvas id="gameCanvas" width="400" height="400"></canvas>
    <script>
      const canvas = document.getElementById("gameCanvas");
      const ctx = canvas.getContext("2d");
      const box = 20;
      const rows = canvas.height / box;
      const cols = canvas.width / box;
      let snake = [{ x: 10 * box, y: 10 * box }];
      let direction = "RIGHT";
      let food = getRandomFoodPosition();
      let score = 0;

      document.addEventListener("keydown", changeDirection);

      function changeDirection(event) {
        if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
        else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
        else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
        else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
      }

      function getRandomFoodPosition() {
        return {
          x: Math.floor(Math.random() * cols) * box,
          y: Math.floor(Math.random() * rows) * box
        };
      }

      function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw food
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, box, box);

        // Move snake
        const head = { ...snake[0] };
        if (direction === "LEFT") head.x -= box;
        if (direction === "UP") head.y -= box;
        if (direction === "RIGHT") head.x += box;
        if (direction === "DOWN") head.y += box;
        snake.unshift(head);

        // Check for food collision
        if (head.x === food.x && head.y === food.y) {
          score++;
          food = getRandomFoodPosition();
        } else {
          snake.pop();
        }

        // Draw snake
        snake.forEach((segment, index) => {
          if (index === 0) {
            drawHead(segment.x, segment.y, direction); // Draw the head with rounded corners
          } else if (index === snake.length - 1) {
            drawTail(segment.x, segment.y, snake[snake.length - 2]); // Draw the tail with rounded corners
          } else {
            // Draw body without rounded corners
            ctx.fillStyle = "#6b8e23";
            ctx.fillRect(segment.x, segment.y, box, box);
            ctx.strokeStyle = "#8FBC8F";
            ctx.strokeRect(segment.x, segment.y, box, box);
          }
        });

        // Game over conditions
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkCollision(head)) {
          clearInterval(game);
          alert("ゲームオーバー！スコア: " + score);
        }
      }

      function drawHead(x, y, direction) {
        ctx.fillStyle = "green";
        ctx.beginPath();
        if (direction === "RIGHT") ctx.arc(x + box / 2, y + box / 2, box / 2, 0.75 * Math.PI, 1.75 * Math.PI);
        else if (direction === "LEFT") ctx.arc(x + box / 2, y + box / 2, box / 2, 1.75 * Math.PI, 0.75 * Math.PI);
        else if (direction === "UP") ctx.arc(x + box / 2, y + box / 2, box / 2, 1.25 * Math.PI, 2.25 * Math.PI);
        else if (direction === "DOWN") ctx.arc(x + box / 2, y + box / 2, box / 2, 0.25 * Math.PI, 1.25 * Math.PI);
        ctx.fill();
      }

      function drawTail(x, y, previousSegment) {
        ctx.fillStyle = "#6b8e23";
        ctx.beginPath();
        if (previousSegment.x < x) ctx.arc(x + box / 2, y + box / 2, box / 2, 1.75 * Math.PI, 0.75 * Math.PI);
        else if (previousSegment.x > x) ctx.arc(x + box / 2, y + box / 2, box / 2, 0.75 * Math.PI, 1.75 * Math.PI);
        else if (previousSegment.y < y) ctx.arc(x + box / 2, y + box / 2, box / 2, 0.25 * Math.PI, 1.25 * Math.PI);
        else if (previousSegment.y > y) ctx.arc(x + box / 2, y + box / 2, box / 2, 1.25 * Math.PI, 2.25 * Math.PI);
        ctx.fill();
      }

      function checkCollision(head) {
        return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
      }

      const game = setInterval(drawGame, 100);
    </script>
  `);
});
