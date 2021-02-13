//variables
var monkey, monkey_running,monkey_collided;
var banana, bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup;
var ground;
var survivalTime = 0;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var woods, woodsImage;

function preload() {

  //Loading animations and images to use
  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png")

  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  monkey_collided = loadAnimation("sprite_0.png");
  woodsImage = loadImage("background.png");
}



function setup() {
  createCanvas(700, 300);
  //creating the background
  
  woods = createSprite(350,150,700,300);
  woods.velocityX = -4;
  woods.addImage(woodsImage);
  woods.scale = 0.7;
  
  //creating empty groups
  FoodGroup = new Group();
  obstacleGroup = new Group();

  //creating monkey and adding animation to it
  monkey = createSprite(50, 230, 20, 50);
  monkey.addAnimation('PlayStateMonkey', monkey_running);
  monkey.addAnimation('collided', monkey_collided);
  monkey.scale = 0.12;

  ground = createSprite(350, 280, 900, 40);
  ground.velocityX = -4;
  ground.x = ground.width / 2;
  ground.visible = false;

  monkey.setCollider("rectangle", 0, 0, monkey.width, monkey.height);
}


function draw() {
background('lightBlue');
  if (gameState == PLAY) {
    //creating the suvival time
    stroke("black");
    textSize(20);
    fill("black");
    // distance/speed = time
    survivalTime = Math.ceil(frameCount / frameRate())
    text("Survival Time: " + survivalTime, 10, 20);

    //giving ground color and reseting it 
    ground.shapeColor = "green";
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if(woods.x<0){
      woods.x = woods.width/2;
    }

    if (FoodGroup.isTouching(monkey)) {
      FoodGroup.destroyEach();
      monkey.scale =  monkey.scale + 0.02;
      score = score + 2;
    }

    spawnFood();
    spawnObstacles();

    //making monkey collide with the ground
    monkey.collide(ground);

    //making monkey jump
    if (keyDown("space") && monkey.y >= 100) {
      monkey.velocityY = -12;
    }

    //adding gravity
    monkey.velocityY = monkey.velocityY + 0.8;


    if (obstacleGroup.collide(monkey)) {
      obstacleGroup.destroyEach();
      monkey.scale = 0.12;
    }
  }

  if (gameState == END) {
    //FoodGroup.destroyEach();
    //obstacleGroup.destroyEach();
    ground.x = 350;
    textSize(20);
    fill("red");
    text("Game Over!!", 300,150);
    monkey.changeAnimation('collided', monkey_collided);
    //set velcity of each game object to 0
    ground.velocityX = 0;
    monkey.velocityY = 0;
     monkey.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    FoodGroup.setVelocityXEach(0);
  

    //set lifetime of the game objects so that they are never destroyed
    obstacleGroup.setLifetimeEach(-1);
    FoodGroup.setLifetimeEach(-1);
    
  }

  monkey.collide(ground);
  drawSprites();
  
    stroke("black");
  textSize(20);
  fill("black");
  text("score: " + score, 610, 20);

  // distance/speed = time
  text("Survival Time: " + survivalTime, 10, 20);
}

//func to create bananas every 80 frames 
function spawnFood() {
  if (frameCount % 80 === 0) {
    var banana = createSprite(600, 120, 10, 20);
    banana.y = Math.round(random(120, 200));
    banana.addImage(bananaImage);

    banana.y = Math.round(random(120, 200));
    banana.velocityX = -(7 + score / 4);
    banana.setLifetime = 100;

    banana.scale = 0.12;

    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;

    FoodGroup.add(banana);
  }
}

//func to create obstacles(rock) every 300 frames
function spawnObstacles() {
  if (frameCount % 300 === 0) {
    var obstacle = createSprite(600, 240, 10, 20);
    obstacle.x = Math.round(random(400, 600));
    obstacle.addImage(obstacleImage);
    obstacle.velocityX = -3;
    obstacle.lifetime = 700;
    obstacle.scale = 0.12;

    obstacle.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;

    obstacleGroup.add(obstacle);
  }
}