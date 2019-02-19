// Code goes here

var app = angular.module('scoreKeeper', ['ui.bootstrap','colorpicker.module']);

app.controller('BoardGameController', function() {

  this.isLoadedGame = false;

  // Players array
  this.players = [];
  this.currentPlayerTurn = 1;

  this.checkTurn = function(player) {
    if(player === this.currentPlayerTurn) {
      return true;
    } else {
      return false;
    }
  };

  this.addPoints = function(player, pointInput) {
    if (pointInput !== 'PTS' && parseInt(pointInput) <= 100) {
      pointInput = parseInt(pointInput);
      player.playerScoreHistory.push(pointInput);
      player.playerScore += pointInput;
    }
    if (pointInput === '') {
      pointInput = 0;
      player.playerScoreHistory.push(pointInput);
      player.playerScore += pointInput;
    }
  }

  this.switchTurn = function() {
    this.currentPlayerTurn = this.currentPlayerTurn + 1;
    if (this.currentPlayerTurn > this.players.length) {
      this.currentPlayerTurn = 1;
    }
    for (var i = 0;i<this.players.length;i++) {
      if (this.players[i].isPlayerTurn === true) {
        if (this.players[i + 1] !== undefined) { // this silly if statement prevents the code form looking for an additional players background color
          $('#the-board').css('background', this.players[i + 1].color); // I don't want to use jquery
        }
        this.players[i].isPlayerTurn = false;
      }
      if (this.players[i].playerNumber === this.currentPlayerTurn) {
        $('#the-board').css('background', this.players[i].color); // I don't want to use jquery
        this.players[i].isPlayerTurn = true;
      }
      if (this.currentPlayerTurn > this.players.length) {
        this.players[0].isPlayerTurn = true;
        $('#the-board').css('background', this.players[0].color); // I don't want to use jquery
        this.currentPlayerTurn = 1;
      }
      var inputSelected = '#ptr' + this.currentPlayerTurn;
      $(inputSelected).focus();
    }
  };

  // Add player method
  this.addPlayer = function(playerName) {
    if (playerName !== undefined) {
      var numberOfPlayers = this.players.length;

      // Create the player object
      this.playerInfo = {
        name: playerName,
        color: 'rgb(60, 60, 60)',
        playerNumber: numberOfPlayers + 1,
        playerScore: 0,
        playerScoreHistory: [],
        highestPoint: function(playerScoreHistory) {
          return Math.max.apply(Math, playerScoreHistory);
        },
        lowestPoint: function(playerScoreHistory) {
          return Math.min.apply(Math, playerScoreHistory);
        },
        averagePoint: function(playerScoreHistory) {
          return Math.ceil(this.playerScore / this.playerScoreHistory.length);
        },
        isPlayerTurn: this.checkTurn(numberOfPlayers + 1),
        removePoint: function() {
          var point = this.playerScoreHistory.length - 1;
          this.playerScore = this.playerScore - this.playerScoreHistory[point];
          this.playerScoreHistory.pop();
        }
      };

      // Add to number of players
      this.players.push(this.playerInfo);
    }

  };

  this.toggleDebug = function() {
    $('#debug-console').toggle();
  };

  this.saveData = function() {
    localStorage["players"] = JSON.stringify(this.players);
    localStorage["currentPlayerTurn"] = JSON.stringify(this.currentPlayerTurn);
  };

  this.loadData = function() {
    this.players = JSON.parse(localStorage['players']);
    this.currentPlayerTurn = JSON.parse(localStorage['currentPlayerTurn']);
  };

});

// Reverse array filter
// found this online, not sure how it actually works
app.filter('reverse', function() {
  return function(items) {
    if(typeof items === 'undefined') { return; }
    return angular.isArray(items) ?
      items.slice().reverse() : // If it is an array, split and reverse it
      (items + '').split('').reverse().join(''); // else make it a string (if it isn't already), and reverse it
  };
});