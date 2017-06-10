import React, { Component } from 'react'
import './App.css'

import Battery from './components/Battery'
import Navigation from './components/Navigation'
import Control from './service/Control'

class App extends Component {
  state = {
      battery: null,
      speed: 40,
      wsConnected: false,
      wsError: false,
  }

  control = null

  componentDidMount() {
    let server = new WebSocket(`ws://${window.location.host}/ws`)
    server.onopen = () => {
        this.setState({wsConnected: true})
        this.control = new Control(server)
    }
    server.onerror = err => this.setState({wsError: true})

    fetch('/api/battery')
      .then(res => res.json())
      .then(battery => this.setState({ battery }));
  }

  render() {

    const batteryView = this.state.battery != null ?
        <Battery
            battery={this.state.battery}
        /> : null
    const navigationView = this.state.wsConnected ?
        <Navigation
            onForward={() => this.control.forward(this.state.speed)}
            onBack={() => this.control.back(this.state.speed)}
            onLeft={() => this.control.left(this.state.speed)}
            onRight={() => this.control.right(this.state.speed)}
            onStop={() => this.control.stop()}
        /> : <div>Connecting to rover</div>

    return (
      <div className="App">
        <h1>Rover</h1>
        {navigationView}
        {batteryView}
      </div>
    );
  }
}

export default App;
