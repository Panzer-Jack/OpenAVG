import Button from '@/components/Button'
import { useVolumeConfig } from '@/store'
import { actions as configMenuActions } from '@openavg/core/src/modules/menu/config-menu/actions'
import { actions } from '@openavg/core/src/modules/menu/main-menu/actions'
import { onExit } from '@openavg/core/src/modules/menu/main-menu/actions/onExit'
import React, { useEffect, useState } from 'react'

enum VolumeEnum {
  mainVolume = 'mainVolume',
  bgmVolume = 'bgmVolume',
  voiceVolume = 'voiceVolume',
}

export function ConfigMenu() {
  const mainVolume = useVolumeConfig(store => store.mainVolume)
  const setMainVolume = useVolumeConfig(store => store.setMainVolume)
  const bgmVolume = useVolumeConfig(store => store.bgmVolume)
  const setBgmVolume = useVolumeConfig(store => store.setBgmVolume)
  const voiceVolume = useVolumeConfig(store => store.voiceVolume)
  const setVoiceVolume = useVolumeConfig(store => store.setVoiceVolume)

  const [isFullscreen, setIsFullscreen] = useState(false) // 是否全屏
  const [language, setLanguage] = useState('en') // 语言 (en, zh, etc.)
  const [isShown, setIsShown] = useState(false)
  const [isFading, setIsFading] = useState(false) // 淡入动画状态

  // 处理音量变化
  const handleVolumeChange = ({
    type = VolumeEnum.mainVolume,
  }: {
    type: VolumeEnum
  }, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    console.log(value)
    if (type === VolumeEnum.mainVolume) {
      setMainVolume(value)
    } else if (type === VolumeEnum.bgmVolume) {
      setBgmVolume(value)
    } else if (type === VolumeEnum.voiceVolume) {
      setVoiceVolume(value)
    }
  }

  // 处理全屏模式
  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen)
    if (!isFullscreen) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  // 处理语言切换
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value)
  }

  // 页面显示切换
  actions.installOnConfig(() => {
    if (!isShown) {
      setIsShown(true)
    }
  })

  const handleReturn = async () => {
    setIsShown(false)
    await configMenuActions.onReturn()
  }

  useEffect(() => {
    if (isFading) {
      const timer = setTimeout(() => {
        setIsFading(false)
      }, 300) // 与淡入时间一致
      return () => clearTimeout(timer)
    }
  }, [isFading])

  const handleExit = () => {
    onExit()
  }

  return (
    <div className={`position-absolute top-0 left-0 h-full w-full transition-all duration-500 ${isShown ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white h-full w-full flex justify-center items-center align-content: center">
        <h2 className="position-absolute left-0 top-0 font-size-60px c-blue m-l-10px">Game Settings</h2>
        <div className="bg-#f5f5f5 h-70% w-90% border-rounded-20px m-t-50px p-8 flex justify-between">
          <div className="w-2/5 pr-4">
            {/* 主音量 */}
            <div className="mb-6">
              <label className="block text-xl font-semibold mb-3 text-gray-800">Main Volume</label>
              <input
                type="range"
                min="0"
                max="100"
                value={mainVolume}
                onChange={(event) => handleVolumeChange({ type: VolumeEnum.mainVolume }, event)}
                className="w-full h-3 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full appearance-none"
              />
              <span className="block text-center mt-3 text-lg text-gray-700">
                {mainVolume}
                %
              </span>
            </div>

            {/* 角色音量 */}
            <div className="mb-6">
              <label className="block text-xl font-semibold mb-3 text-gray-800">Character Voice Volume</label>
              <input
                type="range"
                min="0"
                max="100"
                value={voiceVolume}
                onChange={(event) => handleVolumeChange({ type: VolumeEnum.voiceVolume }, event)}
                className="w-full h-3 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full appearance-none"
              />
              <span className="block text-center mt-3 text-lg text-gray-700">
                {voiceVolume}
                %
              </span>
            </div>

            {/* 背景音乐音量 */}
            <div className="mb-6">
              <label className="block text-xl font-semibold mb-3 text-gray-800">Background Music Volume</label>
              <input
                type="range"
                min="0"
                max="100"
                value={bgmVolume}
                onChange={(event) => handleVolumeChange({ type: VolumeEnum.bgmVolume }, event)}
                className="w-full h-3 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full appearance-none"
              />
              <span className="block text-center mt-3 text-lg text-gray-700">
                {bgmVolume}
                %
              </span>
            </div>
          </div>

          <div className="w-2/5 pl-4">
            {/* 是否全屏 */}
            <div className="mb-6">
              <label className="block text-xl font-semibold mb-3 text-gray-800">Fullscreen Mode</label>
              <button
                onClick={handleFullscreenToggle}
                className={`w-full py-4 text-xl font-semibold rounded-lg text-white ${isFullscreen ? 'bg-green-500' : 'bg-red-500'} transition duration-300 hover:bg-opacity-80`}
              >
                {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              </button>
            </div>

            {/* 语言选择 */}
            <div className="mb-6">
              <label className="block text-xl font-semibold mb-3 text-gray-800">Language</label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full py-4 px-6 text-xl border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
              >
                <option value="en">English</option>
                <option value="zh">Chinese</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>

        <div className="position-absolute right-10 bottom-2 flex gap-10">
          <Button
            className="border-rounded-40px border-none w-150px"
            type="primary"
            size="large"
            onClick={handleReturn}
            loading={false}
          >
            Return
          </Button>

          <Button
            className="border-rounded-40px border-none w-150px"
            type="primary"
            size="large"
            onClick={handleExit}
            loading={false}
          >
            Exit
          </Button>
        </div>
      </div>
    </div>
  )
}
