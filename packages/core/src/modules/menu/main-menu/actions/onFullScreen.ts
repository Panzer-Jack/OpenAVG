export function onFullScreen() {
  const element = document.documentElement // 选择整个页面
  if (element.requestFullscreen) {
    element.requestFullscreen() // 在支持的浏览器中调用
  }
}
