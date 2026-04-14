import { animated } from 'react-spring'
import { useFloatAnimation } from './useFloatAnimation'

function Box() {
  const style = useFloatAnimation('float-mid')
  return (
    <animated.svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="top-left"
      style={style}
    >
      <g stroke="var(--theme-blue)" className="three-d-box">
        <line
          x1="101.834"
          y1="297.925"
          x2="192.834"
          y2="202.925"
          strokeWidth="6"
        />
        <line
          x1="299.834"
          y1="298.925"
          x2="390.834"
          y2="203.925"
          strokeWidth="6"
        />
        <line
          x1="301.834"
          y1="494.925"
          x2="392.834"
          y2="399.925"
          strokeWidth="6"
        />
        <line
          x1="104.834"
          y1="491.925"
          x2="195.834"
          y2="396.925"
          strokeWidth="6"
        />
        <rect
          x="103"
          y="297"
          width="200"
          height="197"
          fill="none"
          strokeWidth="6"
        />
        <rect
          x="192"
          y="204"
          width="200"
          height="197"
          fill="none"
          strokeWidth="6"
        />
      </g>
    </animated.svg>
  )
}

function Donut() {
  const style = useFloatAnimation('float-hi', -2500)
  return (
    <animated.svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="top-left"
      style={style}
    >
      <circle
        className="donut"
        cx="474.5"
        cy="350.5"
        r="12"
        strokeWidth="40"
        stroke="var(--theme-blue)"
      />
    </animated.svg>
  )
}

function CenterText() {
  const style = useFloatAnimation('float-mid', 1000)
  return (
    <svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="center valtio"
    >
      <animated.text
        x="50%"
        y="650"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="bold"
        fontSize="200"
        fill="var(--theme-blue)"
        style={style}
      >
        Valtio-Define
      </animated.text>
    </svg>
  )
}

function Circle() {
  const style = useFloatAnimation('float-hi', -2000)
  return (
    <svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="top-right"
    >
      <animated.circle
        className="fast-circle"
        cx="1338"
        cy="209"
        r="84"
        strokeWidth="6"
        stroke="var(--theme-blue)"
        style={style}
      />
    </svg>
  )
}

function DotGrid() {
  const style = useFloatAnimation('float-hi', -1000)
  return (
    <animated.svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="top-right"
      style={style}
    >
      <g stroke="var(--theme-blue)">
        <g className="dot-grid">
          <circle cx="907.5" cy="145.5" r="3" strokeWidth="15" />
          <circle cx="907.5" cy="230.5" r="3" strokeWidth="15" />
          <circle cx="907.5" cy="315.5" r="3" strokeWidth="15" />
          <circle cx="1025.5" cy="145.5" r="3" strokeWidth="15" />
          <circle cx="1025.5" cy="230.5" r="3" strokeWidth="15" />
          <circle cx="1025.5" cy="315.5" r="3" strokeWidth="15" />
          <circle cx="1143.5" cy="145.5" r="3" strokeWidth="15" />
          <circle cx="1143.5" cy="230.5" r="3" strokeWidth="15" />
          <circle cx="1143.5" cy="315.5" r="3" strokeWidth="15" />
          <circle cx="1261.5" cy="145.5" r="3" strokeWidth="15" />
          <circle cx="1261.5" cy="230.5" r="3" strokeWidth="15" />
          <circle cx="1261.5" cy="315.5" r="3" strokeWidth="15" />
          <circle cx="1379.5" cy="145.5" r="3" strokeWidth="15" />
          <circle cx="1379.5" cy="230.5" r="3" strokeWidth="15" />
          <circle cx="1379.5" cy="315.5" r="3" strokeWidth="15" />
          <circle cx="1497.5" cy="145.5" r="3" strokeWidth="15" />
          <circle cx="1497.5" cy="230.5" r="3" strokeWidth="15" />
          <circle cx="1497.5" cy="315.5" r="3" strokeWidth="15" />
          <circle cx="1615.5" cy="145.5" r="3" strokeWidth="15" />
          <circle cx="1615.5" cy="230.5" r="3" strokeWidth="15" />
          <circle cx="1615.5" cy="315.5" r="3" strokeWidth="15" />
        </g>
      </g>
    </animated.svg>
  )
}

function ConcentricCircles() {
  const style = useFloatAnimation('float-hi', -1000)
  return (
    <svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="bottom-left"
    >
      <animated.g
        stroke="var(--theme-blue)"
        className="concentric-circles"
        style={style}
      >
        <circle cx="-43" cy="1272" r="619" strokeWidth="6" />
        <circle cx="-43" cy="1272" r="593" strokeWidth="6" />
        <circle cx="-43" cy="1272" r="568" strokeWidth="6" />
        <circle cx="-43" cy="1272" r="540" strokeWidth="6" />
        <circle cx="-43" cy="1272" r="514" strokeWidth="6" />
        <circle cx="-43" cy="1272" r="487" strokeWidth="6" />
        <circle cx="-43" cy="1272" r="461" strokeWidth="6" />
        <circle cx="-43" cy="1272" r="435" strokeWidth="6" />
        <circle cx="-43" cy="1272" r="409" strokeWidth="6" />
        <circle cx="-43" cy="1272" r="382" strokeWidth="6" />
        <circle cx="-43" cy="1272" r="355" strokeWidth="6" />
        <circle cx="-43" cy="1272" r="329" strokeWidth="6" />
        <circle cx="-43" cy="1272" r="303" strokeWidth="6" />
      </animated.g>
    </svg>
  )
}

function Square() {
  const style = useFloatAnimation('float-rotate-mid', -1000)
  return (
    <svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="bottom-right"
    >
      <animated.rect
        className="spinning-square"
        x="650"
        y="750"
        width="100"
        height="100"
        strokeWidth="6"
        stroke="var(--theme-blue)"
        style={style}
      />
    </svg>
  )
}

function Line1() {
  const style = useFloatAnimation('float-mid', 250)
  return (
    <animated.svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="bottom-right"
      style={style}
    >
      <line
        className="line-1"
        x1="1275"
        y1="780"
        x2="1393"
        y2="780"
        strokeWidth="6"
        stroke="var(--theme-blue)"
      />
    </animated.svg>
  )
}

function Line2() {
  const style = useFloatAnimation('float-mid', 500)
  return (
    <animated.svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="bottom-right"
      style={style}
    >
      <line
        className="line-2"
        x1="1095"
        y1="839"
        x2="1685"
        y2="839"
        strokeWidth="6"
        stroke="var(--theme-blue)"
      />
    </animated.svg>
  )
}

function Line3() {
  const style = useFloatAnimation('float-mid', 750)
  return (
    <animated.svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="bottom-right"
      style={style}
    >
      <line
        className="line-3"
        x1="1275"
        y1="898"
        x2="1518"
        y2="898"
        strokeWidth="6"
        stroke="var(--theme-blue)"
      />
    </animated.svg>
  )
}

export function AnimatedShapes() {
  return (
    <>
      <Box />
      <Donut />
      <DotGrid />
      <Circle />
      <CenterText />
      <ConcentricCircles />
      <Square />
      <Line1 />
      <Line2 />
      <Line3 />
    </>
  )
}
