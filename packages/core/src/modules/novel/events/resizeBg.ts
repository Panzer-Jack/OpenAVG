import { eventManager } from '../../../managers/event-manager'
import Hooks from '../Hooks'

function resizeBg() {
  const hooks = Hooks.getInstance()
  const resizeObserver = new ResizeObserver(() => {
    const bgSprite = hooks.sceneManager.currentScene?.background
    if (bgSprite) {
      hooks.resizeImage({ image: bgSprite })
    }
  })
  resizeObserver.observe(document.getElementById('game-root'))
}

eventManager.install({
  name: 'resizeBg',
  event: resizeBg,
})
