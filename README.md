# VUBNavigate

A (web)app for navigating through the VUB written in HTML, plain JavaScript and CSS. It uses ultrasonic communication to interact with beacons or scans the surrounding Wi-Fi networks and matches the MAC-address to a location.

## Libraries

This project uses the following libraries:

*	[Material Design Lite](https://getmdl.io/) from Google
*	[Quiet JS](https://github.com/quiet/quiet-js) for ultrasonic communication
*	[Mozilla jsical](https://github.com/mozilla-comm/ical.js/) for parsing ics and vCards.
*	[Cordova](https://cordova.apache.org/) for building a mobile app
*	[Polyfill for Dialog](https://github.com/GoogleChrome/dialog-polyfill) for replacing dialog functionality
*	[Dijkstra algorithm in JavaScript](https://github.com/andrewhayward/dijkstra) for calculating the shortest path

and uses the following Web API's:

*	[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for the local database
*	[Speech Synthesis](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for saying directions out loud

