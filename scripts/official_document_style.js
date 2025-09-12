/**
 * 官方文书样式应用脚本
 * 
 * 这个脚本会检查文章的front-matter中是否包含'document_style: official'标记
 * 如果包含，则会为文章页面添加'official-document'类，并引入相应的CSS
 */

'use strict';

const fs = require('fs');
const path = require('path');

// 在生成页面之前注入CSS
hexo.extend.filter.register('before_generate', function() {
  // 检查CSS文件是否存在，如果不存在则不执行后续操作
  const cssPath = path.join(hexo.source_dir, 'css', 'official-document.css');
  if (!fs.existsSync(cssPath)) {
    hexo.log.warn('官方文书样式CSS文件不存在，样式可能无法正确应用');
    return;
  }
});

// 在生成页面时为特定文章添加类名
hexo.extend.filter.register('after_render:html', function(str, data) {
  const post = data.page;
  
  // 检查是否是文章页面且设置了document_style为official
  if (post && post.layout === 'post' && post.document_style === 'official') {
    // 为body标签添加official-document类
    str = str.replace(/<body([^>]*)>/, '<body$1 class="official-document">');
    
    // 在head标签结束前添加CSS引用
    const cssLink = '<link rel="stylesheet" href="/css/official-document.css">';
    str = str.replace('</head>', cssLink + '</head>');
  }
  
  return str;
});

// 修改演示文章，添加document_style标记
hexo.extend.filter.register('before_post_render', function(data) {
  // 检查文章标题是否为"官方文书风格演示"
  if (data.title === '官方文书风格演示') {
    // 添加document_style标记
    data.document_style = 'official';
  }
  return data;
}); 