import { mainMenu } from '../'
import { eventManager } from '../../../../managers/event-manager'
import { resizeToCanvas } from '../../../../utils/resize'

function resizeMainMenu() {
  const resizeObserver = new ResizeObserver(() => {
    resizeToCanvas({
      image: mainMenu.mainMenuBgSprite,
      app: mainMenu.app,
    })
  })
  resizeObserver.observe(document.getElementById('game-root'))
}

eventManager.install({
  name: 'resizeMainMenu',
  event: resizeMainMenu,
})
