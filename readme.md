# WebAudio API

通过WebAudio技术获得比HTML5中audio标签更为强大的功能和更为流畅的体验。


### 简单的用例

采用构造函数的语法创建一个webaudio对象，然后给src属性赋值，过程和用javascript创建一个img标签类似。

```js
var webaudio=new WebAudio();
audio.src = "music/bg.mp3";
```
默认情况下audio不是自动播放，如果需要音频下载、解码完成后自动播放，需要设置autoPlay属性：
```js
var webaudio=new WebAudio();
audio.autoPlay=true;
audio.src = "music/bg.mp3";
```