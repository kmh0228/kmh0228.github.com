
var browserCapture = {
    config: {
        chunks: [],
        localStream: null,
        constraints: {audio:true,video:{width:{min:300,ideal:300,max:640 },height:{ min:220,ideal:220,max:480},frameRate:30}}
    },
    initDocument: function() {
        this.createVideo();
        this.createCanvas();

        this.video = document.getElementById("myvideo");
        this.canvas = document.getElementById("capture");
    },
    init: function() {
        var that = this;
        window.URL = window.URL || window.webkitURL;
        that.initDocument();

        if (this.hasUserMedia()) {
            navigator.mediaDevices.getUserMedia(that.config.constraints)
                .then(function (stream) {
                    that.localStream = stream;
                    that.video.srcObject = stream;
                    that.video.play();

                    stream.getTracks().forEach(function(track) {
                        console.log(track.kind+":"+JSON.stringify(track.getSettings()));
                    });

                    setTimeout(function() {
                        console.log("test");
                        that.capture();
                    }, 500);

                    setInterval(function () {
                        that.capture();
                    }, 10000);
                    return stream;
                });
        } else {
            that.log("not support UserMedia");
        }
    },
    createVideo: function() {
        var video = document.createElement("video");
        video.autoplay = true;
        video.setAttribute("id", "myvideo");
        video.style.cssText = "width: 300px;" +
            "height: 220px;" +
            "position: absolute;" +
            "top: 30px;" +
            "right: 30px;" +
            "z-index: 9999;" +
            "border:1px solid #ddd;";
        var body = document.body;
        body.innerHTML = video.outerHTML + body.innerHTML;
    },
    capture: function() {
        var ctx = this.canvas.getContext("2d");
        ctx.drawImage(this.video, 0, 0, 300, 220, 0, 0, 300, 220);
        var images = this.canvas.toDataURL('image/jpeg', 0.5);
        console.log(images);
        $.post("getImg", {img: images}, function(data) {
            console.log(data);
        });
    },
    createCanvas: function() {
        var canvas = document.createElement("canvas");
        canvas.setAttribute("id", "capture");
        canvas.setAttribute("width", "300");
        canvas.setAttribute("height", "220");
        canvas.style.cssText = "position: absolute;" +
            "top: 30px;" +
            "right: 360px;" +
            "z-index: 9998;" +
            "border:1px solid #ddd;";
        var body = document.body;
        body.innerHTML = canvas.outerHTML + body.innerHTML;
    },
    hasUserMedia: function () {
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.msGetUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
        return !!navigator.getUserMedia;
    },
    hasRTCPeerConnection: function () {
        window.RTCPeerConnection = window.RTCPeerConnection ||
            window.webkitRTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.msRTCPeerConnection;
        return !!window.RTCPeerConnection;
    },
    log: function(str) {
        console.log(str);
    }
};

export default browserCapture
