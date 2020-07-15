"use strict"

//EN: First, we will create a constants list holding the most common keyboard codes.
//ES: Primero, crearemos una lista de constantes almacenando los códigos de teclado más comunes.
const vk = new CEnginy.keyboard.keycodes;

//EN: Now, load the keyboard control.
//ES: Ahora, carguemos el control del teclado.
let keyboard = new CEnginy.keyboard.control;
//EN: Start the keyboard control.
//ES: Iniciemos el control del teclado.
keyboard.start();


//EN: Start the game config only when window is loaded
//ES: Iniciar la configuración del juego sólo cuando la ventana esté cargada.
window.addEventListener("load", function() {

	//EN: Here, we will get the DOM base elements: The game scene and the camera.
	//As you can see in CSS styles, the game may have a big size, while the
	//camera is a small box.

	//ES: Aquí, obtendremos los elementos base del DOM: La escena del juego y la cámara.
	//Además, como puedes ver en el estilo CSS, la escena del juego puede tener un gran
	//tamaño, mientras que la cámara es una caja pequeña.
	const game_scene   = document.getElementById("game-scene");
	const game_camera  = document.getElementById("game-window");
	const game_pause   = document.getElementById("game-paused");
	const console_div  = document.getElementById("console");
	const score_marker = document.getElementById("score-marker");
	const time_count   = document.getElementById("time-count");

	//A variable where we will hold the time (in seconds) of game.
	let time = 0;

	//EN: With this event listener, we will add a pause/resume functionallity.
	//ES: Con este event listener, agregaremos una funcionalidad de pausa/reanudar.
	window.addEventListener("keydown", function(e) {
		let key = e.which || e.keydown;
		if(key !== "P".charCodeAt(0)) //EN: Check if P key is pressed. ES: Comprobar si se está presionando P
			return;

		//EN: If it is, pause or resume the game loop.
		//ES: Si lo está, pausar o reanudar el ciclo del juego.
		CEnginy.GameLoopEnable = !CEnginy.GameLoopEnable;
		
		if(game_pause.style.display == "")
			game_pause.style.display = "block";
		else
			game_pause.style.display = "";
	});

	//EN: Disallow the right-click menu on the game.
	//ES: Deshabilitar el menú del click derecho en el juego.
	window.addEventListener("contextmenu", function(e) {
		e.preventDefault();
	});


	//EN: Now, we will create a new scene.
	//NOTE: You must not set the scenes as constants
	//(their content will be modified constantly during game)

	//ES: Ahora, crearemos una nueva escena.
	//NOTA: No debes declarar las escenas como constantes.
	//(Su contenido será modificado constantemente durante el juego)
	let Game = new CEnginy.Entity.Scene(game_scene);

		//EN: Set the game update speed to 60 FPS.
		//ES: Establecer la velocidad de actualización del juego a 60 FPS.
		Game.update_speed = 40;

		//EN: A custom property for holding the game score.
		//ES: Una propiedad personalizada para almacenar el puntaje del juego.
		Game.Score = 0;

		//EN: Set an alarm to one second, for augment the time counter.
		//ES: Establecer una alarma a un segundo, para aumentar el contador de tiempo.
		Game.alarm[0] = Game.update_speed;

	//EN: Set a constant list for the sprite assets.
	//This assets are set by their relative URL (from game HTML document).
	//ES: Definimos una lista de constantes para los recursos gráficos.
	//Estos recursos son definidos a partir de su ruta relativa, desde el documento
	//HTML.
	const sprites = {
		player: {
			left: ["sprites/player/player-left.png", "sprites/player/player-left-2.png"],
			right: ["sprites/player/player-right.png", "sprites/player/player-right-2.png"]
		},
		wall: ["sprites/floor.png"],
		door: ["sprites/door.png"],
		enemy: {
			left:  ["sprites/enemy/enemy_left.png", "sprites/enemy/enemy_left_2.png"],
			right: ["sprites/enemy/enemy_right.png", "sprites/enemy/enemy_right_2.png"]
		},
		box: ["sprites/box.png"]
	}

	//EN: Here we are creating the game character prototypes,
	//these are like "molds" for the instances in the game.
	//ES: Aquí estamos creando los prototipos de los personajes del juego.
	//Éstos son como "moldes" para las instancias en el juego.
	let objPlayer = new CEnginy.Entity.Character("player");
	let objEnemy  = new CEnginy.Entity.Character("enemy");
	let objWall   = new CEnginy.Entity.Character("wall");
	let objDoor   = new CEnginy.Entity.Character("wall");
	let objBoxy   = new CEnginy.Entity.Character("wall");


	//EN: Append all character prototypes to room.
	//ES: Adjuntamos todos los prototipos de personaje a la escena.
	Game.appendCharacter(objPlayer);
	Game.appendCharacter(objWall);
	Game.appendCharacter(objDoor);
	Game.appendCharacter(objEnemy);
	Game.appendCharacter(objBoxy);


	//EN: In this part, we will customize all character prototypes.
	//ES: En esta parte, personalizaremos todos los prototipos de personajes.

		//------THIS IS THE PLAYER---------
		//------ÉSTE ES EL JUGADOR---------
		//EN: Set the default engine properties.
		//ES: Definir las propiedades del motor por defecto.
		objPlayer.Proto.solid = false;
		objPlayer.Proto.sprite_index = sprites.player.right;
		objPlayer.Proto.image_speed = 0;
		objPlayer.Proto.gravity = 2;

		//EN: Set the collision mask size.
		//(This size is calculated from the CSS size, by default, but
		//in this case we need to make it smaller).

		//ES: Definir el tamaño de la máscara de colisión.
		//(Este tamaño es calculado desde el tamaño en CSS por defecto, 
		//pero en este caso necesitamos hacerla más pequeña).
		objPlayer.Proto.bbox.left = 4;
		objPlayer.Proto.bbox.right = 28;
		objPlayer.Proto.bbox.top = 16;


		//EN: Set some custom properties for character
		//ES: Definimos algunas propiedades personalizadas para el personaje.

		//EN: This will be the default image_speed value for player,
		//(when it is moving).
		//ES: Esta variable será la velocidad de animación del jugador,
		//cuando se está movientdo.
		objPlayer.Proto.defaultImgspeed = 0.5;

		//EN: This two properties holds the keys that player can use for moving.
		//ES: Estas dos propiedades almacenan las teclas que el jugador podrá
		//usar para moverse.
		objPlayer.Proto.key_left  = [vk.left, "A".charCodeAt(0)];
		objPlayer.Proto.key_right = [vk.right, "D".charCodeAt(0)];

		//EN: This is the horizontal speed of the player (when is moving).
		//ES: Ésta es la velocidad horizontal del jugador (cuando se mueve).
		objPlayer.Proto.h_vel = 5;

		//EN: Prototype step event.
		//This event IS NOT for all character instances, it is
		//just for the character prototype.

		//ES: Evento step prototipo.
		//Este NO ES un evento para todas las instancias; sólo para
		//el personaje prototipo.
		objPlayer.Event.Step = function() {
			//EN: Enable the default engine.
			//In this case, we don't set the step event for all instances
			//from here. (We will set it below).

			//ES: Activamos el motor predefinido.
			//En este caso, no estableceremos el evento step para todas las
			//instancias desde aquí, (lo haremos más adelante).
			CEnginy.Entity.PrototypeEvent(objPlayer, null, true);
		}

		//EN: Here is: We set the step event of all instances.
		//This event takes one parameter: The current instance that
		//event is working with.

		//ES: Aquí es: Establecemos el evento step para todas las instancias.
		//Este evento toma un parámetro: La instancia actual con la que el evento
		//está trabajando.
		objPlayer.Proto.Event.Step = function(e) {
			//EN: The 'e' variable holds the current player instance.
			//ES: La variable 'e' almacena la instancia actual del jugador.

			//EN: This is a small movement system using keys.
			//ES: Este es un pequeño sistema de movimiento usando teclas.
			let move_left  = false; //EN: The left key is being pressed? ES: ¿La tecla izquierda se ha presionado?
			let move_right = false; //EN: The right key is being pressed? ES: ¿La tecla derecha se ha presionado?

			//EN: A loop for checking if any of the keys defined for left movement is being pressed
			//ES: Un ciclo que comprueba si alguna de las teclas definidas para el movimiento hacia
			//la izquierda está siendo presionada.
			for(let i = 0; i < e.key_left.length; i++)
				if(keyboard.check(e.key_left[i]))
					move_left = true;


			//EN: A loop for checking if any of the keys defined for left movement is being pressed.
			//ES: Un ciclo que comprueba si alguna de las teclas definidas para el movimiento hacia la
			//derecha está siendo presionada.
			for(let i = 0; i < e.key_right.length; i++)
				if(keyboard.check(e.key_right[i]))
					move_right = true;

			//EN: Use the above boolean values as real numbers (1 and 0) for get
			//the horizontal movement sign. For example:
			//If player press left and right, operation will be: 1 - 1, resulting
			//in zero (no movement)... If player only pressed left, operation will be: 0 - 1,
			//Resulting in -1 (left), and same with right key.

			//ES: Usaremos los valores booleanos anteriores como números reales (1 y 0)
			//para obtener el signo del movimiento horizontal. Por ejemplo:
			//Si el jugador presiona izquierda y derecha, la operación será: 1 - 1, resultando
			//en cero (sin movimiento)... Si el jugador sólo presiona izquierda, la operación
			//será: 0 - 1, resultando en -1 (izquierda), y lo mismo con la tecla derecha.
			let move_dir = move_right - move_left;

			//EN: If player is pressing the right key
			//ES: Si el jugador está presionando la tecla derecha
			if(move_right) {
				//EN: Set the corresponding sprite.
				//ES: Definir el sprite correspondiente.
				e.sprite_index = sprites.player.right;
			}
			//EN: If player is pressing the left key
			//ES: Si el jugador está presionando la tecla izquierda,
			if(move_left) {
				//EN: Set the corresponding sprite.
				//ES: Definir el sprite correspondiente.
				e.sprite_index = sprites.player.left;
			}
			//EN: If player is moving anywhere
			//ES: Si el player se mueve a cualquier dirección.
			if(Math.abs(move_dir)) //EN: Absolute value of -1 or 1, is 1 (true).
				                   //ES: El valor absoluto de -1 o 1, es 1 (true).
			{
				//EN: Set the image speed (defined in the prototype, some lines above)
				//ES: Establecer la velocidad de la animación (definida en el prototipo,
				//Algunas líneas arriba).
				e.image_speed = e.defaultImgspeed;
				//EN: Set the speed: the horizontal speed (defined in prototype, too)
				//multiplied by horizontal movement sign (1 or -1).
				//ES: Establecer la velocidad: La velocidad horizontal (definida también en el
				//prototipo) multiplicada por el signo del movimiento horizontal (1 o -1).
				e.hspeed = move_dir * e.h_vel;
			}
			//EN: If player IS NOT moving
			//ES: Si el player NO se está moviendo
			else
			{
				//EN: Set speed, image speed and image index to 0.
				//ES: Establecer velocidad de movimiento y animación, al
				//igual que el índice de la subimagen, a cero.
				e.hspeed = 0;
				e.image_index = 0;
				e.image_speed = 0;
			}

			//EN: If player is pressing space bar, and is 1px above a solid instance,
			//ES: Si el jugador está presionando la barra espaciadora, y está 1px encima
			//de una instancia sólida.
			if(keyboard.check(vk.space) && e.Check.Collision(e, 0, 1, 1))
				e.vspeed = -22; //Jump! / ¡Saltar!
		}

		//EN: Now, we well modify the collision event of all player instances.
		//This event takes two parameters: First one is the current instance that
		//event is working with, and second one is an array containing all 
		//the other instances within the collision.

		//ES: Ahora, modificaremos el evento de colisión para todas las instancias
		//del jugador. Este evento toma dos parámetros: El primero es la instancia
		//actual con la que el evento está trabajando, y el segundo es un arreglo
		//con todas las otras instancias involucradas en la colisión.
		objPlayer.Proto.Event.Collision = function(self, collision) {

			if(collision[0].parent !== objEnemy) //EN: If collision instance isn't enemy.
												 //ES: Si la instancia involucrada en la colisión
												 //no es un enemigo.

				return; //EN: Close event. ES: Terminar evento.

			alert("You died!"); //EN: Show an alert message. ES: Mostrar un mensaje de alerta.
			objPlayer.instanceDestroy(self); //EN: Destroy the player. ES: Destruir al jugador.
			window.setTimeout(function() { //EN: And set a timeout. ES: Y establecer un temporizador
				Game.sceneRestart(); //EN: for restart the scene. ES: Para reiniciar la escena. 
			}, 2000); //EN: In two seconds. ES: En dos segundos.
		}

		//-----THIS IS THE WALL-------
		//-----ÉSTE ES EL MURO -------
		//EN: Set the default engine properties.
		//ES: Definir las propiedades del motor por defecto.
		objWall.Proto.solid = true;
		objWall.Proto.image_speed = 0;
		objWall.Proto.sprite_index = sprites.wall;

		//EN: Set the create event for all enemy instances.
		//This event is executed only once, when a new instance is created.
		//This event takes only one parameter: The current instante that has been created.

		//ES: Establecer el evento create para todas las instancias del enemigo.
		//Este evento es ejecutado una sola vez cuando alguna instancia es creada.
		//El evento toma un solo parámetro: La instancia actual que ha sido creada.
		objWall.Proto.Event.Create = function(self) {

			//EN: Here, we will make an exception in the way we are doing the things.
			//Mainly, the walls WILL NOT have any movement or in-game position (or others)
			//transformations, so that we don't need any prototype step event.
			//So, what we are going to do?... When a wall is created, We will set a timeout 
			//within one game step that will print the CSS style of that wall instance
			//ONLY ONCE TIME, which will allow us to customize the properties after wall
			//is created, and save many calculations per step, and will optimise
			//the game performance.

			//ES: Aquí haremos una excepción en la forma en la que hemos estado haciendo
			//las cosas. Principalmente, los muros NO TENDRÁN ningún tipo de movimiento ni
			//transformaciones de posición (u otras) durante el juego, por lo que no necesitaremos
			//ningún prototipo de evento step.
			//Entonces, ¿qué es lo que haremos?... Cuando un muro sea creado, lanzaremos
			//un temporizador que, dentro de un step, imprima el estilo CSS de la instancia creada.
			//Esto nos permitirá modificar sus propiedades inmediatamente después de crearla, además
			//de reducir muchos cálculos por step, lo que optimizará el rendimiento del juego.


			window.setTimeout(function() {
				CEnginy.Entity.printStyle(self);
			}, Game.update_speed);
		}

		//------THIS IS THE DOOR-------
		//------ÉSTA ES LA PUERTA------
		//EN: Engine properties.
		//ES: Propiedades del motor.
		objDoor.Proto.sprite_index = sprites.door;
		objDoor.Proto.image_speed = 0;
		objDoor.Proto.solid = false;

		//EN: This custom property holds the position the player
		//will be moved to when collision.
		//ES: Esta propiedad personalizada almacena la posición
		//en la que el jugador será movido cuando se produzca la colisión.
		objDoor.Proto.target = {x: 0, y: 0};

		//EN: Set prototype event.
		//ES: Establecer evento prototipo.
		objDoor.Event.Step = function() {
			//EN: As we need the collision event, we need the default engine enabled.
			//ES: Como necesitamos el evento de colisión, también necesitamos mantener
			//activado el motor perdefinido.
			CEnginy.Entity.PrototypeEvent(objDoor, null, true);
			//EN: Although, you can also disable it and check the collision manually.
			//ES: Aunque, también es posible desactivarlo y revisar la colisión manualmente.
		}
		//EN: Collision event for all door instances.
		//ES: Evento de colisión para todas las instancias de puerta.
		objDoor.Proto.Event.Collision = function(self, collision) {
			if(collision[0].parent !== objPlayer) //EN: If collision instance isn't player,
												  //ES: Si la instancia involucrada en la colisión
												  //no es el jugador,

				return; //EN: Close the event. ES: Terminar el evento.

			//EN: Move the player to the door target.
			//ES: Mover el jugador al objetivo de la puerta.
			collision[0].x = self.target.x;
			collision[0].y = self.target.y;
		}

		//-----THIS IS THE ENEMY------
		//-----ÉSTE ES EL ENEMIGO-----

		//EN: Engine properties
		//ES: Propiedades del motor.
		objEnemy.Proto.gravity = 2;
		objEnemy.Proto.image_speed = 0.25;

		objEnemy.Proto.bbox.top = 24;
		objEnemy.Proto.bbox.left = 4;
		objEnemy.Proto.bbox.right = 37;

		//EN: Wall creation event.
		//ES: Evento de creación del muro.
		objEnemy.Proto.Event.Create = function(self) {	
			//ES: This variable will set the direction that the enemy will start
			//moving, randomly.

			//EN: Esta variable establecerá aleatoriamente la dirección en la que
			//el enemigo comenzará a moverse.
			let dir = CEnginy.choose(-1, 1);
			self.hspeed = dir * 3;
			self.sprite_index = sprites.enemy[(dir == 1)? "right": "left"];
		}

		//EN: Set prototype event.
		//ES: Establecer evento prototipo.
		objEnemy.Event.Step = function() {
			CEnginy.Entity.PrototypeEvent(objEnemy, function(child){
				//EN: Also, we can set the step event for all instances
				//from entity prototype event. This event takes one parameter:
				//The current instance that event is working with.

				//ES: Además, podemos también establecer el evento step para
				//todas las instancias desde el evento prototipo. Este evento
				//recibe un parámetro: La instancia actual con la que el evento
				//está trabajando.

				//EN: Check if enemy is coliding frontally with a solid instance.
				//ES: Comprobar si el enemigo está colisionando frontalmente con una
				//instancia sólida.
				if(child.Check.Collision(child, Math.sign(child.hspeed), 0, 1))
				{
					//EN: Invert the direction.
					//ES: Invertir la dirección.
					child.hspeed *= -1;
					//EN: And set the corresponding sprite.
					//ES: Y establecer el sprite correspondiente.
					if(child.hspeed < 0)
						child.sprite_index = sprites.enemy.left;
					else
						child.sprite_index = sprites.enemy.right;
				}

			}, true);
		}


		//-----THIS IS THE BOX---------
		objBoxy.Proto.sprite_index = sprites.box;
		objBoxy.Proto.solid = false;

		//Set the collision event for all instances
		objBoxy.Proto.Event.Collision = function(self, collision) {
			if(collision[0].parent == objPlayer) //If the collision was with the player
				self.gravity = 2; //Set the gravity and make it fall.

			if(collision[0].parent == objEnemy && self.vspeed !== 0) //If the collision was with an enemy
			{
				objEnemy.instanceDestroy(collision[0]); //Destroy the enemy.

				Game.Score++; //Augment the score

				score_marker.innerText = "Score: " + Game.Score.toString();

				//Put a text into player HTML element
				collision[0].parentNode.innerText = "You killed an enemy!";
				window.setTimeout(function() {
					//And clear it after 2 seconds.
					collision[0].parentNode.innerText = "";
				}, 2000);
			}
		}
		//Set the prototype event
		objBoxy.Event.Step = function() {
			CEnginy.Entity.PrototypeEvent(objBoxy, function(self) {
				//If the instance gets outside room
				if(self.Check.Outside(self))
					objBoxy.instanceDestroy(self); //destroy it
			}, true);
		};

	//Set the room creation event.
	//This event will be triggered when the game loop starts, or when
	//room is restarted.
	Game.sceneMap = function() {
		//Create a player instance, and set it as camera target.
		let player = Game.instanceCreate(32, 32, objPlayer);
		Game.cameraTarget = player;

		//Now we will create all wall instances in the room.
		let floor  = Game.instanceCreate(0, Game.height - 32, objWall);
		floor.width = Game.width;
		floor.bbox.right = Game.width;

		floor = Game.instanceCreate(0, 0, objWall);
		floor.height = Game.height;
		floor.bbox.bottom = Game.height;

		floor = Game.instanceCreate(Game.width - 32, 0, objWall);
		floor.height = Game.height;
		floor.bbox.bottom = Game.height;

		floor = Game.instanceCreate(0, 0, objWall);
		floor.width = Game.width;
		floor.bbox.right = Game.width;

		floor = Game.instanceCreate(32, Game.height - 128, objWall);
		floor.width = 480;
		floor.bbox.right = 480;

		floor = Game.instanceCreate(512, Game.height - 256, objWall);
		floor.height = 224;
		floor.bbox.bottom = 224;

		Game.instanceCreate(380, Game.height - 192, objWall);

		floor = Game.instanceCreate(Game.width - 400, 224, objWall);
		floor.width = 400;
		floor.bbox.right = 400;

		for(let i = 1; i < 10; i+= 2)
		{
			Game.instanceCreate(Game.width - (400+32*i), 128, objWall);
			Game.instanceCreate(Game.width - (432+32*i), 96, objBoxy);
		}
		floor = Game.instanceCreate(Game.width - 1000, 128, objWall);
		floor.width = 264;
		floor.bbox.right = 264;

		//Create a door and set its target.
		let door = Game.instanceCreate(Game.width - 96, Game.height - 64, objDoor);
		door.target = {x: Game.width - 128, y: 96};

		//Create an enemy
		let enemy = Game.instanceCreate(Game.width - 180, Game.height - 224, objEnemy);
		enemy = Game.instanceCreate(Game.width - 420, Game.height - 224, objEnemy);
	}

	//Start game!
	CEnginy.GameLoop(Game, function() {
		//Follow the player with the camera
		Game.setCamera(game_camera, 1, 1, 0.6, 0.28);

		if(!Game.alarm[0])
		{
			time++;

			let snap = {
				s: (time % 60) < 10 ? "0" + (time % 60).toString(): time % 60,
				m: Math.floor(time / 60) < 10 ? "0" + Math.floor(time / 60).toString(): Math.floor(time / 60)
			}

			time_count.innerText = snap.m + ": " + snap.s;
			Game.alarm[0] = Game.update_speed;
		}
	});
});