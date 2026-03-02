import { Player } from '../gameObjects/Player.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.add.image(400, 300, 'sky');
        
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = new Player(this, 100, 450);

        this.physics.add.collider(this.player, this.platforms); // add coll

        this.cursors = this.input.keyboard.createCursorKeys(); // add cursor input

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: {x: 12, y: 0, stepX: 70 }
        }); // make a star

        this.stars.children.iterate(child => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        }); // make it star bouce

        this.physics.add.collider(this.stars, this.platforms); // add coll
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});

        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBombs, null, this);

        this.highScore = 0;
        this.highScoreText = this.add.text(16, 56, 'High Score: 0', {fontSize: '32px', fill: '#000'});
        
        this.level = 0;
        this.levelText = this.add.text(16, 96, 'Level: 0', {fontSize: '32px', fill: '#000'});
    }

    update() {
        if (this.cursors.left.isDown)
        {
            this.player.moveLeft();
        } 
        else if (this.cursors.right.isDown) 
        {
            this.player.moveRight();
        } 
        else
        {
            this.player.idle();
        }

        if (this.cursors.up.isDown) 
        {
            this.player.jump();
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            this.releaseBomb();
            this.releaseBomb();
            this.releaseBomb();
            this.releaseBomb();
            this.releaseBomb();

            this.level += 1;
            this.levelText.setText('Level: ' + this.level);
        }

        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreText.setText('highScore: ' + this.score);
        }
    }

    hitBombs() {
        // this.physics.pause();

        // player.setTint(0xff0000);

        // player.anims.play('turn');

        // this.time.delayedCall(2000, () => {
        //     this.scene.start('GameOver');
        // });

        this.score = 0;
    }

    releaseBomb() {
        var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
        var bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}
