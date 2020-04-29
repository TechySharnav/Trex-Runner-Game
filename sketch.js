//Create variables for Trex 
var trex, trex_running, trex_collided;

//Create variables for Ground 
var ground, invisibleGround, groundImage;

//Cloud Variables
var CloudsGroup, cloudImage;

//Obstacle Variables
var ObstaclesGroup, Obstacle1, Obstacle2, Obstacle3, Obstacle4, Obstacle5, Obstacle6;

//Score Variable
var Score = 0;

//GameState Variables
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//GAme Over & Restart Variable
var gameOverImg, restartImg;
var GameOver, restart;

//Sound Variables
var collide_sound, jump_sound, checkPoint_sound;

function preload() {
  //Load Trex Running and Collided Animation
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");

  //Add Animation to ground
  groundImage = loadImage("ground2.png");

  //Load Cloud Animation
  cloudImage = loadImage("cloud.png");

  //Load Obstacle Animation
  Obstacle1 = loadImage("obstacle1.png");
  Obstacle2 = loadImage("obstacle2.png");
  Obstacle3 = loadImage("obstacle3.png");
  Obstacle4 = loadImage("obstacle4.png");
  Obstacle5 = loadImage("obstacle5.png");
  Obstacle6 = loadImage("obstacle6.png");

  //Add Animation to Game Over text and Restart Button
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  //Load SFX
  collide_sound = loadSound('collide.mp3');
  jump_sound = loadSound('jump.mp3');
  checkPoint_sound = loadSound('checkPoint.mp3');
  
}

function setup() {
  createCanvas(600, 200);

  //Create Trex Sprite
  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("Collided", trex_collided);
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,35);
  
  //Create Ground Sprite
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2
  ground.velocityX = -4;

  //Create Invisible Ground
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  CloudsGroup = new Group();
  ObstaclesGroup = new Group();

  GameOver = createSprite(300, 100, 150, 100);
  restart = createSprite(300, 140, 20, 20);

  GameOver.addImage(gameOverImg);
  restart.addImage(restartImg);

  GameOver.scale = 0.5;
  restart.scale = 0.5;

  GameOver.visible = false;
  restart.visible = false;
}

function draw() {
  background(180);

  //Display Score
  text("Score: " + Score, 500, 50);

  //Make Invisible Ground support Trex
    trex.collide(invisibleGround);  
  
  if (gameState === PLAY) {
    Score = Score + Math.round(getFrameRate() / 60);

    console.log(trex.y);
    
    //Make Trex Jump
    if (keyDown("space") && trex.y > 161) {
      jump_sound.play();
      trex.velocityY = -12;
    }

  ground.velocityX = -(6 + 3 * Score/100);
    
    if(Score % 100 === 0 && Score>0){
      checkPoint_sound.play();
    }
    
    //Make Trex Fall after Jumping
    trex.velocityY = trex.velocityY + 0.8;

    //Reset ground After Moving out of Screen
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    spawnClouds();
    spawnObstacle();

    if (trex.isTouching(ObstaclesGroup)) {
      collide_sound.play();
      trex.velocityY = 0;
      gameState  = END;
    }
  } 
  
  else if (gameState === END) {
    
  trex.changeAnimation("Collided", trex_collided);
    
  GameOver.visible = true;
  restart.visible = true;

  ground.velocityX = 0;
  ObstaclesGroup.setVelocityXEach(0);
  CloudsGroup.setVelocityXEach(0);
  
    
  ObstaclesGroup.setLifetimeEach(-1);
  CloudsGroup.setLifetimeEach(-1);   
    
  if(mousePressedOver(restart)){
    reset();
   }
 }
  
  drawSprites();
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage("cloud", cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    cloud.lifetime = 200;

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;


    CloudsGroup.add(cloud);
  }
}

function spawnObstacle() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 100);
    obstacle.velocityX = -(6 + 3 * Score/100);

    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage("obstacle1", Obstacle1);
        break;
      case 2:
        obstacle.addImage("obstacle2", Obstacle2);
        break;
      case 3:
        obstacle.addImage("obstacle3", Obstacle3);
        break;
      case 4:
        obstacle.addImage("obstacle4", Obstacle4);
        break;
      case 5:
        obstacle.addImage("obstacle5", Obstacle5);
        break;
      case 6:
        obstacle.addImage("obstacle6", Obstacle6);
        break;
      default:
        break;
    }

    obstacle.scale = 0.5;
    obstacle.lifetime = 100;

    
    obstacle.depth = trex.depth;
    trex.depth = obstacle.depth + 1;

    ObstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  
  GameOver.visible = false;
  restart.visible = false;  
  
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  Score = 0;
}