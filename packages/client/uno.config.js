import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(), // 添加 UnoCSS 的默认样式预设
  ],
  theme: {
    colors: {
      'primary': 'rgb(209, 96, 112)',
      'primary-hover': 'rgb(255, 130, 150)',
      'primary-active': 'rgb(180, 70, 90)',
      'danger': '#ff4d4f',
      'link': '#1890ff',
      'default': '#f5f5f5',
      'gray': '#dcdcdc',
    },
    spacing: {
      small: '8px',
      middle: '16px',
      large: '24px',
    },
    fontSize: {
      small: '12px',
      middle: '14px',
      large: '16px',
    },
    borderRadius: {
      default: '4px',
    },
    animation: {
      spin: 'spin 1s linear infinite',
    },
  },
})
