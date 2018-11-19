import React from 'react';

/**
 * @class ProgressBar
 * 
 * @description Show a cliclable progress bar that represent the progress of the video player
 */
class ProgressBar extends React.Component{
    render() {
        return (
        <div className="progress">
            <progress
                onClick={(e) => this.props.handleProgressBarClick(e)}
                id="progress"
                value={this.props.progressBarValue}
                max={this.props.progressBarMax}
                min={this.props.progressBarMin}
            >
            <span ref={this.props.progressBarRef} id="progress-bar"></span>
            </progress>
        </div>
        );
    }
}

export default ProgressBar;