import type { SaveData } from '@openavg/types'
import Button from '@/components/Button'
import dayjs from 'dayjs'
import React from 'react'

interface DataWindowProps {
  time?: string
  saveData?: SaveData
  className?: string
  onClick?: () => void
}

const DataWindow: React.FC<DataWindowProps> = ({
  saveData,
  className = '', // 默认为空字符串
  onClick,
}) => {
  const imgSrc = saveData?.img
  const timeTxt = saveData?.time && dayjs(saveData.time).format('YYYY-MM-DD HH:mm:ss')

  return (
    <Button
      className={`group color-black border-none transition-all duration-300 transform hover:scale-105 box-border ${className}`}
      type="link"
      onClick={onClick}
    >
      <div className="inline-block w-288px relative">
        {/* Title 样式 */}
        {saveData && (
          <div className="absolute top--2 left--4 p-x-10px bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-lg shadow-lg z-10 transform scale-110 transition-all duration-300 ease-in-out">
            {saveData.title}
          </div>
        )}

        {/* 图片背景容器 */}
        <div
          className="w-288px h-162px rounded-4px overflow-hidden group-hover:border-4px group-hover:border-gradient-to-r group-hover:border-primary group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 ease-in-out"
          style={{
            backgroundImage: imgSrc ? `url(${imgSrc})` : 'none',
            backgroundColor: !imgSrc ? 'white' : 'transparent',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1, // 确保图片不会覆盖标题
          }}
        />

        {/* 时间 */}
        <div
          className="bg-white border-solid border-white border-rounded-20px m-t-10px m-auto text-align-center w-80% h-30px flex justify-center items-center group-hover:border-4px group-hover:border-gradient-to-r group-hover:border-primary group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 ease-in-out z-0"
        >
          {timeTxt || '— — / — —'}
        </div>
      </div>
    </Button>
  )
}

export default DataWindow
