Sprites.LOCAL_RESOURCES_URL = "./web-gallery/assets/";
Sprites.EXTERNAL_FURNITURE_URL = "./hof_furni/";
Sprites.EXTERNAL_IMAGER_URL = "./avatarimage.php?figure=";

DrawableSprite.PRIORITY_DOOR_FLOOR = 1;
DrawableSprite.PRIORITY_DOOR_FLOOR_SELECT = 2;
DrawableSprite.PRIORITY_DOOR_FLOOR_PLAYER_SHADOW = 3;
DrawableSprite.PRIORITY_DOOR_FLOOR_PLAYER = 4;
DrawableSprite.PRIORITY_DOOR_WALL = 5;
DrawableSprite.PRIORITY_WALL = 6;
DrawableSprite.PRIORITY_FLOOR = 7;
DrawableSprite.PRIORITY_PLAYER_SHADOW = 8;
DrawableSprite.PRIORITY_FLOOR_SELECT = 9;
DrawableSprite.PRIORITY_PLAYER = 10;
DrawableSprite.PRIORITY_FURNI = 10;
DrawableSprite.PRIORITY_SIGN = 11;
DrawableSprite.PRIORITY_CHAT = 12;

Sprites.rgb2int = function(r, g, b) {
  return (r << 16) + (g << 8) + (b);
};

function Sprites() {
  this.images = {};
  this.silhouettes = {};
  this.colorR = this.random(0, 255);
  this.colorG = this.random(0, 255);
  this.colorB = this.random(0, 255);
  this.colorId = Sprites.rgb2int(this.colorR, this.colorG, this.colorB);
};

Sprites.prototype.random = function(min, max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
};

Sprites.prototype.loadImage = function (key, src) {
    var img = new Image();
    var d = new Promise(function (resolve, reject) {
        img.onload = function () {
            this.images[key] = img;
            this.silhouettes[key] = this.generateSilhouette(img, this.colorR, this.colorG, this.colorB);
            resolve(img);
        }.bind(this);

        img.onerror = function () {
            reject('Could not load image: ' + src);
        };
    }.bind(this));

    img.src = src;
    return d;
};

Sprites.prototype.getImage = function (key) {
    return (key in this.images) ? this.images[key] : null;
};

Sprites.prototype.getSilhouette = function (key) {
    return (key in this.silhouettes) ? this.silhouettes[key] : null;
};

Sprites.prototype.loadFurniAsset = function(asset, key) {
  var totalUrl = Sprites.EXTERNAL_FURNITURE_URL + asset + "/" + key + ".png";
  return this.loadImage(key, totalUrl);
};

Sprites.prototype.loadSimpleAvatar = function (key, look, direction) {
  var totalUrl = Sprites.EXTERNAL_IMAGER_URL + look + '&direction=' + direction + '&head_direction=' + direction;
  return this.loadImage(key, totalUrl);
};

Sprites.prototype.loadWavingAvatar = function (key, look, direction, frame) {
  var totalUrl = Sprites.EXTERNAL_IMAGER_URL + look + '&direction=' + direction + '&head_direction=' + direction + '&action=wav&frame=' + (frame);
  return this.loadImage(key, totalUrl);
};

Sprites.prototype.loadWalkingAvatar = function (key, look, direction, frame) {
  var totalUrl = Sprites.EXTERNAL_IMAGER_URL + look + '&direction=' + direction + '&head_direction=' + direction + '&action=wlk&frame=' + (frame);
  return this.loadImage(key, totalUrl);
};

Sprites.prototype.loadHeadAvatar = function(key, look) {
  var totalUrl = Sprites.EXTERNAL_IMAGER_URL + look + '&direction=2&head_direction=2&size=s&headonly=1';
  return this.loadImage(key, totalUrl);
};

Sprites.prototype.loadAllSimpleAvatar = function (key, look) {
  var p = [];
  for (var i = 0; i <= 7; i++) {
      p.push(this.loadSimpleAvatar(key + "_" + i, look, i));
  }
  return Promise.all(p);
}

Sprites.prototype.loadAllWalkingAvatar = function (key, look) {
  var p = [];
  for (var i = 0; i <= 7; i++) {
    for (var j = 0; j <= 3; j++) {
      p.push(this.loadWalkingAvatar(key + "_" + i + "_" + j, look, i, j));
    }
  }
  return Promise.all(p);
}

Sprites.prototype.loadAllWavingAvatar = function(key, look) {
  var p = [];
  for (var i = 0; i <= 7; i++) {
    for (var j = 0; j <= 1; j++) {
      p.push(this.loadWavingAvatar(key + "_" + i + "_" + j, look, i, j));
    }
  }
  return Promise.all(p);
};

Sprites.prototype.generateSilhouette = function(img, r, g, b) {
  var element = document.createElement('canvas');
  var c = element.getContext("2d");

  var width = img.width;
  var height = img.height;

  element.width = width;
  element.height = height;

  c.drawImage(img, 0, 0);
  var imageData = c.getImageData(0, 0, width, height);
  for (var y = 0; y < height; y++) {
    var inpos = y * width * 4;
    for (var x = 0; x < width; x++) {
      var pr = imageData.data[inpos++];
      var pg = imageData.data[inpos++];
      var pb = imageData.data[inpos++];
      var pa = imageData.data[inpos++];
      if (pa != 0) {
        imageData.data[inpos - 2] = b; //B
        imageData.data[inpos - 3] = g; //G
        imageData.data[inpos - 4] = r; //R
      }
    }
  }
  c.putImageData(imageData, 0, 0);
  return element;
};

function DrawableSprite(sprite, selectableSprite, screenX, screenY, priority) {
  this.sprite = sprite;
  this.selectableSprite = selectableSprite;
  this.screenX = screenX;
  this.screenY = screenY;
  this.priority = priority;
}

DrawableSprite.prototype.getScreenX = function() {
  return this.screenX;
};

DrawableSprite.prototype.getScreenY = function() {
  return this.screenY;
};

DrawableSprite.prototype.getComparableItem = function() {
  return this.screenY;
};

function IsometricDrawableSprite(sprite, selectableSprite, mapX, mapY, mapZ, offsetX, offsetY, priority) {
  DrawableSprite.call(this, sprite, selectableSprite, 0, 0, priority);
  this.mapX = mapX;
  this.mapY = mapY;
  this.mapZ = mapZ;
  this.offsetX = offsetX;
  this.offsetY = offsetY;
}

IsometricDrawableSprite.prototype.getScreenX = function() {
  return (this.mapX - this.mapY) * (Game.TILE_W / 2) + this.offsetX;
};

IsometricDrawableSprite.prototype.getScreenY = function() {
  return (this.mapX + this.mapY) * (Game.TILE_H / 2) + this.offsetY - (this.mapZ * Game.TILE_H);
};

IsometricDrawableSprite.prototype.getComparableItem = function() {
  return (this.mapX + this.mapY) * (Game.TILE_H / 2);
};
