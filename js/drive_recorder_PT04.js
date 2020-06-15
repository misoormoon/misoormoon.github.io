window.addEventListener("DOMContentLoaded", function() {
	var player = document.getElementById("player");
	var canvas = document.getElementById("canvas");
	var recButton = document.getElementById("rec_bt");
	var stpButton = document.getElementById("stp_bt");
	var anchor = document.getElementById("download_link");

	var canvasStream;
	var recorder;
	var chunks = [];
	var rec_time;

	var accessCameraSuccess = function(stream) {
	    player.srcObject = stream;/*videoタグに写す*/
	    setInterval(function(){
		var context = canvas.getContext("2d");
		canvas.width =player.clientWidth;
		canvas.height = player.clientHeight;
		context.drawImage(player, 0, 0, canvas.width, canvas.height);
	    }, 1000/30);
	    canvasStream = canvas.captureStream();
	    console.log(canvasStream);
	    alert(canvasStream);
	    makeRecorder(canvasStream);/*引数はstreamでもいい*/
	    recorder.ondataavailable = function(e) {
		chunks.push(e.data);
		makeBlobUrl();
	    };
	}

	function makeRecorder(stream) {
	    recorder = new MediaRecorder(stream, 
	                   {mimeType: "video/mp4"/*"video/webm;codecs=vp9"*/});
	}

	function makeBlobUrl() {
	    var videoBlob = new Blob(chunks, {type: "video/mp4"});
	    console.log(chunks);
	    chunks = [];
	    console.log(videoBlob);
	    var blobUrl = window.URL.createObjectURL(videoBlob);
	    anchor.download = rec_time + ".mp4"/*"movie.webm"*/;/*ファイル名指定*/
	    anchor.href = blobUrl;
	    anchor.style.display = "block";
	}
		
	var accessCameraFailure = function(error) {
	    alert(error.name);
	};

	recButton.addEventListener("click", function(){
		var time = new Date();
		rec_time = time.getFullYear()+"年"+(time.getMonth()+1)+"月"
		    +time.getDate()+"日"+time.getHours()+"時"
		    +time.getMinutes()+"分"+time.getSeconds()+"秒";
		recorder.start();
	});

	stpButton.addEventListener("click", function() {
		recorder.stop();
		makeRecorder(canvasStream);
		recorder.ondataavailable = function(e) {
		    chunks.push(e.data);
		    makeBlobUrl();
		};
	});

	navigator.mediaDevices
	    .getUserMedia({video: {facingMode: "environment"}, audio: false})
	    .then(accessCameraSuccess, accessCameraFailure);
});
