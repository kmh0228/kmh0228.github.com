/***
 * getVA 获取视频流和语音流的方法
 * fnBack 为回调函数,参数是 返回的流
 * vaopt 是获取视频或者音频的选项 默认 {audio:true, video:true}
*/
//获取摄像头和语音的功能,回调函数参数为视频流
const getVA = function(fnBack,vaopt){
    var opt = vaopt || { audio: true, video: true }
    navigator.getUserMedia = navigator.getUserMedia || navigator.msGetUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if(!!navigator.getUserMedia){
        navigator.getUserMedia(opt,function(stream){
            //可以使用 window.URL.createObjectURL(stream); 把流转换成video或者audio的src
            fnBack && fnBack(stream)
        },function (error) {
            switch (error.code || error.name) {
                case 'PERMISSION_DENIED':
                case 'PermissionDeniedError':
                   throw '用户拒绝提供信息。';
                    break;
                case 'NOT_SUPPORTED_ERROR':
                case 'NotSupportedError':
                    throw'<a href="http://www.it165.net/edu/ewl/" target="_blank" class="keylink">浏览器</a>不支持硬件设备。';
                    break;
                case 'MANDATORY_UNSATISFIED_ERROR':
                case 'MandatoryUnsatisfiedError':
                    throw'无法发现指定的硬件设备。';
                    break;
                default:
                    throw '无法打开麦克风/视频。异常信息:' + (error.code || error.name);
                    break;
            }
        })
    }else{
        throw '当前<a href="http://www.it165.net/edu/ewl/" target="_blank" class="keylink">浏览器</a>不支持录音/录像功能。';
    }
}

export default getVA
