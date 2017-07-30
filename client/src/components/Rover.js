import React from 'react';

const sc = value => value ? '#f44256' : '#008000'

const Rover = ({rear, left, front, right}) =>
  <div style={{width: '150px'}}>
    <svg version="1.1" viewBox="0 0 744.09448819 1052.3622047">
    	<defs id="defs4"/>
    	<g id="layer1">
    		<rect height="1035.6705" id="rect4136" style={{"fill":"none","fillOpacity":"1","stroke":"#000000","strokeWidth":"12.66728401","strokeLinecap":"butt","strokeLinejoin":"miter","strokeMiterlimit":"4","strokeDasharray":"none","strokeOpacity":"1"}} width="727.43896" x="9.4855824" y="9.0253849"/>
    		<rect height="353.20551" id="left_wheel" style={{"fill":"#000000","fillOpacity":"1","stroke":"none","strokeWidth":"6.64099979","strokeLinecap":"butt","strokeLinejoin":"miter","strokeMiterlimit":"4","strokeDasharray":"none","strokeOpacity":"1"}} width="146.97615" x="41.11335" y="350.69907"/>
    		<rect height="353.20551" id="right_wheel" style={{"fill":"#000000","fillOpacity":"1","stroke":"none","strokeWidth":"6.64099979","strokeLinecap":"butt","strokeLinejoin":"miter","strokeMiterlimit":"4","strokeDasharray":"none","strokeOpacity":"1"}} width="146.97615" x="554.21173" y="350.89459"/>
    		<rect height="31.928186" id="front_left" style={{"fill":sc(front.left),"fillOpacity":"1","stroke":"none","strokeWidth":"6.64099979","strokeLinecap":"butt","strokeLinejoin":"miter","strokeMiterlimit":"4","strokeDasharray":"none","strokeOpacity":"1"}} width="102.32517" x="104.4063" y="27.065191"/>
    		<rect height="31.928186" id="front_right" style={{"fill":sc(front.right),"fillOpacity":"1","stroke":"none","strokeWidth":"6.64099979","strokeLinecap":"butt","strokeLinejoin":"miter","strokeMiterlimit":"4","strokeDasharray":"none","strokeOpacity":"1"}} width="102.32517" x="548.88269" y="24.869118"/>
    		<rect height="31.928186" id="rear_left" style={{"fill":sc(rear.left),"fillOpacity":"1","stroke":"none","strokeWidth":"6.64099979","strokeLinecap":"butt","strokeLinejoin":"miter","strokeMiterlimit":"4","strokeDasharray":"none","strokeOpacity":"1"}} width="102.32517" x="105.33653" y="996.79333"/>
    		<rect height="31.928186" id="rear_right" style={{"fill":sc(rear.right),"fillOpacity":"1","stroke":"none","strokeWidth":"6.64099979","strokeLinecap":"butt","strokeLinejoin":"miter","strokeMiterlimit":"4","strokeDasharray":"none","strokeOpacity":"1"}} width="102.32517" x="547.93848" y="996.99384"/>
    		<rect height="29.767324" id="left_front" style={{"fill":sc(left.front),"fillOpacity":"1","stroke":"none","strokeWidth":"6.64099979","strokeLinecap":"butt","strokeLinejoin":"miter","strokeMiterlimit":"4","strokeDasharray":"none","strokeOpacity":"1"}} width="109.75315" transform="matrix(0,1,-1,0,0,0)" x="122.48372" y="-55.221073"/>
    		<rect height="29.767324" id="right_front" style={{"fill":sc(right.front),"fillOpacity":"1","stroke":"none","strokeWidth":"6.64099979","strokeLinecap":"butt","strokeLinejoin":"miter","strokeMiterlimit":"4","strokeDasharray":"none","strokeOpacity":"1"}} width="109.75315" transform="matrix(0,1,-1,0,0,0)" x="121.83136" y="-721.63202"/>
    		<rect height="29.767324" id="left_rear" style={{"fill":sc(left.rear),"fillOpacity":"1","stroke":"none","strokeWidth":"6.64099979","strokeLinecap":"butt","strokeLinejoin":"miter","strokeMiterlimit":"4","strokeDasharray":"none","strokeOpacity":"1"}} width="109.75315" transform="matrix(0,1,-1,0,0,0)" x="801.38806" y="-54.915176"/>
    		<rect height="29.767324" id="right_rear" style={{"fill":sc(right.rear),"fillOpacity":"1","stroke":"none","strokeWidth":"6.64099979","strokeLinecap":"butt","strokeLinejoin":"miter","strokeMiterlimit":"4","strokeDasharray":"none","strokeOpacity":"1"}} width="109.75315" transform="matrix(0,1,-1,0,0,0)" x="801.38806" y="-721.63202"/>
    	</g>
    </svg>
  </div>

export default Rover
