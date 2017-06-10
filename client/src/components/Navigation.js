import React from 'react';

const Navigation = ({onForward, onBack, onLeft, onRight, onStop}) =>
    <div>
        <div>Navigation Controls</div>
        <button
            onMouseDown={onForward}
            onMouseUp={onStop}
            >Forward</button>
        <button
            onMouseDown={onBack}
            onMouseUp={onStop}
            >Back</button>
        <button
            onMouseDown={onLeft}
            onMouseUp={onStop}
            >Left</button>
        <button
            onMouseDown={onRight}
            onMouseUp={onStop}
            >Right</button>
    </div>

export default Navigation
