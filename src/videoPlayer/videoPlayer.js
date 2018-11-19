import React from 'react';
import Controls from '../controls/controls';
import QueueVideoContainer from '../queueVideo/queueVideoContainer';
import Content from '../content/content';

/**
 * @class VideoPlayer
 * @todo add subtitles button, export state obj
 * 
 * @description Show a custom video player with a sidebar inside a container
 */
class VideoPlayer extends React.Component {
    videoElement = React.createRef();
    PADDING_CONTAINER = 5;
  
    constructor(props) {
      super(props);
      this.state = {
        paused: true,
        transitionIcon: 'timer', // material-icon to show in the transitions
        autoplay: props.autoPlay ? true : false,
        muted: props.muted ? true : false,
        volume: 0.8, // from 0 to 1
        status: 'loading', // dynamic videoplayer's status
        loop: false,
        togglePlayIcon: 'play_arrow', // material-icon to show in the controls bar
        volumeIcon: 'volume_up', // material-icon to show in the controls bar for the volume button
        currentTime: "0:00",
        duration: "0:00",
        playingVideo: { // obj that represents the playing video
          title: "Big Buck Bunny",
          image: "images/big_buck.png",
          src: "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_30mb.mp4",
        },
        // subtitles: props.subtitles ? true : false,
        // allowFullscreen: props.allowFullscreen ? true : false,
        isFullScreen: false,
        progressBar: { // progress bar config
          value: 0,
          min: 0,
          max: 0,
          compatibleElement: React.createRef()
        },
        featuredVideo: Array(3).fill(null), // test, future implementation
        queueVideo: [ // video in queue
          {
            src: "https://download.blender.org/durian/trailer/sintel_trailer-720p.mp4",
            title: "Sintel - A blender movie",
            image: "images/sintel.png"
          },
          {
            src: "https://www.videvo.net/videvo_files/converted/2016_11/videos/GOPR6239_1.mov34724.mp4",
            title: "The awesome world of turtles",
            image: "images/turtle.png"
          },
          {
            src: "https://ia600209.us.archive.org/24/items/WildlifeSampleVideo/Wildlife.mp4",
            title: "Celebrate wildlife like polar bears this season",
            image: "images/wild-life.png"
          },
          {
            src: "https://archive.org/download/youtube-O-XidwKsKAE/This_is_the_new_Google_Earth-O-XidwKsKAE.mp4",
            title: "This is the new Google Earth",
            image: "images/earth.png"
          },
          {
            title: "Big Buck Bunny",
            image: "images/big_buck.png",
            src: "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_30mb.mp4",
          }
        ]
      };
      
      /**
       * Functions bind to this class
       * So I can use it in the children component of this app
      */
      this.changeVideo = this.changeVideo.bind(this);
      this.previousVideo = this.previousVideo.bind(this);
      this.clearInterval = this.clearInterval.bind(this);
      this.rewind = this.rewind.bind(this);
      this.togglePlay = this.togglePlay.bind(this);
      this.forward = this.forward.bind(this);
      this.nextVideo = this.nextVideo.bind(this);
      this.handleFullscreen = this.handleFullscreen.bind(this);
      this.toggleLoop = this.toggleLoop.bind(this);
      this.handleVolumeChange = this.handleVolumeChange.bind(this);
      this.toggleMute = this.toggleMute.bind(this);
      this.handleKeyUp = this.handleKeyUp.bind(this);
      this.handleProgressBarClick = this.handleProgressBarClick.bind(this);
    }
    
    /**
     * @function togglePlay
     * @description Play | Pause the player and update the player's status
     * @returns void
     */
    togglePlay() {
      const video = this.videoElement.current;
      let togglePlayIcon = 'pause';
      if (video.paused || video.ended) {
        video.play();
      } else {
        togglePlayIcon = 'play_arrow';
        video.pause();
      }
      video.focus();
  
      this.setState({
        togglePlayIcon: togglePlayIcon,
        paused: video.paused,
        status: video.paused ? 'paused' : 'playing',
        transitionIcon: video.paused ? 'play_arrow' : 'timer'
      })
    }
    
