import { useEffect, useRef } from 'react'

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * @param {React.EffectCallback} effect
 * @param {React.DependencyList} deps
 *
 */
export function useAfterMountEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList
) {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current) {
      return effect()
    }
    didMountRef.current = true
    //eslint-disable-next-line
  }, deps)
}
