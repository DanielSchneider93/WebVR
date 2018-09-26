AFRAME.registerComponent('controller-cursor', {
   // dependencies: ['cursor'],

   // daydream-controller doesn't have a trigger.
   schema: {
     downEvents: {type: 'array', default: ['triggerdown', 'trackpaddown', 'thumbstickdown']},
     upEvents: {type: 'array', default: ['triggerup', 'trackpadup', 'thumbstickup']},
   },

   init: function () {
     // We want to use controller buttons, so don't fuse.
     this.el.setAttribute('cursor', 'fuse', false);
     this.onDown = this.onDown.bind(this);
     this.onUp = this.onUp.bind(this);
   },

   play: function () {
     var el = this.el;
     // Samsung Internet doesn't like ES6 syntax!
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
     // Samsung Internet doesn't like ES6 syntax!
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
     // install event handler
     el.addEventListener('controllerconnected', function (evt) {
       // we've got something, make it visible
       el.setAttribute('visible', true);
       // undo hand-model rotation offset
       el.setAttribute('tracked-controls', 'rotationOffset', 0);
       el.setAttribute(evt.detail.name, 'rotationOffset', 0);
       // use controller model
       el.setAttribute(evt.detail.name, 'model', true);
       // setAttribute doesn't make model appear, so force
       evt.detail.component.updateControllerModel();
     });

     // Use various controller components,
     this.controllerComponents.forEach(function(name) { this.el.setAttribute(name, 'hand', this.data); }.bind(this));
     // but hide by default.
     this.el.setAttribute('visible', false);
   }
 });

 AFRAME.registerComponent("controller-with-cursor-if-present", {
   schema: {type: 'string'},
   init: function() {
     this.el.setAttribute('controller-model-if-present', this.data);

     // Create ray as visible guide for selection.
     // NOTE: make sure cursor/raycaster won't intersect!
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
       // if we had a raycaster, cursor, etc., attach here
       evt.target.setAttribute('controller-cursor', '');
       // need to make ray NOT an intersection target for raycaster!
       evt.target.setAttribute('raycaster', 'interval:100; objects:.clickable');

       // Since we have a controller, remove gaze cursor.
       var cameraCursorEl = document.querySelector('a-camera a-entity[cursor]');
       if (cameraCursorEl) {
         cameraCursorEl.parentElement.removeChild(cameraCursorEl);
       }
     });
   }
 });

//copy pasted component for controller with no ray
 AFRAME.registerComponent("controller-with-cursor-if-present-no-visible-ray", {
   schema: {type: 'string'},
   init: function() {
     this.el.setAttribute('controller-model-if-present', this.data);

     // Create ray as visible guide for selection.
     // NOTE: make sure cursor/raycaster won't intersect!
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
       // if we had a raycaster, cursor, etc., attach here
       evt.target.setAttribute('controller-cursor', '');
       // need to make ray NOT an intersection target for raycaster!
       evt.target.setAttribute('raycaster', 'interval:100; objects:.clickable');

       // Since we have a controller, remove gaze cursor.
       var cameraCursorEl = document.querySelector('a-camera a-entity[cursor]');
       if (cameraCursorEl) {
         cameraCursorEl.parentElement.removeChild(cameraCursorEl);
       }
     });
   }
 });
