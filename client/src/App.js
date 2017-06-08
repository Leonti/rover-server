import React, { Component } from 'react';
import './App.css';

import Battery from './components/Battery';

class App extends Component {
  state = {
      battery: null
  }

  componentDidMount() {
    this.ws = new WebSocket('ws://localhost:3000/ws');

    this.ws.onopen = () => this.ws.send('Ping')

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
