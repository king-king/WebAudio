# WebAudio API

通过WebAudio技术获得比HTML5中audio标签更为强大的功能和更为流畅的体验。


### 简单的用例

* 采用构造函数的语法创建一个webaudio对象，然后给src属性赋值，过程和用javascript创建一个img标签类似。

```js
var webaudio=new WebAudio();
audio.src = "music/bg.mp3";
```
* 默认情况下audio不是自动播放，如果需要音频下载、解码完成后自动播放，需要设置autoPlay属性：
```js
var webaudio=new WebAudio();
audio.autoPlay=true;
audio.src = "music/bg.mp3";
```
* 音频是有状态的，可以通过state属性读取audio的状态
```js
//audio.state
0：初始化
1：下载中
2：下载完毕正在解码
3：解码完毕
4：播放中
5：暂停
```
* 可以调用pause()方法暂停音乐播放，state会变为5。可以通过state是否为4或5来判断音乐是否播放过。

* audio.play([offset],[duration]) 该方法既可以实现从指定时间（offset）、指定时长（duration）播放音乐。play方法
的两个参数从根本上支持了音乐播放中的快进、快退功能。

* 可以通过设置loop属性为true，让音乐循环播放
