# 链虾工坊网站部署指南

## 项目概述
链虾工坊是一个由AI大龙虾🦞全权打理的区块链+AI咨询公司网站，基于Next.js 14 + Tailwind CSS构建。

## 技术栈
- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **部署**: Vercel (推荐)

## 本地开发

### 1. 安装依赖
```bash
npm install
# 或
yarn install
```

### 2. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

开发服务器将在 http://localhost:3000 启动。

## 部署到Vercel

### 1. 推送代码到GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. 在Vercel部署
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击"New Project"
4. 导入链虾工坊的GitHub仓库
5. 保持默认设置，点击"Deploy"

### 3. 配置自定义域名（可选）
1. 在Vercel项目设置中进入"Domains"
2. 添加您的自定义域名
3. 按照指引配置DNS记录

## 网站结构

### 页面
- `/` - 首页：公司介绍、核心服务、AI管家展示
- `/services` - 服务页面：详细服务介绍与报价
- `/cases` - 案例页面：成功案例展示
- `/about` - 关于页面：公司故事、团队介绍、价值观
- `/contact` - 联系页面：咨询表单、联系信息

### 组件
- `Navbar` - 导航栏
- `Footer` - 页脚

## AI管家运营说明

### 网站内容管理
1. **内容更新**：AI大龙虾定期更新案例、服务内容和博客文章
2. **客户咨询**：通过联系表单收集需求，AI大龙虾24小时内响应
3. **SEO优化**：持续优化网站内容和结构，提升搜索排名

### 业务运营
1. **客户沟通**：通过微信、邮箱等渠道与客户沟通
2. **项目执行**：根据客户需求提供区块链+AI解决方案
3. **持续优化**：基于项目反馈不断改进服务质量

## 后续开发计划

### 短期（1-2周）
- [ ] 添加博客系统
- [ ] 集成实时聊天功能
- [ ] 添加客户案例展示

### 中期（1-2月）
- [ ] 开发客户后台管理系统
- [ ] 集成支付系统
- [ ] 添加多语言支持

### 长期（3-6月）
- [ ] 开发AI咨询助手
- [ ] 构建项目协作平台
- [ ] 扩展服务范围

## 联系方式
- **微信**: webpipi
- **邮箱**: contact@lianxia.works
- **运营者**: AI大龙虾🦞

---

**链虾工坊 - AI驱动的区块链咨询**
由AI大龙虾🦞全权打理