var styleActive = false;
var failedAttemptsImages = new Array('./Hangman Game Over Img/ahorcado6.jpg', './Hangman Game Over Img/ahorcado5.jpg', './Hangman Game Over Img/ahorcado4.jpg', './Hangman Game Over Img/ahorcado3.jpg', './Hangman Game Over Img/ahorcado2.jpg', './Hangman Game Over Img/ahorcado.jpg');
var failedAttempts;
var maxAttempts = 6;
var selectedWord;
var points;

// ------------------- Timer --------------------------------
var startTime;
var timeInterval;
var time = new Date();
//------------------------------------------------------------

var foundWords;
var words = new Array('MANGA',
'ANIME',
'SIU',
'MONOGATARI',
'NARUTO',
'AIZEN',
'MANWHA',
'WEBCOMIC',
'SAITAMA',
'UNMEI');

var hints = new Array('Japanese comic',
'Japanese animation or toons',
'Author of Tower of God',
'Japanese for history and a serie of light novels',
'Manga created by Kishimoto Masashi',
'Main antagonist of Bleach which betrayed the Soul Society',
'Korean comic',
'Online free comics',
'Main character of One-Punch Man',
'Japanese for Fate');

var gameOnGoing = false;

function startStopInterval(start) {
	if (start)
		timeInterval = setInterval(timer, 1000);
	else
		clearInterval(timeInterval);
}

// Dynamically creates the key buttons with upper case values
function createKeyboard() {
	var i;
	var keyCont = document.getElementById('lettersCont');
	
	for (i = 65; i <= 90; i++)
	{
		keyCont.innerHTML = keyCont.innerHTML + ' <div id="letter' + String.fromCharCode(i) + '" class="keyCont keyActive" onclick="tryLetter(letter' + String.fromCharCode(i) + ')">' + String.fromCharCode(i) + '</div>';
	}
}

// New game
function startGame() {	
	if (gameOnGoing)
	{
		// If a game is on course that means that this we'll be a new word
		calcPoints();
	}
	else
	{
		// If not that means that is a totally new game
		startTime = new Date();
		startStopInterval(true);
		points = 0;
		printPoints();
	}
	
	selectedWord = selectWord();	
	
	// If we obtain a word from selectWord() we go on with the game
	if (selectedWord != null)
	{
		gameOnGoing = true;
		document.getElementById('hangedImg').setAttribute('src', 'Hangman Game Over Img/ahorcado7.jpg');
		document.getElementById('startGame').disabled = true;
		document.getElementById('addWord').disabled = true;
		document.getElementById('newWordTextBox').disabled = true;
		document.getElementById('hintCont').innerText = '';
		failedAttempts = 0;
		var timePoints = new Array();
		timePoints = document.getElementsByClassName('specialFixed');
		var letters = new Array();
		letters = document.getElementsByClassName('keyCont');
		
		for(var div in timePoints)
		{
			try
			{
				timePoints[div].style.display = 'block';
			}
			catch(ex){}
		}
		
		// Loop to activate the "keys"
		for(var div in letters)
		{
			try
			{
				letters[div].setAttribute('class', 'keyCont keyActive');
				letters[div].setAttribute('onclick', 'tryLetter(' + letters[div].getAttribute('id') + ')');
			}
			catch(ex){}
		}
		
		defineText();
	}
	else // If selected words is null that means that the game is over and we have won
	{
		gameOnGoing = false;
		startStopInterval(false);
		alert("Congratulations, there are no more words to guess.");
		allowNewGame();
	}
}

function timer() {
	var min;
	var sec;
	
	time = new Date();
	min = time.getMinutes();
	sec = time.getSeconds();
	min=checkTime(min);
	sec=checkTime(sec);
	
	document.getElementById('timeCont').innerText = time.getHours() + ':' + min + ':' + sec;
}

// From w3Schools adds a 0 to seconds a minutes that are 
function checkTime(i)
{
	if (i<10)
	{
		i="0" + i;
	}
	return i;
}

