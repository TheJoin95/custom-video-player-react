import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import VideoPlayer from './videoPlayer/videoPlayer';
// import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  (
    <VideoPlayer src="https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_30mb.mp4" />
  ),
  document.getElementById('root')
);