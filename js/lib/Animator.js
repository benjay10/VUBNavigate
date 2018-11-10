"use strict";

function Animator(animInClass, animOutClass, hiddenClass, isVisible, removeAtEnd, useAnimations) {
	
	this.domObject = null;

	this.setObject = function (domObj) {
		this.domObject = domObj;
		return this;
	};

	this.disableAnimations = function () {
		useAnimations = false;
	};

	this.enableAnimations = function () {
		useAnimations = true;
	};

	this.show = function () {
		let me = this;
		let obj = this.domObject;
		return new Promise((resolve, reject) => {
			isVisible = true;
			obj.removeEventListener("animationend", this.onAnimationEnd);
			if (useAnimations) {
				obj.classList.remove(animOutClass);
				obj.classList.add(animInClass);
				obj.classList.remove(hiddenClass);
			} else {
				obj.classList.remove(hiddenClass);
				obj.classList.remove(animInClass);
				obj.classList.remove(animOutClass);
			}
			resolve();
		});
	};

	this.hide = function () {
		let me = this;
		let obj = this.domObject;
		return new Promise((resolve, reject) => {
			isVisible = false;
			if (useAnimations) {
				obj.classList.remove(animInClass);
				obj.classList.add(animOutClass);
				obj.addEventListener("animationend", this.onAnimationEnd);
			} else {
				obj.classList.add(hiddenClass);
				obj.classList.remove(animInClass);
				obj.classList.remove(animOutClass);
			}
			resolve();
		});
	};

	this.toggle = function () {
		return (isVisible ? this.hide() : this.show());
	};

	this.onAnimationEnd = function _onAnimEnd(event) {
		event.stopPropagation();
		event.currentTarget.removeEventListener("animationend", _onAnimEnd);
		if (! isVisible) {
			if (removeAtEnd) {
				event.currentTarget.parentNode.removeChild(event.currentTarget);
			}
			else {
				event.currentTarget.classList.add(hiddenClass);
			}
		}
	};
}

