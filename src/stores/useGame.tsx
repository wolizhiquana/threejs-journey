import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface GameInfo {
  blocksCount: number
  blocksSeed: number
  phase: 'reading' | 'playing' | 'ended'
  startTime: number
  endTime: number
}

type GameInfoStore = GameInfo & {
  start: () => void
  restart: () => void
  end: () => void
}

export default create(
  subscribeWithSelector<GameInfoStore>((set) => ({
    blocksCount: 10,
    blocksSeed: 0,

    // Time
    startTime: 0,
    endTime: 0,

    // Phease
    phase: 'reading',
    start: () =>
      set(({ phase }) =>
        phase === 'reading' ? { phase: 'playing', startTime: Date.now() } : {}
      ),
    restart: () => set(() => ({ phase: 'reading', blocksSeed: Math.random() })),
    end: () =>
      set(({ phase }) =>
        phase === 'playing' ? { phase: 'ended', endTime: Date.now() } : {}
      )
  }))
)
