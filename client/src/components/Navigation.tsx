import React, { FunctionComponent, memo } from 'react'
import './Navigation.css'

const LEFT = 'LEFT'
const RIGHT = 'RIGHT'
const BOTTOM = 'BOTTOM'
const TOP = 'TOP'

const findQuadrant = (x: number, y: number, width: number, height: number) => {
    if (y < (height/2)) {

        // top left
        if (x < (width/2)) {
            return isSide(x, y, width/2, height/2) ? LEFT : TOP

        // top right
        } else {
            return isSide(width - x, y, width/2, height/2) ? RIGHT : TOP
        }
    } else {

        // bottom left
        if (x < (width/2)) {
            return isSide(x, height - y, width/2, height/2) ? LEFT : BOTTOM

        // bottom right
        } else {
            return isSide(width - x, height - y, width/2, height/2) ? RIGHT : BOTTOM
        }
    }
}

const hypotenuse = (sideA: number, sideB: number) => Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2))

const angle = (side: number, h: number) => Math.asin(side/h)

// http://www.calculator.net/triangle-calculator.html
const isSide = (x: number, y: number, halfWidth: number, halfHeight: number) => {
    const h = hypotenuse(halfHeight, halfWidth)
    const angleA = angle(halfHeight, h)
    const angleB = angle(halfWidth, h)
    const sideB = y * Math.sin(angleB) / Math.sin(angleA)

    return x < sideB
}

const onStart = (e: React.MouseEvent<HTMLDivElement>, onForward: () => void, onBack: () => void, onLeft: () => void, onRight: () => void) => {
    if (e.target == null) {
        return;
    }
    
    e.stopPropagation();
    e.preventDefault();

    const boundingBox = (e.target as Element).getBoundingClientRect()
    const x = e.clientX - (boundingBox as DOMRect).x;
    const y = e.clientY - (boundingBox as DOMRect).y

    switch(findQuadrant(x, y, boundingBox.width, boundingBox.height)) {
        case LEFT:
            onLeft()
            break
        case RIGHT:
            onRight()
            break
        case TOP:
            onForward()
            break
        case BOTTOM:
            onBack()
            break
        default:
            console.log('Unknown position')
    }

}

type Props = {
    onForward: () => void,
    onBack: () => void,
    onLeft: () => void,
    onRight: () => void,
    onStop: () => void,
}

const Navigation: FunctionComponent<Props> = ({onForward, onBack, onLeft, onRight, onStop}) =>
    <div className="navigation-view"
        onMouseDown={e => onStart(e, onForward, onBack, onLeft, onRight)}
//        onTouchStart={e => onStart(e, onForward, onBack, onLeft, onRight)}
        onMouseUp={onStop}
//        onTouchEnd={onStop}
    >
    </div>

export default memo(Navigation)
