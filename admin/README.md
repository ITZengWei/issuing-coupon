# 个人博客后台管理界面

预览: [http://blog.smalllb.top/admin/](http://blog.smalllb.top/admin/)

## 项目介绍

最开始通过 React Class 的方式开发了一个后台界面，但是代码冗余，可读性不高，通过学习 React Hooks 和 TypeScript 也想实战练习一下，所以重构了之前的后台。

## 规划

- 响应式后台
- 封装 Axios 请求方法
- 全面使用`react-hooks`开发，不再使用 `class`组件写法，所有组件异步加载，提高首屏渲染速度
- 根据路由配置设计路由
- 动态权限设计
- Css all Js
- ...

## 技术栈

- UI 框架: `react`、`react-hooks`
- UI 组件: `antd`
- 数据管理: `redux`、`redux-thunk`、`react-redux`
- 类型检查 `TypeScript`
- 接口请求 `axios`
- Cookies: `js-cookie`
- 后端 Api: `nodejs`、`nestjs`、`mongodb`、`TypeScript`、

## 菜单

- 仪表盘
- 菜单管理
- 分类管理
- 相册管理
- 记录管理
- 游戏管理
- 文章管理
- 用户页

## 使用

```cmd
  $ git clone -b dev-admin-v2 https://github.com/ITZengWei/project-blog.git
  $ cd project-blog
  $ npm install
  $ npm start
```

## 文件说明

```cmd

D:.
│  .gitignore // github 忽略文件
│  .prettierrc // 代码格式化
│  craco.config.js // 对antd按需加载以及设计主题色
│  debug.log
│  lessVars.js // antd 主题色
│  package.json
│  README.md
│  tsconfig.json // TypeScript配置文件
│  yarn.lock
│
├─.vscode
│      settings.json // 配置VsCode 对 prettierrc支持
│
├─public
│      favicon1.ico
│      index.html
│      logo192.png
│      logo512.png
│      manifest.json
│      robots.txt
│
├─readme-asserts // README 素材
│      个人博客获取菜单数据.png
│      获取菜单树.png
│
└─src
    │  App.test.tsx
    │  App.tsx
    │  index.tsx
    │  react-app-env.d.ts
    │  reportWebVitals.ts
    │  setupTests.ts
    │
    ├─api // 后端接口Api
    │      album.ts
    │      article.ts
    │      category.ts
    │      code.ts
    │      file.ts
    │      game.ts
    │      menu.ts
    │      record.ts
    │      types.ts
    │      user.ts
    │
    ├─asserts // 图片资源
    │  └─images
    │      │  brand_bg.jpg
    │      │  default.png
    │      │  notFound.jpg
    │      │  pie_bg.png
    │      │  pie_top.jpg
    │      │
    │      └─ContainerAside
    │              banner.png
    │              banner1.png
    │
    ├─components
    │  ├─common-modal
    │  │      index.tsx
    │  │
    │  ├─container // 容器相关组件
    │  │      container-aside.tsx // 页面通用侧边栏
    │  │      container-breadcrumb.tsx // 面包屑
    │  │      container-footer.tsx // 页面通用底部
    │  │      container-header.tsx // 页面通用头部
    │  │      container-history.tsx // 页面通用历史记录
    │  │      container-main.tsx // 主区域外部
    │  │      context.ts // 容器相关上下文
    │  │      index.tsx // 用来整合 侧边栏、头部、底部等等
    │  │      style.ts // 容器相关样式
    │  │
    │  ├─echars // 图表封装(TODO)
    │  │      index.tsx
    │  │
    │  ├─editor // 富文本编辑器
    │  │      index.tsx
    │  │      style.ts
    │  │
    │  ├─filter-group // 通用过滤按钮
    │  │      drop-down.tsx
    │  │      index.ts
    │  │      input-search.tsx
    │  │
    │  ├─form-drawer // 通用表单抽屉
    │  │      context.ts
    │  │      form-icon.tsx // 表单——选择图标
    │  │      form-select.tsx // 表单——下拉框
    │  │      index.tsx
    │  │      style.ts
    │  │
    │  ├─loading
    │  │      common-loading.tsx
    │  │      layout-loading.tsx
    │  │      style.ts
    │  │
    │  └─simple-upload  // 通用上传文件组件
    │          index.tsx
    │
    ├─config // 应用配置(Api地址、令牌等配置)
    │      index.ts
    │
    ├─hooks
    │      use-actions.ts // 将普通函数绑定 redux-action函数钩子
    │      use-menu-selectd-keys.ts // 获取当前选中菜单钩子
    │      use-shallow-equal-selector.ts // 浅比较获取store里面的信息
    │
    ├─layouts
    │      base-layout.tsx // 业务页面布局
    │      error-layout.tsx // 错误页面布局
    │      init-layout.tsx // 全局初始化布局(获取用户信息)
    │      user-layout.tsx // 用户路由(登录、注册、找回密码等)
    │
    ├─routes // 路由
    │      index.tsx // 路由配置
    │      types.ts // 路由类型
    │      util.ts // 转换路由的一些方法
    │
    ├─store // 全局数据
    │  │  index.ts
    │  │  reducer.ts
    │  │  types.ts
    │  │
    │  └─module
    │      └─user
    │              actionCreators.ts
    │              reducer.ts
    │
    ├─styles // 全局样式
    │      basic-style.ts
    │      global-style.ts
    │
    ├─utils // 工具
    │      cookie.ts // 对 js-cookie 的封装
    │      menu.ts // 菜单相关方法
    │      person.ts // 一些用户信息转换方法
    │      request.ts // 请求封装
    │      store.ts // 本地 localStorage 封装
    │      tool.ts // 公共实用方法
    │      validator.ts //  验证值的策略
    │
    └─views // 页面
        ├─account-center // 用户中心
        │      index.tsx
        │
        ├─account-list // 用户列表
        │      index.tsx
        │
        ├─account-setting // 用户设置
        │      index.tsx
        │
        ├─add-article // 菜单树
        │      index.tsx
        │
        ├─album-admin // 相册管理
        │      index.tsx
        │
        ├─analyses // 分析也
        │      index.tsx
        │      style.ts
        │
        ├─article-list // 文章列表
        │      index.tsx
        │
        ├─category-admin // 分类管理
        │      index.tsx
        │
        ├─error
        │  ├─forbidden // 无访问权限页面
        │  │      index.tsx
        │  │
        │  └─not-found // 404 页面
        │          index.tsx
        │
        ├─game-admin // 游戏列表
        │      index.tsx
        │
        ├─menu-list // 菜单列表
        │      index.tsx
        │
        ├─menu-tree // 菜单树
        │      index.tsx
        │
        ├─record-admin // 记录管理
        │      index.tsx
        │
        ├─system
        │  ├─login
        │  │      index.tsx // 登录页面
        │  │      style.ts
        │  │
        │  ├─register // 注册页面
        │  │      index.tsx
        │  │
        │  └─register-result // 注册成功页面
        │          index.tsx
        │
        └─workplace // 工作台页面
                index.tsx
```
