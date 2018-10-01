//Component for accessing the teleport-controls variable prevHitHeight
AFRAME.registerComponent('y-offset-control', {
        resetTeleportOffset: function() {
          console.log(this.el.components['teleport-controls'].prevHitHeight);
          this.el.components['teleport-controls'].prevHitHeight = 0
        }
});

// call the function in the y-offset-control
function setOffset(){
       var temp = document.querySelector('[y-offset-control]').components['y-offset-control'];
       temp.resetTeleportOffset();
       console.log("offset set");
}

//Level 2 Functions
function Level2() {
        //Show and Hide the Scenes
        document.getElementById('scene1').setAttribute('visible', 'false');
        document.getElementById('scene2').setAttribute('visible', 'true');
        document.getElementById('start_env').setAttribute('environment', 'active: false;');
        document.getElementById('environment_lvl2').setAttribute('environment', 'active: true;');

        // Set the Camera
        document.getElementById('cameraRig').setAttribute('position', '100 4 100');
        setOffset();

        //Set the Sound
        var oceanmusic = document.querySelector('#oceanmusic');
        oceanmusic.components.sound.pauseSound();
        var weed = document.querySelector('#weedmusic');
        weed.components.sound.pauseSound();
        var rat = document.querySelector('#ratmusic');
        rat.components.sound.pauseSound();
        var drone = document.querySelector('#dronemusic');
        drone.components.sound.playSound();
        var atmo = document.querySelector('#atmomusic');
        atmo.components.sound.playSound();
}

//Level 3 Functions
function Level3(){
        document.getElementById('scene2').setAttribute('visible', 'false');
        document.getElementById('scene3').setAttribute('visible', 'true');
        document.getElementById('environment_lvl2').setAttribute('environment', 'active: false;');
        document.getElementById('env_lvl3').setAttribute('environment', 'active: true;');

        // Set the Camera
        document.getElementById('cameraRig').setAttribute('position', '227 4 250');
        setOffset();

        var drone = document.querySelector('#dronemusic');
        drone.components.sound.stopSound();
        var atmo = document.querySelector('#atmomusic');
        atmo.components.sound.stopSound();
        var birds = document.querySelector('#scene3');
        birds.components.sound.playSound();
}

// Final Gold Treasure Level
function Gold(){
        document.getElementById('scene3').setAttribute('visible', 'false');
        document.getElementById('goldlevel').setAttribute('visible', 'true');
        document.getElementById('env_lvl3').setAttribute('environment', 'active: false;');

        var gold = document.querySelector('#goldlevel');
        gold.components.sound.playSound();

        var birds = document.querySelector('#scene3');
        birds.components.sound.stopSound();

        document.getElementById('cameraRig').setAttribute('position', '400 4 400');
        setOffset();
}

// got to Hell and back to Lvl 1 after 9000ms
function Hell() {
        document.getElementById('scene1').setAttribute('visible', 'false');
        document.getElementById('hell_id').setAttribute('visible', 'true');
        document.getElementById('scene2').setAttribute('visible', 'false');
        document.getElementById('scene3').setAttribute('visible', 'false');
        document.getElementById('environment_lvl2').setAttribute('environment', 'active: false;');

        // Set the Camera
        document.getElementById('cameraRig').setAttribute('position', '300 8 300');
        setOffset();

        var hellanim = document.querySelectorAll('#hellstart'), i;
        for (i = 0; i < hellanim.length; ++i) {
          hellanim[i].emit('startafterteleport');
        }

        var light = document.querySelector('#hellend');
        light.emit('startafterteleport');

        setTimeout(function(){ backToLvl1();}, 9000);

        var hellsound = document.querySelector('#you_dead');
        hellsound.components.sound.playSound();
        var dead = document.querySelector('#dead');
        dead.components.sound.playSound();
        var drone = document.querySelector('#dronemusic');
        drone.components.sound.stopSound();
        var atmo = document.querySelector('#atmomusic');
        atmo.components.sound.stopSound();
}

//play sound if hover over treasures
function Goldsound(){
        var goldsound = document.querySelector('#goldsound');
        goldsound.components.sound.playSound();
        console.log("play goldsound");
}

//reset everythin to the start
function backToLvl1(){
        document.getElementById('scene1').setAttribute('visible', 'true');
        document.getElementById('scene2').setAttribute('visible', 'false');
        document.getElementById('scene3').setAttribute('visible', 'false');
        document.getElementById('hell_id').setAttribute('visible', 'false');
        document.getElementById('start_env').setAttribute('environment', 'active: true;');
        document.getElementById('env_lvl3').setAttribute('environment', 'active: false;');

        var oceanmusic = document.querySelector('#oceanmusic');
        oceanmusic.components.sound.playSound();
        var weed = document.querySelector('#weedmusic');
        weed.components.sound.playSound();
        var rat = document.querySelector('#ratmusic');
        rat.components.sound.playSound();

        document.getElementById('cameraRig').setAttribute('position', '10 4 20');
        setOffset();

        var end = document.querySelector('#hellend');
        end.emit('goBack');

        var hellanim = document.querySelectorAll('#hellstart'), i;
          for (i = 0; i < hellanim.length; ++i) {
              hellanim[i].emit('goBack');
            }
}

//Hover over clickable Object
AFRAME.registerComponent('selecting', {
        init: function () {
          var cursor = document.querySelector('#camera-cursor');
          //make cursor fusing
          cursor.emit('start-fusing');
          this.oldColor = this.el.getAttribute('material').color;
          //set the color to gold
          this.el.setAttribute('material','color','#FFD700');
          //play doorsound
          this.el.components.sound.playSound();
        },
        remove: function () {
          if (!this.oldColor) { return; }
          this.el.setAttribute('material', 'color', this.oldColor);
        }
});

//What should the raycaster do if interaction entity id x ?
AFRAME.registerComponent('selected', {
        init: function () {
          var x = this.el.getAttribute('id');
          switch (x) {
      case "hell":
        Hell();
        break;
      case "level1":
        backToLvl1();
        break;
      case "level2":
        Level2();
        break;
      case "level3":
        Level3();
        break;
      case "mouse":
        useMouse();
        break;
        case "gold":
          Gold();
          break;
        case "goldsound":
          Goldsound();
          break;
        }}
});

//needed for clickit component
AFRAME.registerComponent('clickable', {
        init: function () { this.el.classList.add('clickable'); },
        remove: function () { this.el.classList.remove('clickable'); }
});


//Component for giving Enities the power to get interacted with
AFRAME.registerComponent('clickit', {
        dependencies: ['clickable'],
        init: function () {
          var el = this.el;
          el.addEventListener('mouseenter', function (evt) {
            evt.target.removeAttribute('selected');
            evt.target.setAttribute('selecting', '');
          });
          el.addEventListener('mouseleave', function (evt) {
            evt.target.removeAttribute('selecting');
            evt.target.removeAttribute('selected');
          });
          el.addEventListener('click', function (evt) {
            evt.target.removeAttribute('selecting');
            evt.target.setAttribute('selected', '');
          });
        }
});
