import React from 'react';
import QueueVideo from './queueVideo';

/**
 * @class QueueVideoContainer
 * @todo css, beautify
 * 
 * @description Show a list of video in the sidebar of the videoContainer
 */
class QueueVideoContainer extends React.Component {
    renderQueueVideo() {
      let queueVideoList = [];
  
      this.props.queueVideo.forEach((element, index) => {
        queueVideoList.push(<QueueVideo key={index} changeVideo={this.props.changeVideo} src={element.src} title={element.title} image={element.image} />)
      });
  
      return queueVideoList;
    }
  
    renderFeaturedVideo() {
      let featuredVideoList = [];
      this.props.featuredVideo.forEach((element, index) => {
        // Placeholder
        featuredVideoList.push(<QueueVideo key={index} src={this.props.queueVideo[0].src} title="Lorem ipsum" image="images/video.png" />);
      });
      return featuredVideoList;
    }
  
    render() {
      return (
          <div className="videoQueue">
            <h2>Next videos:</h2>
            <div className="videoList">
              {this.renderQueueVideo()}
            </div>
            <hr />
            <h2>Featured videos:</h2>
            <div className="videoList">
              {this.renderFeaturedVideo()}
            </div>
          </div>
      );
    }
}

export default QueueVideoContainer;