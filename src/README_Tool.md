#Compodoc
它用于为 Angular 应用程序生成静态文档。Compodoc 能够帮助 Angular开发人员为他们的应用程序生成清晰且有用的文档，这使得参与应用程序开发的其它成员也可以轻松了解当前应用程序或库的特性。

生成的文档结构清晰。<br>
- 支持多种主题风格，比如 laravel, original, material, postmark 等。<br>
- 支持快速检索，基于强大的 lunr.js 搜索引擎。<br>
- 支持 JSDoc 高亮，支持 @param, @returns, @link, @ignore 和 @example 标签。<br>
- 支持文档覆盖率统计。<br>
- 对 Angular CLI 友好，支持 Angular CLI 创建的项目。<br>
- 离线化，无需服务器，不依赖线上资源，完全脱机生成的文档。<br>

**安装 compodoc**
```
npm install --save-dev @compodoc/compodoc
```
然后我们在项目的 package.json 中添加以下配置：
```
"scripts": {
  "compodoc": "./node_modules/.bin/compodoc -p src/tsconfig.app.json"
}
或者
"scripts": {
   "compodoc": "npx compodoc -p src/tsconfig.app.json"
}
```
运行
```
npm run compodoc
```
