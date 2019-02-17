import React from 'react';

class Page extends React.Component {
  render() {
    return (
      <div>
        <p>I am a  PAGE</p>
        {this.props.children}
      </div>
    )
  }
}

export default Page;
