// Message.tsx
import React, { useEffect, useState } from 'react'

export interface MessageProps {
  type: 'success' | 'error' | 'info'
  content: string
  duration: number
}

const Message: React.FC<MessageProps> = ({ type, content, duration }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!visible)
    return null

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded-md text-white z-50
        ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}
    >
      <span>{content}</span>
    </div>
  )
}

export default Message
