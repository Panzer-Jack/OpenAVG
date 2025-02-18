import Button from '@/components/Button'
import { actions } from '@openavg/core/src/modules/menu/main-menu/actions'

export function UI() {
  const buttons = [
    {
      name: 'Fullscreen',
      onClick: () => {
        actions.onFullScreen()
      },
    },
    {
      name: 'Load',
      onClick: () => {
        actions.onLoad()
      },
    },
    {
      name: 'Save',
      onClick: () => {
        actions.onSave()
      },
    },
    {
      name: 'Configs',
      onClick: () => {
        actions.onConfig()
      },
    },
    {
      name: 'Title',
      onClick: () => {
        actions.onTitle()
      },
    },
    {
      name: 'Exit',
      onClick: () => {
        actions.onExit()
      },
    },
  ]
  return (
    <div className="position-absolute bottom-1 w-full">
      <div className="flex justify-center items-center">
        {buttons.map((button, index) => {
          return (
            <Button
              key={index}
              className="border-none w-120px"
              type="link"
              onClick={button.onClick}
              loading={false}
            >
              {button.name}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
