"use strict";

function LocationService() {

  // Fields

  this.files = {

  };

  let me = this;

  this.location = null;

  this.startLocalisation = function() {
    //init quietjs here
    var TextReceiver = (function() {
      console.log("Start creation of Quiet");
      Quiet.init({
        profilesPrefix: "./assets/", //TODO: need to add profile
        memoryInitializerPrefix: "./assets/",
        libfecPrefix: "./assets/"
      });
      console.log("Iets");

      var target;
      var content = new ArrayBuffer(0);
      var warningbox;

      function onReceive(recvPayload) {
        content = Quiet.mergeab(content, recvPayload);
        this.location = Quiet.ab2str(content);
        console.log("location is: ", this.location);
      };

      function onReceiverCreateFail(reason) {
        console.log("failed to create quiet receiver: " + reason);
      };

      function onReceiveFail(num_fails) {
        console.log("Failed to receive message: " + num_fails);
      };

      function onQuietReady() {
        console.log("Quiet created");
        var profilename = "ultrasonic-experimental";
        Quiet.receiver({
          profile: profilename,
          onReceive: onReceive,
          onCreateFail: onReceiverCreateFail,
          onReceiveFail: onReceiveFail
        });
      };

      function onQuietFail(reason) {
        console.log("quiet failed to initialize: " + reason);
      };
      Quiet.addReadyCallback(onQuietReady, onQuietFail);
    })();
  };

  this.getLocation = function() {
    return location;
  };

  // Init
  this.init = function() {
    return new Promise((resolve, reject) => {
      this.startLocalisation();
      console.log("Gedaan");
    });
  };

}
