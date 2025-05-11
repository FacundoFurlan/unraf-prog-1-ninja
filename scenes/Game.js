// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("game");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}

    this.gameOver = false;
    this.pointArray = [0,0,0];
    this.twoOfEach = false;
    this.points = 0;
    this.moreThan100Points = false;
  }

  preload() {
    // load assets
    this.load.image("sky", "./public/assets/Cielo.webp");
    this.load.image("ninja", "./public/assets/Ninja.png");
    this.load.image("plataforma", "./public/assets/platform.png");
    this.load.image("triangle", "./public/assets/triangle.png");
    this.load.image("square", "./public/assets/square.png");
    this.load.image("bad", "./public/assets/bad.webp");
    this.load.image("diamond", "./public/assets/diamond.png");
  }

  create() {
    // create game objects
    this.add.image(400, 300, "sky").setScale(2).setDepth(-100)

    //NINJA ----------------------------------------------------------
    this.ninja = this.physics.add.image(400, 100, "ninja");
    this.ninja.setScale(0.1)
    this.ninja.setBounce(0.1);
    this.ninja.setCollideWorldBounds(true);
    
    this.cursors = this.input.keyboard.createCursorKeys();
    
    //COLLECTABLES ---------------------------------------------------
    this.collectables = this.physics.add.group();
    this.collectableEvent = this.time.addEvent({
      delay: 500,
      callback: this.updateCollectable,
      callbackScope: this,
      loop: true
    })
    //PLATAFORMAS ----------------------------------------------------
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 600, "plataforma").setScale(2,1).refreshBody();
    this.platforms.create(400, 300, "plataforma").setScale(1,0.5).refreshBody();
    this.platforms.create(50, 450, "plataforma").setScale(1,.5).refreshBody();
    this.platforms.create(750, 450, "plataforma").setScale(1,.5).refreshBody();
    
    
    //TIMERS---------------------------------------------------------
    this.totalTime = 60;
    this.timer = this.add.text(700,16,`${this.totalTime}`, {
      fontSize: "32px",
      fill: "#000"
    });
    this.TimerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    })
    
    //POINTS --------------------------------------------------------
    this.pointTextTriangle = this.add.text(16,16,`T:${this.pointArray[0]} -`)
    this.pointTextSquare = this.add.text(75,16,`S:${this.pointArray[1]} - `)
    this.pointTextDiamond = this.add.text(134,16,`D:${this.pointArray[2]}`)

    this.pointsText = this.add.text(600, 16, `${this.points}`, {
      fontSize: "32px",
      fill: "#000"
    });


    //COLLIDERS -----------------------------------------------------
    this.physics.add.collider(this.ninja, this.platforms)
    this.physics.add.collider(this.collectables, this.platforms, this.onCollectableBounce, null, this)
    this.physics.add.overlap(
      this.ninja,
      this.collectables,
      this.collectSomething,
      null,
      this
    );
    // emmit particles from ninja
    // const emitter = this.add.particles(0, 0, "red", {
    //   speed: 100,
    //   scale: { start: 1, end: 0 },
    //   blendMode: "ADD",
    // });

    // emitter.startFollow(ninja);
  }

  update() {
    // update game objects

    if(!this.gameOver){
      if (this.cursors.left.isDown) {
        this.ninja.setVelocityX(-160);
      } else if (this.cursors.right.isDown) {
        this.ninja.setVelocityX(160);
      } else {
        this.ninja.setVelocityX(0);
      }
  
      if (this.cursors.up.isDown && this.ninja.body.touching.down) {
        this.ninja.setVelocityY(-330);
      }
      if (this.cursors.down.isDown) {
        this.ninja.setVelocityY(this.ninja.body.velocity.y + 10)
      }
    }
  }

  updateTimer(){
    if(!this.gameOver){
      this.totalTime = this.totalTime-1;
      this.timer.setText(`${this.totalTime}`)

      if(this.totalTime <= 0){
        this.finishGame()
      }
    }
  }

  updateCollectable(){
    if(!this.gameOver){
      let kindOfCollectable = "";
      let collectableValue = 0;
      let randomNumber = Phaser.Math.Between(1,4);
      if(randomNumber === 1){
        kindOfCollectable = "triangle"
        collectableValue = 15;
      } else if (randomNumber === 2){
        kindOfCollectable = "square"
        collectableValue = 25;
      } else if (randomNumber === 3){
        kindOfCollectable = "diamond"
        collectableValue = 20;
      }else if (randomNumber === 4){
        kindOfCollectable = "bad"
        collectableValue = -20;
      }
      const collectable = this.collectables.create(Phaser.Math.Between(10,790),0, kindOfCollectable)

      if(kindOfCollectable === "bad"){
        collectable.setScale(.3).refreshBody()
      }

      collectable.type = kindOfCollectable;
      collectable.value = collectableValue;
      collectable.setBounceY(.7);
      collectable.setDepth(-10);
    }
  }

  onCollectableBounce(collectable, platform){
    collectable.value = collectable.value - 5;

    if(collectable.value <= 0){
      collectable.destroy();
    }

  }

  collectSomething(ninja, collectable){
    if(collectable.type === "triangle"){
      this.pointArray = [this.pointArray[0]+1,this.pointArray[1],this.pointArray[2]];
      this.pointTextTriangle.setText(`T:${this.pointArray[0]} -`)
      this.points = this.points + collectable.value;
      this.pointsText.setText(`${this.points}`)

      if(this.pointArray[0] >= 2){
        this.pointTextTriangle.setColor("#55ff00")
      }
    } else if(collectable.type === "square"){
      this.pointArray = [this.pointArray[0],this.pointArray[1]+1,this.pointArray[2]];
      this.pointTextSquare.setText(`S:${this.pointArray[1]} - `)
      this.points = this.points + collectable.value;
      this.pointsText.setText(`${this.points}`)

      if(this.pointArray[1] >= 2){
        this.pointTextSquare.setColor("#55ff00")
      }
    } else if(collectable.type === "diamond"){
      this.pointArray = [this.pointArray[0],this.pointArray[1],this.pointArray[2]+1];
      this.pointTextDiamond.setText(`D:${this.pointArray[2]}`)
      this.points = this.points + collectable.value;
      this.pointsText.setText(`${this.points}`)

      if(this.pointArray[2] >= 2){
        this.pointTextDiamond.setColor("#55ff00")
      }
    } else if(collectable.type === "bad"){
      this.points = this.points + collectable.value;
      this.pointsText.setText(`${this.points}`)
    }

    if(this.pointArray[0] >= 2 && this.pointArray[1] >= 2 && this.pointArray[2] >= 2){
      this.twoOfEach = true;
    }
    if(this.points >= 100){
      this.moreThan100Points = true;
    }

    if(this.twoOfEach && this.moreThan100Points){
      this.finishGame();
    }

    collectable.destroy();
  }

  finishGame(){
    this.physics.pause();
    this.collectableEvent.remove();

    this.gameOver = true;

    const outcome = (this.twoOfEach && this.moreThan100Points) ? 1 : 0;
    this.scene.start("end", { outcome, points: this.points });
  }
}
