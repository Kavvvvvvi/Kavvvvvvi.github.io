const fs = require('fs');
const path = require('path');

/**
 * @typedef {import('hexo')} Hexo
 */

/**
 * =======================================================================
 *                          别名使用指南
 * =======================================================================
 * 
 * 使用方法: @别名[参数1][参数2]...
 * 
 * ---
 * 
 * 警告框:
 * 用法: @警告框[标题][内容]
 * 复制: @警告框[][]
 * 
 * ---
 * 
 * 引用框:
 * 用法: @引用框[引用内容][引用来源]
 * 复制: @引用框[][]
 * 
 * ---
 * 
 * 代码框:
 * 用法: @代码框[代码标题][代码内容]
 * 复制: @代码框[][]
 * 
 * ---
 * 
 * 并排图片 / 图注小字加粗无边框:
 * 用法: @并排图片[images/.png][图片1说明][images/.jpg][图片2说明]
 * 复制: @并排图片[][][][]
 * 
 * ---
 * 
 * 引言框 / 正文粉色正常粗无边框:
 * 用法: @引言框[标题][内容第一段][内容第二段(可选)]
 * 复制: @引言框[][][]
 * 
 * =======================================================================
 */

/**
 * 别名到模板文件名的映射。
 * 您可以在这里添加或修改您想要的别名。
 * key 是您在 markdown 中使用的别名 (例如 @警告框)
 * value 是在 source/templates/ 文件夹下的模板文件名
 * @type {Object.<string, string>}
 */
const templateAliases = {
  // 通用模板别名
  '警告框': 'alert-box-template.html',
  '引用框': 'blockquote-template.html',
  '代码框': 'code-block-template.html',
  '并排图片': 'side-by-side-images-template.html',
  '引言框': 'template.html',

  // 根据您提供的例子创建的别名
  '正文粉色正常粗无边框': 'template.html',
  '图注小字加粗无边框': 'side-by-side-images-template.html'
};

/**
 * 插件主逻辑
 * @param {Hexo} hexo
 */
function customTemplatePlugin(hexo) {
  const templatesDir = path.join(hexo.source_dir, 'templates');
  const templateCache = new Map();

  function getTemplateContent(filename) {
    if (templateCache.has(filename)) {
      return templateCache.get(filename);
    }

    try {
      const filePath = path.join(templatesDir, filename);
      // 使用 existsSync 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        hexo.log.warn(`[CustomTemplates] Template file not found: ${filePath}`);
        templateCache.set(filename, null);
        return null;
      }
      const content = fs.readFileSync(filePath, 'utf-8');
      templateCache.set(filename, content);
      return content;
    } catch (error) {
      hexo.log.error(`[CustomTemplates] Error reading template file ${filename}:`, error);
      templateCache.set(filename, null);
      return null;
    }
  }

  function customTemplateTag(data) {
    // 确保 content 是字符串
    if (typeof data.content !== 'string') {
        return data;
    }
    
    let content = data.content;

    // 正则表达式匹配 @别名[参数1][参数2]...
    // @([^\s[\]]+) 匹配别名, 例如：@警告框
    // ((?:\[.*?\])*) 匹配所有参数, 例如：[标题][内容]
    const aliasRegex = /@([^\s[\]]+)((?:\[.*?\])*)/g;

    content = content.replace(aliasRegex, (match, alias, paramsString) => {
      if (!templateAliases[alias]) {
        // 如果别名未定义，则不进行替换
        return match;
      }

      const templateFile = templateAliases[alias];
      let templateContent = getTemplateContent(templateFile);

      if (!templateContent) {
        // 如果模板文件读取失败，不替换
        return match;
      }

      // 解析参数, e.g., from "[param1][param2]" to ["param1", "param2"]
      const params = [];
      if (paramsString) {
        const paramRegex = /\[(.*?)\]/g;
        let paramMatch;
        while ((paramMatch = paramRegex.exec(paramsString)) !== null) {
          params.push(paramMatch[1]);
        }
      }

      // 根据模板文件名和参数替换占位符
      switch (templateFile) {
        case 'alert-box-template.html':
          templateContent = templateContent.replace(/⚠️\s*提示标题/g, `⚠️ ${params[0] || '提示'}`);
          templateContent = templateContent.replace(/提示内容/g, params[1] || '内容');
          break;
        case 'blockquote-template.html':
          templateContent = templateContent.replace(/引用内容/g, params[0] || '引用内容');
          templateContent = templateContent.replace(/引用来源/g, params[1] || '引用来源');
          break;
        case 'code-block-template.html':
          templateContent = templateContent.replace(/代码标题/g, params[0] || '代码');
          // 处理多行代码的情况
          const codeContent = params[1] || '请在此处输入代码';
          templateContent = templateContent.replace(/<pre[^>]*>[\s\S]*?<\/pre>/, `<pre style="margin-top: 0; background-color: #f6f8fa; padding: 16px; border: 1px solid #ddd; border-top: none; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; overflow-x: auto; font-family: monospace; line-height: 1.5;">${codeContent}</pre>`);
          break;
        case 'side-by-side-images-template.html':
          // 这个模板比较复杂，我们替换图片1和图片2的信息
          templateContent = templateContent.replace(/\/images\/image1.jpg/g, params[0] || '/images/placeholder.jpg');
          templateContent = templateContent.replace(/<strong>图片1说明文字<\/strong>/g, `<strong>${params[1] || '图片说明'}</strong>`);
          templateContent = templateContent.replace(/\/images\/image2.jpg/g, params[2] || '/images/placeholder.jpg');
          templateContent = templateContent.replace(/<strong>图片2说明文字<\/strong>/g, `<strong>${params[3] || '图片说明'}</strong>`);
          break;
        case 'template.html':
          templateContent = templateContent.replace(/引言标题/g, params[0] || '引言');
          templateContent = templateContent.replace(/引言内容第一段/g, params[1] || '内容第一段');
          // 如果有第二个内容参数，则替换第二段，否则移除第二段
          if (params[2]) {
            templateContent = templateContent.replace(/引言内容第二段/g, params[2]);
          } else {
            templateContent = templateContent.replace(/<p style="margin: 5px 0;">引言内容第二段<\/p>/g, '');
          }
          break;
      }

      return templateContent;
    });

    data.content = content;
    return data;
  }

  // 注册过滤器，9 是优先级，可以根据需要调整
  hexo.extend.filter.register('before_post_render', customTemplateTag, 9);
}

// 导出插件
customTemplatePlugin(hexo); 