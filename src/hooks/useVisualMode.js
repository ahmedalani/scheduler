import { useState } from 'react';

export function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode)
  const [history, setHistory] = useState([initialMode])
  function transition(transitionMode, replace = false) {
    const newHistory = [...history]
    if (replace) {
      newHistory.pop()
      setHistory([...newHistory, transitionMode])
    } else {
      setHistory([...newHistory, transitionMode])
    }
    setMode(transitionMode)
  }
  function back() {
    const newHistory = [...history]
    if (newHistory.length > 1) {
      newHistory.pop()
      setHistory(newHistory)
      setMode(newHistory[newHistory.length - 1])
    }
  }
  return { mode, transition, back }
}