// Function to calculate points - Super Random Points System
function calcPoints() {
	
	var defaultExtra = 1000 * foundWords.length+1;
	
	var dateDif = Math.round(Math.abs((startTime.getTime() - time.getTime())/1000));
	defaultExtra -= dateDif;
	
	if (defaultExtra > 0)
	{
		points += defaultExtra;
	}
	
	if (points > 99999999)
		points = 99999999;
		
	printPoints();
}

// Print points
function printPoints() {
	
	var zeros = '';
	var pointsCont = document.getElementById('pointsCont');
	
	if (points < 100000000)
	{
		// If the points are not the "max" amount we add a 0 until the length is reached
		for (var i = 0; i < 8 - points.toString().length - 1; i++)
			zeros += '0';
			
		pointsCont.innerText = zeros + points;
	}
	else
		pointsCont.innerText = '99999999';
}

// Choose a random word
function selectWord(){
	var randomIndex;
	var allowed;
	
	if (gameOnGoing)
	{
		// If both arrays have the same length it means that there are not words left to guess
		if (foundWords.length == words.length)
		{
			return null;
		}
		else
		{
			// Controlling that we have to guess a word we haven't already guessed
			do 
			{
				allowed = true;
				randomIndex = Math.floor((Math.random()*(words.length)));
				for (var i = 0; i < foundWords.length; i++)
				{
					if (foundWords[i] == words[randomIndex])
						allowed = false;	
				}
			}
			while (!allowed);
			
			return words[randomIndex];
		}
	}
	else
	{
		foundWords = new Array();
		randomIndex = Math.floor((Math.random()*(words.length)));
		return words[randomIndex];
	}
}

// Create the _ _ _ text that will allow the player to know how many letters there are
function defineText() {
	var text = "";
	for(var letter in selectedWord)
	{
		if (selectedWord[letter] != ' ')
			text += '_';
		else
			text += ' ';
	}
	document.getElementById('selectedWord').innerText = text;
	document.getElementById('selectedWord').style.display = 'block';
	
}

// Try a letter chosen by the player
function tryLetter(divId) {
	if (gameOnGoing)
	{
		var finalString;
		var textDiv = document.getElementById('selectedWord');
		var letter = divId.innerText;
		var found = selectedWord.match(letter);
		var indexOf = -1;
		var text;
		var aux;
		
		// If found we'll modify the _ _ _ text
		if (found != null)
		{		
			text = textDiv.innerText;
			
			while (found.length > 0)
			{				
				aux = '';
				finalString = selectedWord.substring(indexOf + 1, selectedWord.length);
				indexOf = finalString.indexOf(letter);

				// Substrings worked really awkward so we'll create the string from zero.
				for (var i = 0; i < text.length; i+=1)
				{
					if (text.charAt(i) == '_' && selectedWord.charAt(i) == letter)
					{
						aux += letter;
						points += 7;
					}
					else
						if (text.charAt(i) != '_')
							aux += text.charAt(i);
						else
							aux += '_';
				}
				printPoints();
				found.pop();
				text = aux;
			}
			
			textDiv.innerText = text;
			
			// If the final text is the same as the selected word it means you've won
			if (text == selectedWord)
			{
				correctAnswer();
			}	
		}
		else
		{
			failedAttempt();
		}
		
		divId.setAttribute('class', 'keyCont keyDisabled');
		divId.setAttribute('onclick', '');
		divId.disabled = true;
	}
}

// Show hint if the player asks for one
function hintShow() {
	var wordCount;

	if (gameOnGoing)
	{
		for (wordCount = 0; wordCount < words.length && words[wordCount] != selectedWord; wordCount++);
		
		if (wordCount < hints.length)
			document.getElementById('hintCont').innerText = hints[wordCount];
		
		failedAttempt();
	}
}

