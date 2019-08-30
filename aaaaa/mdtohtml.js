const marked = require("marked"); //markdown解析
const fs = require("fs");
const path = require("path");
const highlight = require("highlight.js"); //代码高亮
const minify = require("html-minifier").minify; //文本压缩
const mapDirUtil = require("./mapdirutil"); //遍历文件夹的工具类

const renderer = new marked.Renderer(); //创建markdown渲染对象

//渲染a标签时的回调
renderer.link = function(href, title, text) {
  return `<a href="${href}" target="_blank">${text}</a>`;
};

//渲染h1-h6标签时的回调
renderer.heading = function(text, level) {
  var content = "";
  var number = "";
  return (
    `<h${level} id="` + content + `">` + number + " " + content + `</h${level}>`
  );
};

//设置markdown解析
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, language) {
    var html = undefined;
    try {
      html = highlight.highlight(language, code).value;
    } catch (err) {
      //如果不支持某些语言报错,则使用java语法进行转化
      html = highlight.highlight("java", code).value;
    }
    return html;
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});

// 同步读取 模板内容
// var tempalte = fs.readFileSync("template.html").toString();

mapDirUtil.mapDir(
  "C:\\Users\\yingjie.lu\\Desktop\\html", //src路径
  "./", //当前目录
  function(srcDir, relativePath, filename) {
    //文件回调
    console.log(srcDir, relativePath, filename);
  },
  function(srcDir, relativePath, filename) {
    //目录回调(返回false则该目录不继续遍历)
    console.log(srcDir, relativePath, filename);
  }
);
