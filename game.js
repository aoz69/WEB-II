var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var lastPressed = false;



//------------------------------------------All the variables from this point are user made------------------------------------------
var start;
var HP = 3;	//health points
var hooman; //Player
var Missiles = []; // All the Missiles generated
var MovementIncrese = 1; // speed multiplier to increase difficulty
var PlayTime = 0; // game played time
var GameOver = false; // defines game state 
var Points = 0; // game Points
var sky;		//sky
var hoomanHit = false; // hooman animation when hit
var life; // Life/Health HUD
var PlayerShoot = false; // hooman animation when fired arrow
var Movements = [];
var high;
var LeftSpeed = [];
var DownSpeed = [];
//-----------------------------------------------------------------------------------------------------------------------------------



//---------------------The following function is to create missile---------------------------------------------------------------------------------------------------------------
function MissileSpawn()
	{
		var missile = document.createElement('div');
		missile.className = 'bomb';
		document.body.appendChild(missile);
		respawn(missile);
		Missiles.push(missile);
		LeftSpeed.push(0);
		DownSpeed.push(1);
	}
//---------------------------------------------------------------------------------------------------------------------------------------------------------

function respawn (missile)
{
	var ScreenWidth = window.innerWidth;
	var RandoWidth = Math.ceil(Math.random() * ScreenWidth);
	var RandoHeight = Math.random() * (1000)+ 1;
	missile.style.top = -1 * RandoHeight + 'px';
	missile.style.left = RandoWidth + 'px';
}

//---------------------The following function is stop game after death and displays score--------------------------------------------------------------------------------------------------------------

