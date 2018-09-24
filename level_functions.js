
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

      function Level3(){
        document.getElementById('scene2').setAttribute('visible', 'false');
        document.getElementById('scene3').setAttribute('visible', 'true');
        document.getElementById('environment_lvl2').setAttribute('environment', 'active: false;');
        document.getElementById('env_lvl3').setAttribute('environment', 'active: true;');

        // Set the Camera
        document.getElementById('cameraRig').setAttribute('position', '227 4 250');
        setOffset();
      }

      function Hell() {
        console.log("Hell() Called");
        document.getElementById('scene1').setAttribute('visible', 'false');
        document.getElementById('hell_id').setAttribute('visible', 'true');
        document.getElementById('scene2').setAttribute('visible', 'false');
        document.getElementById('environment_lvl2').setAttribute('environment', 'active: false;');

        // Set the Camera
        document.getElementById('cameraRig').setAttribute('position', '300 4 300');
        setOffset();

        var hellanim = document.querySelectorAll('#hellstart'), i;
        for (i = 0; i < hellanim.length; ++i) {
          hellanim[i].emit('startafterteleport');
        }

        var light = document.querySelector('#hellend');
        light.emit('startafterteleport');

        var end = document.querySelector('#hellend');
        end.addEventListener('animationcomplete', function(){
        console.log("rollback");
        backToLvl1();
        rollBack();
        });

        var hellsound = document.querySelector('#you_dead');
        hellsound.components.sound.playSound();
        var dead = document.querySelector('#dead');
        dead.components.sound.playSound();
        var drone = document.querySelector('#dronemusic');
        drone.components.sound.stopSound();
        var atmo = document.querySelector('#atmomusic');
        atmo.components.sound.stopSound();
      }


      function backToLvl1(){
        document.getElementById('scene1').setAttribute('visible', 'true');
        document.getElementById('hell').setAttribute('visible', 'false');
        document.getElementById('start_env').setAttribute('environment', 'active: true;');

        // Set the Camera
        document.getElementById('cameraRig').setAttribute('position', '10 4 20');
        setOffset();

      }

      //Reset Hell
      function rollBack(){
          var end = document.querySelector('#hellend');
          end.emit('goBack');

          var hellanim = document.querySelectorAll('#hellstart'), i;
            for (i = 0; i < hellanim.length; ++i) {
                hellanim[i].emit('goBack');
        }
      }


      function disableController(){
        var vive = document.querySelector('#vivecontrols');
        vive.parentNode.removeChild(vive);
        console.log("Disabled Controller");
      }
