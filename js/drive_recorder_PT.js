window.addEventListener("DOMContentLoaded", function() {
	var player = document.getElementById("player");
	var recButton = document.getElementById("rec_bt");
	var stpButton = document.getElementById("stp_bt");
	var anchor = document.getElementById("download_link");

	var recorder;
	var chunks = [];
	var rec_time;

	var accessCameraSuccess = function(stream) {
	    player.srcObject = stream;/*videoタグに写す*/
	    makeRecorder(player.srcObject);/*引数はstreamでもいい*/
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
		makeRecorder(player.srcObject);
		recorder.ondataavailable = function(e) {
		    chunks.push(e.data);
		    makeBlobUrl();
		};
	});

	navigator.mediaDevices
	    .getUserMedia({video: {aspectRatio: 9/16, facingMode: "environment"}, audio: false})
	    .then(accessCameraSuccess, accessCameraFailure);
});
