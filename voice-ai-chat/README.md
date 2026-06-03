# AI 语音助手

> 微信风格的网页版 AI 语音对话，支持接入 OpenAI / DeepSeek / Moonshot 等主流 AI API，具备流式响应、TTS 语音播报、语音输入等能力。

## 在线访问

部署后访问：`https://<你的用户名>.github.io/<仓库名>/`

## 功能

- 🤖 接入真实 AI API（支持 GPT / DeepSeek / Kimi / 智谱 / 通义）
- 🌐 AI 具备当前时间感知，可回答时效性问题
- 🎤 语音输入（Web Speech API，Chrome 支持最佳）
- 🔊 语音播报（浏览器 TTS）
- 💬 流式逐字输出
- 📱 微信聊天风格 UI
- 🟢 AI 在线 / 忙碌 / 离线状态显示
- ⚙️ 前端设置面板（Key 存本地，不上传）

## 使用方法

1. 打开网页后点击右上角 **齿轮图标**
2. 选择 AI 提供商，填入 API Key
3. 保存后即可开始对话

## 推荐 API

| 提供商 | 注册地址 | 特点 |
|--------|---------|------|
| DeepSeek | https://platform.deepseek.com | 极低价格，中文效果佳 |
| Moonshot/Kimi | https://platform.moonshot.cn | 支持搜索，中文强 |
| 智谱 GLM | https://open.bigmodel.cn | 有免费额度 |
| OpenAI | https://platform.openai.com | 全球最强 |

## 本地运行

直接用浏览器打开 `index.html` 即可（无需服务器）。

## 部署到 GitHub Pages

1. 将此目录推送到 GitHub 仓库
2. 进入仓库 **Settings → Pages**
3. Source 选择 **GitHub Actions**
4. Push 代码后自动部署完成
