/**
 * Created by WQ on 2015/5/27.
 */
(function () {
    window.WebAudio = function () {
        var context = new AudioContext();
        this.autoPlay = false;
        var audio = this;
        audio.state = 0;// 0:初始化、1：下载中、2：下载完毕正在解码、3：解码完毕、4：播放中、5：暂停
        audio.currentTime = 0;
        audio.play = function ( offset, duration ) {
            if ( audio.state != 4 && audio.state > 2 ) {
                audio.state = 4;
                var source = context.createBufferSource();
                audio.loop && (source.loop = true);
                audio.source = source;
                source.buffer = audio.buffer;
                source.connect( context.destination );
                duration ? source.start( 0, offset || audio.currentTime, duration ) : source.start( 0, offset || audio.currentTime );
            }
        };

        audio.pause = function () {
            audio.state = 5;
            audio.source && audio.source.stop();
            audio.currentTime = audio.context.currentTime;
        };

        Object.defineProperty( audio, "src", {
            get : function () {
                return this._src;
            },
            set : function ( src ) {
                this._src = src;
                audio.state = 1;
                var xhr = new XMLHttpRequest();
                audio.context = context;
                xhr.open( "get", src, true );
                xhr.responseType = 'arraybuffer';
                xhr.onload = function () {
                    audio.state = 2;
                    context.decodeAudioData( xhr.response, function ( buffer ) {
                        console.log( buffer );
                        audio.duration = buffer.duration;
                        audio.state = 3;
                        audio.buffer = buffer;
                        if ( audio.autoPlay ) {
                            audio.play();
                        }
                        audio.onload && audio.onload();
                    } )
                };
                xhr.send();
            }
        } )
    };

    window.media = {
        WebAudio : WebAudio
    }

})();