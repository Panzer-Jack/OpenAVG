# OpenAVG

【OpenAVG】一个可以做Galgame和RPG 的 通用冒险游戏引擎

[制作的Demo演示](https://demo.openavg.panzer-jack.cn/) 

[引擎文档（#TODO）](https://doc.openavg.panzer-jack.cn/)

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/dace964a-35e4-491f-ba03-0746a6e10893" />

---

## 安装

### 系统要求

- Node.js >= 16.x
- pnpm >= 7.x

### 安装步骤
```bash
git clone https://github.com/Panzer-Jack/OpenAVG.git
cd OpenAVG
pnpm install
```

### 目录结构
```
OpenAVG/
├── packages/
│   ├── client/        # 客户端代码（游戏主程序）
│   ├── core/          # 引擎核心代码
│   ├── types/         # 类型定义
├── README.md          # 项目的文档
├── package.json       # 项目的配置
└── pnpm-workspace.yaml # pnpm workspace 配置
```

## 使用
1. 测试游戏
```bash
pnpm dev
```
2. 打包
```bash
pnpm build:game
```

