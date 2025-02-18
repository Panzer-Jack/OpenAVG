// import type { Application, Sprite } from 'pixi.js'
// import type { AssetsPacks } from '../../../managers/assets-manager/assetsConfig'
// import { ButtonContainer, List } from '@pixi/ui'
// import { AlphaFilter, Container, Graphics, Text } from 'pixi.js'

// import { ButtonGroup, CommonButton } from '../../../components/button'
// import { fadeIn, fadeOut } from '../../../filters/fade'
// import { assetsManager } from '../../../managers/assets-manager'
// import { effectsManager } from '../../../managers/effects-manager'
// import { tickerManager } from '../../../managers/ticker-manager'
// import { centerView, row } from '../../../utils/layout'
// // import { onExit, onReturn } from './actions'

// export class LoadMenu {
//   app: Application
//   fatherContainer: Container
//   container = new Container({ label: 'LoadMenu' })

//   assetsManager: typeof assetsManager
//   assetsPack: AssetsPacks

//   private whiteBg: Graphics
//   private grayBg: Graphics
//   private isRender = false
//   private title: Text
//   btnLock = false

//   currPage = 1

//   constructor() { }

//   init({
//     app,
//     fatherContainer,
//     assetsPack,
//   }: {
//     app: Application
//     fatherContainer: Container
//     assetsPack: AssetsPacks
//   }) {
//     this.app = app
//     this.fatherContainer = fatherContainer
//     this.assetsManager = assetsManager
//     this.assetsPack = assetsPack
//     this.fatherContainer.addChild(this.container)

//     // 白色垫底
//     this.whiteBg = new Graphics()
//       .roundRect(0, 0, this.app.screen.width, this.app.screen.height, 0)
//       .fill({
//         color: 'white',
//       })
//     // 灰色垫底
//     this.grayBg = new Graphics()
//       .roundRect(0, 0, this.app.screen.width - 150, this.app.screen.height / 3 * 2)
//       .fill({
//         color: '#dcdcdc',
//       })
//     centerView({
//       view: this.grayBg,
//       target: this.container,
//       global: true,
//       offset: { x: 0, y: 80 },
//     })

//     this.title = new Text({
//       text: 'Load',
//       style: {
//         fontSize: 80,
//         fill: 'skyblue',
//       },
//     })
//     this.title.anchor.set(0) // 左上角锚点
//     this.title.position.set(20, 20) // 距离左上角10px

//     this.container.visible = false
//     this.container.addChild(this.whiteBg)
//     this.paginationRender(this.paginationButton())
//     this.container.addChild(this.grayBg)
//     this.buttonRender(this.defaultButtons())
//     this.container.addChild(this.title)

//     return this
//   }

//   async initFilter() {
//     // 动画
//     const fadeInTween = await fadeIn({
//       filter: this.container.filters[0] as AlphaFilter,
//     })
//     fadeInTween.start()
//     tickerManager.addListener('showLoadMenu', () => {
//       fadeInTween.update()
//     })
//   }

//   paginationButton() {
//     const row1: CommonButton[] = []
//     for (let i = 1; i <= 6; i++) {
//       const btn = new CommonButton({
//         text: `${i}`,
//         noGradient: true, // 设置 noGradient 为 true，不使用渐变
//         colors: {
//           default: 'white',
//           hover: 'white',
//           press: '#dcdcdc',
//         },
//         fontSize: 40,
//         height: 80,
//         size: 'small',
//         textOffset: { y: -15 },
//         onClick: () => this.toPage({ page: i }),
//         checked: i === 1,
//       })
//       if (btn.checked) {
//         btn.press()
//       }
//       row1.push(btn)
//     }
//     const btnGroup = new ButtonGroup(row1)
//     return btnGroup
//   }

//   toPage({
//     page,
//     force,
//   }: {
//     page: number
//     force?: boolean
//   }) {
//     if (this.currPage !== page || force) {
//       console.log('page', page)
//       this.currPage = page
//       this.dataWindow()
//     }
//   }

//   dataWindow() {
//     const items = []

//     const boardWidth = (this.grayBg.width) / 5
//     const boardHeight = (this.grayBg.height) / 2.8

