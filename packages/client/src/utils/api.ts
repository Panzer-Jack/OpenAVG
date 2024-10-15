export async function fetchGlobalConfig() {
  const res = await fetch('/demo/config.json')
  return res.json()
}

export async function fetchChapter({ name }: { name: string }) {
  const res = await fetch(`/demo/novel/${name}.json`)
  return res.json()
}
