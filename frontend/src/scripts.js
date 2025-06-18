class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'start' });
    }

    preload() {

        this.load.image('background_start', 'images/start-game-image.png');
        this.load.audio('theme_intro', 'audio/music-intro.ogg');
    }

    create() {

        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background_start')
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
            .setTint(0xAAAAAA);

        this.sound.play('theme_intro', { volume: 0.7 });

        this.add.text(this.cameras.main.width / 2, 80, 'O Último Guardião', {
            fontFamily: '"Cinzel Decorative", serif',
            fontSize: '52px',
            fill: '#E0E0E0',
            stroke: '#000000',
            strokeThickness: 5,
            shadow: { offsetX: 4, offsetY: 4, color: '#000', blur: 6, stroke: true, fill: true }
        }).setOrigin(0.5);


        const gameStory = "O Rei, consumido pela ganância e pelo medo do poder ancestral, decretou a morte daquele que protege o equilíbrio do mundo. Você, o mais leal guerreiro do reino, recebeu a ordem final: adentrar as ruínas proibidas e eliminar 'O Último Guardião'. Mas ao cruzar os portões, uma dúvida assola sua alma: você está cumprindo seu dever ou selando o destino de todos?";


        const textBackground = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.6 } });
        const storyText = this.add.text(this.cameras.main.width / 2, 220, gameStory, {
            fontFamily: 'Georgia, serif',
            fontSize: '17px',
            fill: '#DDCBAA',
            align: 'center',
            wordWrap: { width: this.cameras.main.width - 100 },
            lineSpacing: 7
        }).setOrigin(0.5);


        const bounds = storyText.getBounds();
        textBackground.fillRoundedRect(bounds.x - 20, bounds.y - 15, bounds.width + 40, bounds.height + 30, 10);

        const startButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 70, 'INICIAR JORNADA', {
            fontFamily: '"Cinzel", serif',
            fontSize: '28px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerover', () => {
            startButton.setStyle({ fill: '#FFD700' });
            this.game.canvas.style.cursor = 'pointer';
        });


        startButton.on('pointerout', () => {
            startButton.setStyle({ fill: '#FFFFFF' });
            this.game.canvas.style.cursor = 'default';
        });

        startButton.on('pointerdown', () => {
            this.game.canvas.style.cursor = 'default';
            this.sound.stopByKey('theme_intro');
            this.scene.start('game');
        });
    }
}


class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gameOver' });
    }

    preload() {
        this.load.image('background_gameover', 'images/game-over-image.png');
    }

    create() {
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background_gameover')
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);


        this.add.text(this.cameras.main.width / 2, 80, 'Fim de Jogo', {
            fontFamily: '"Times New Roman", serif',
            fontSize: '60px',
            fill: '#ff4444',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 5, stroke: true, fill: true }
        }).setOrigin(0.5);

        const gameOverStory = "O guerreiro caiu. As sombras, antes contidas pela sua coragem, agora se espalham sem controle. A esperança se extingue, e o mundo mergulha em uma era de escuridão eterna. Ou será que não? Talvez morrer aqui tenha sido a coisa certa a se fazer.";

        this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 150, gameOverStory, {
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            fill: '#cccccc',
            align: 'center',
            wordWrap: { width: this.cameras.main.width - 60 },
            lineSpacing: 8
        }).setOrigin(0.5);
    }
}


class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'victory' });
    }


    preload() {
        this.load.audio('theme_victory', 'audio/music-victory.ogg');
        this.load.image('background_victory', 'images/victory-image.png');
    }

    create() {

        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background_victory')
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.sound.play('theme_victory', { loop: true, volume: 0.5 });

        this.add.text(this.cameras.main.width / 2, 80, 'Vitória!', {
            fontFamily: '"Times New Roman", serif',
            fontSize: '60px',
            fill: '#ffffaa',
            stroke: '#332200',
            strokeThickness: 4,
            shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 5, stroke: true, fill: true }
        }).setOrigin(0.5);

        const victoryStory = "Com a queda do 'Último Guardião', a luz retorna ao mundo. A sua bravura será cantada por gerações, e a paz que você conquistou florescerá por milênios. Descanse, nobre guerreiro. Você mereceu. Se não fosse pelo fato de suas ações terem condenado o mundo a uma eterna era de tirania, é claro.";

        this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 150, victoryStory, {
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            fill: '#fffff',
            align: 'center',
            wordWrap: { width: this.cameras.main.width - 60 },
            lineSpacing: 8
        }).setOrigin(0.5);
    }
}


