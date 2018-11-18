import React from 'react';
import ProgressBar from '../progress/progressBar'

class Controls extends React.Component {
    render() {
      return (
        <div className="controls-container" id="videoControls">
          <ProgressBar 
            progressBarRef={this.props.progressBarRef}
            handleProgressBarClick={this.props.handleProgressBarClick}
            progressBarValue={this.props.progressBarValue}
            progressBarMax={this.props.progressBarMax}
            progressBarMin={this.props.progressBarMin}
          />
          <div className="controls">
            <button className="pull-left" onClick={() => this.props.previousVideo()}><i className="material-icons">skip_previous</i></button>
            <button className="pull-left" onMouseUp={() => this.props.clearInterval()} onMouseDown={() => this.props.rewind()}><i className="material-icons">fast_rewind</i></button>
            <button className="pull-left" onClick={() => this.props.togglePlay()} id="playAndStop"><i className="material-icons">{this.props.togglePlayIcon}</i></button>
            <button className="pull-left" onMouseUp={() => this.props.clearInterval()} onMouseDown={() => this.props.forward()}><i className="material-icons">fast_forward</i></button>
            <button className="pull-left" onClick={() => this.props.nextVideo()}><i className="material-icons">skip_next</i></button>
            
            <button className="pull-right" onClick={() => this.props.handleFullscreen()}><i className="material-icons">{this.props.isFullScreen ? 'fullscreen_exit' : 'fullscreen'}</i></button>
            <button className="pull-right" onClick={() => this.props.toggleLoop()} style={{backgroundColor: this.props.loop ? "#fff" : 'transparent', color: this.props.loop ? "#000" : '#fff'}}><i className="material-icons">repeat</i></button>
  
            <div className="volumeContainer pull-right">
              <input className="volumeRange" type="range" onChange={(e) => this.props.handleVolumeChange(e)} value={this.props.volume} max="1" step="0.01" min="0" orient="vertical" />
              <button onClick={() => this.props.toggleMute()}><i className="material-icons">{this.props.volumeIcon}</i></button>
            </div>
  
            <button className="pull-right" onClick={() => this.props.handleKeyUp(39)} id="pos5"><i className="material-icons">forward_5</i></button>
            <button className="pull-right" onClick={() => this.props.handleKeyUp(37)} id="pos-5"><i className="material-icons">replay_5</i></button>
            <button className="pull-right" style={{padding: "7px 5px"}}>{this.props.currentTime} / {this.props.duration}</button>
          
          </div>
        </div>
      );
    }
}

export default Controls;