  AFRAME.registerComponent('controller-cursor', {
    schema: {
      downEvents: {type: 'array', default: ['triggerdown', 'trackpaddown', 'thumbstickdown']},
      upEvents: {type: 'array', default: ['triggerup', 'trackpadup', 'thumbstickup']},
    },

    init: function () {
      this.el.setAttribute('cursor', 'fuse', false);
      this.onDown = this.onDown.bind(this);
      this.onUp = this.onUp.bind(this);
    },

    play: function () {
      var el = this.el;
      var self = this;
      this.data.downEvents.forEach(function (eventName) {
        el.addEventListener(eventName, self.onDown);
      });
      this.data.upEvents.forEach(function (eventName) {
        el.addEventListener(eventName, self.onUp);
      });
    },

    pause: function () {
      var el = this.el;
      var self = this;
      this.data.downEvents.forEach(function (eventName) {
        el.removeEventListener(eventName, self.onDown);
      });
      this.data.upEvents.forEach(function (eventName) {
        el.removeEventListener(eventName, self.onUp);
      });
    },

    onDown: function (evt) {
      var cursor = this.el.components.cursor;
      cursor.onCursorDown ? cursor.onCursorDown() : cursor.onMouseDown();
    },
    onUp: function (evt) {
      var cursor = this.el.components.cursor;
      cursor.onCursorUp ? cursor.onCursorUp() : cursor.onMouseUp();
    }
  });

  AFRAME.registerComponent("controller-model-if-present", {
    controllerComponents: ['oculus-touch-controls', 'vive-controls', 'daydream-controls', 'gearvr-controls'],
    schema: { type: 'string' },
    init: function () {
      var el = this.el;
      el.addEventListener('controllerconnected', function (evt) {
        el.setAttribute('visible', true);
        el.setAttribute('tracked-controls', 'rotationOffset', 0);
        el.setAttribute(evt.detail.name, 'rotationOffset', 0);
        el.setAttribute(evt.detail.name, 'model', true);
        evt.detail.component.updateControllerModel();
      });
      this.controllerComponents.forEach(function(name) { this.el.setAttribute(name, 'hand', this.data); }.bind(this));
      this.el.setAttribute('visible', false);
    }
  });

  AFRAME.registerComponent("controller-with-cursor-if-present", {
    schema: {type: 'string'},
    init: function() {
      this.el.setAttribute('controller-model-if-present', this.data);

      var ray = document.createElement('a-box');
      ray.setAttribute('class', 'not-clickable');
      ray.setAttribute('width', 0.001);
      ray.setAttribute('height', 0.001);
      ray.setAttribute('depth', 100);
      ray.setAttribute('position', {x:0, y:0, z: -50});
      ray.setAttribute('color', 'green');
      ray.setAttribute('opacity', 0.95);
      this.el.appendChild(ray);

      this.el.addEventListener('controllerconnected', function (evt) {
        evt.target.setAttribute('controller-cursor', '');
        evt.target.setAttribute('raycaster', 'interval:100; objects:.clickable');

        var cameraCursorEl = document.querySelector('a-camera a-entity[cursor]');
        if (cameraCursorEl) {
          cameraCursorEl.parentElement.removeChild(cameraCursorEl);
        }
      });
    }
  });

    AFRAME.registerComponent("controller-with-cursor-if-present-no-visible-ray", {
    schema: {type: 'string'},
    init: function() {
      this.el.setAttribute('controller-model-if-present', this.data);

      var ray = document.createElement('a-box');
      ray.setAttribute('class', 'not-clickable');
      ray.setAttribute('width', 0.001);
      ray.setAttribute('height', 0.001);
      ray.setAttribute('depth', 100);
      ray.setAttribute('position', {x:0, y:0, z: -50});
      ray.setAttribute('color', 'green');
      ray.setAttribute('opacity', 0);
      this.el.appendChild(ray);

      this.el.addEventListener('controllerconnected', function (evt) {
        evt.target.setAttribute('controller-cursor', '');
        evt.target.setAttribute('raycaster', 'interval:100; objects:.clickable');

        var cameraCursorEl = document.querySelector('a-camera a-entity[cursor]');
        if (cameraCursorEl) {
          cameraCursorEl.parentElement.removeChild(cameraCursorEl);
        }
      });
    }
  });

  AFRAME.registerComponent('selecting', {
    init: function () {
      this.oldColor = this.el.getAttribute('material').color;
      this.el.setAttribute('material','color','#4F4'); 
    },
    remove: function () {
      if (!this.oldColor) { return; }
      this.el.setAttribute('material', 'color', this.oldColor); 
    }
  });
  
  AFRAME.registerComponent('selected', {
    init: function () {
      this.oldColor = this.el.getAttribute('material').color;
      this.el.setAttribute('material','color','#48F'); 
    },
    remove: function () {
      if (!this.oldColor) { return; }
      this.el.setAttribute('material', 'color', this.oldColor); 
    }
  });

  AFRAME.registerComponent('clickable', {
    init: function () { this.el.classList.add('clickable'); },
    remove: function () { this.el.classList.remove('clickable'); }
  });
  
  AFRAME.registerComponent('clickbait', {
    dependencies: ['clickable'],
    
    init: function () {
      var el = this.el;
      el.addEventListener('mouseenter', function (evt) {
        console.log('mouseenter ' + JSON.stringify(evt.target.getAttribute('position')));
        evt.target.removeAttribute('selected'); 
        evt.target.setAttribute('selecting', '');
      });
      
      el.addEventListener('mouseleave', function (evt) {
        console.log('mouseleave ' + JSON.stringify(evt.target.getAttribute('position')));
        evt.target.removeAttribute('selecting'); 
        evt.target.removeAttribute('selected'); 
      });
      
      el.addEventListener('click', function (evt) {
        console.log('click ' + JSON.stringify(evt.target.getAttribute('position')));
        evt.target.removeAttribute('selecting'); 
        evt.target.setAttribute('selected', '');         
      });
    }
  });