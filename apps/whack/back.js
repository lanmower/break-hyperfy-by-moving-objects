import React, { useRef, useEffect } from 'react'
import { useWorld, useSyncState, randomInt } from 'hyperfy'

import { Tween } from './Tween'

export const blenderVec3 = ([x, y, z]) => [x, z, -y]

const headOffset = [
  blenderVec3([-0.65, 0, -1]), blenderVec3([-0.65, -0.65, -1.3]), blenderVec3([-0.65, 0.65, -0.7]),
  blenderVec3([0, 0, -1]), blenderVec3([0, -0.65, -1.3]), blenderVec3([0, 0.65, -0.7]),
  blenderVec3([0.65, 0, -1]), blenderVec3([0.65, -0.65, -1.3]), blenderVec3([0.65, 0.65,  -0.7]),
]

function moleHeightPosition(currentTime) {
  const downTime = 0.9; // percentage of time the mole spends down
  const cycleTime = 2000; // time for one full up-down cycle in milliseconds
  const radiansPerMillisecond = Math.PI / cycleTime;
  const amplitude = 30; // maximum deviation from the mean height
  const offset = 50; // mean height of the mole
  
  const currentTimeInCycle = currentTime % cycleTime;
  const isDown = currentTimeInCycle < downTime * cycleTime;
  
  if (isDown) {
    return 0; // mole is down
  } else {
    const baseRadians = (currentTimeInCycle - downTime * cycleTime) * radiansPerMillisecond;
    const heightOffset = Math.random() * amplitude * Math.sin(Math.random() * Math.PI * 2);
    const height = Math.sin(baseRadians) * amplitude + heightOffset + offset;
    return height;
  }
}
const SPEED = 0.1
export default function Heads() {
  const world = useWorld()
  const headRef = []
  for(let x = 0; x < 9; x++) headRef.push(useRef())
  const audioRef = [useRef()]
  const [state, dispatch] = useSyncState(state => state)
  useEffect(() => {
    return world.onUpdate(delta => {
      const worldTime = world.getServerTime()
      
      headRef[0].current.setPosition([-0.65, 0, -1]);
      headRef[1].current.setPosition([-0.65, 0, -1]);
      headRef[2].current.setPosition([-0.65, 0, -1]);
      /*if(world.isClient) {
        for(let ref in headOffset) {
        }
      }*/
      
    })
  }, [state.heads])


  return (
    <app>

      <rigidbody type="static">
        <place label="nextwhack" position={[0, 0, 0]} />
        <box position={blenderVec3([0, 0, 0])} size={3} hidden={true} />
        <audio src="whack.mp3" ref={audioRef[2]} />
        <model src="whackbox.glb" />
      </rigidbody>
      {
          headOffset.map((a,i)=>{
            console.log(a)
            return <model
              key={i}
              ref={headRef[i]}
              src="whackhead.glb"
              position={a}
            />
          })
        }
    </app>
  )
}

const initialState = {
  time: -9999,
  heads: [0,0,0,0,0,0,0,0,0],
}
const openTween = new Tween({ scale: 1 }).to({ scale: 1.1 }, SPEED, Tween.QUAD_IN_OUT)
const closeTween = new Tween({ scale: 1.1 }).to({ scale: 1 }, SPEED, Tween.QUAD_IN_OUT)

export function getStore(state = initialState) {
  const playGame = function playGame(state, limit, time, client) {
    state.time = time
    state.sequence = []
    state.input = []
    state.limit = limit
    state.started = true
    for (let x = 0; x < limit; x++) {
      const head = randomInt(0, 8);
      if (client) state.sequence.push({ head, time: time + (x * 3) })
    }
  }
  return {
    state,
    actions: {
      playHead(state, head, time) {
        state.head = head
        state.isOpening = true
        state.time = time
        state.input.push({ head, time })
      },
      setClose(state, time) {
        state.time = time
        state.isOpening = false
      },
      playGame
    }
  }
}