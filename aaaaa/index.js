var gitUrl="https://github.com/shiniaxiaomi/mdToHtml.git";
var targetDir=""
var srcDir="C:\\Users\\yingjie.lu\\Desktop\\buff"

const shell = require('shelljs');
const path = require("path");

//进入到srcDir目录下,将github上笔记了克隆到源目录下
var gitExe = shell.exec("git clone "+gitUrl+" "+srcDir, {silent:true});
if(gitExe.code!=0){
    console.log("git clone failed: ("+ gitExe.stderr.replace(/[\r\n]/g,"")+") ---time:"+new Date().toLocaleString());
    return;
}else{
    console.log("git clone success!"+" ---time:"+new Date().toLocaleString());
}




// 同步读取 模板内容
// 同步获取目录信息
// 删除目标路径下的所有文件
// 构建index.html
// 复制css到目标路径下
// 复制js到目标路径下
// 将markdown转化成html
