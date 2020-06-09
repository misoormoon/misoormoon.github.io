window.addEventListener("DOMContentLoaded", function() {
	var player = document.getElementById("player");
	var recButton = document.getElementById("rec_bt");
	var stpButton = document.getElementById("stp_bt");
	var anchor = document.getElementById("download_link");
	var time = new Date();

	var recorder;

	var accessCameraSuccess = function(stream) {
	    player.srcObject = stream;/*videoタグに写す*/
	    recorder = new MediaRecorder(stream, 
	                   {mimeType: "video/mp4"/*"video/webm;codecs=vp9"*/});
	    recorder.ondataavailable = function(e) {
		var videoBlob = new Blob([e.data], {type: e.data.type});
		blobUrl = window.URL.createObjectURL(videoBlob);
		var year = time.getFullYear();
		var month = time.getMonth();
		var date = time.getDate();
		var hour = time.getHours();
		var min = time.getMinutes();
		var sec = time.getSeconds();
		var rec_time = year+"/"+month+"/"+date+"/"+hour+":"+min+":"+sec
		anchor.download = rec_time + ".mp4"/*"movie.webm"*/;/*ファイル名指定*/
		anchor.href = blobUrl;
		anchor.style.display = "block";
	    }

	};
	var accessCameraFailure = function(error) {
	    alert(error.name);
	};

	recButton.addEventListener("click", function(){
		recorder.start();
	});

	stpButton.addEventListener("click", function() {
		recorder.stop();
	});

	navigator.mediaDevices
	    .getUserMedia({video: {facingMode: "environment"}, audio: false})
	    .then(accessCameraSuccess, accessCameraFailure);
});
