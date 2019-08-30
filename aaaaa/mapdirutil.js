const path = require("path");
const fs = require("fs");

function _mapDir(srcDir, relativePath, fileCallback, dirCallback) {
  //读取目录
  fs.readdir(path.join(srcDir, relativePath), function(err, files) {
    if (files == undefined) {
      return;
    }
    files.forEach((filename, index) => {
      // let targetPath = path.join(targetDir, filename);
      var buffPath = path.join(relativePath, filename); //拼接文件相对路径
      fs.stat(path.join(srcDir, buffPath), (err, stats) => {
        if (stats.isDirectory()) {
          var flag = dirCallback(srcDir, buffPath, filename);
          if (flag == undefined || flag == true) {
            _mapDir(srcDir, buffPath, fileCallback, dirCallback);
          }
        } else if (stats.isFile()) {
          fileCallback(srcDir, buffPath, filename);
        }
      });
    });
  });
};

function _mapDirSync(srcDir, relativePath, fileCallback, dirCallback) {
  //读取目录
  var files = fs.readdirSync(path.join(srcDir, relativePath));
  if (files == undefined) {
    return;
  }

  files.forEach((filename, index) => {
    var buffPath = path.join(relativePath, filename); //拼接文件相对路径
    var stats = fs.statSync(path.join(srcDir, buffPath));
    if (stats.isDirectory()) {
      var flag = dirCallback(srcDir, buffPath, filename);
      if (flag == undefined || flag == true) {
        mapDir(srcDir, buffPath, fileCallback, dirCallback);
      }
    } else if (stats.isFile()) {
      fileCallback(srcDir, buffPath, filename);
    }
  });
};

//遍历目录,到每个目录或文件的时候回调
exports.mapDir = function(srcDir, relativePath, fileCallback, dirCallback) {
  _mapDir(srcDir, relativePath, fileCallback, dirCallback);
};

//遍历目录,到每个目录或文件的时候回调
exports.mapDirSync = function (srcDir, relativePath, fileCallback, dirCallback) {
  _mapDirSync(srcDir, relativePath, fileCallback, dirCallback);
};

//测试用例
// _mapDirSync(
//   "C:\\Users\\yingjie.lu\\Desktop\\html",//src路径
//   "./",//当前目录
//   function(srcDir, relativePath, filename) {//文件回调
//     console.log(srcDir, relativePath, filename);
//   },
//   function(srcDir, relativePath, filename) {//目录回调(返回false则该目录不继续遍历)
//     console.log(srcDir, relativePath, filename);
//   }
// );
