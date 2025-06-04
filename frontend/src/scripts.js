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
      fireCooldown: 0
    };

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("keydown", e => keys[e.key] = true);
    document.addEventListener("keyup", e => keys[e.key] = false);

    canvas.addEventListener("mousemove", e => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener("mousedown", () => {
      shootTowardMouse();
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
        player.fireCooldown = 10;
      }
    }

    class Room {
      constructor(id) {
        this.id = id;
        this.inimigos = [];
        this.cleared = false;
        this.neighbors = {}; // { north, south, east, west }
      }

      spawnEnemies() {
        const qtd = Math.floor(Math.random() * 5) + 3; // 3 a 7
        for (let i = 0; i < qtd; i++) {
          this.inimigos.push(this.createEnemy());
        }
      }

      createEnemy() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return { x, y, size: 16, speed: 1.2, color: "red", alive: true };
      }

      updateEnemies() {
        for (let e of this.inimigos) {
          if (!e.alive) continue;
          const dx = player.x - e.x;
          const dy = player.y - e.y;
          const dist = Math.hypot(dx, dy);
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
        }

        // Colisão tiro x inimigo
        for (let i = this.inimigos.length - 1; i >= 0; i--) {
          const e = this.inimigos[i];
          for (let j = projectiles.length - 1; j >= 0; j--) {
            const p = projectiles[j];
            const dist = Math.hypot(e.x - p.x, e.y - p.y);
            if (e.alive && dist < e.size + p.size) {
              e.alive = false;
              projectiles.splice(j, 1);
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
      if (keys["w"]) player.y -= player.speed;
      if (keys["s"]) player.y += player.speed;
      if (keys["a"]) player.x -= player.speed;
      if (keys["d"]) player.x += player.speed;

      if (player.fireCooldown > 0) player.fireCooldown--;

      for (let p of projectiles) {
        p.x += p.dx * p.speed;
        p.y += p.dy * p.speed;
      }

      currentRoom.updateEnemies();
      checkRoomTransition();
    }

    function draw() {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    createRooms();
    loop();