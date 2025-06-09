    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const keys = {};
    const projectiles = [];

    const player = {
      x: 300,
      y: 220,
      size: 20,
      speed: 2.5,
      color: "green",
      fireCooldown: 0,
      life: 3
    };

    const walls = [
      { x: 100, y: 100, width: 200, height: 20 },
      { x: 350, y: 200, width: 20, height: 150 },
      { x: 200, y: 300, width: 100, height: 20 }
    ];

    let mouseX = 0;
    let mouseY = 0;
    let mouseDown = false;

    document.addEventListener("keydown", e => keys[e.key] = true);
    document.addEventListener("keyup", e => keys[e.key] = false);

    canvas.addEventListener("mousemove", e => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener("mousedown", () => {
      mouseDown = true;
    });

    canvas.addEventListener("mouseup", () => {
      mouseDown = false;
    });

    function shootTowardMouse() {
      if (player.fireCooldown <= 0) {
        const dx = mouseX - player.x;
        const dy = mouseY - player.y;
        const dist = Math.hypot(dx, dy);
        projectiles.push({
          x: player.x,
          y: player.y,
          dx: dx / dist,
          dy: dy / dist,
          speed: 4,
          size: 6,
          color: "yellow"
        });
        player.fireCooldown = 20;
      }
    }

    function checkWallCollision(newX, newY) {
      for (let wall of walls) {
        if (
          newX + player.size > wall.x &&
          newX - player.size < wall.x + wall.width &&
          newY + player.size > wall.y &&
          newY - player.size < wall.y + wall.height
        ) {
          return true;
        }
      }
      return false;
    }

    class Room {
      constructor(id) {
        this.id = id;
        this.inimigos = [];
        this.cleared = false;
        this.neighbors = {};
      }

      spawnEnemies() {
        const qtd = Math.floor(Math.random() * 5) + 3;
        for (let i = 0; i < qtd; i++) {
          this.inimigos.push(this.createEnemy());
        }
      }

      createEnemy() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return { x, y, size: 16, speed: 1.2, color: "red", life: 3, alive: true };
      }

      updateEnemies() {
        for (let e of this.inimigos) {
          if (!e.alive) continue;
          const dx = player.x - e.x;
          const dy = player.y - e.y;
          const dist = Math.hypot(dx, dy);
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;

          if (Math.hypot(player.x - e.x, player.y - e.y) < player.size + e.size) {
            player.life--;
            console.log("Jogador atingido! Vidas restantes: ", player.life);
            e.alive = false;
            if (player.life <= 0) {
              alert("Game Over!");
              window.location.reload();
            }
          }
        }

        for (let i = this.inimigos.length - 1; i >= 0; i--) {
          const e = this.inimigos[i];
          for (let j = projectiles.length - 1; j >= 0; j--) {
            const p = projectiles[j];
            const dist = Math.hypot(e.x - p.x, e.y - p.y);
            if (e.alive && dist < e.size + p.size) {
              e.life--;
              projectiles.splice(j, 1);
              if (e.life <= 0) {
                e.alive = false;
              }
              break;
            }
          }
        }

        if (!this.cleared && this.inimigos.every(e => !e.alive)) {
          this.cleared = true;
          console.log("Sala limpa!");
        }
      }

      drawEnemies() {
        for (let e of this.inimigos) {
          if (!e.alive) continue;
          ctx.fillStyle = e.color;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const rooms = [];
    let currentRoom = null;

    function createRooms() {
      const roomA = new Room("A");
      const roomB = new Room("B");
      const roomC = new Room("C");
      const roomD = new Room("D");

      roomA.neighbors.east = roomB;
      roomB.neighbors.west = roomA;
      roomB.neighbors.south = roomC;
      roomC.neighbors.north = roomB;
      roomC.neighbors.east = roomD;
      roomD.neighbors.west = roomC;

      rooms.push(roomA, roomB, roomC, roomD);
      for (let r of rooms) r.spawnEnemies();

      currentRoom = roomA;
    }

    function checkRoomTransition() {
      const margin = 20;
      if (!currentRoom.cleared) return;

      if (player.x < margin && currentRoom.neighbors.west) {
        currentRoom = currentRoom.neighbors.west;
        player.x = canvas.width - margin;
      } else if (player.x > canvas.width - margin && currentRoom.neighbors.east) {
        currentRoom = currentRoom.neighbors.east;
        player.x = margin;
      } else if (player.y < margin && currentRoom.neighbors.north) {
        currentRoom = currentRoom.neighbors.north;
        player.y = canvas.height - margin;
      } else if (player.y > canvas.height - margin && currentRoom.neighbors.south) {
        currentRoom = currentRoom.neighbors.south;
        player.y = margin;
      }
    }

    function update() {
      let newX = player.x;
      let newY = player.y;

      if (keys["w"]) newY -= player.speed;
      if (keys["s"]) newY += player.speed;
      if (keys["a"]) newX -= player.speed;
      if (keys["d"]) newX += player.speed;

      if (!checkWallCollision(newX, newY)) {
        player.x = newX;
        player.y = newY;
      }

      if (player.fireCooldown > 0) player.fireCooldown--;

      for (let p of projectiles) {
        p.x += p.dx * p.speed;
        p.y += p.dy * p.speed;
      }

      currentRoom.updateEnemies();
      checkRoomTransition();
      if (mouseDown) {
        shootTowardMouse();
      }
    }

    function draw() {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Paredes
      ctx.fillStyle = "#444";
      for (let wall of walls) {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
      }

      currentRoom.drawEnemies();

      // Player
      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
      ctx.fill();

      // Tiros
      for (let p of projectiles) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vida do jogador
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText("Vida: " + player.life, 10, 20);
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    createRooms();
    loop();