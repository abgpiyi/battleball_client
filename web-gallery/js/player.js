function Player(id, x, y, z, rot, name, look)
{
  this.id = id;
  this.x = x;
  this.y = y;
  this.z = z;
  this.rot = rot;
  this.name = name;
  this.look = look;
  this.targetX = x + 1;
  this.targetY = y + 1;
  this.ready = false;
  this.elapsedTime = 0;
  this.walkFrame = 0;
  this.sprites = new Sprites();
}

Player.prototype.prepare = function() {
  return new Promise(function (resolve, reject) {

    var p = this.loadSprites();

    Promise.all(p).then(function (loaded) {
      console.log("Sprites loaded");
      this.ready = true;
      resolve();
    }.bind(this),

    function (error) {
      console.log("Error loading sprites: " + error);
      reject("Error loading sprites: " + error);
    }.bind(this));

  }.bind(this));
};

Player.prototype.loadSprites = function() {
  return [
    this.sprites.loadAllSimpleAvatar("simple", this.look),
    this.sprites.loadAllWalkingAvatar("walking", this.look)
  ];
};

Player.prototype.isWalking = function() {
  return (this.x != this.targetX || this.y != this.targetY);
};

Player.prototype.currentSprite = function() {
  if (this.isWalking()) {
    return this.sprites.getImage('walking_' + this.rot + "_" + this.walkFrame);
  }
  return this.sprites.getImage('simple_' + this.rot);
};

Player.prototype.nextWalkFrame = function() {
  this.walkFrame++;
  if (this.walkFrame >= 4) {
    this.walkFrame = 0;
  }
}

Player.prototype.tick = function(delta) {
  this.elapsedTime += delta;
  if (this.elapsedTime >= 125) {
    this.nextWalkFrame();
    this.elapsedTime = 0;
  }
}

Player.prototype.draw = function(finalX, finalY) {


};