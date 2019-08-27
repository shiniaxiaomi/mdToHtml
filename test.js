//列表数据
var list = [
    // { level: 3, data: "0.1.1." },
    { level: 1, data: "1." },
    { level: 2, data: "1.1" },
    { level: 2, data: "1.2" },
    { level: 3, data: "1.2.1" },
    { level: 1, data: "2." },
    { level: 2, data: "2.1" },
    { level: 2, data: "2.2" },
    { level: 3, data: "2.2.1" },
    { level: 1, data: "3." },
    { level: 2, data: "3.1" },
]

//节点的定义
var sidebar = {
    level: 0,
    data: "目录",
    proot: undefined,
    children: []
}

//从sidebar中找到对应的子树并添加自身
function addNode(sidebar) {
    list.map(item => {
        findAndAdd(sidebar, item);
    })
}

//查找树中node节点对应的子树并添加
function findAndAdd(srcNode, node) {
    if (srcNode.children.length == 0) {
        //到了根节点,则node添加到节点下
        srcNode.children.push({
            level: node.level,
            data: node.data,
            proot: srcNode,
            children: []
        });
        return;
    }

    var flag = false;
    //遍历树的子节点
    srcNode.children.map((item, index) => {
        //如果node属于该节点下,则再继续遍历
        if (node.data.length >= item.data.length && node.data.substr(0, item.data.length) == item.data) {
            flag = true;
            findAndAdd(item, node);
        }
        //如果全部遍历完之后还未找到,则说明node属于该树的父节点(即和该树是兄弟节点)
        if (srcNode.children.length - 1 == index && flag == false) {
            item.proot.children.push({
                level: node.level,
                data: node.data,
                proot: item.proot,
                children: []
            });
        }
    })
}

var html="";
function buildTree(sidebar){
    if(sidebar.children.length==0){
        html+="<li>"+sidebar.data+"</li>"
        return;
    }
    
    html+="<li>"+sidebar.data+"</li>"
    html+="<ul>";
    sidebar.children.map(item=>{
        buildTree(item);
    })
    html+="</ul>";
}

addNode(sidebar);
// console.log(sidebar)
buildTree(sidebar);
console.log(html)

