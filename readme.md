# 项目组成

项目有主要的 5 个文件组成

- css

  主要有笔记的两个样式

  - 页面的基本样式
  - 代码高亮样式

- js

  存放了侧边栏的一些逻辑实现

- index.js

  主要功能是指定笔记的源路径和目标路径,可以将源路径中的 markdown 笔记转化成 html 到目标路径

  - 转化的过程中将 html 进行了压缩处理
  - 将不是 markdown 的文件复制到目标路径中

- package.json

  记录了本次项目中使用的依赖包

- template.html

  html 的模板,转化的 html 页面都是参照这个模板进行转化的
  
- index.html

  用户的首页,用于笔记的全局搜索

# 项目初始化

- 项目初始化

  `npm install`或者`npm i`即可

- 项目运行

  `npm run build`
