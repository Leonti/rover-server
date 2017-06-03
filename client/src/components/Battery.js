import React from 'react';

const Battery = ({battery}) =>
    <div>
        <div>{battery.voltage}mV</div>
        <div>{battery.current}mA</div>
    </div>

export default Battery
