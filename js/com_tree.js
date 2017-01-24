var __icons = ['✎', '✕', '✛'];

/**
 * Created by Administrator on 2017/1/24.
 */
/*
 list to tree
 input:    'children':[{'id':101, 'pid':1, 'name':'电影'}, {'id':102, 'pid':1, 'name':'购物'}, {'id':1011, 'pid':101, 'name':'日韩'}]
 output:    {"nodes":[{"id":101,"pid":1,"name":"电影","nodes":[{"id":1011,"pid":101,"name":"日韩"}]},{"id":102,"pid":1,"name":"购物"}]}
 */
function formatTree(children){
    var lsC = {},       //节点-孩子节点列表 索引
        lsR = {},   //节点-检测是否根节点 索引
        src = {};   //节点-源数据 索引
    children.forEach(function(d){
        src[d.id] = d;
        lsR[d.id] = 1;
    });
    children.forEach(function(d){
        if(d.pid in src){
            lsR[d.id] = 0;
            if(!(d.pid in lsC))lsC[d.pid] = [];
            lsC[d.pid].push(d.id);
        }
    });

    var tree = {'nodes':[]};
    for(var c in lsR){
        if(lsR[c]==0)continue;
        var node = src[c];
        node['text'] = node['name'];
        node['tags'] = __icons;
        node['href'] = "#node-" + node['id'];   //日后方便找到
        tree['nodes'].push(node);
        createTree(node, lsC, src);
    }
    return tree;
}
//建树过程 - 递归
function createTree(parent, lsc, src){
    if(!(parent.id in lsc))return;
    lsc[parent.id].forEach(function(d){
        if(!('nodes' in parent))parent['nodes'] = [];
        var _node = src[d];
        _node['text'] = _node['name'];
        _node['tags'] = __icons;
        _node['href'] = "#node-" + _node['id'];   //日后方便找到
        parent['nodes'].push(_node);
        createTree(_node, lsc, src);
    });
}
//获取树深度
function _getTreeHeight(node, height){
    if(!('nodes' in node))return;
    height[0]++;
    node['nodes'].forEach(function(d){
        _getTreeHeight(d, height);
    });
}
function getTreeHeight(tree){
    var height = [0];
    _getTreeHeight(tree, height);
    return height[0];
}
function _getNodeList(node, list){
    if('id' in node)list.push([node['id'], node['name'], node['value']]);
    if(!('nodes' in node))return;
    node['nodes'].forEach(function(d){
        _getNodeList(d, list);
    });
}
function getNodeList(tree){
    var list = [];
    _getNodeList(tree, list);
    return list;
}
//获取子孙节点
//*注：此算法未经深入验证
function _getChildrenListById(node, id, list, flag){
    if(flag==true)list.push(node['id']);
    if(!('nodes' in node))return;
    node['nodes'].forEach(function(d){
        if(d['id']==id)
            _getChildrenListById(d, id, list, true);
        else
            _getChildrenListById(d, id, list, flag);
    });
}
function getChildrenListById(tree, id){
    var list = [];
    _getChildrenListById(tree, id, list, false);
    return list;
}
//删除节点·含子树
function removeNodeById(node, id){
    if(!('nodes' in node))return;
    for(var i=0; i<node['nodes'].length; i++){
        if(node['nodes'][i]['id']==id){
            node['nodes'].splice(i, 1);
            if(node['nodes'].length==0)delete node['nodes'];
            return;
        }
        removeNodeById(node['nodes'][i], id);
    }
}
/*
 function removeNodeById(tree, id){
 for(var i=0; i<tree['nodes'].length; i++){
 if(tree['nodes'][i]['id']==id){
 tree['nodes'].splice(i, 1);
 if(tree['nodes'].length==0)delete tree['nodes'];
 return;
 }
 _removeNodeById(tree['nodes'][i], id);
 }
 }
 function _removeNodeById(node, id){
 if(!('nodes' in node))return;
 for(var i=0; i<node['nodes'].length; i++){
 if(node['nodes'][i]['id']==id){
 node['nodes'].splice(i, 1);
 if(node['nodes'].length==0)delete node['nodes'];
 return;
 }
 _removeNodeById(node['nodes'][i], id);
 }
 }

 */