    /**
     * @function onTimeUpdate
     * @description HTMLVideoElement event that is fired everytime the player show the next frame (based on video.currentTime).
     * @description It will update the currentTime and the progressBar Componenet with the real progress
     * @returns void
     */
    onTimeUpdate() {
      const progressBar = this.state.progressBar;
      const videoElement = this.videoElement.current;
      if (progressBar.max === 0) progressBar.max = videoElement.duration;
      progressBar.value = videoElement.currentTime;
      let tmpDate = new Date(null);
      tmpDate.setSeconds(videoElement.currentTime);
      this.setState({currentTime: tmpDate.toISOString().substr(14, 5)}); // mm:ss
      progressBar.compatibleElement.current.style.width = Math.floor((videoElement.currentTime / videoElement.duration) * 100) + '%';
  
      this.setState({
        progressBar: progressBar
      });
    }
    
    /**
     * @function onLoadedMetadata
     * @description HTMLVideoElement event that is fired when the video has loaded the minimun metadata
     * @description It will update the duration, the progressbar and the status of the player from loading to loaded/paused
     * @returns void
     */
    onLoadedMetadata() {
      const progressBar = this.state.progressBar;
      const videoElement = this.videoElement.current;
      progressBar.max = videoElement.duration;
      let tmpDate = new Date(null);
      tmpDate.setSeconds(videoElement.duration);
      this.setState({
        status: this.state.autoplay ? 'loaded' : 'paused',
        transitionIcon: this.state.autoplay ? 'timer' : 'play_arrow',
        duration: tmpDate.toISOString().substr(14, 5),
        progressBar: progressBar
      });
    }
    
    /**
     * @function handleProgressBarClick
     * @description It handle the progressbar click for seeking the right frame to show
     * @description PAY ATTENTION: the right position is based on the offset of the progress element from the left of the page. Be careful in the margins and padding
     * @returns void
     */
    handleProgressBarClick(e) {
      const videoElement = this.videoElement.current;
      const PADDING_CONTAINER = this.PADDING_CONTAINER;
      var pos = (e.pageX - document.getElementById('root').offsetLeft - PADDING_CONTAINER - e.target.offsetLeft) / e.target.offsetWidth;
      videoElement.currentTime = pos * videoElement.duration;
    }
  
    /**
     * @function handleKeyUp
     * @description By pressing the left arrow or the right arrow we will travel over time. By pressing the space key we will stop the time.
     * @returns void
     */
    handleKeyUp(keyCode) {
      const videoElement = this.videoElement.current;
      switch(keyCode) {
        case 37:
        // left
        videoElement.currentTime -= 5;
        break;
  
        case 39:
        // right
        videoElement.currentTime += 5;
        break;
  
        case 32:
        // space
        this.togglePlay();
        break;
  
        default:
        // Nope
        break;
      }    
    }
    
    /**
     * @function handleVolumeChange
     * @description It handle the event from the input range and it will change the volume. NOTE: the value is decimal; in the mobile browser this feature is disabled
     * @param e - HTMLEvent - the event from the input range
     * @returns void
     */
    handleVolumeChange(e) {
      const videoElement = this.videoElement.current;
      if(e !== null && e.target.value > 0) {
        this.setState({volume: e.target.value, muted: false, volumeIcon: (e.target.value > 0.5 ? 'volume_up' : 'volume_down')});
        videoElement.volume = e.target.value;
      }else{
        this.setState({volume: e.target.value, volumeIcon: 'volume_mute'});
      }
    }
    
