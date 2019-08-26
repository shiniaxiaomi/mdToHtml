//最好是使用绝对路径
const srcDir = "C:\\Users\\yingjie.lu\\Desktop\\note"; //源路径
const targetDir = "C:\\Users\\yingjie.lu\\Desktop\\html"; //目标路径

const baseCssPath = targetDir+"/css/github.css";
const highlightCssPath = targetDir+"/css/highlight.css";

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

//给h1-h6标题添加序号
renderer.heading = function (text, level) {

  if(flag==false){
    h1_sum=0;
    h2_sum=0;
    h3_sum=0;
    h4_sum=0;
    h5_sum=0;
    h6_sum=0;
    flag=true;
    console.log(sidebar)
    sidebar=[];
  }


  if(flag){
    var content="";
    var number="";
    switch(level){
      case 1: 
        h1_sum++;
        h2_sum=0;
        h3_sum=0;
        h4_sum=0;
        h5_sum=0;
        h6_sum=0;
        number=`${h1_sum}. `;
        content=`${text}`;

        //保存h1标签
        sidebar.push({
          number:number,
          data:content,
          children:[]
        })
        
        break;
      case 2:
        h2_sum++;
        h3_sum=0;
        h4_sum=0;
        h5_sum=0;
        h6_sum=0;
        number=`${h1_sum}.${h2_sum}. `;
        content=`${text}`;

        sidebar.map((item,index)=>{
          if(item.number==h1_sum){
            sidebar[index].children.push({
              number:number,
              data:content,
              children:[]
            })
          }
        })
        break;
      case 3:
        h3_sum++;
        h4_sum=0;
        h5_sum=0;
        h6_sum=0;
        number=`${h1_sum}.${h2_sum}.${h3_sum}. `;
        content=`${text}`;

        sidebar.map((item,index)=>{
          if(item.number==h1_sum){
            sidebar[index].children.map((item1,index1)=>{
              if(item1.number==h2_sum){
                sidebar[index].children[index1].children.push({
                  number:number,
                  data:content,
                  children:[]
                })
              }
            })
          }
        })
        break;
      case 4:
        h4_sum++;
        h5_sum=0;
        h6_sum=0;
        number=`${h1_sum}.${h2_sum}.${h3_sum}.${h4_sum}. `;
        content=`${text}`;

        sidebar.map((item,index)=>{
          if(item.number==h1_sum){
            sidebar[index].children.map((item1,index1)=>{
              if(item1.number==h2_sum){
                sidebar[index].children[index1].children.push({
                  number:number,
                  data:content,
                  children:[]
                })
              }
            })
          }
        })
        break;
      case 5:
        h5_sum++;
        h6_sum=0;
        number=`${h1_sum}.${h2_sum}.${h3_sum}.${h4_sum}.${h5_sum}. `;
        content=`${text}`;
        break;
      case 6:
        h6_sum++;
        number=`${h1_sum}.${h2_sum}.${h3_sum}.${h4_sum}.${h5_sum}.${h6_sum}. `;
        content=`${text}`;
        break;
    }

    // var NO=h1_sum+(h2_sum==0?".":"."+h2_sum)+(h3_sum==0?".":"."+h3_sum)+(h4_sum==0?".":"."+h4_sum)+(h5_sum==0?".":"."+h5_sum)+(h6_sum==0?".":"."+h6_sum);
    // sidebar.map((item,index)=>{
    //   if(item.number==NO){
    //     item.children[item].map()
    //   }
    // })

 

    return `<h${level}>`+number+content+`</h${level}>`;
  }

};


function mapNode(sidebar,times,var1,var2,var3,var4,var5,var6){
  sidebar.children.map((item,index)=>{
    
  })

}


//遍历目录,到每个目录或文件的时候回调
function mapDir(srcDir,targetDir,fileCallback,dirCallback){
  //如果目录不存在,则创建
  if(!fs.existsSync(targetDir)){
    fs.mkdirSync(targetDir,{recursive :true},err=>{});
  }

  //读取目录
  fs.readdir(srcDir, function(err, files) {
    if(files==undefined){
      console.log(srcDir+"文件夹下没有文件");
      return;
    }
    files.forEach((filename, index) => {
      let srcPath = path.join(srcDir, filename);
      let targetPath = path.join(targetDir, filename);
      fs.stat(srcPath, (err, stats) => {
        if (stats.isDirectory()) {
          var flag=dirCallback(srcPath,targetPath);
          if(flag){
            mapDir(srcPath, targetPath,fileCallback,dirCallback);
          }
        } else if (stats.isFile()) {
          fileCallback(srcPath,targetPath,filename);
        }
      });
    });
  });
}

//删除目录
function delDir(path){
  let files = [];
  if(fs.existsSync(path)){
      files = fs.readdirSync(path);
      files.forEach((file, index) => {
          let curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()){
              delDir(curPath); //递归删除文件夹
          } else {
              fs.unlinkSync(curPath); //删除文件
          }
      });
      fs.rmdirSync(path);
  }
}

//复制css目录
function copyCssDir(srcDir,targetDir){
  mapDir(srcDir,targetDir,function(srcPath,targetPath,filename){
    fs.writeFileSync(targetPath, fs.readFileSync(srcPath));//复制文件
  },function(srcPath,targetPath){
    return true;
  });  
}

//将markdown生成html
function build(srcPath, targetPath, filename, tempalte) {
  fs.readFile(srcPath, (err, data) => {
    
    var body = marked(data.toString(), { renderer: renderer }).replace("[TOC]", "");//将[TOC]替换为空
    flag=false;

    //进行模板的参数替换
    var html = template
      .replace("${title}", filename)
      .replace("${keywords}", filename)
      .replace("${content}", filename)
      .replace("${baseCssPath}", baseCssPath)
      .replace("${highlightCssPath}", highlightCssPath)
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

//将markdown转化成html
function mdToHtml(srcDir,targetDir){
  mapDir(srcDir,targetDir,function(srcPath, targetPath, filename) {
      //如果是markdown文件,则回调转化成html
      if (srcPath.search(".md") != -1) {
        build(srcPath, targetPath, filename, template);
      } else {
        //如果是其他文件,则进行复制
        fs.writeFileSync(targetPath, fs.readFileSync(srcPath));
      }
  },function(srcPath,targetPath) {
      //对.git文件夹不做处理(如果路径中不包含.img并且包换.git,说明是.git仓库文件)
      if (srcPath.search(".git") != -1 && srcPath.search(".img") == -1) {
        return false;
      }
      return true;
  });
}


var h1_sum=0;
var h2_sum=0;
var h3_sum=0;
var h4_sum=0;
var h5_sum=0;
var h6_sum=0;
var sidebar=[];
var flag=true;//如果是false,则需要进行count=1

// 同步读取 模板内容
var template = fs.readFileSync("template.html").toString();
// 删除目标路径下的所有文件
// delDir(targetDir);
// 复制css到目标路径下
copyCssDir("./css",targetDir+"/css");
// 将markdown转化成html
mdToHtml(srcDir,targetDir);


// var a=[];
// a.push({
//   children:[]
// })

// a[0].children.push