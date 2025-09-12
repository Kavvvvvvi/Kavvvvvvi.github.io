/**
 * 样式覆盖脚本
 * 
 * 这个脚本会在所有页面中注入自定义样式
 */

'use strict';

const fs = require('fs');
const path = require('path');

// 在生成页面之前检查CSS文件是否存在
hexo.extend.filter.register('before_generate', function() {
  // 检查CSS文件是否存在
  const cssPath = path.join(hexo.source_dir, 'css', 'style-override.css');
  if (!fs.existsSync(cssPath)) {
    hexo.log.warn('自定义样式覆盖CSS文件不存在，样式可能无法正确应用');
    return;
  }
});

// 在生成页面时注入自定义样式
hexo.extend.filter.register('after_render:html', function(str, data) {
  // 在head标签结束前添加CSS引用
  const cssLink = '<link rel="stylesheet" href="/css/style-override.css">';
  str = str.replace('</head>', cssLink + '</head>');
  
  return str;
}); 