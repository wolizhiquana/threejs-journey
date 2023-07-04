import { useKeyboardControls } from '@react-three/drei'
import { Controls } from './Player'
import useGame from './stores/useGame'
import { useEffect, useRef } from 'react'
import { addEffect } from '@react-three/fiber'

function Interface() {
  const time = useRef<HTMLDivElement>(null)
  const restart = useGame((state) => state.restart)
  const phase = useGame((state) => state.phase)

  const forward = useKeyboardControls<Controls>((state) => state.forward)
  const backward = useKeyboardControls<Controls>((state) => state.backward)
  const leftward = useKeyboardControls<Controls>((state) => state.leftward)
  const rightward = useKeyboardControls<Controls>((state) => state.rightward)
  const jump = useKeyboardControls<Controls>((state) => state.jump)

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const { phase, startTime, endTime } = useGame.getState()

      let elapsedTime = 0

      if (phase === 'playing') elapsedTime = Date.now() - startTime
      else if (phase === 'ended') elapsedTime = endTime - startTime

      elapsedTime /= 1000

      if (time.current) time.current.textContent = elapsedTime.toFixed(2)
    })
    return () => {
      unsubscribeEffect()
    }
  }, [])

  return (
    <div className='interface'>
      {/* Time */}
      <div ref={time} className='time'></div>

      {/* Restart */}
      {phase === 'ended' && (
        <div className='restart' onClick={restart}>
          Restart
        </div>
      )}

      {/* Control */}
      <div className='control'>
        <div className='raw'>
          <div className={`key ${forward && 'active'}`}>W</div>
        </div>
        <div className='raw'>
          <div className={`key ${backward && 'active'}`}>A</div>
          <div className={`key ${leftward && 'active'}`}>S</div>
          <div className={`key ${rightward && 'active'}`}>D</div>
        </div>
        <div className='raw'>
          <div className={`key large ${jump && 'active'}`}>SPACE</div>
        </div>
      </div>
    </div>
  )
}

export default Interface
