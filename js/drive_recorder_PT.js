window.addEventListener("DOMContentLoaded", function() {
	var player = document.getElementById("player");
	var canvas = document.getElementById("canvas");
	canvas.width = player.clientWidth;
	canvas.height = player.clientHeight * 1.5;
	/*なぜか縦は1.5倍しないとうまく行かない*/
	var recButton = document.getElementById("rec_bt");

	var handleSuccess = function(stream) {
	    player.srcObject = stream;
	};
	var handleFailure = function(error) {
	    alert(error.name);
	};

	recButton.addEventListener("click", function(){
		var context = canvas.getContext("2d");
		context.drawImage(player, 0, 0, canvas.width, canvas.height);
	});

	navigator.mediaDevices
	    .getUserMedia({video: {facingMode: "environment"}, audio: false})
	    .then(handleSuccess, handleFailure);
});