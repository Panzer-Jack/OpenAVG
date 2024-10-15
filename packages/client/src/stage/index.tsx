import { PixiCanvas } from '@/pixi'
// import { Novel } from '@/modules/novel'
import { Menu } from '@/modules/menu'
import { useLoader } from '@/store'

export function Stage() {
  const isInit = useLoader(store => store.isInit())

  return (
    <>
      <PixiCanvas />
      {/* {isInit && <Novel />} */}
      {isInit && <Menu />}
    </>
  )
}
