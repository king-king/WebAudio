/**
 * Created by WQ on 2015/5/27.
 */
(function () {
    var WebAudio = function () {
        var context = new AudioContext();
        this.autoPlay = false;
        var audio = this;
        audio.state = 0;// 0:初始化、1：下载中、2：下载完毕正在解码、3：播放中、4：暂停
        audio.currentTime = 0;
        audio.play = function () {
            if ( audio.state != 3 ) {
                audio.state = 3;
                var source = context.createBufferSource();
                audio.source = source;
                source.buffer = audio.buffer;
                source.connect( context.destination );
                source.start( 0, audio.currentTime );
            }
        };

        audio.pause = function () {
            audio.state = 4;
            audio.source && audio.source.stop();
            audio.currentTime = audio.context.currentTime;
        };

        Object.defineProperty( audio, "src", {
            get : function () {
                return this._src;
            },
            set : function ( src ) {
                this._src = src;
                var xhr = new XMLHttpRequest();
                audio.context = context;
                xhr.open( "get", src, true );
                xhr.responseType = 'arraybuffer';
                xhr.onload = function () {
                    context.decodeAudioData( xhr.response, function ( buffer ) {
                        audio.buffer = buffer;
                        if ( audio.autoPlay ) {
                            var source = context.createBufferSource();
                            source.connect( context.destination );
                            audio.source = source;
                            source.buffer = buffer;
                            audio.state = 3;
                            source.start( 0 );
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