# Jianceen

## 简介
Jianceen是一个基于Next.js的Web应用程序，旨在提供一个简单易用的在线考试平台。通过Jianceen，用户可以创建、管理和参加各种类型的考试。

## 效果展示

![Jianceen](./public/doc/jc%20(1).png)

![Jianceen](./public/doc/jc%20(2).png)

![Jianceen](./public/doc/jc%20(3).png)

![Jianceen](./public/doc/jc%20(4).png)


## 功能特点

- 基于Next.js 15.1.2版本构建
- 使用Tailwind CSS进行样式设计
- 支持API路由功能
- 自动字体优化（使用Geist字体）

## 安装说明

1. 克隆项目到本地：
```bash
git clone [你的仓库URL]
cd jianceen
```

2. 安装依赖：
```bash
npm install
# 或者使用yarn
yarn install
```

## 使用方法

### 开发环境

运行开发服务器：

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产环境

构建生产版本：

```bash
npm run build
# 或
yarn build
```

运行生产服务器：

```bash
npm run start
# 或
yarn start
```


## 项目结构

```
├── src/                # 源代码目录
│   ├── pages/         # 页面文件
│   ├── styles/        # 样式文件
│   └── data/          # 题库JSON文件
├── public/            # 静态资源
└── ...配置文件
```

## 题库编写指南

题库文件存放在 `src/data` 目录下，采用JSON格式。每个题库文件应遵循以下格式规范：

```json
{
    "title": "题库标题",
    "description": "题库描述",
    "time": 2000,
    "questions": [
        {
            "type": "简答题",
            "question": "题目内容",
            "answer": "答案内容"
        }
    ]
}
```

### 字段说明

- `title`: 题库的标题
- `description`: 题库的简要描述
- `time`: 答题时间限制（单位：秒）
- `questions`: 题目数组，包含多个题目对象
  - `type`: 题目类型（目前支持：简答题）
  - `question`: 题目内容
  - `answer`: 标准答案

### 添加新题库

1. 在 `src/data` 目录下创建新的JSON文件（如：`new_exam.json`）
2. 按照上述格式编写题库内容
3. 确保JSON格式正确，可以使用在线JSON校验工具进行验证

### 修改现有题库

1. 打开需要修改的题库JSON文件
2. 可以修改题库的基本信息（标题、描述、时间限制）
3. 在questions数组中：
   - 添加新题目：在数组末尾添加新的题目对象
   - 修改现有题目：直接修改对应题目对象的内容
   - 删除题目：移除对应的题目对象
4. 保存文件时注意维持正确的JSON格式

## 技术栈

- Next.js 15.1.2
- React 18.3.1
- Tailwind CSS 3.4.1

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](./LICENSE) 文件。

## 贡献指南

欢迎提交问题和贡献代码，请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 部署

推荐使用 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) 进行部署，这是 Next.js 官方推荐的部署平台。

更多部署相关信息，请参考 [Next.js 部署文档](https://nextjs.org/docs/pages/building-your-application/deploying)。
