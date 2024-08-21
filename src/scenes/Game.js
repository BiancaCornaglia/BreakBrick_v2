import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    init(data) {
      this.score = 0;
      this.ballspeed = data.ballspeed || 300;
    }
    create() {
      //crear paleta como rectangulo
      this.paddle = this.add.rectangle(400, 700, 100, 20, 0x6666ff);
      //fisicas
      this.physics.add.existing(this.paddle);
      this.paddle.body.setImmovable(true);
      this.paddle.body.setCollideWorldBounds(true);
  
      //crear pelota como circulo
      this.ball = this.add.circle(400, 300, 10, 0xff6666);
      //fisicas
      this.physics.add.existing(this.ball);
      this.ball.body.setCollideWorldBounds(true);
      this.ball.body.setBounce(1, 1);
      this.ball.body.setVelocity(this.ballspeed, this.ballspeed);
  
      //agregar los obstaculos a las fisicas
      this.obstacles = this.physics.add.group();

      for (let i = 0; i < 10; i++) {
        const x = 100 + i * 90; //posición en x
        const y = 80;
        const obstacle = this.add.rectangle(x, y, 60, 10, 0x66ff66);
        this.physics.add.existing(obstacle);
        obstacle.body.setImmovable(true);
        this.obstacles.add(obstacle);
      }
      //agregar configuracion de fisicas al obstaculo
      this.obstacles.children.iterate((obstacle) => {
        this.physics.add.existing(obstacle, true);
  
        obstacle.body.setImmovable(true);
      });
  
      //agregar cursor
      this.cursor = this.input.keyboard.createCursorKeys();
      //reconocimiento del mouse
      this.pointer = this.input.activePointer;

      //colision de la pelota con la paleta
      this.physics.add.collider(this.paddle, this.ball, null, null, this);
  
      //colision de la pelota con el obstaculo
      this.ball.body.onWorldBounds = true;
      this.physics.add.collider(
        this.ball,
        this.obstacles,
        this.handleCollision,
        null,
        this
      );

        //colision de la pelota con el limite inferior
      this.physics.world.on("worldbounds", (body, up, down, left, right) => {
        if (down) {
          console.log("hit bottom");
          this.scene.start("GameOver");
        }
      });

      //se agrega score
      this.textScore = this.add
        .text(this.game.config.width - 10, 10, "0", {
          fontSize: "70px",
          fill: "#fff",
        })
        .setOrigin(1, 0);
    }
  
    update() {
      this.paddle.x = this.pointer.x;
      if (this.cursor.right.isDown) {
        this.paddle.x += 20;
      } else if (this.cursor.left.isDown) {
        this.paddle.x -= 20;
      }
      console.log(this.ballspeed);
    }
  
    handleCollision = (ball, obstacle) => {
      console.log("collision");
      this.score++;
      this.textScore.setText(` ${this.score}`);
      obstacle.destroy();
      if (this.score >= 10) {
        this.ballspeed += this.ballspeed * 0.1;
        this.scene.restart({ ballspeed: this.ballspeed }); //
        console.log("aumento");
      }
    };
  }