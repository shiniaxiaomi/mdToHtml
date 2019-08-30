var fs=require("fs")
var shell = require('shelljs');

var path="E:\\";

//进入到笔记目录下
shell.cd(path);

shell.exec("git clone https://github.com/shiniaxiaomi/note.git", function(code, stdout, stderr) {
    if(code!=0){//报错
        console.log(new Date().toLocaleString()+'克隆失败:'+stderr);
    }else{
        console.log(new Date().toLocaleString()+'克隆成功:'+stdout);
        //执行index.js脚本
    }
  })