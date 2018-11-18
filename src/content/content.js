import React from 'react';

class Content extends React.Component {
    render() {
      return (
        <div className="content">
          <section name="description" className="description">
            <h3>Description</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </section>
          <hr />
          <section name="comments" className="comments">
            <h3>Comments</h3>
            <p>No comments yet.</p>
          </section>
        </div>
      );
    }
}

export default Content;