class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'game' });
    }


    init() {
        this.boss = null;
        this.player = { x: 320, y: 240, size: 40, speed: 150, visible: true };
        this.bullets = [];
        this.enemyBullets = [];
        this.canShoot = true;
        this.shootCooldown = 400;
        this.playerLife = 5;
        this.currentRoomIndex = 0;
        this.rooms = [];
        this.door = { x: 0, y: 0, width: 40, height: 40, open: false, direction: null };
        this.visitedRooms = new Set();
        this.isInvulnerable = false;
        this.invulnDuration = 2000;
        this.isDashing = false;
        this.dashCooldown = 2000;
        this.dashDuration = 150;
        this.lastDashTime = -this.dashCooldown;
        this.dashSpeedMultiplier = 4;
        this.damageTakenMultiplier = 1;
        this.itemDescription = '';
        this.itemPickupAvailable = false;
        if (this.currentMusic) {
            this.currentMusic.stop();
        }
        this.currentMusic = null;
        this.player.lastShootDirection = 'down';
        this.player.lookDirectionLockUntil = 0;
    }

    preload() {
        this.load.image('player_up', 'images/characters/principal/principal cima .PNG');
        this.load.image('player_down', 'images/characters/principal/principal baixo.png');
        this.load.image('player_left', 'images/characters/principal/principal esquerda.png');
        this.load.image('player_right', 'images/characters/principal/principal direita.png');

        this.load.image('normal_enemy', 'images/characters/olho/inimigo olhos.PNG');
        this.load.image('atirador_enemy', 'images/characters/morte/inimigo morte.PNG');
        this.load.image('rapido_enemy', 'images/characters/monstro/inimigo monstros.PNG');


        this.load.audio('theme_combat', 'audio/music-combat.mp3');
        this.load.audio('theme_item', 'audio/music-item.mp3');
        this.load.audio('theme_boss', 'audio/music-boss.mp3');
        this.load.audio('sfx_hurt', 'audio/sfx-hit.wav');
        this.load.audio('sfx_gameover', 'audio/sfx-game-over.wav');
        this.load.audio('sfx_dash', 'audio/dash-sound.wav');
        this.load.audio('sfx_shoot', 'audio/player-shoot.wav');
    }

    create() {
        this.cameras.main.setBackgroundColor('#111');

        this.player.sprite = this.add.sprite(this.player.x, this.player.y, 'player_down').setOrigin(0.5);
        this.player.size = 64;
        this.player.sprite.setDisplaySize(this.player.size, this.player.size);

        this.cursors = this.input.keyboard.addKeys('W,A,S,D');
        this.shootKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT
        });
        this.dashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.itemKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        this.hudText = this.add.text(10, 10, '', { font: '16px Arial', fill: '#fff' }).setDepth(1);
        const descriptionBg = this.add.graphics().setDepth(0.9);
        this.descriptionText = this.add.text(20, 320, '', {
            fontFamily: 'Verdana', fontSize: '12px', color: '#ffffaa', align: 'left',
            wordWrap: { width: config.width - 40 }, lineSpacing: 6, stroke: '#000000', strokeThickness: 3,
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 2, stroke: true, fill: true }
        }).setDepth(1);

        this.events.on('postupdate', () => {
            if (this.descriptionText.text.length > 0) {
                const textHeight = this.descriptionText.height + 16;
                descriptionBg.clear();
                descriptionBg.fillStyle(0x000000, 0.7);
                descriptionBg.fillRoundedRect(10, 310, config.width - 20, textHeight, 10);
                this.descriptionText.setY(320 + (textHeight - this.descriptionText.height - 16) / 2);
            } else {
                descriptionBg.clear();
            }
        });


        this.createRooms();
        this.setDoorPosition();
        this.playMusicForRoom('combat');
    }

    update(time, delta) {
        let newDirection = null;
        if (this.cursors.W.isDown) newDirection = 'up';
        else if (this.cursors.S.isDown) newDirection = 'down';
        else if (this.cursors.A.isDown) newDirection = 'left';
        else if (this.cursors.D.isDown) newDirection = 'right';

        if (
            newDirection &&
            this.time.now > this.player.lookDirectionLockUntil &&
            newDirection !== this.player.currentDirection
        ) {
            this.player.currentDirection = newDirection;
            this.player.sprite.setTexture('player_' + newDirection);
        }

        const currentRoom = this.rooms[this.currentRoomIndex];
        currentRoom.enemies.forEach(enemy => {
            if ((enemy.type === 'normal' || enemy.type === 'atirador' || enemy.type === 'rapido') && enemy.sprite) {
                enemy.sprite.setPosition(enemy.x, enemy.y);
                enemy.sprite.setVisible(enemy.active);
            }

            if (enemy.life <= 0) {
                enemy.active = false;
                if (enemy.sprite) {
                    enemy.sprite.destroy();
                    enemy.sprite = null;
                }
            }
        });

        this.player.hasShotThisFrame = false;
        this.player.sprite.setPosition(this.player.x, this.player.y);
        this.player.sprite.setVisible(this.player.visible);
        this.handlePlayerMovement(time, delta);
        this.handleShooting();
        this.handleEnemyAI(time, delta);
        this.handleItemPickup();
        this.updateBullets(delta);
        this.checkCollisions();
        this.checkRoomClearCondition();
        this.checkDoorTransition();

        this.separateEnemies(this.rooms[this.currentRoomIndex].enemies);
        this.hudText.setText(`Vida: ${Math.ceil(this.playerLife)}`);
        this.descriptionText.setText(this.itemDescription);

        this.drawGame();
    }



    handlePlayerMovement(time, delta) {
        let dx = 0;
        let dy = 0;

        if (this.cursors.W.isDown) dy -= 1;
        if (this.cursors.S.isDown) dy += 1;
        if (this.cursors.A.isDown) dx -= 1;
        if (this.cursors.D.isDown) dx += 1;

        if (dx !== 0 || dy !== 0) {
            const len = Math.hypot(dx, dy);
            dx /= len;
            dy /= len;

            if (Phaser.Input.Keyboard.JustDown(this.dashKey) && time - this.lastDashTime >= this.dashCooldown) {
                this.sound.play('sfx_dash', { volume: 0.5 });
                this.isDashing = true;
                this.lastDashTime = time;
                setTimeout(() => { this.isDashing = false; }, this.dashDuration);
                this.isInvulnerable = true;
                setTimeout(() => { this.isInvulnerable = false; }, this.dashDuration);
            }

            const currentSpeed = this.isDashing ? this.player.speed * this.dashSpeedMultiplier : this.player.speed;
            this.player.x += dx * currentSpeed * (delta / 1000);
            this.player.y += dy * currentSpeed * (delta / 1000);
        }

        this.player.x = Phaser.Math.Clamp(this.player.x, this.player.size / 2, config.width - this.player.size / 2);
        this.player.y = Phaser.Math.Clamp(this.player.y, this.player.size / 2, config.height - this.player.size / 2);
    }

    handleShooting() {
        if (this.canShoot) {
            let direction = null;
            if (this.shootKeys.up.isDown) direction = 'up';
            else if (this.shootKeys.down.isDown) direction = 'down';
            else if (this.shootKeys.left.isDown) direction = 'left';
            else if (this.shootKeys.right.isDown) direction = 'right';

            if (direction) {
                this.shoot(direction);
                this.canShoot = false;
                setTimeout(() => { this.canShoot = true; }, this.shootCooldown);
            }
        }
    }

    handleEnemyAI(time, delta) {
        const currentRoom = this.rooms[this.currentRoomIndex];
        currentRoom.enemies.forEach(enemy => {
            if (!enemy.active) return;
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 0) {
                enemy.x += (dx / dist) * enemy.speed * (delta / 1000);
                enemy.y += (dy / dist) * enemy.speed * (delta / 1000);
            }
            if (enemy.shoots && time - enemy.lastShot > enemy.shootCooldown) {
                this.enemyShoot(enemy);
                enemy.lastShot = time;
            }
        });

        if (this.boss && this.boss.active) {
            if (this.boss.isDashing) {
                const dx = this.boss.dashTarget.x - this.boss.x;
                const dy = this.boss.dashTarget.y - this.boss.y;
                const dist = Math.hypot(dx, dy);
                const dashSpeed = 450;

                if (dist > 20) {
                    this.boss.x += (dx / dist) * dashSpeed * (delta / 1000);
                    this.boss.y += (dy / dist) * dashSpeed * (delta / 1000);
                } else {
                    this.boss.isDashing = false;

                    const shotgunBullets = 7;
                    const spreadAngle = Math.PI / 4;
                    const baseAngle = Math.atan2(this.player.y - this.boss.y, this.player.x - this.boss.x);

                    for (let i = 0; i < shotgunBullets; i++) {
                        const angle = baseAngle - (spreadAngle / 2) + (i * (spreadAngle / (shotgunBullets - 1)));
                        this.enemyBullets.push({
                            x: this.boss.x, y: this.boss.y,
                            vx: Math.cos(angle) * 250,
                            vy: Math.sin(angle) * 250,
                            fromEnemy: true
                        });
                    }
                }
            } else {

                const dx = this.player.x - this.boss.x;
                const dy = this.player.y - this.boss.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 0) {
                    this.boss.x += (dx / dist) * this.boss.speed * (delta / 1000);
                    this.boss.y += (dy / dist) * this.boss.speed * (delta / 1000);
                }
            }
            this.bossAttack(time);
        }

    }

    handleItemPickup() {
        const currentRoom = this.rooms[this.currentRoomIndex];
        if (currentRoom.type === 'item' && currentRoom.item) {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, config.width / 2, config.height / 2);
            if (dist < 50) {
                this.itemDescription = `${currentRoom.item.name}: ${currentRoom.item.description}\nPressione [ESPAÇO] para pegar.`;
                this.itemPickupAvailable = true;
                if (Phaser.Input.Keyboard.JustDown(this.itemKey)) {
                    currentRoom.item.applyEffect(this);
                    currentRoom.item = null;
                    this.itemDescription = '';
                    this.itemPickupAvailable = false;
                }
            } else {
                this.itemDescription = '';
                this.itemPickupAvailable = false;
            }
        }
    }

    updateBullets(delta) {
        this.bullets.forEach(b => { b.x += b.vx * (delta / 1000); b.y += b.vy * (delta / 1000); });
        this.enemyBullets.forEach(b => { b.x += b.vx * (delta / 1000); b.y += b.vy * (delta / 1000); });
    }

    checkCollisions() {
        const currentRoom = this.rooms[this.currentRoomIndex];


        this.bullets = this.bullets.filter(bullet => {
            let hit = false;
            currentRoom.enemies.forEach(enemy => {
                if (enemy.active && Phaser.Math.Distance.Between(bullet.x, bullet.y, enemy.x, enemy.y) < (enemy.size / 2)) {
                    enemy.life -= (this.player.damageMultiplier || 1);
                    if (enemy.life <= 0) enemy.active = false;
                    hit = true;
                }
            });
            if (this.boss && this.boss.active && !this.boss.isDashing && Phaser.Math.Distance.Between(bullet.x, bullet.y, this.boss.x, this.boss.y) < (this.boss.size / 2)) {
                this.boss.life -= (this.player.damageMultiplier || 1);
                if (this.boss.life <= 0) this.boss.active = false;
                hit = true;
            }
            return !hit && bullet.x > 0 && bullet.x < config.width && bullet.y > 0 && bullet.y < config.height;
        });


        this.enemyBullets = this.enemyBullets.filter(bullet => {
            if (!this.isInvulnerable && Phaser.Math.Distance.Between(bullet.x, bullet.y, this.player.x, this.player.y) < this.player.size / 2) {
                this.takeDamage();
                return false;
            }
            return bullet.x > 0 && bullet.x < config.width && bullet.y > 0 && bullet.y < config.height;
        });


        if (!this.isInvulnerable) {
            currentRoom.enemies.forEach(enemy => {
                if (enemy.active && Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) < (this.player.size / 2)) {
                    this.takeDamage();
                }
            });
            if (this.boss && this.boss.active && Phaser.Math.Distance.Between(this.player.x, this.player.y, this.boss.x, this.boss.y) < (this.player.size / 2 + this.boss.size / 2)) {
                this.takeDamage();
            }
        }
    }

    checkRoomClearCondition() {
        const currentRoom = this.rooms[this.currentRoomIndex];


        if (currentRoom.cleared) return;

        let shouldClear = false;

        if (currentRoom.type === 'item') {

            shouldClear = true;
        } else if (currentRoom.type === 'combat') {

            if (currentRoom.spawned && currentRoom.enemies.every(e => !e.active)) {
                shouldClear = true;
            }
        } else if (currentRoom.type === 'boss') {

            if (this.boss && !this.boss.active) {
                shouldClear = true;
            }
        }


        if (shouldClear) {
            currentRoom.cleared = true;
            this.door.open = true;
        }
    }

    checkDoorTransition() {
        if (this.door.open && this.checkPlayerAtDoor()) {
            const currentRoom = this.rooms[this.currentRoomIndex];
            if (currentRoom.next) {
                this.currentRoomIndex++;
                this.visitedRooms.add(this.currentRoomIndex);
                this.bullets = [];
                this.enemyBullets = [];
                this.movePlayerToNewPosition();
                this.setDoorPosition();

                const nextRoom = this.rooms[this.currentRoomIndex];
                this.playMusicForRoom(nextRoom.type);


                if (!nextRoom.spawned) {
                    setTimeout(() => {

                        if (nextRoom.type === 'boss') {
                            this.spawnBoss();
                        } else if (nextRoom.type === 'combat') {
                            this.spawnEnemies();
                        }


                        nextRoom.spawned = true;
                    }, 1000);
                }
            } else {

                this.sound.stopAll();
                this.scene.start('victory');
            }
        }
    }

    drawGame() {
        if (!this.graphics) {
            this.graphics = this.add.graphics();
        }
        this.graphics.clear();


        this.graphics.fillStyle(this.door.open ? 0x00ff00 : 0xff0000, 1);
        this.graphics.fillRect(this.door.x, this.door.y, this.door.width, this.door.height);

        const currentRoom = this.rooms[this.currentRoomIndex];
        currentRoom.enemies.forEach(enemy => {
            if (!enemy.active) return;
            if (enemy.type !== 'normal' && enemy.type !== 'atirador' && enemy.type !== 'rapido') {
                let color;
                switch (enemy.type) {
                    case 'bruto': color = 0xff9900; break;
                }
                this.graphics.fillStyle(color, 1);
                this.graphics.fillRect(enemy.x - enemy.size / 2, enemy.y - enemy.size / 2, enemy.size, enemy.size);
            }
        });

        if (this.boss && this.boss.active) {
            this.graphics.fillStyle(0x8B008B, 1);
            this.graphics.fillRect(this.boss.x - this.boss.size / 2, this.boss.y - this.boss.size / 2, this.boss.size, this.boss.size);
            const healthBarWidth = 150, healthBarHeight = 15, healthBarX = config.width / 2 - healthBarWidth / 2, healthBarY = 20;
            this.graphics.fillStyle(0x333333, 1);
            this.graphics.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
            const currentHealthWidth = (this.boss.life / this.boss.maxLife) * healthBarWidth;
            this.graphics.fillStyle(0xff0000, 1);
            this.graphics.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
        }


        this.graphics.fillStyle(0xffff00, 1);
        this.bullets.forEach(b => this.graphics.fillRect(b.x - b.size / 2, b.y - b.size / 2, b.size, b.size));
        this.graphics.fillStyle(0xff00ff, 1);
        this.enemyBullets.forEach(b => this.graphics.fillRect(b.x - 4, b.y - 4, 8, 8));


        if (currentRoom.type === 'item' && currentRoom.item) {
            this.graphics.fillStyle(0xffff00, 1);
            this.graphics.fillRect(config.width / 2 - 15, config.height / 2 - 15, 30, 30);
        }
    }



    createRooms() {
        const roomSequence = ['combat', 'combat', 'combat', 'item', 'combat', 'combat', 'combat', 'item', 'combat', 'combat', 'combat', 'item', 'boss'];
        const opposites = { north: 'south', south: 'north', east: 'west', west: 'east' };
        const dirOffsets = { north: { x: 0, y: -1 }, south: { x: 0, y: 1 }, east: { x: 1, y: 0 }, west: { x: -1, y: 0 } };
        let currentPos = { x: 0, y: 0 }, usedPositions = new Set(["0,0"]), previousDirection = null;

        for (let i = 0; i < roomSequence.length; i++) {
            const type = roomSequence[i];
            const room = new Room(`Sala ${i + 1} - ${type}`, type);
            this.rooms.push(room);

            if (type === 'item') room.item = Phaser.Utils.Array.GetRandom(specialItems);

            let possibleDirs = ['north', 'south', 'east', 'west'].filter(dir => dir !== opposites[previousDirection]);
            let chosenDir = Phaser.Utils.Array.GetRandom(possibleDirs);
            room.exitDirection = chosenDir;
            previousDirection = chosenDir;
        }

        for (let i = 0; i < this.rooms.length - 1; i++) {
            this.rooms[i].next = this.rooms[i + 1];
        }

        setTimeout(() => {
            const firstRoom = this.rooms[0];
            if (firstRoom.type === 'combat') this.spawnEnemies();
            firstRoom.spawned = true;
        }, 750);
    }

    spawnEnemies() {
        const room = this.rooms[this.currentRoomIndex];
        if (room.spawned) return;
        if (room.type !== 'combat') {
            return;
        }

        const roomIndex = this.currentRoomIndex;
        let totalEnemiesToSpawn = 2 + Math.floor(roomIndex * 0.5);
        for (let i = 0; i < totalEnemiesToSpawn; i++) {
            let x, y;
            do {
                x = Phaser.Math.Between(50, config.width - 50);
                y = Phaser.Math.Between(50, config.height - 50);
            } while (Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) < 150);

            const progress = roomIndex / this.rooms.length;
            let type;
            const rand = Phaser.Math.Between(1, 100);
            if (rand < 25) type = 'rapido';
            else if (rand < 50) type = 'atirador';
            else if (rand < 75) type = 'bruto';
            else type = 'normal';

            let shoots = false, speed = 50, life = 2, shootCooldown, bulletSpeed;
            switch (type) {
                case 'rapido': speed = 150 + Math.floor(progress * 50); life = 2 + Math.floor(progress * 1); shoots = false; break;
                case 'atirador': speed = 50 + Math.floor(progress * 15); life = 3 + Math.floor(progress * 2); shoots = true; bulletSpeed = 150 + Math.floor(progress * 50); shootCooldown = Phaser.Math.Between(6000, 7500); break;
                case 'bruto': speed = 125 + Math.floor(progress * 50); life = 5 + Math.floor(progress * 3); shoots = false; break;
                case 'normal': speed = 75 + Math.floor(progress * 25); life = 3 + Math.floor(progress * 1); shoots = true; bulletSpeed = 275 + Math.floor(progress * 75); shootCooldown = Phaser.Math.Between(1000, 1500); break;
            }

            const enemy = { x, y, size: 54, life, active: true, lastShot: 0, speed, shoots, type };

            if (type === 'normal') {
                enemy.sprite = this.add.sprite(x, y, 'normal_enemy').setOrigin(0.5);
                enemy.sprite.setDisplaySize(enemy.size, enemy.size);
            }

            if (type === 'atirador') {
                enemy.sprite = this.add.sprite(x, y, 'atirador_enemy').setOrigin(0.5);
                enemy.sprite.setDisplaySize(enemy.size, enemy.size);
            }

            if (type === 'rapido') {
                enemy.sprite = this.add.sprite(x, y, 'rapido_enemy').setOrigin(0.5);
                enemy.sprite.setDisplaySize(enemy.size, enemy.size);
            }

            if (shoots) { enemy.shootCooldown = shootCooldown; enemy.bulletSpeed = bulletSpeed; }
            room.enemies.push(enemy);
        }
    }

    setDoorPosition() {
        const currentRoom = this.rooms[this.currentRoomIndex];
        if (!currentRoom) return;
        const dir = currentRoom.exitDirection;
        this.door.direction = dir;

        if (currentRoom.type === 'item') {
            this.door.open = true;
        } else {
            this.door.open = currentRoom.cleared;
        }

        switch (dir) {
            case 'north': this.door.x = config.width / 2 - this.door.width / 2; this.door.y = 0; break;
            case 'south': this.door.x = config.width / 2 - this.door.width / 2; this.door.y = config.height - this.door.height; break;
            case 'east': this.door.x = config.width - this.door.width; this.door.y = config.height / 2 - this.door.height / 2; break;
            case 'west': this.door.x = 0; this.door.y = config.height / 2 - this.door.height / 2; break;
        }
    }

    shoot(direction) {
        this.sound.play('sfx_shoot', { volume: 0.05 });
        const baseSpeed = 300; let baseAngle = 0;
        if (direction === 'up') baseAngle = -Math.PI / 2;
        else if (direction === 'down') baseAngle = Math.PI / 2;
        else if (direction === 'left') baseAngle = Math.PI;

        const bulletSize = 8 * (this.player.bulletSizeMultiplier || 1);
        const numberOfBullets = Math.pow(2, (this.player.multiShotLevel || 0));
        const spreadAngle = 0.2;

        for (let i = 0; i < numberOfBullets; i++) {
            const angleOffset = (i - (numberOfBullets - 1) / 2) * spreadAngle;
            const angle = baseAngle + angleOffset;
            this.bullets.push({ x: this.player.x, y: this.player.y, vx: Math.cos(angle) * baseSpeed, vy: Math.sin(angle) * baseSpeed, size: bulletSize });
        }

        this.player.currentDirection = direction;
        this.player.lastShootDirection = direction;
        this.player.sprite.setTexture('player_' + direction);
        this.player.lookDirectionLockUntil = this.time.now + 500;
        this.player.hasShotThisFrame = true;
    }

    enemyShoot(enemy) {
        if (!enemy.active || !enemy.shoots) return;


        if (enemy.type === 'atirador') {

            const numBullets = 9;
            const spread = Math.PI / 2;
            const baseAngle = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
            const startAngle = baseAngle - spread / 2;
            const delayPerShot = 50;

            for (let i = 0; i < numBullets; i++) {
                setTimeout(() => {

                    if (!enemy.active) return;

                    const angle = startAngle + (spread / (numBullets - 1)) * i;
                    const vx = Math.cos(angle) * enemy.bulletSpeed;
                    const vy = Math.sin(angle) * enemy.bulletSpeed;

                    this.enemyBullets.push({
                        x: enemy.x,
                        y: enemy.y,
                        vx,
                        vy,
                        fromEnemy: true
                    });
                }, i * delayPerShot);
            }
        } else {

            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const len = Math.hypot(dx, dy);
            this.enemyBullets.push({
                x: enemy.x,
                y: enemy.y,
                vx: (dx / len) * enemy.bulletSpeed,
                vy: (dy / len) * enemy.bulletSpeed,
                fromEnemy: true
            });
        }
    }

    checkPlayerAtDoor() {
        return (this.player.x + this.player.size / 2 >= this.door.x && this.player.x - this.player.size / 2 <= this.door.x + this.door.width &&
            this.player.y + this.player.size / 2 >= this.door.y && this.player.y - this.player.size / 2 <= this.door.y + this.door.height);
    }

    movePlayerToNewPosition() {
        switch (this.door.direction) {
            case 'north': this.player.y = config.height - this.player.size; break;
            case 'south': this.player.y = this.player.size; break;
            case 'east': this.player.x = this.player.size; break;
            case 'west': this.player.x = config.width - this.player.size; break;
        }
    }

    takeDamage() {
        this.playerLife -= this.damageTakenMultiplier;
        this.sound.play('sfx_hurt', { volume: 0.6 });
        this.isInvulnerable = true;

        if (this.playerLife <= 0) {
            this.sound.stopAll();
            this.sound.play('sfx_gameover');
            this.scene.start('gameOver');
            return;
        }

        let blink = true;
        const blinkInterval = setInterval(() => { this.player.visible = blink; blink = !blink; }, 75);
        setTimeout(() => {
            clearInterval(blinkInterval);
            this.player.visible = true;
            this.isInvulnerable = false;
        }, this.invulnDuration);
    }

    separateEnemies(enemies) {
        for (let i = 0; i < enemies.length; i++) {
            const e1 = enemies[i]; if (!e1.active) continue;
            for (let j = i + 1; j < enemies.length; j++) {
                const e2 = enemies[j]; if (!e2.active) continue;
                const dx = e2.x - e1.x, dy = e2.y - e1.y, dist = Math.hypot(dx, dy);
                if (dist > 0 && dist < 33) {
                    const overlap = (33 - dist) / 2, nx = dx / dist, ny = dy / dist;
                    e1.x -= nx * overlap; e1.y -= ny * overlap; e2.x += nx * overlap; e2.y += ny * overlap;
                }
            }
        }
    }

    spawnBoss() {
        this.boss = {
            x: config.width / 2,
            y: 100,
            size: 80,
            life: 200,
            maxLife: 200,
            active: true,
            speed: 60,
            phase: 1,
            attackCooldown: 2500,
            lastAttackTime: 0,


            spiralAngle: 0,
            attackPattern: ['spiral'],
            isDashing: false,
            dashTarget: null
        };
    }

    bossAttack(time) {
        if (!this.boss.active || this.boss.isDashing || time < this.boss.lastAttackTime + this.boss.attackCooldown) {
            return;
        }


        const healthPercentage = this.boss.life / this.boss.maxLife;


        if (this.boss.phase === 1 && healthPercentage <= 0.70) {
            this.boss.phase = 2;
            this.boss.speed = 80;
            this.boss.attackCooldown = 2500;
            this.boss.attackPattern.push('barrage');
            this.bossNovaBlast(16);
        }

        else if (this.boss.phase === 2 && healthPercentage <= 0.35) {
            this.boss.phase = 3;
            this.boss.speed = 95;
            this.boss.attackCooldown = 1800;
            this.boss.attackPattern.push('charge');
            this.bossNovaBlast(24);
        }

        this.boss.lastAttackTime = time;
        const nextAttack = Phaser.Utils.Array.GetRandom(this.boss.attackPattern);

        switch (nextAttack) {

            case 'spiral':
                const spiralBullets = 12;
                const spiralSpeed = this.boss.phase === 3 ? 220 : 180;
                const spiralRotation = this.boss.phase === 3 ? 0.7 : 0.5;

                for (let i = 0; i < spiralBullets; i++) {
                    const angle = this.boss.spiralAngle + (i * (2 * Math.PI / spiralBullets));
                    this.enemyBullets.push({
                        x: this.boss.x, y: this.boss.y,
                        vx: Math.cos(angle) * spiralSpeed, vy: Math.sin(angle) * spiralSpeed, fromEnemy: true
                    });
                }
                this.boss.spiralAngle += spiralRotation;
                break;

            case 'barrage':
                const isPhase3 = this.boss.phase === 3;

                const barrageStreamCount = isPhase3 ? 5 : 4;

                const coneBulletCount = isPhase3 ? 5 : 3;

                const spreadAngle = isPhase3 ? Math.PI / 6 : Math.PI / 8;

                const delayBetweenWaves = isPhase3 ? 200 : 300;
                const bulletSpeed = isPhase3 ? 320 : 280;

                for (let i = 0; i < barrageStreamCount; i++) {
                    this.time.delayedCall(i * delayBetweenWaves, () => {
                        if (!this.boss.active) return;


                        const baseAngle = Math.atan2(this.player.y - this.boss.y, this.player.x - this.boss.x);


                        for (let j = 0; j < coneBulletCount; j++) {

                            const angle = baseAngle - (spreadAngle / 2) + (j * (spreadAngle / (coneBulletCount - 1)));

                            this.enemyBullets.push({
                                x: this.boss.x, y: this.boss.y,
                                vx: Math.cos(angle) * bulletSpeed,
                                vy: Math.sin(angle) * bulletSpeed,
                                fromEnemy: true
                            });
                        }
                    });
                }
                break;


            case 'charge':
                this.boss.isDashing = true;
                this.boss.dashTarget = { x: this.player.x, y: this.player.y };
                break;
        }
    }

    bossNovaBlast(bulletCount) {
        if (!this.boss.active) return;
        const bulletSpeed = 200;
        for (let i = 0; i < bulletCount; i++) {
            const angle = i * (2 * Math.PI / bulletCount);
            this.enemyBullets.push({
                x: this.boss.x, y: this.boss.y,
                vx: Math.cos(angle) * bulletSpeed,
                vy: Math.sin(angle) * bulletSpeed,
                fromEnemy: true
            });
        }
    }

    playMusicForRoom(roomType) {
        let musicKey = 'theme_combat';
        if (roomType === 'boss') musicKey = 'theme_boss';
        else if (roomType === 'item') musicKey = 'theme_item';

        if (this.currentMusic && this.currentMusic.key === musicKey) return;
        if (this.currentMusic) this.currentMusic.stop();

        this.currentMusic = this.sound.add(musicKey, { loop: true, volume: 0.4 });
        this.currentMusic.play();
    }
}




