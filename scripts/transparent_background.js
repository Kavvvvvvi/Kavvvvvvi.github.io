/**
 * 透明背景样式应用脚本
 * 
 * 这个脚本会检查网站配置或文章的front-matter中是否启用了透明背景
 * 如果启用，则会为页面添加相应的CSS样式
 */

'use strict';

const fs = require('fs');
const path = require('path');

// 在生成页面之前检查CSS文件是否存在
hexo.extend.filter.register('before_generate', function() {
  // 检查CSS文件是否存在
  const cssPath = path.join(hexo.source_dir, 'css', 'transparent-background.css');
  if (!fs.existsSync(cssPath)) {
    hexo.log.warn('透明背景样式CSS文件不存在，样式可能无法正确应用');
    return;
  }
  
  // 检查背景图片目录是否存在
  const bgDirPath = path.join(hexo.source_dir, 'images', 'backgrounds');
  if (!fs.existsSync(bgDirPath)) {
    hexo.log.warn('背景图片目录不存在，已自动创建');
    try {
      fs.mkdirSync(bgDirPath, { recursive: true });
    } catch (err) {
      hexo.log.error('创建背景图片目录失败:', err);
    }
  }
});

// 在生成页面时应用透明背景样式
hexo.extend.filter.register('after_render:html', function(str, data) {
  const config = hexo.config;
  const page = data.page;
  
  // 检查是否在全站配置中启用了透明背景
  const enableTransparentBg = config.transparent_background === true;
  
  // 检查是否在当前页面/文章中启用了透明背景
  const pageEnableTransparentBg = page && page.transparent_background === true;
  
  // 如果全站启用或当前页面启用了透明背景，则应用样式
  if (enableTransparentBg || pageEnableTransparentBg) {
    // 在head标签结束前添加CSS引用
    const cssLink = '<link rel="stylesheet" href="/css/transparent-background.css">';
    str = str.replace('</head>', cssLink + '</head>');
    
    // 获取背景图片设置
    let bgImageClass = '';
    let bgOpacityClass = '';
    let bgSizeClass = '';
    let bgPositionClass = '';
    let bgScrollClass = '';
    let darkThemeClass = '';
    
    // 从页面设置或全站设置中获取背景图片
    const bgImage = page && page.bg_image ? page.bg_image : config.bg_image;
    if (bgImage) {
      if (bgImage.startsWith('bg-image-') && bgImage.match(/^bg-image-[1-5]$/)) {
        // 使用预设背景图片
        bgImageClass = bgImage;
      } else if (bgImage === 'custom') {
        // 使用自定义背景图片
        bgImageClass = 'bg-custom';
        
        // 获取自定义背景图片路径
        const customBgImage = page && page.custom_bg_image ? page.custom_bg_image : config.custom_bg_image;
        if (customBgImage) {
          // 在页面中注入自定义背景图片样式
          const customBgStyle = `
            <style>
              body.bg-custom::before,
              body.bg-custom::after {
                background-image: url('${customBgImage}');
              }
            </style>
          `;
          str = str.replace('</head>', customBgStyle + '</head>');
        }
      }
    } else {
      // 默认使用第一张背景图片
      bgImageClass = 'bg-image-1';
    }
    
    // 从页面设置或全站设置中获取背景不透明度
    const bgOpacity = page && page.bg_opacity ? page.bg_opacity : config.bg_opacity;
    if (bgOpacity && bgOpacity.toString().match(/^(10|[1-9]0)$/)) {
      bgOpacityClass = `bg-opacity-${bgOpacity}`;
    } else {
      // 默认背景不透明度为70%
      bgOpacityClass = 'bg-opacity-70';
    }
    
    // 从页面设置或全站设置中获取背景尺寸
    const bgSize = page && page.bg_size ? page.bg_size : config.bg_size;
    if (bgSize) {
      if (['contain', 'auto', '100', 'width-100', 'height-100', 'cover'].includes(bgSize)) {
        bgSizeClass = `bg-${bgSize}`;
      }
    }
    
    // 从页面设置或全站设置中获取背景位置
    const bgPosition = page && page.bg_position ? page.bg_position : config.bg_position;
    if (bgPosition) {
      if (['top', 'bottom', 'left', 'right', 'center'].includes(bgPosition)) {
        bgPositionClass = `bg-${bgPosition}`;
      }
    }
    
    // 从页面设置或全站设置中获取背景滚动模式
    const bgScroll = page && typeof page.bg_scroll !== 'undefined' ? page.bg_scroll : config.bg_scroll;
    if (bgScroll === true) {
      bgScrollClass = 'bg-scroll';
    } else if (bgScroll === false) {
      bgScrollClass = 'bg-fixed';
    } else {
      // 未显式配置时，默认使用滚动背景，便于自适应高度生效
      bgScrollClass = 'bg-scroll';
    }
    
    // 从页面设置或全站设置中获取是否使用暗色主题
    const darkTheme = page && typeof page.dark_theme !== 'undefined' ? page.dark_theme : config.dark_theme;
    if (darkTheme === true) {
      darkThemeClass = 'dark-theme';
    }
    
    // 将所有类添加到body标签
    const classesToAdd = [
      'transparent-background',
      'custom-background',
      bgImageClass,
      bgOpacityClass,
      bgSizeClass,
      bgPositionClass,
      bgScrollClass,
      darkThemeClass
    ].filter(Boolean).join(' ');
    
    // 添加类到body标签
    if (str.includes('<body class="')) {
      str = str.replace(/<body class="([^"]*)"/, function(match, p1) {
        return `<body class="${p1} ${classesToAdd}"`;
      });
    } else if (str.includes('<body ')) {
      str = str.replace(/<body ([^>]*)>/, function(match, p1) {
        return `<body ${p1} class="${classesToAdd}">`;
      });
    } else {
      str = str.replace(/<body>/, `<body class="${classesToAdd}">`);
    }
    
    // 添加自适应背景JavaScript
    const adaptiveBgScript = `
      <script>
        /**
         * 自适应背景图片长度控制
         * 根据页面内容长度自动调整背景图片高度
         */
        (function() {
          function initAdaptiveBackground() {
            // 检查是否启用了透明背景
            if (!document.body.classList.contains('custom-background')) {
              return;
            }

            // 等待页面完全加载
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', adjustBackgroundHeight);
            } else {
              adjustBackgroundHeight();
            }

            // 监听窗口大小变化
            window.addEventListener('resize', debounce(adjustBackgroundHeight, 250));
            
            // 监听内容变化（如果有动态内容）
            const observer = new MutationObserver(debounce(adjustBackgroundHeight, 500));
            observer.observe(document.body, { 
              childList: true, 
              subtree: true, 
              attributes: true 
            });
          }

          function adjustBackgroundHeight() {
            const body = document.body;
            
            // 获取页面实际高度
            const pageHeight = Math.max(
              document.body.scrollHeight,
              document.body.offsetHeight,
              document.documentElement.clientHeight,
              document.documentElement.scrollHeight,
              document.documentElement.offsetHeight
            );
            
            // 设置背景元素的高度为页面实际高度
            const beforeStyle = document.createElement('style');
            beforeStyle.id = 'adaptive-background-style';
            
            // 移除之前的样式
            const existingStyle = document.getElementById('adaptive-background-style');
            if (existingStyle) {
              existingStyle.remove();
            }
            
            // 设置背景元素的高度
            beforeStyle.textContent = \`
              body.custom-background::before {
                height: \${pageHeight}px !important;
              }
            \`;
            
            document.head.appendChild(beforeStyle);
          }

          // 防抖函数
          function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
              const later = () => {
                clearTimeout(timeout);
                func(...args);
              };
              clearTimeout(timeout);
              timeout = setTimeout(later, wait);
            };
          }

          // 初始化
          initAdaptiveBackground();
        })();
      </script>
    `;
    
    // 在body结束标签前添加脚本
    str = str.replace('</body>', adaptiveBgScript + '</body>');
  }
  
  return str;
}); 