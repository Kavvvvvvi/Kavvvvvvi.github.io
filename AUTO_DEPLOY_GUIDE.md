# Hexo 自动部署指南

本文档提供了几种自动部署 Hexo 博客的方法，让您在修改内容后无需手动执行 `hexo g -d` 命令。

## 方法 1：使用批处理脚本（Windows）

1. 在博客根目录下已创建 `auto-deploy.bat` 文件
2. 双击运行该文件
3. 脚本会每 60 秒自动执行一次部署
4. 按 `Ctrl+C` 停止自动部署

## 方法 2：使用 Bash 脚本（Linux/macOS）

1. 在博客根目录下已创建 `auto-deploy.sh` 文件
2. 执行以下命令赋予执行权限：
   ```
   chmod +x auto-deploy.sh
   ```
3. 运行脚本：
   ```
   ./auto-deploy.sh
   ```
4. 脚本会每 60 秒自动执行一次部署
5. 按 `Ctrl+C` 停止自动部署

## 方法 3：使用 Nodemon（推荐，基于文件变化触发）

这种方法更智能，只在文件变化时才会触发部署：

1. 安装 nodemon：
   ```
   npm install -g nodemon
   npm install --save-dev nodemon
   ```

2. 将 `auto-deploy-package.json` 中的内容合并到您的 `package.json` 文件，或者直接复制以下命令：

3. 运行以下命令启动监视：
   ```
   npm run watch
   ```
   
   或者直接运行：
   ```
   nodemon --watch source --watch _config.yml --watch themes -e md,ejs,styl,yml,js,css --ignore public/ --ignore .deploy_git/ --exec "hexo clean && hexo generate && hexo deploy"
   ```

4. 现在，每当您修改文章或配置文件时，系统会自动部署您的网站

## 方法 4：使用 Hexo 的内置服务器（仅本地预览）

如果您只需要本地预览而不是部署到远程服务器：

```
hexo server --watch
```

这会启动一个本地服务器，并在文件变化时自动重新生成内容。

## 注意事项

- 频繁部署可能会消耗更多的服务器资源
- 如果您使用 GitHub Pages，过于频繁的推送可能会受到限制
- 建议在完成一组相关修改后再进行部署，而不是每次小修改都部署 