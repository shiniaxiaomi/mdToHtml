//最好是使用绝对路径
const srcPath = "mynote"; //源路径
const targetPath = "html"; //目标路径

const cssPath = "";
const highlightCssPath = "";

// Create reference instance
const marked = require("marked"); //markdown解析
var fs = require("fs");
const path = require("path");
const highlight = require("highlight.js"); //代码高亮
const minify = require("html-minifier").minify; //文本压缩

// Set options
// `highlight` example uses `highlight.js`
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

const renderer = new marked.Renderer();

//渲染a标签
renderer.link = function(href, title, text) {
  return `<a href="${href}" target="_blank">${text}</a>`;
};

// 遍历目录下的所有文件
function mapDir(srcDir, targetDir, callback, finish) {
  //如果目录不存在,则创建
  fs.stat(targetDir, { recursive: true }, (err, stats) => {
    if (err) {
      fs.mkdir(targetDir, err => {
        if (err) {
          console.log(err);
        }
      });
    }
  });

  fs.readdir(srcDir, function(err, files) {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach((filename, index) => {
      let srcPath = path.join(srcDir, filename);
      let targetPath = path.join(targetDir, filename);
      fs.stat(srcPath, (err, stats) => {
        // 读取文件信息
        if (err) {
          console.log("获取文件stats失败");
          return;
        }
        if (stats.isDirectory()) {
          //对.git文件夹不做处理(如果路径中不包含.img并且包换.git,说明是.git仓库文件)
          if (srcPath.search(".git") != -1 && srcPath.search(".img") == -1) {
            return;
          }
          mapDir(srcPath, targetPath, callback, finish);
        } else if (stats.isFile()) {
          //如果是markdown文件,则回调转化成html
          if (srcPath.search(".md") != -1) {
            callback && callback(srcPath, targetPath, filename); //获取到了源文件路径和目标文件路径
          } else {
            //如果是其他文件,则进行复制
            fs.writeFileSync(targetPath, fs.readFileSync(srcPath));
          }
        }
      });
      if (index === files.length - 1) {
        finish && finish();
      }
    });
  });
}

//将markdown生成html
function build(srcPath, targetPath, filename, tempalte) {
  fs.readFile(srcPath, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    var body = marked(data.toString(), { renderer: renderer });

    //进行模板的参数替换
    var html = template
      .replace("${title}", filename)
      .replace("${keywords}", filename)
      .replace("${content}", filename)
      .replace("${css}", css1 + css2)
      .replace("${body}", body);

    fs.writeFile(
      targetPath.slice(0, targetPath.length - 3) + ".html",
      minify(html, {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true
      }), //开启文本压缩
      function(err) {
        console.log(targetPath + ".html生成成功!");
      }
    );
  });
}

// Compile
// 同步读取 模板内容
var template = fs.readFileSync("template.html").toString();
// 同步读取 css样式
var css1 = fs.readFileSync(__dirname + "/css/github.css").toString();
var css2 = fs.readFileSync(__dirname + "/css/highlight.css").toString();

mapDir(
  srcPath,
  targetPath,
  function(srcPath, targetPath, filename) {
    build(srcPath, targetPath, filename, template);
  },
  function() {}
);
