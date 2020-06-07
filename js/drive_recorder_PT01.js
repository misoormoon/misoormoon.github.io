window.addEventListener("DOMContentLoaded", function() {
	var player = document.getElementById('player');

	var handleSuccess = function(stream) {
	    player.srcObject = stream;
	};
	var handleFailure = function(error) {
	    alert(error.name);
	}

	navigator.mediaDevices.getUserMedia({video: true})
	    .then(handleSuccess, handleFailure);
});