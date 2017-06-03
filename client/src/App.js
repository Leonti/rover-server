import React, { Component } from 'react';
import './App.css';

import Battery from './components/Battery';

class App extends Component {
  state = {
      battery: null
  }

  componentDidMount() {
    fetch('/api/battery')
      .then(res => res.json())
      .then(battery => this.setState({ battery }));
  }

  render() {

    const batteryView = this.state.battery != null ?
        <Battery
            battery={this.state.battery}
        /> : null;

    return (
      <div className="App">
        <h1>Rover</h1>
        {batteryView}
      </div>
    );
  }
}

export default App;
