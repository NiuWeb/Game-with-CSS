let CEnginy = {

	//Control actions
	repeat: function(times, callback) {
		if(!callback || !times)
			return;
		let i = 0;
		while(i < Math.abs(times))
		{
			if(callback() == -1)
				return false;
			i++;
		}
		return true;
	},
	choose: function() {
		return arguments[Math.floor(Math.random()*arguments.length)];
	},
	Geometry: {
		Circle: function(x, y, r){
			this.left = x;
			this.top = y;
			this.radius = r;

			this.Collision = new Object();

			let self = this;

			this.Collision.Circle = function(circle) {
				return(
					new CEnginy.Geometry.Point(self.left, self.top).distanceTo(
						new CEnginy.Geometry.Point(circle.left, circle.top)) <  
					(self.radius + circle.radius)
				);
			}
			this.Collision.Point = function(point) {
				return point.Collision.Rectangle(self);
			}		
			this.Collision.Rectangle = function(rect) {
				return rect.Collision.Circle(self);
			}
		},
		Rectangle: function(x1, y1, x2, y2) {
			this.left   = x1;
			this.top    = y1;
			this.right  = x2;
			this.bottom = y2;

			this.Collision = new Object;

			let self = this;
			this.Collision.Rectangle = function(rect2) {
			return (self.left < rect2.right &&
	   				self.right > rect2.left &&
	   				self.top < rect2.bottom &&
	   				self.bottom > rect2.top)
			}
			this.Collision.Point = function(point) {
				return point.Collision.Rectangle(self);
			};
			this.Collision.Circle = function(circle) {
				let distx = Math.abs(circle.left - self.left - (self.right  - self.left)/2);
				let disty = Math.abs(circle.top  - self.top  - (self.bottom - self.top)/2);

				if(distx > (self.right - self.left)/2 + circle.radius)
					return false;
				if(disty > (self.bottom - self.right)/2 + circle.radius)
					return false;

				if(distx <= (self.right - self.left)/2)
					return true;
				if(disty <= (self.bottom - self.top)/2)
					return true;

				let dx = distx - (self.right - self.left)/2;
				let dy = disty + (self.bottom - self.top)/2;
				return (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(circle.radius, 2));
			}
		},
		Point: function(x, y) {
			this.left = x;
			this.top  = y;

			this.angleTo = function(point) {
				let w = point.left - this.left;
				let h = point.top - this.top;

				return Math.atan2(h, w);
			};
			this.distanceTo = function(point) {
				return Math.sqrt(  Math.pow(this.left - point.left, 2) 
					+ Math.pow(this.top - point.top, 2)  );
			}

			this.Collision = new Object();

			let self = this;
			this.Collision.Rectangle = function(rect) {
				return (
					self.left > rect.left  &&
					self.left < rect.right &&
					self.top  > rect.top   &&
					self.top  < rect.bottom
				);
			};
			this.Collision.Circle = function(circle) {
				return(self.distanceTo(  circle  ) < circle.radius);
			}
		}
	},
	keyboard: {
		keycodes: function() {
			this.left = 37;
			this.up = 38;
			this.right = 39;
			this.down = 40;
			this.space = 32;
			this.enter = 13;
			this.tab = 9;
			this.F1 = 112;
			this.F2 = 113;
			this.F3 = 114;
			this.F4 = 115;
			this.F5 = 116;
			this.F6 = 117;
			this.F7 = 118;
			this.F8 = 119;
			this.F9 = 120;
			this.F10 = 121;
			this.F11 = 122;
			this.F12 = 123;
		},
		control: function() {
			this.Proto = {
				keymap: {}
			};
			this.start = function() {
				let proto = this.Proto;
				window.addEventListener("keydown", function(e) {
					let key = e.which || e.keyCode;
					proto.keymap[key] = true;
				});
				window.addEventListener("keyup", function(e) {
					let key = e.which || e.keyCode;
					proto.keymap[key] = false;
				});
			};
			this.check = function(e) {
				return (this.Proto.keymap[e] == true);
			};
		}
	},
	mouse: {
		keycodes: function() {
			this.left   = 0;
			this.right  = 1;
			this.middle = 2;
		},
		control: function() {
			this.Proto = {
				mouse: {
					x: 0,
					y: 0,
				},
				buttonmap: {}
			};
			this.start = function() {
				let proto = this.Proto;


				window.addEventListener("mousemove", function(e) {
					proto.mouse.x = e.clientX;
					proto.mouse.y = e.clientY;
				});
				window.addEventListener("mousedown", function(e) {
					    e = e || window.event;

					    let button = "";
					    if (e.which == null)
					    {
					        button = (e.button < 2) ? 0 :
					            ((e.button == 4) ? 2 : 1);
					    }
					    else
					    {
					        button = (e.which < 2) ? 0 :
					            ((e.which == 2) ? 2 : 1);
					    }
					    proto.buttonmap[button] = true;
				});
				window.addEventListener("mouseup", function(e) {
					    e = e || window.event;

					    let button = "";
					    if (e.which == null)
					    {
					        button = (e.button < 2) ? 0 :
					            ((e.button == 4) ? 2 : 1);
					    }
					    else
					    {
					        button = (e.which < 2) ? 0 :
					            ((e.which == 2) ? 2 : 1);
					    }
					    proto.buttonmap[button] = false;
				});
				window.addEventListener('contextmenu', function(e){
					e.preventDefault();
				});
			};
			this.check = function(mb) {
				return (this.Proto.buttonmap[mb] == true);
			};
			this.x = function() {
				return this.Proto.mouse.x;
			};
			this.y = function() {
				return this.Proto.mouse.y;
			};
		}
	},

	//Game entities prototypes
	Entity: {
		printStyle: function(proto) {
			proto.parentNode.style.left = proto.x.toString() + "px";
			proto.parentNode.style.top  = proto.y.toString() + "px";
			proto.parentNode.style.width = proto.width.toString() + "px";
			proto.parentNode.style.height = proto.height.toString() + "px";

			let index = Math.floor(proto.image_index);
			proto.parentNode.style.backgroundImage = 'url(' + proto.sprite_index[index%proto.sprite_index.length] + ')';
		},
		PrototypeEvent: function(entity, callback, prefab_engine) {
			for(let i = 0; i < entity.Instances.length; i++)
			{
				let proto = entity.Instances[i];
				if(callback)
					callback(proto);

				proto.image_index += proto.image_speed;

				if(!prefab_engine)
				{
					CEnginy.Entity.printStyle(proto);
					continue;
				}


				let coliders = [];
				let static_col = proto.Check.Collision(proto, 0, 0, 2);
				if(static_col)
					coliders = static_col;


				proto.vspeed += proto.gravity;

				CEnginy.repeat(proto.hspeed, function() {
					let dir = Math.sign(proto.hspeed);
					let col = proto.Check.Collision(proto, dir, 0, 1);
					if(col)
					{
						coliders = coliders.concat(col);
						return -1;
					}
					else
						proto.x += dir;

				});
				CEnginy.repeat(proto.vspeed, function() {
					let dir = Math.sign(proto.vspeed);
					let col = proto.Check.Collision(proto, 0, dir, 2);
					if(col)
					{
						coliders = coliders.concat(col);
						for(let x = 0; x < col.length; x++)
						{
							if(!col[x].solid)
								continue;
							
							proto.vspeed = 0;
							return -1;
						}
					}
					proto.y += dir;

				});
				if(coliders.length)
				{
					proto.Event.Collision(proto, coliders);
				}

				proto.Event.Step(proto);


				CEnginy.Entity.printStyle(proto);
			}
		},
		Scene: function(node) {

			this.Proto = {
				parentNode: node
			};
			this.width = node.offsetWidth;
			this.height = node.offsetHeight;

			this.Characters = [];
			this.alarm = [0, 0, 0, 0, 0, 0, 0];
			this.update_speed = 30;

			this.sceneMap = function(){};

			this.cameraTarget = null;

			this.sceneRestart = function() {
				this.Proto.parentNode.innerHTML = "";
				if(this.sceneMap)
				{
					for(let i = 0; i < this.Characters.length; i++)
					{
						this.Characters[i].Instances = [];
					}
					this.sceneMap();
				}
			}

			this.setCamera = function(camera, dist_w, dist_h, parallax_h, parallax_v) {
				if(!this.cameraTarget)
					return;

				let proto = this.cameraTarget;
				let w = camera.offsetWidth;
				let h = camera.offsetHeight;
				let p = this.getCamera();

				let move_x = Math.min(0, (w/2*dist_w) - proto.x);
				move_x = Math.min(-move_x, this.Proto.parentNode.offsetWidth - w)*-1;
				this.Proto.parentNode.style.left = Math.floor(move_x).toString() + "px";

				let move_y = Math.min(0, (h/2*dist_h) - proto.y);
				move_y = Math.min(-move_y, this.Proto.parentNode.offsetHeight - h)*-1;
				this.Proto.parentNode.style.top = Math.floor(move_y).toString() + "px";

				this.Proto.parentNode.style.backgroundPositionX = ((!parallax_h) ? 0: -move_x*parallax_h).toString() + "px";
				this.Proto.parentNode.style.backgroundPositionY = ((!parallax_v) ? 0: -move_y*parallax_v).toString() + "px";
			}
			this.getCamera = function() {
				return {
					x: -parseInt(this.Proto.parentNode.style.left),
					y: -parseInt(this.Proto.parentNode.style.top)
				}
			}

			this.appendCharacter = function(character) {
				if(this.Characters.indexOf(character) == -1)
					this.Characters.push(character);
			};
			this.instanceCreate = function(x, y, character) {
				let instance = new Object();
				for(let prop in character.Proto)
				{
					instance[prop] = character.Proto[prop];
				}
				instance.parent = character;
				instance.scene = this;

				let container = document.createElement("div");
				this.Proto.parentNode.appendChild(container);

				container.setAttribute("class", character.CSS);
				instance.scene = this;
				instance.parentNode = container;
				instance.x = x;
				instance.y = y;

				instance.xstart = x;
				instance.ystart = y;

				instance.width = container.offsetWidth;
				instance.height = container.offsetHeight;

				instance.bbox = {
					left: 0, top: 0,
					right: instance.width,
					bottom: instance.height
				}
				
				if(character.Proto.bbox.left !== null)
					instance.bbox.left = character.Proto.bbox.left;
				if(character.Proto.bbox.top !== null)
					instance.bbox.top = character.Proto.bbox.top;
				if(character.Proto.bbox.bottom !== null)
					instance.bbox.bottom = character.Proto.bbox.bottom;
				if(character.Proto.bbox.right !== null)
					instance.bbox.right = character.Proto.bbox.right;
			
				CEnginy.Entity.printStyle(instance);

				character.Instances.push(instance);
				instance.Event.Create(instance);

				return instance;
			}
		},
		Character: function(css_selector) {
			this.CSS = css_selector;
			this.Proto = {
				scene: null,
				parentNode: null,
				width: 0,
				height: 0,
				x: 0,
				y: 0,
				hspeed: 0,
				vspeed: 0,
				solid: false,
				gravity: 0,
				bbox: {
					top: null,
					left: null,
					right: null,
					bottom: null
				},
				sprite_index: [],
				image_index: 0,
				image_speed: 1,
				Check: {
					Collision: function(self, mask_x, mask_y, instance_type) {
						let coliding = [];
						for(let j = 0; j < self.scene.Characters.length; j++)
						{
							let parent = self.scene.Characters[j];
							for(let i = 0; i < parent.Instances.length; i++)
							{
								let other = parent.Instances[i];
								if(other == self)
									continue;

								if(instance_type == 0 && other.solid)
									continue;
								else if(instance_type == 1 && !other.solid)
									continue;

								let my_mask = new CEnginy.Geometry.Rectangle(
										mask_x + self.x + self.bbox.left, 
										mask_y + self.y + self.bbox.top, 
										mask_x + self.x + self.bbox.right, 
										mask_y + self.y + self.bbox.bottom
									);
								let ot_mask = new CEnginy.Geometry.Rectangle(
										other.x + other.bbox.left, 
										other.y + other.bbox.top,
										other.x + other.bbox.right, 
										other.y + other.bbox.bottom
									);

								if(my_mask.Collision.Rectangle(ot_mask))
									coliding.push(other);
							}
						}
						if(!coliding.length)
							return false;
						else
							return coliding;

					},
					Outside: function(self) {
						return (self.x < 0 || self.y < 0 
							|| self.x > self.scene.width || self.y > self.scene.height);
					}
				},

				Event: {
					Step: function(target) {},
					AnimationEnd: function(target) {},
					Destroy: function(target) {},
					Collision: function(target, other) {},
					Create: function(target) {}
				}
			}

			this.Instances = [];
			this.instanceDestroy = function(child){
				child.Event.Destroy(child);

				child.scene.Proto.parentNode.removeChild(child.parentNode);
				this.Instances.splice( this.Instances.indexOf(child), 1 );
			}
			this.Event = {
				Step: function(target) {}
			};

		}
	},
	GameLoop: function(scene, extra) {
		if(scene.sceneMap)
			scene.sceneMap();
		CEnginy.GameLoopID = window.setInterval(function() {
			try
			{
				if(CEnginy.GameLoopEnable)
				{
					for(let i = 0; i < scene.Characters.length; i++)
					{
						scene.Characters[i].Event.Step();
					}
					for(let i = 0; i < scene.alarm.length; i++)
					{
						if(scene.alarm[i] > 0)
							scene.alarm[i] --;
					}
				}
				if(extra)
					extra();
			}
			catch(error)
			{
				console.log(error);
				window.clearInterval(CEnginy.GameLoopID);
				CEnginy.GameLoopID = null;
			}

		}, 1000/ scene.update_speed);
	},
	GameLoopID: null,
	GameLoopEnable: true
}