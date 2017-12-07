Communication.OUTGOING_LOGIN = 1;
Communication.OUTGOING_REQUEST_MAP = 2;
Communication.OUTGOING_REQUEST_MOVEMENT = 7;
Communication.OUTGOING_REQUEST_CHAT = 9;

Communication.INCOMING_LOGIN_OK = 3;
Communication.INCOMING_MAP_DATA = 4;
Communication.INCOMING_PLAYERS_DATA = 6;
Communication.INCOMING_PLAYER_MOVEMENT = 8;
Communication.INCOMING_CHAT = 10;

function Communication(game) {
  this.game = game;
}

Communication.prototype.doLogin = function(username, look) {
  var message = new ClientMessage(Communication.OUTGOING_LOGIN);
  message.appendString(username);
  message.appendString(look);
  this.game.connection.sendMessage(message);
};

Communication.prototype.requestMap = function() {
  this.game.connection.sendMessage(new ClientMessage(Communication.OUTGOING_REQUEST_MAP));
};

Communication.prototype.requestMovement = function(x, y) {
  var message = new ClientMessage(Communication.OUTGOING_REQUEST_MOVEMENT);
  message.appendInt(x);
  message.appendInt(y);
  this.game.connection.sendMessage(message);
};

Communication.prototype.requestChat = function(chat) {
  if (chat.length > 0) {
    var message = new ClientMessage(Communication.OUTGOING_REQUEST_CHAT);
    message.appendString(chat);
    this.game.connection.sendMessage(message);
  }
};

Communication.prototype.handleMessage = function(data) {
  var request = new ServerMessage(data);
  switch (request.id)
  {
    case Communication.INCOMING_LOGIN_OK:
      this.handleLoggedIn(request);
      break;
    case Communication.INCOMING_MAP_DATA:
      this.handleMap(request);
      break;
    case Communication.INCOMING_PLAYERS_DATA:
      this.handlePlayers(request);
      break;
    case Communication.INCOMING_PLAYER_MOVEMENT:
      this.handleMovement(request);
      break;
    case Communication.INCOMING_CHAT:
      this.handleChat(request);
      break;
  }
};

Communication.prototype.handleLoggedIn = function(request) {
  this.game.onLoggedIn();
};

Communication.prototype.handleMap = function(request) {
  console.log("Received map");
  var cols = request.popInt();
  var rows = request.popInt();
  var doorX = request.popInt();
  var doorY = request.popInt();

  var heightmap = [];
  for (var i = 0; i < cols; i++) {
    heightmap.push([]);
    for (var j = 0; j < rows; j++) {
      heightmap[i].push(request.popInt());
    }
  }

  this.game.setMap(cols, rows, doorX, doorY, heightmap);
};

Communication.prototype.handlePlayers = function(request) {

};

Communication.prototype.handleMovement = function(request) {

};

Communication.prototype.handleChat = function(request) {

};