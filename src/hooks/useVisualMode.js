import { useState } from 'react';

export function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode)
  const [history, setHistory] = useState([initialMode])

  function transition(transitionMode, replace = false) {
    if (replace) {
      history.pop()
      setHistory([...history, transitionMode])
    } else {
      setHistory([...history, transitionMode])
    }
    setMode(transitionMode)
  }
  function back() {
    if (history.length > 1) {
      history.pop()
      setMode(history[history.length - 1])
    }
  }
  return { mode, transition, back }
}
/*
import { useState } from 'react';

export function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode)
  const [history, setHistory] = useState([initialMode])

  function transition(transitionMode, replace = false) {
    if (replace) {
      const tempHistory = [...history]
      tempHistory.pop()
      setHistory([...tempHistory, transitionMode])
    } else {
      setHistory([...history, transitionMode])
    }
    setMode(transitionMode)
  }
  function back() {
    if (history.length > 1) {
      const tempHistory = [...history]
      tempHistory.pop()
      setMode(tempHistory[tempHistory.length - 1])
    }
  }
  return { mode, transition, back }
}
*/