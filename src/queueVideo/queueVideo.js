import React from 'react';

class QueueVideo extends React.Component {
    render() {
      return (
        <div className="videoPreview">
          <figure onClick={() => this.props.changeVideo(this.props.title, this.props.image, this.props.src)}>
            <img width="120" height="68" alt={this.props.title} src={this.props.image} />
            <figcaption>{this.props.title}</figcaption>
          </figure>
        </div>
      );
    }
}

export default QueueVideo;