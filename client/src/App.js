import React, { Component } from 'react'
import './App.css'

import Battery from './components/Battery'
import Navigation from './components/Navigation'
import CameraView from './components/CameraView'

import Control from './service/Control'

class App extends Component {
  state = {
      battery: null,
      speed: "40",
      wsConnected: false,
      wsError: false,
      leftTicks: 0,
      rightTicks: 0,
      ir0: null,
      ir1: null,
      ir2: null,
      ir3: null,
      ir4: null,
      ir5: null,
      ir6: null,
      ir7: null,
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
      this.setState({
        ir0: value.c0,
        ir1: value.c1,
        ir2: value.c2,
        ir3: value.c3,
        ir4: value.c4,
        ir5: value.c5,
        ir6: value.c6,
        ir7: value.c7,
      })
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
        <div>Speed: <input type="text" value={this.state.speed} onChange={this.onSpeedChange.bind(this)} /></div>
        <div>Left: {this.state.leftTicks}</div>
        <div>Right: {this.state.rightTicks}</div>
        <div>Ir0: {this.state.ir0}</div>
        <div>Ir1: {this.state.ir1}</div>
        <div>Ir2: {this.state.ir2}</div>
        <div>Ir3: {this.state.ir3}</div>
        <div>Ir4: {this.state.ir4}</div>
        <div>Ir5: {this.state.ir5}</div>
        <div>Ir6: {this.state.ir6}</div>
        <div>Ir7: {this.state.ir7}</div>
      </div>
    );
  }
}

export default App;
