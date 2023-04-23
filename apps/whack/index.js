import React, { useRef, useEffect } from 'react'
import { useWorld, useSyncState, randomInt } from 'hyperfy'

const headOffset = [
  [0,0,0],[0,0,0],[0,0,0]
]

export default function Heads() {
  const world = useWorld()
  const headRef = [useRef(), useRef(), useRef()]
  useEffect(() => {
    return world.onUpdate(delta => {
      if(world.isClient) {
      headRef[0].current?.setPosition([-0.65, 0, -1]);
      headRef[1].current?.setPosition([-0.65, -0.65, -1.3]);
      headRef[2].current?.setPosition([-0.65, 0.65, -0.7]);      
      }
    })
  }, [])

  return (
    <app>
            <model
              key={1}
              ref={headRef[0]}
              src="whackbox.glb"
              position={headOffset[0]}
            />
            <model
              key={1}
              ref={headRef[1]}
              src="whackbox.glb"
              position={headOffset[1]}
            />
            <model
              key={1}
              ref={headRef[2]}
              src="whackbox.glb"
              position={headOffset[2]}
            />
    </app>
  )
}

const initialState = {
  heads: [0,0,0,0,0,0,0,0,0],
}

export function getStore(state = initialState) {
  return {
    state,
    actions: {
    }
  }
}