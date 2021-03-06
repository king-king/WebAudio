/**
 * Created by WQ on 2015/5/27.
 */
(function () {
    window.WebAudio = function () {
        var context = new AudioContext();
        this.autoPlay = false;
        var audio = this;
        audio.state = 0;// 0:初始化、1：下载中、2：下载完毕正在解码、3：解码完毕、4：播放中、5：暂停
        var startPlayTime = 0;
        var sumPlayTime = 0;
        audio.play = function ( offset, duration ) {
            if ( audio.state > 2 ) {
                if ( !offset && !duration && audio.state == 4 ) {
                    // 如果正在播放中，但是定位信息缺失，则直接return
                    return;
                }
                if ( audio.state == 4 ) {
                    // 正在播放，但是offset或者duration有数值，则暂停音乐，重新start
                    audio.pause();
                }
                startPlayTime = audio.context.currentTime;
                audio.state = 4;
                var source = context.createBufferSource();
                audio.loop && (source.loop = true);
                audio.source = source;
                source.buffer = audio.buffer;
                if ( audio.analyser ) {
                    var analyser = context.createAnalyser();
                    analyser.fftSize = 512;
                    source.connect( analyser );
                    analyser.connect( context.destination );
                    audio.frequencyData = new Uint8Array( analyser.frequencyBinCount );
                    audio.timeDomainData = new Uint8Array( analyser.frequencyBinCount );
                    function onaudioprocess() {
                        setTimeout( function () {
                            analyser.getByteFrequencyData( audio.frequencyData );
                            analyser.getByteTimeDomainData( audio.timeDomainData );
                            audio.onaudioprocess && audio.onaudioprocess( audio.frequencyData, audio.timeDomainData );
                            if ( audio.state == 4 ) {
                                onaudioprocess();
                            }
                        }, 1000 / 60 );
                    }

                    onaudioprocess();
                }
                else {
                    source.connect( context.destination );
                }
                offset && (sumPlayTime = offset);
                duration ? source.start( 0, offset || sumPlayTime % audio.duration, duration ) : source.start( 0, offset || sumPlayTime % audio.duration );
            }
        };

        audio.pause = function () {
            if ( audio.state == 4 ) {
                audio.state = 5;
                audio.source && audio.source.stop();
                sumPlayTime = sumPlayTime + audio.context.currentTime - startPlayTime;
            }
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
                        audio.buffer = buffer;
                        if ( audio.autoPlay ) {
                            audio.play();
                        }
                        audio.state = 3;
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