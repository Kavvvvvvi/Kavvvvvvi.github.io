<!-- 模板索引文件 -->
# 博客格式模板库

这个文件夹包含了可在 Markdown 博客文章中使用的各种 HTML/CSS 格式模板。
使用这些模板可以让您的博客文章更加美观和结构化。

## 可用模板

1. **[引言框模板](intro-box-template.html)** - 用于突出显示文章引言或重要概述
2. **[警告/提示框模板](alert-box-template.html)** - 用于显示提示、警告、成功或错误信息
3. **[代码块带标题模板](code-block-template.html)** - 用于显示带有标题的代码片段
4. **[引用模板](blockquote-template.html)** - 用于美化引用内容
5. **[并排图片模板](side-by-side-images-template.html)** - 用于并排显示多张图片

## 使用方法

1. 打开您想要使用的模板文件
2. 复制HTML代码
3. 粘贴到您的Markdown博客文章中
4. 替换示例内容为您自己的内容

## 自定义

每个模板文件中都包含了注释，说明如何自定义颜色、大小等样式。
您可以根据自己的喜好修改这些样式。

## 示例

### 引言框示例

```html
<div style="background-color: rgba(236, 179, 229, 0.2); border-left: 4px solid #3498db; padding: 10px; margin: 10px 0; border-radius: 3px; max-width: 85%;">
<h3 style="margin-top: 0; margin-bottom: 8px; color: #2980b9; font-size: 1.1em;">引言</h3>
<p style="margin: 5px 0;">这是一个引言示例，您可以在这里放置重要的概述内容。</p>
</div>
```

### 警告框示例

```html
<div style="background-color: rgba(255, 243, 205, 0.5); border-left: 4px solid #f39c12; padding: 10px; margin: 10px 0; border-radius: 3px;">
<h4 style="margin-top: 0; margin-bottom: 8px; color: #d35400; font-size: 1.1em;">⚠️ 注意</h4>
<p style="margin: 5px 0;">这是一个警告提示示例，用于提醒读者注意某些重要事项。</p>
</div>
``` 