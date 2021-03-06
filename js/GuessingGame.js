
//random number generator
function generateWinningNumber(){
   return Math.floor(Math.random()*100) +1;
}


//shuffle the winning number for every game
function shuffle(arr){
    var arrLength = arr.length;
    var t;
    var i;

    // While there remain elements to shuffle…
    while(arrLength) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * arrLength--);

        // And swap it with the current element.
        t = arr[arrLength];
        arr[arrLength] = arr[i];
        arr[i] = t;
    }
    return arr;
}

//Game constructor function
function Game(){
    //players current guess
    this.playersGuess = null;

    //players past guesses as an array
    this.pastGuesses = [];

    //method to retrive the winning number
    this.winningNumber = generateWinningNumber();
}


//returns the abolute value of difference between players guess and winning number
Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}

//checks to see if the players guess is less than the winning number
Game.prototype.isLower = function(){
    if(this.playersGuess - this.winningNumber < 0){
        return true;
    } else {
        return false;
    }
}


//assigns the players guess to this.playersGuess
Game.prototype.playersGuessSubmission = function(num){
   if(num < 1 || num > 100 || typeof(num) !== "number") {
       throw "That is an invalid guess."
   } else {
        this.playersGuess = num;
   } 
   return this.checkGuess();   
}


//checks the guesses and provides feedback

Game.prototype.checkGuess = function() {
    if(this.playersGuess===this.winningNumber) {
        $('#hint, #submit').prop("disabled",true);
        $('#subtitle').text("Press the Reset button to play again!")
        return 'You Win!'
    }
    else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return 'You have already guessed that number.';
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                $('#hint, #submit').prop("disabled",true);
                $('#subtitle').text("Press the Reset button to play again!")
                return 'You Lose.';
            }
            else {
                var diff = this.difference();
                if(this.isLower()) {
                    $('#subtitle').text("Guess Higher!")
                } else {
                    $('#subtitle').text("Guess Lower!")
                }
                if(diff < 10) return'You\'re burning up!';
                else if(diff < 25) return'You\'re lukewarm.';
                else if(diff < 50) return'You\'re a bit chilly.';
                else return'You\'re ice cold!';
            }
        }
    }
}
// Game.prototype.checkGuess = function(){
//     console.log(this.difference())
    
//     if(this.playersGuess === this.winningNumber){
//         $('#hint, #submit').prop("disabled",true);
//         $('#subtitle').text("Press the Reset button to play again!")
//         return 'You Win!';
//     } else if(this.pastGuesses.indexOf(this.playersGuess)> -1){
//         return 'You have already guessed that number.';
//     } else if(this.pastGuesses.length < 4){
//         this.pastGuesses.push(this.playersGuess);
//         $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
//     } else if(this.pastGuesses.length === 4){
//         $('#hint, #submit').prop("disabled",true);
//         $('#subtitle').text("Press the Reset button to play again!")
//         return 'You Lose.';
//     } 
    
//     if(this.difference() < 10){
//         return 'You\'re burning up!';
//     } else if(this.difference() < 25){
//         return 'You\'re lukewarm.'
//     } else if(this.difference() < 50){
//         return 'You\'re a bit chilly.'
//     } else if(this.difference() < 100){
//         return 'You\'re ice cold!';
//     }
// }

//creates an instance of the new game
function newGame(){
    return new Game();
}


//hint provides 3 numbers (one of them is the winning number) and return arr is shuffled
Game.prototype.provideHint = function(){
    var arr =[this.winningNumber];
    for(var i =0; i< 2; i++){
        arr.push(generateWinningNumber());
    }
    return shuffle(arr);
}

function makeAGuess(game) {
    var guess = $('#player-input').val();
    $('#player-input').val("");
    $('#title').text(game.playersGuessSubmission(parseInt(guess,10)));
}


$(document).ready(function() {
    var game = new Game();

    $('#go-button').click(function(e) {
       makeAGuess(game);
    })

    $('#player-input').keypress(function(event) {
        if ( event.which == 13 ) {
           makeAGuess(game);
        }
    })

    $('#hint').click(function() {
        var hints = game.provideHint();
        $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    });
    
    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!')
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled",false);
    })
})

