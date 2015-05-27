/**
 * Created by WQ on 2015/5/27.
 */
(function () {
    //window.WebAudio = function () {
    //    this.autoPlay = false;
    //};
    var WebAudio = function () {
        this.autoPlay = false;
        var audio = this;
        Object.defineProperty( audio, "src", {
            get : function () {
                return this._src;
            },
            set : function ( src ) {
                console.log( src );
                this._src = src;
                var xhr = new XMLHttpRequest();
                var context = new AudioContext();
                xhr.open( "get", src, true );
                xhr.responseType = 'arraybuffer';
                xhr.onload = function () {
                    context.decodeAudioData( xhr.response, function ( buffer ) {
                        var source = context.createBufferSource();
                        source.buffer = buffer;
                        source.connect( context.destination );
                        source.start( 0 );
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