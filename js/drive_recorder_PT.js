window.addEventListener("DOMContentLoaded", function() {
	var player = document.getElementById("player");
	var permButton = document.getElementById("perm_bt");
	var recButton = document.getElementById("rec_bt");
	var acdButton = document.getElementById("acd_bt");
	var anchors = document.getElementsByClassName("download_link");
	var permSe = document.getElementById("perm_se");
	var acdSe = document.getElementById("acd_se");

	var recorder;
	var chunks = [];
	var videoBlobs = [];
	var recTimes = [];
	var recordTimerId;
	var accident = "unhappend";
	var step = 0;

	var accessCameraSuccess = function(stream) {
	    player.srcObject = stream;/*videoタグに写す*/
	    streamBuff = stream;/*recorderに直接渡すためにグローバルに代入*/
	    console.log(streamBuff);
	    setRecording(streamBuff);
	    };

	function setRecording(stream) {
	    makeRecorder(stream);
	    console.log(stream);
	    console.log(recorder.state);
	    recorder.ondataavailable = function(e) {
		console.log(recorder.state);
		chunks.push(e.data);
		console.log(chunks);
		if (chunks.length >= 4) {
		    chunks.shift();/*.splice(0, 1)でも良い*/
		}
		console.log(chunks);
		if(step >= 2){
		    makeBlob();
		    makeBlobUrl();
		}
	    }
	}

	function makeRecorder(stream) {
	    recorder = new MediaRecorder(stream, 
	                   {mimeType: "video/mp4"/*"video/webm;codecs=vp9"*/});
	}

	function makeBlob() {
	    for(var i=0; i<chunks.length; i++) {
		var chunk= chunks.slice(i,i+1);
		var videoBlob = new Blob(chunk, {type: "video/mp4"});
		videoBlobs.push(videoBlob);
	    }
	    console.log(videoBlobs);
	}

	function makeBlobUrl() {
	    var blobUrls = [];
	    for(var i=0; i<videoBlobs.length; i++){
		var blobUrl = window.URL.createObjectURL(videoBlobs[i]);
		blobUrls.push(blobUrl);
	    }
	    for(var i=0; i<blobUrls.length; i++){
		anchors[i].download = recTimes[i] + ".mp4"/*"movie.webm"*/;/*ファイル名指定*/
		anchors[i].href = blobUrls[i];
		anchors[i].style.display = "block";
	    }
	}

	var accessCameraFailure = function(error) {
	    alert(error.name);
	};

	recButton.addEventListener("click", function(){
		startRecording();
		recButton.disabled = true;
	    });

	function startRecording() {
	    if (accident == "happend") {
		step++;
	    }
	    if (step < 2) {
		var time = new Date();
		var recTime = time.getFullYear()+"年"+(time.getMonth()+1)+"月"
		    +time.getDate()+"日"+time.getHours()+"時"
		    +time.getMinutes()+"分"+time.getSeconds()+"秒";
		console.log(recTime);
		recTimes.push(recTime);
		if(recTimes.length >= 4){
		    recTimes.shift();
		}
		console.log(recTimes);
		recorder.start();/*引数はtimeslice(ミリ秒)*/
		console.log(recorder.state);
		recordTimer();
	    }
	    else{
		;/*終了時にはスタートしたくないので。*/
	    }
	}

	function recordTimer() {
	    recordTimerId = setTimeout(function() {
		    recorder.stop();
		    console.log(recorder.state);
		    setRecording(streamBuff);
		    startRecording();
		}, 10000);
	    console.log(recordTimerId);
	}

	acdButton.addEventListener("click", function() {
		accident = "happend";
		acdButton.disabled = true;
		acdSe.play();
	});

	navigator.mediaDevices
	    .getUserMedia({video: {facingMode: "environment"}, audio: false})
	    .then(accessCameraSuccess, accessCameraFailure);

	function accessMotionSensor() {
	    if(!DeviceMotionEvent){
		alert("加速度センサーへのアクセスができません。safariの設定を変更するか、事故発生時に手動でaccidentボタンを押して録画処理をしてください。")
	    }
	    if(typeof DeviceMotionEvent.requestPermission === "function"){
		DeviceMotionEvent.requestPermission()
		    .then(accessMotionSensorSuccess);
	    }
	}

	function accessMotionSensorSuccess(response) {
	    if(response === "granted") {
		window.addEventListener("devicemotion", function(e){
			/*console.log(e.acceleration.x);*//*確認用*/
			/*console.log(e.acceleration.y);*//*確認用*/
			/*console.log(e.acceleration.z);*//*確認用*/
			/*console.log(e.interval);*//*確認用*/
			accidentHappend(e);
		})
	    }
	    else {
		alert("加速度センサーへのアクセスが拒否されました。更新してアクセス許可するか、事故発生時に手動でaccidentボタンを押して録画処理をしてください。")
	    }
	}

	function accidentHappend(e) {
	    if(e.acceleration.x > 10 ||
	       e.acceleration.y > 10 ||
	       e.acceleration.z > 10) {
		accident = "happend";
		acdButton.disabled = true;
		acdSe.play();
	    }
	}

	function accessAudio() {
	    permSe.play();
	}

	permButton.addEventListener("click", function() {
		accessMotionSensor();
		permButton.disabled = true;
	    });
	permButton.addEventListener("click", accessAudio);
});