const specialItems = [
    {
        name: "Pergaminho da Velocidade",
        applyEffect: function (scene) {
            scene.player.speed *= 1.5;
            scene.dashSpeedMultiplier *= 1.2;
            scene.dashCooldown /= 1.25;
            scene.damageTakenMultiplier *= 2;
            scene.playerLife += 1;
        },
        description: "Velocidade absurda... mas sofra o dobro de dano."
    },
    {
        name: "Pergaminho da Força",
        applyEffect: function (scene) {
            scene.player.damageMultiplier = (scene.player.damageMultiplier || 1) * 2.5;
            scene.playerLife += 4;
            scene.dashCooldown *= 1.2;
            scene.dashSpeedMultiplier /= 1.1;
            scene.player.speed /= 1.1;
        },
        description: "Dano e vida aumentados... mas seu personagem e dash agora são mais lentos."
    },
    {
        name: "Pergaminho do Poder",
        applyEffect: function (scene) {
            scene.player.bulletSizeMultiplier = (scene.player.bulletSizeMultiplier || 1) * 2;
            scene.player.multiShotLevel = (scene.player.multiShotLevel || 0) + 1;
            scene.player.damageMultiplier = (scene.player.damageMultiplier || 1) * 0.75;
            scene.playerLife += 1;
        },
        description: "Dobro de tiros, maiores e mais rápidos... mas seu dano é reduzido."
    }
];

class Room {
    constructor(name, type = 'combat', next = null) {
        this.name = name;
        this.type = type;
        this.next = null;
        this.enemies = [];
        this.cleared = false;
        this.exitDirection = null;
        this.spawned = false;
        this.item = null;
    }
}



const config = {
    type: Phaser.AUTO,
    width: 650,
    height: 450,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    audio: {
        disableWebAudio: false,
        noAudio: false,
    },
    scene: [StartScene, GameScene, GameOverScene, VictoryScene]
};

const game = new Phaser.Game(config);