    /**
     * @function handleFullscreen
     * @description Toggle the fullscreen view
     * @returns void
     */
    handleFullscreen() {
      const videoElement = this.videoElement.current;
      if (this.state.isFullScreen === true) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        this.setState({isFullScreen: false});
     } else {
        if (videoElement.parentNode.requestFullscreen) videoElement.parentNode.requestFullscreen();
        else if (videoElement.parentNode.mozRequestFullScreen) videoElement.parentNode.mozRequestFullScreen();
        else if (videoElement.parentNode.webkitRequestFullScreen) videoElement.parentNode.webkitRequestFullScreen();
        else if (videoElement.parentNode.msRequestFullscreen) videoElement.parentNode.msRequestFullscreen();
        this.setState({isFullScreen: true});
     }
    }
    
    /**
     * @function toggleMute
     * @description Toggle the mute flag
     * @returns void
     */
    toggleMute() {
      const current = this.state;
      this.setState({muted: !current.muted, volumeIcon: (!current.muted === true ? 'volume_off' : 'volume_up')});
    }
    
    /**
     * @function stop
     * @description It will stop and reset to the start the video
     * @returns void
     */
    stop() {
      const videoElement = this.videoElement.current;
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  
    /**
     * @function toggleLoop
     * @description It will active the autoplay. The video "will not end at the end"
     * @returns void
     */
    toggleLoop() {
      const current = this.state;
      this.setState({loop: !current.loop});
    }
  
    /**
     * @function forward
     * @description It will increment the currentTime
     * @todo not fluid, any suggest? Maybe create the settings for speed up the reproducing speed like 2x 1.5x etc
     * @returns void
     */
    forward() {
      const videoElement = this.videoElement.current;
      this.setState({forwardInterval: setInterval(function() {
        videoElement.currentTime += 1.5;
      }, 400)});
    }
  
    /**
     * @function rewind
     * @description It will decrement the currentTime
     * @todo not fluid, any suggest? Maybe create the settings for speed up the reproducing speed like -2x -1.5x etc
     * @returns void
     */
    rewind() {
      const videoElement = this.videoElement.current;
      this.setState({rewindInterval: setInterval(function() {
        videoElement.currentTime -= 1.5;
      }, 400)});
    }

    /**
     * @function clearInterval
     * @description It will clear the rewind and forward interval
     * @returns void
     */
    clearInterval() {
      const current = this.state;
      clearInterval(current.rewindInterval);
      clearInterval(current.forwardInterval);
    }
  
    /**
     * @function toggleSpinner
     * @description It's not a real spinner. It is just a clock
     * @returns void
     */
    toggleSpinner() {
      const current = this.state;
      let status = 'loaded';
      if(current.status === 'loading') {
        status = 'loading';
      }
  
      this.setState({
        status: status,
        transitionIcon: 'timer'
      });
    }
  
    /**
     * @function handleTouchStart
     * @description Testing, not used
     * @returns void
     */
    handleTouchStart(e) {
      const current = this.state;
      this.setState({
        status: `${current.status} showControls`
      });
      return false;
    }
  
    /**
     * @function handleTouchEnd
     * @description Testing, not used
     * @returns void
     */
    handleTouchEnd(e) {
      const current = this.state;
      this.setState({
        status: current.status.replace(' showControls', '')
      });
    }
  
    /**
     * @function changeVideo
     * @description It will change the video with the selected one and requeue the actual video
     * @param title - string - title of the video
     * @param image - string - image of the video
     * @param src - string - url of the video to reproduce
     * @param top - bool - optional - flag to requeue the actual video at the bottom or at the top of the queue video list
     * @returns void
     */
    changeVideo(title, image, src, top=false) {
      const current = this.state;
      this.requeueVideo(current.playingVideo, top);

      this.setState({
        status: 'changing',
        transitionIcon: 'timer',
        playingVideo: {
          title: title,
          image: image,
          src: src
        },
        autoplay: true,
        paused: false,
        togglePlayIcon:'pause'
      });
      return false;
    }
  
    /**
     * @function requeueVideo
     * @description It will requeue the video (no duplicate)
     * @param videoObj - obj - {title: string, src: string, image: string}
     * @param top - bool - optional - flag to requeue the videoObj at the bottom or at the top of the queue video list
     * @returns void
     */
    requeueVideo(videoObj, top=false) {
      const current = this.state;
      let alreadyInQueue = false;
      let queueVideo = current.queueVideo;
      queueVideo.forEach((element, index) => {
        if(element.src === videoObj.src) {
          alreadyInQueue = true;
        }
      });
      
      // If is not present in the list
      if(alreadyInQueue === false) {
        if(top === true)
          current.queueVideo.unshift(videoObj);
        else
          current.queueVideo.push(videoObj);
  
        this.setState({
          queueVideo: queueVideo
        });
      }
  
    }
  
    /**
     * @function nextVideo
     * @description It will reproduce the next video in queue
     * @returns void
     */
    nextVideo() {
      const current = this.state;
      var queueVideo = current.queueVideo;
      let nextVideo = queueVideo.shift();
      
      this.changeVideo(nextVideo.title, nextVideo.image, nextVideo.src);
    }
  
    /**
     * @function previousVideo
     * @description It will reproduce the previous video in queue (the last one)
     * @returns void
     */
    previousVideo() {
      const current = this.state;
      var queueVideo = current.queueVideo;
      let prevVideo = queueVideo.pop();
      
      this.changeVideo(prevVideo.title, prevVideo.image, prevVideo.src, true);
    }
    
    /**
     * @function onVideoEnded
     * @description HTMLMediaEvent - At the end of the video I need to reproduce the next video in the queue list. Actually I will wait 2sec to make a fadeOut effect
     * @returns void
     */
    onVideoEnded() {
      this.setState({
        status: 'ended',
        transitionIcon: ''
      });
      setTimeout(function() {
        this.nextVideo();
      }.bind(this), 2000);
    }
  
    render() {
      return (
        <div className="videoWrapper">
          <h2>{this.state.playingVideo.title}</h2>
          <div className="col-2-3">
            <div id="videoContainer" className={this.state.status}>
              <div onClick={() => (this.state.status === 'paused' ? this.togglePlay() : '')} className={`${this.state.status}-transition transition`}><i className="material-icons">{this.state.transitionIcon}</i></div>
              <video 
                tabIndex="-1"
                id="player"
                onClick={() => this.togglePlay()}
                onEnded={() => this.onVideoEnded()}
                onLoadedMetadata={() => this.onLoadedMetadata()}
                onTimeUpdate={() => this.onTimeUpdate()}
                onWaiting={() => this.toggleSpinner()}
                onPlaying={() => this.toggleSpinner()}
                onKeyUp={(e) => this.handleKeyUp(e.keyCode)}
                ref={this.videoElement}
                muted={this.state.muted}
                loop={this.state.loop}
                volume={this.state.volume}
                preload="metadata"
                src={this.state.playingVideo.src}
                autoPlay={this.state.autoplay}
              >
                Use a browser with video support, pls.
              </video>
  
              <Controls 
                handleProgressBarClick={this.handleProgressBarClick}
                progressBarValue={this.state.progressBar.value}
                progressBarMax={this.state.progressBar.max}
                progressBarMin={this.state.progressBar.min}
                progressBarRef={this.state.progressBar.compatibleElement}
                previousVideo={this.previousVideo}
                clearInterval={this.clearInterval}
                rewind={this.rewind}
                togglePlay={this.togglePlay}
                togglePlayIcon={this.state.togglePlayIcon}
                forward={this.forward}
                nextVideo={this.nextVideo}
                handleFullscreen={this.handleFullscreen}
                isFullScreen={this.state.isFullScreen}
                toggleLoop={this.toggleLoop}
                loop={this.state.loop}
                handleVolumeChange={this.handleVolumeChange}
                volume={this.state.volume}
                toggleMute={this.toggleMute}
                volumeIcon={this.state.volumeIcon}
                handleKeyUp={this.handleKeyUp}
                currentTime={this.state.currentTime}
                duration={this.state.duration}
              />
            </div>
            <Content />
          </div>
          <div className="col-1-3">
            <QueueVideoContainer featuredVideo={this.state.featuredVideo} changeVideo={this.changeVideo} queueVideo={this.state.queueVideo} />
          </div>
        </div>
      );
    }
}

export default VideoPlayer;