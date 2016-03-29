angular.module('walkthrough.services', [])

.service('TouchService', function (){
	// inspired on: https://github.com/hammerjs/touchemulator/blob/master/touch-emulator.js
	function Touch(target, identifier, pos, deltaX, deltaY)
	{
		deltaX = deltaX || 0;
		deltaY = deltaY || 0;
		this.identifier = identifier;
		this.target = target;
		this.clientX = pos.clientX + deltaX;
		this.clientY = pos.clientY + deltaY;
		this.screenX = pos.screenX + deltaX;
		this.screenY = pos.screenY + deltaY;
		this.pageX = pos.pageX + deltaX;
		this.pageY = pos.pageY + deltaY;
	}

	function TouchList()
	{
		var touchList = [];

		touchList.item = function(index) {
			return this[index] || null;
		};

		// specified by Mozilla
		touchList.identifiedTouch = function(id) {
			return this[id + 1] || null;
		};

		return touchList;
	}

	function createTouchList(eventTarget, event)
	{
		var touchList = new TouchList();
		// Modified by me
		if(event.type != "touchend")
		{
			touchList.push(new Touch(eventTarget, 1, event.touches[0], 0, 0));
		}
		return touchList;
	}

	function getTouches(eventTarget, event)
	{
		var touchList = createTouchList(eventTarget, event);
		return touchList;
	}

	this.triggerTouch = function(newEventTarget, originalTouchEvent){
		var newTouchEvent = document.createEvent('Event');
		newTouchEvent.initEvent(originalTouchEvent.type, true, true);

		newTouchEvent.touches = getTouches(newEventTarget, originalTouchEvent);
		newTouchEvent.targetTouches = getTouches(newEventTarget, originalTouchEvent);
		newTouchEvent.changedTouches = getTouches(newEventTarget, originalTouchEvent);

		newEventTarget.dispatchEvent(newTouchEvent);
	};
})


;