// Change environment details
function changeStyle()
{
	if (!styleActive)
	{
		document.getElementById('extraBGCont').style.backgroundImage = 'url(\"Hangman Game Over Img/hangBanner.png\")';
		document.getElementById('gameMainCont').style.backgroundImage = 'url(\"Hangman Game Over Img/hangBackground.png\")';
		document.body.style.backgroundColor = 'black';
		document.body.style.backgroundImage = 'url(\"Hangman Game Over Img/doubt_back.jpg\")';
		styleActive = true;
	}
	else
	{
		document.getElementById('extraBGCont').style.backgroundImage = '';
		document.getElementById('gameMainCont').style.backgroundImage = '';
		document.body.style.backgroundColor = 'transparent';
		document.body.style.backgroundImage = '';
		styleActive = false;
	}
}

// If the letter was a wrong one we diminish the remaining tries
function failedAttempt() {
	document.getElementById('hangedImg').setAttribute('src', failedAttemptsImages[failedAttempts]);
	failedAttempts++;
	
	// If you reached the max amount of attempts you lose
	if (failedAttempts == maxAttempts)
	{
		document.getElementById('gameOver').style.display = 'block';
		document.getElementById('backShade').style.display = 'block';
		gameOnGoing = false;
		startStopInterval(false);
		setTimeout(allowNewGame, 8000);
	}
}

// After finishing the Game Over we allow the player to create a new one
function allowNewGame() {
	document.getElementById('startGame').disabled = false;
	document.getElementById('addWord').disabled = false	;
	document.getElementById('newWordTextBox').disabled = false;
	document.getElementById('gameOver').style.display = 'none';
	document.getElementById('backShade').style.display = 'none';
}

// If the user completes the word we start with a new one
function correctAnswer() {
	foundWords.push(selectedWord);
	setTimeout(startGame, 1000);
}

// An all-in option, if he is right he pass to a new one, else he'll lose.
function riskWord() {
	if (gameOnGoing && document.getElementById('riskTextBox').value.length > 0)
	{
		if (document.getElementById('riskTextBox').value.toUpperCase() == selectedWord)
		{
			correctAnswer();
			document.getElementById('selectedWord').innerText = document.getElementById('riskTextBox').value.toUpperCase();
			document.getElementById('riskTextBox').value = '';
			points += 500;
			printPoints();
			setTimeout(startGame, 3000);
		}
		else
		{
			failedAttempts = maxAttempts-1;
			failedAttempt();
			document.getElementById('riskTextBox').value = '';
		}
	}
}

// Add a word if there is no game on going
function addNewWord() {
	if (!gameOnGoing)
	{
		var wordToInsertCont = document.getElementById('newWordTextBox');
		var notInNum = true;
		var notInAlready = true;
		
		// Checking that the length of the word is between 3 and 12
		if (wordToInsertCont.value.length > 2 && wordToInsertCont.value.length < 13)
		{
			// Checking if the word is totally a number
			if (isNaN(wordToInsertCont.value))
			{
				// Loop to check if the word is already in the array
				for (var wordsIn in words)
				{
					if (words[wordsIn] == wordToInsertCont.value.toUpperCase())
						notInAlready = false;
				}
				
				if (notInAlready)
				{
					// Second loop to check if there is a number between the letters or something that's not a letter
					for (var i = 0; i < wordToInsertCont.value.length; i++)
					{
						if (!isNaN(wordToInsertCont.value.charAt(i)) || wordToInsertCont.value.fromCharCode(i) < 65 || wordToInsertCont.value.fromCharCode(i) > 90)
							notInNum = false;
					}
					if (notInNum)
					{
						// If everything is alright we add the word and clean de input
						alert("Word added successfully.");
						words.push(wordToInsertCont.value.toUpperCase());
						wordToInsertCont.value = '';
					}
					else
						alert("The word can't contain numbers or symbols.");
				}
				else
					alert("The word is already in the list.");
			}
			else
			{
				alert("The word can't be a number.");
			}
		}
		else
		{
			alert("You must enter a word between 3 and 12 characters.");
		}
	}
}