function Die() {
	GameOver = true;			//sets game over state to true if player dies 
	player.className = 'character dead';
	var RestartBtn = document.createElement('div');
	RestartBtn.className = 'start';
	var DeadPromt = document.createTextNode('Oops you died, Restart?');	//promts when player dies
	RestartBtn.appendChild(DeadPromt);
	RestartBtn.addEventListener('click', () => location.reload());
	document.body.appendChild(RestartBtn);

//---------------------------------the following bock of code is for score board--------------------------------------------------------------------------------------------------------
	var ProPlayer = localStorage.key(0);
	var MaxPoints = parseInt(localStorage.getItem(ProPlayer)); 	//stores score point 
	var MaxPoint = document.createElement('div');	//creates a div for score board
    document.body.appendChild(MaxPoint);
    MaxPoint.className = 'Points';	//assigns class name as Points
    if (!MaxPoints || Points > MaxPoints) 
	{
        localStorage.clear();
        var PlayerName = prompt("You've scored the highest, save your score with a name");		//asks player name if new score is set
        ProPlayer = PlayerName;		//changes player name
        MaxPoints = Points;	//changes player gained score
    }
    localStorage.setItem(ProPlayer, MaxPoints);		//stores player name and score
    MaxPoint.innerHTML = 'Player Name: ' + ProPlayer + '<br> ' + 'HighScore: ' + MaxPoints;	//shows player name and score at the end (after dying)
	return;
//---------------------------------------------------------------------------------------------------------------------------------------------------------
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------------------------------------------
function RainBomb() 	
	{
		// in case of game over do nothing 
		if (GameOver) 
		{
			return;
		}
		// Sets gameTime to 0 and change speed multiplayer
		if (PlayTime > 100)
		{
		if(MovementIncrese < 7) 
			{
				for (var i = 0; i < 5; i++) 
				{
					MissileSpawn();	//creates more bomb
				}
				MovementIncrese = MovementIncrese + 0.75;
				PlayTime = 0;
			}
		}
		// increment Play Time

//---------------The following block of code drops bomb and increase top axis for randmoness-------------
		for (var i = 0; i < Missiles.length; i++) 
		{
			var BombTopPos = parseFloat(Missiles[i].offsetTop);
			ExplodeMissile = Math.floor(Math.random() * (window.innerHeight - sky[0].offsetHeight)) + sky[0].offsetHeight;
//-------Explode bomb upon dropping on grass or bottom of the screen--------------------------------
			if (Missiles[i].offsetTop == ExplodeMissile || Missiles[i].offsetTop > window.innerHeight) 
			{
				BombBoom(Missiles[i]);
				respawn(Missiles [i]);
				SpeedLeft(i);
				DownSpeed[i] =((Math.ceil(Math.random() * 2))) +1;
			} 
			else
			{
				if (ElementCollide(hooman, Missiles[i]) != 0) 
				{
					
					BombBoom(Missiles[i]);	// if missile hits player explode the bomb
					respawn(Missiles [i]);	// reset the exploded missile's pos and respawn
					SpeedLeft(i);
					DownSpeed[i] =((Math.ceil(Math.random() * 2))) +1;

				}
				else 
				{
					var TopPos = BombTopPos + DownSpeed[i] * MovementIncrese;
					var LeftPos = parseFloat(Missiles[i].offsetLeft);
					Missiles[i].style.top = TopPos + 'px';
					if (LeftPos > window.innerWidth - Missiles[i].offsetWidth || LeftPos < 0) 
					{
						SpeedLeft(i);
					}
					Missiles[i].style.left = LeftPos + LeftSpeed[i] + 'px';
				}
			}
		}
	}

// -------------------------------------- upon collision of arrow and missile, missile disappears and grants 2 pts as to player--------------------------- 





//--------------------------------this function is for collision--------------------------------------------------------------------------------------------------------------------

function ElementCollide(ElementA, ElementB) 
	{
	//to detect height,width and top/left of an object for collision
		if (ElementA.offsetTop <  ElementB.offsetTop + ElementB.offsetHeight)
		{
			if( ElementA.offsetTop + ElementA.offsetHeight > ElementB.offsetTop)
			{
		 		if(ElementA.offsetLeft < ElementB.offsetLeft + ElementB.offsetWidth)
		  		{
		   			if(ElementA.offsetLeft + ElementA.offsetWidth > ElementB.offsetLeft)
					{
						return true;
					}
				}
			}
		}		
		return false;
	}


//---------------------------------------------------------------------------------------------------------------------------------------------------------



function ArrowPew (arrows, FirInterval) {
	var  ArrowPosTop = arrows.offsetTop;
	arrows.style.top = ArrowPosTop - 1 + 'px';
	
	for (var i = 0; i < Missiles.length; i++) 
	{
		if (ElementCollide(Missiles[i], arrows)) 
		{
			arrows.remove();		//removes arrow
			PlayTime = PlayTime + 2;		//calculates gameplay timers		
			respawn(Missiles [i]);	//respawns bomb's position
			SpeedLeft(i);
			DownSpeed[i] =((Math.ceil(Math.random() * 2))) +1;
			Points = Points + 10;			//updates the Points with arrow collides
			high.innerHTML = 'Points:' + Points;
			clearInterval(FirInterval);
		} 

		if (ArrowPosTop < 0) // removes arrow if arrow goes outside the screen
		{
			arrows.remove();
			clearInterval(FirInterval);
		}
	}
}


function pewpew()
	{
	var arrows = document.createElement('div');
	hooman.classList.add('fire');
	arrows.className = 'arrow up';
	document.body.appendChild(arrows);
	arrows.style.top = hooman.offsetTop + 'px';
	arrows.style.left = hooman.offsetLeft + 'px';
	// 500ms cooldown
	PlayerShoot = true;
	setTimeout(
		function ()
		{
			hooman.classList.remove('fire');
			PlayerShoot = false;
		}, 500);
	//shoots arrow in upwards direction
	var FirInterval = setInterval(
		function () 
		{
		ArrowPew(arrows, FirInterval)
		}
		, 10);
	}
//---------------------------------------------------------------------------------------------------------------------------------------------------------



//------------------------------------------All the function is to detect bomb location and explode it causing hp loss.----------------------------

function BombBoom(bomb) 
	{
		var explosion = document.createElement('div');
		explosion.className = 'explosion';
		document.body.appendChild(explosion);
		explosion.style.top = bomb.offsetTop + 'px';
		explosion.style.left = bomb.offsetLeft + 'px';
	
		console.log("kool222")
		if (ElementCollide(hooman, explosion))
		{
			console.log("kool")
			hoomanHit = true; //sets player collision to true 
			hooman.classList.add('hit'); 	//plays human's animation when hit
			HP--; //decrease one health point
			life[0].remove(); //removes life from top left of the screen
			if (HP == 0) //if all 3 lives are gone call die function
			{
				Die();
			} 
			setTimeout(function () 
			{
				hoomanHit = false; //sets player's state to normal
				hooman.classList.remove('hit');	//also removes the hit animation
			}, 1000);
		} 
		else
		{
			high.innerHTML = 'Points:' + Points;
			Points = Points + 5; //if player didnt get hit increment score points
			PlayTime++;	//increment play time
		}
		setTimeout(function () 
		{
			explosion.remove(); //explosion is removed after 100ms
		}, 100);
	}
//---------------------------------------------------------------------------------------------------------------------------------------------------------



//----------------------------------The following function is for giving random speed in  random direction-----------------------------------------------------------------------------------------------------------------------

function SpeedLeft(Index)
{
	var rando = Math.floor(Math.random() * 2 );
	if (rando == 0) 
	{
		LeftSpeed[Index] = ((Math.ceil(Math.random() * 3)));
	} 
	else 
	{
		LeftSpeed[Index] =((Math.ceil(Math.random() * 3))) *  -1;
	}

}
//---------------------------------------------------------------------------------------------------------------------------------------------------------


function startGame() {
	start[0].style.display = 'none';
	move();
	RainBomb();
}
 
function keyup(event) {
	if (GameOver) {
		return;
	}
	if (event.keyCode == 37) {
		leftPressed = false;
		lastPressed = 'left';
	}
	if (event.keyCode == 39) {
		rightPressed = false;
		lastPressed = 'right';
	}
	if (event.keyCode == 38) {
		upPressed = false;
		lastPressed = 'up';
	}
	if (event.keyCode == 40) {
		downPressed = false;
		lastPressed = 'down';
	}

	hooman.className = 'character stand ' + lastPressed;
}

function move() {
	if (GameOver || PlayerShoot) {
		return;
	}
	var positionLeft = hooman.offsetLeft;
	var positionTop = hooman.offsetTop;

	if (downPressed) {
		if (hooman.offsetTop < window.innerHeight - 30) {
			var TopPos = positionTop + 2;
			hooman.style.top = TopPos + 'px';
		}


		if (leftPressed == false) {
			if (rightPressed == false && !hoomanHit) {
				hooman.className = 'character walk down';
			}
		}
	}
	if (upPressed) {
		var TopPos = positionTop - 2;
		var element = document.elementFromPoint(0, TopPos);
		if (element.classList.contains('sky') == false) {
			hooman.style.top = TopPos + 'px';
		}

		if (leftPressed == false) {
			if (rightPressed == false && !hoomanHit) {
				hooman.className = 'character walk up';
			}
		}
	}
	if (leftPressed) {
		var newLeft = positionLeft - 2;
		if (newLeft > 0) {
			hooman.style.left = newLeft + 'px';
		}

		if (!hoomanHit) { hooman.className = 'character walk left'; }
	}
	if (rightPressed) {
		var newLeft = positionLeft + 2;

		var element = document.elementFromPoint(0, hooman.offsetTop);
		if (newLeft < window.innerWidth - hooman.offsetWidth) {
			hooman.style.left = newLeft + 'px';
		}
		if (!hoomanHit) {
			hooman.className = 'character walk right';
		}

	}

}

function keydown(event) {
	if (GameOver || PlayerShoot) {
		return;
	}
	if (event.keyCode == 32) {
		pewpew();
	}
	if (event.keyCode == 37) {
		leftPressed = true;
	}
	if (event.keyCode == 39) {
		rightPressed = true;
	}
	if (event.keyCode == 38) {
		upPressed = true;
	}
	if (event.keyCode == 40) {
		downPressed = true;
	}
}

// keeps on calling start game function 60times/1sec
function timerola (){
	setInterval(startGame,1000/60);
}

// after the page is loaded gets hooman calls 30 bombs 
function myLoadFunction() {
	high = document.createElement('div');
	high.className = 'Points';
	document.body.appendChild(high);
	hooman = document.getElementById('player');
	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);
	start = document.getElementsByClassName('start');
	start[0].addEventListener('click', timerola);
	sky = document.getElementsByClassName('sky');
	for (var i = 0; i < 30; i++) {
		MissileSpawn();
	}
	life = document.getElementsByClassName('health')[0].getElementsByTagName('li');

}

document.addEventListener('DOMContentLoaded', myLoadFunction);
