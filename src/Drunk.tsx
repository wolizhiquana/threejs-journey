import { PrimitiveProps } from '@react-three/fiber'
import { ForwardedRef, forwardRef } from 'react'
import DrunkEffect, { DrunkEffectProps } from './DrunkEffect'

const Drunk = forwardRef(
  (props: DrunkEffectProps, ref: ForwardedRef<PrimitiveProps>) => {
    const effect = new DrunkEffect(props)

    return <primitive ref={ref} object={effect} />
  }
)

export default Drunk
