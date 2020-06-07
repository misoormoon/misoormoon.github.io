window.addEventListener("DOMContentLoaded", function() {
	var player = document.getElementById("player");
	var canvas = document.getElementById("canvas");
	var recButton = document.getElementById("rec_bt");

	var handleSuccess = function(stream) {
	    player.srcObject = stream;
	};
	var handleFailure = function(error) {
	    alert(error.name);
	};

	recButton.addEventListener("click", function(){
		var context = canvas.getContext("2d");
		canvas.width = player.clientWidth;
		canvas.height = player.clientHeight;
		/*ここでcanvasのサイズを決めないと、縦がおかしくなる。*/
		/*おそらく、読み込みや定義のタイミングの問題*/
		context.drawImage(player, 0, 0, canvas.width, canvas.height);
	});

	navigator.mediaDevices
	    .getUserMedia({video: {facingMode: "environment"}, audio: false})
	    .then(handleSuccess, handleFailure);
});