import React from 'react'

export interface ModalProps {
  visible: boolean
  title: string
  onCancel: () => void
  onOk: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ visible, title, onCancel, onOk, children }) => {
  if (!visible)
    return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onCancel}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-w-full" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h3 className="text-xl">{title}</h3>
          <button className="text-xl" onClick={onCancel}>X</button>
        </div>
        <div className="mt-4">
          {children}
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-gray-200 px-4 py-2 rounded mr-2" onClick={onCancel}>取消</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onOk}>确认</button>
        </div>
      </div>
    </div>
  )
}

export default Modal
