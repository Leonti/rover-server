import React, { Component } from 'react'
import './App.css'

import Battery from './components/Battery'
import Navigation from './components/Navigation'
import CameraView from './components/CameraView'
import Rover from './components/Rover'

import Control from './service/Control'

class App extends Component {
  state = {
      battery: null,
      speed: "30",
      wsConnected: false,
      wsError: false,
      leftTicks: 0,
      rightTicks: 0,
      ir: null,
  }

  control = null

  onEncoder(value) {
      if (value === 'LEFT') {
          this.setState({leftTicks: this.state.leftTicks + 1})
      } else {
          this.setState({rightTicks: this.state.rightTicks + 1})
      }
  }

  onIrSensor(value) {
      this.setState({ ir: value })
  }

  processMessage(msg) {
      switch(msg.type) {
          case 'ENCODER':
            this.onEncoder(msg.value)
            break
          case 'IR_SENSOR':
            this.onIrSensor(msg.value)
            break
          default:
            console.log('Unknown server message', msg)
      }
  }

  componentDidMount() {
    let server = new WebSocket(`ws://${window.location.host}/ws`)
    server.onopen = () => {
        this.setState({wsConnected: true})
        this.control = new Control(server)

        server.onmessage = msg => this.processMessage(JSON.parse(msg.data))
    }
    server.onerror = err => this.setState({wsError: true})

    fetch('/api/battery')
      .then(res => res.json())
      .then(battery => this.setState({ battery }));
  }

  onSpeedChange(event) {
      this.setState({speed: event.target.value});
  }

  render() {

    const batteryView = this.state.battery != null ?
        <Battery
            battery={this.state.battery}
        /> : null
    const navigationView = this.state.wsConnected ?
        <Navigation
            onForward={() => this.control.forward(parseInt(this.state.speed))}
            onBack={() => this.control.back(parseInt(this.state.speed))}
            onLeft={() => this.control.left(parseInt(this.state.speed))}
            onRight={() => this.control.right(parseInt(this.state.speed))}
            onStop={() => this.control.stop()}
        /> : <div>Connecting to rover</div>

    return (
      <div className="App">
        <h1>Rover</h1>
        <div className="control-panel">
          <CameraView />
          {navigationView}
        </div>
        <Rover
          rear={!this.state.ir ? false : this.state.ir.rear}
          left={!this.state.ir ? false : this.state.ir.left}
          front={!this.state.ir ? false : this.state.ir.front}
          right={!this.state.ir ? false : this.state.ir.right}
        />
        <div>Speed: <input type="text" value={this.state.speed} onChange={this.onSpeedChange.bind(this)} /></div>
        <div>Left: {this.state.leftTicks}</div>
        <div>Right: {this.state.rightTicks}</div>
      </div>
    );
  }
}

export default App;
