"use strict";

function SpeechService(roomService) {
		
		// Fields

		let me = this;

		this.speechSynthesis = null;
		this.voices = null;
		this.selectedVoice = null;

		// Methods
		
		this.speakCurrentLocation = function (room) {
				return roomService.getBuilding(room.building).then((building) => {
						return new Promise((resolve, reject) => {
								let speechString = "You are currently near room " + room.legalName + ", in building " + building.name + ", on floor " + room.floor + ".";
								let utterance = new SpeechSynthesisUtterance(speechString);
								if (me.selectedVoice) {
										utterance.voice = me.selectedVoice;
								}
								me.speechSynthesis.speak(utterance);
								utterance.onend = (event) => { resolve(); };
								utterance.onerror = reject;
						});
				});
		};

		this.speakStep = function (text) {
				return new Promise((resolve, reject) => {
						let utterance = new SpeechSynthesisUtterance(text);
						if (me.selectedVoice) {
								utterance.voice = me.selectedVoice;
						}
						me.speechSynthesis.speak(utterance);
						utterance.onend = (event) => { resolve(); };
						utterance.onerror = reject;
						resolve();
				});
		};

		// Init
		
		this.init = function () {
				return new Promise((resolve, reject) => {
						me.speechSynthesis = window.speechSynthesis;
						
						// Retreive all voices
						
						me.voices = me.speechSynthesis.getVoices();
						if (me.voices.length >= 1) {
								resolve();
						}

						if (me.speechSynthesis.onvoiceschanged !== undefined) {
								me.speechSynthesis.onvoiceschanged = (event) => {
										me.voices = me.speechSynthesis.getVoices();
										resolve();
								};
						}
				}).then(() => {

						// Search for an English voice
						
						let englishVoicePred = (voice) => { return voice.lang.toLowerCase().includes("en"); };
						let britVoicePred = (voice) => { return voice.lang.toLowerCase().includes("gb"); };
						let amerVoicePred = (voice) => { return voice.lang.toLowerCase().includes("us"); };
						
						let englishVoices = me.voices.filter(englishVoicePred);
						let britVoices = englishVoices.filter(britVoicePred);
						let amerVoices = englishVoices.filter(amerVoicePred);

						// Put them in a certain priority and select the best one
						
						let priorityVoices = amerVoices.concat(britVoices).concat(englishVoices);

						if (priorityVoices.length >= 1) {
								me.selectedVoice = priorityVoices[0];
						}
				});
		};
}
