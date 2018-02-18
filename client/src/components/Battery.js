import React from 'react';

const Battery = ({battery, batteryTemp}) =>
    <div>
        <div>{battery.voltage}V</div>
        <div>{battery.current_mA}mA</div>
        <div>{batteryTemp}C</div>
    </div>

export default Battery
