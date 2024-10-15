import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import StartGame from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StartGame />
  </StrictMode>,
)
