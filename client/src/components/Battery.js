import React from 'react';

const Battery = ({battery, batteryTemp}) =>
    <div>
        <div>{battery.voltage}V</div>
        <div>{battery.currentMa}mA</div>
        <div>{batteryTemp}C</div>
    </div>

export default Battery