//     for (let i = 1; i <= 8; i++) {
//       const board = new Graphics()
//         .roundRect(0, 0, boardWidth, boardHeight, 0)
//         .fill({
//           color: 'dcdcdc',
//         })

//       const win = new Graphics()
//         .roundRect(0, 0, boardWidth, boardHeight * 0.8, 10)
//         .fill({
//           color: 'white',
//         })

//       const timeBd = new Graphics()
//         .roundRect(0, 0, boardWidth * 0.8, boardHeight * 0.15)
//         .fill({
//           color: 'white',
//         })

//       centerView({
//         pos: 'x',
//         view: timeBd,
//         target: board,
//       })
//       timeBd.position.y = board.height - timeBd.height

//       board.addChild(win)
//       board.addChild(timeBd)

//       items.push(board)
//     }

//     const list = new List({
//       elementsMargin: 90,
//       topPadding: 60,
//       leftPadding: 40,
//       rightPadding: 40,
//       type: null,
//       maxWidth: this.grayBg.width,
//       maxHeight: this.grayBg.height,
//     })

//     items.forEach(item => list.addChild(item))
//     this.grayBg.addChild(list)
//   }

//   paginationRender(btnGroup: ButtonGroup) {
//     const btnRow1Container = new ButtonContainer()
//     const btnSpriteRow1 = btnGroup.buttons.map((btn, idx) => {
//       tickerManager.addListener(`btnRow1InLoadMenu-${idx}`, () => btn.tween.update())
//       return btn.view as Sprite
//     })
//     row(btnSpriteRow1, 100)

//     btnSpriteRow1.forEach(btn => btnRow1Container.addChild(btn))
//     btnRow1Container.position.set(this.grayBg.x + 20, this.grayBg.y - 50)
//     this.container.addChild(btnRow1Container)
//   }

//   buttonRender({
//     row1,
//   }: {
//     row1: CommonButton[]
//   }) {
//     const btnRow1Container = new ButtonContainer()
//     const btnSpriteRow1 = row1.map((btn, idx) => {
//       tickerManager.addListener(`btnRow1InLoadMenu-${idx}`, () => btn.tween.update())
//       return btn.view as Sprite
//     })

//     row(btnSpriteRow1, 220)

//     // 将按钮组移动到右下角
//     setTimeout(() => {
//       btnRow1Container.position.set(
//         this.app.canvas.width - btnRow1Container.width - 40, // 距离右边20px
//         this.app.canvas.height - btnRow1Container.height - 20, // 距离下边20px
//       )
//     })

//     btnSpriteRow1.forEach(btn => btnRow1Container.addChild(btn))
//     this.container.addChild(btnRow1Container)
//   }

//   defaultButtons() {
//     const returnBtn = new CommonButton({
//       text: 'return',
//       onClick: () => onReturn(),
//       noGradient: true, // 设置 noGradient 为 true，不使用渐变
//       colors: {
//         default: 'rgb(210, 96, 112)', // 更新为新的玫红色
//         hover: 'rgb(255, 130, 150)', // 悬停颜色
//         press: 'rgb(180, 70, 90)', // 按下颜色
//         disable: 'rgb(180, 180, 180)', // 禁用颜色
//       },
//       textColor: 'white',
//     })

//     const ExitBtn = new CommonButton({
//       text: 'Exit',
//       onClick: () => onExit(),
//       noGradient: true, // 设置 noGradient 为 true，不使用渐变
//       colors: {
//         default: 'rgb(210, 96, 112)', // 更新为新的玫红色
//         hover: 'rgb(255, 130, 150)', // 悬停颜色
//         press: 'rgb(180, 70, 90)', // 按下颜色
//         disable: 'rgb(180, 180, 180)', // 禁用颜色
//       },
//       textColor: 'white',
//     })
//     return {
//       row1: [returnBtn, ExitBtn],
//     }
//   }

//   async render() {
//     if (!this.isRender) {
//       // 渐入效果
//       this.container.visible = true
//       const alfphaFilter = new AlphaFilter()
//       alfphaFilter.alpha = 0
//       this.container.filters = [alfphaFilter]
//       this.initFilter()
//       this.toPage({ page: 1, force: true })
//       this.isRender = true
//     }
//   }
// }

// export const loadMenu = new LoadMenu()
