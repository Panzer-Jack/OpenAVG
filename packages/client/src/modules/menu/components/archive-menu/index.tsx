import type { SaveDataList } from '@openavg/types'
import Button from '@/components/Button'
import Pagination from '@/components/Pagination'
import { useManagers } from '@/store'
import { actions as archiveMenuActions } from '@openavg/core/src/modules/menu/archive-menu/actions'
import { actions } from '@openavg/core/src/modules/menu/main-menu/actions'
import { useEffect, useState } from 'react'
import DataWindow from './DataWindow'

export function ArchiveMenu() {
  const total = 72
  const pageSize = 12

  const [currentPage, setCurrentPage] = useState(0)
  const [title, setTitle] = useState('Load')
  const [isShown, setIsShown] = useState(false)
  const [datalist, setDatalist] = useState<Array<any>>([])
  const [renderList, setRenderList] = useState<Array<any>>([])
  const [isFading, setIsFading] = useState(false) // 新增状态来控制淡入动画

  const sceneManager = useManagers(store => store.novelManager.sceneManager)

  const handleDataClick = async ({
    i,
    type,
    isMainMenu,
    hasSaveData = false,
  }: {
    i: number
    type: 'load' | 'save'
    isMainMenu: boolean
    hasSaveData?: boolean
  }) => {
    if (type === 'save') {
      await sceneManager.saveGame(i)
      const dataList = await archiveMenuActions.getDataList()
      updatePage({
        saveGameList: dataList,
        type,
      })
    } else {
      if (hasSaveData) {
        await handleReturn()
        await sceneManager.loadGame({ i, isMainMenu })
      }
    }
  }

  function updatePage({
    saveGameList,
    type,
    isMainMenu = false,
  }: {
    saveGameList: SaveDataList
    type: 'load' | 'save'
    isMainMenu?: boolean
  }) {
    const datawindowList = []

    for (let i = 1; i <= total; i++) {
      if (saveGameList && saveGameList[i]) {
        datawindowList.push(
          <DataWindow
            key={i}
            saveData={saveGameList[i]}
            onClick={() => {
              handleDataClick({ i, type, isMainMenu, hasSaveData: true })
            }}
          />,
        )
      } else {
        datawindowList.push(
          <DataWindow
            key={i}
            onClick={() => handleDataClick({ i, type, isMainMenu })}
          />,
        )
      }
    }
    setDatalist(datawindowList)
  }

  actions.installOnLoad((saveGameList, isMainMenu) => {
    if (!isShown) {
      setTitle('Load')
      setIsShown(true)
    }
    setCurrentPage(1)
    updatePage({
      saveGameList,
      type: 'load',
      isMainMenu,
    })
  })

  actions.installOnSave((saveGameList) => {
    if (!isShown) {
      setTitle('Save')
      setIsShown(true)
    }
    setCurrentPage(1)
    updatePage({
      saveGameList,
      type: 'save',
    })
  })

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  async function handleReturn() {
    setIsShown(false)
    await archiveMenuActions.onReturn()
    setTimeout(() => {
      setCurrentPage(1)
    }, 500)
  }

  function handleExit() {
    actions.onExit()
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setRenderList(datalist.slice((currentPage - 1) * pageSize, currentPage * pageSize))
    }, 300)
    return () => clearTimeout(timer)
  }, [currentPage, datalist])

  useEffect(() => {
    setIsFading(true)
  }, [currentPage])

  useEffect(() => {
    // 淡入完成后清除过渡状态
    if (isFading) {
      const timer = setTimeout(() => {
        setIsFading(false)
      }, 300) // 与淡入时间一致
      return () => clearTimeout(timer)
    }
  }, [isFading])

  return (
    <div
      className={`position-absolute top-0 left-0 h-full w-full transition-all duration-500 ${isShown ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >

      <div className="bg-white h-full w-full flex justify-center items-center align-content: center">
        <h2 className="position-absolute left-0 top-0 font-size-60px c-blue m-l-10px">{title}</h2>
        <div className="bg-#dcdcdc h-80% w-90% border-rounded-20px m-t-50px justify-left">
          <Pagination
            className="position-relative top--45px left-20px"
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={handlePageChange}
          />
          <div className={`
            position-relative top--30px flex flex-wrap gap-x-30
            justify-center items-center h-full w-full transition-all duration-300
            ${isFading ? 'opacity-0' : 'opacity-100'}`}
          >
            {renderList}
          </div>
        </div>
        <div className="position-absolute right-10 bottom-2">
          <Button
            className="border-rounded-40px border-none w-150px mr-10px"
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
