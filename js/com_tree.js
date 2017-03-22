var __icons = ['✎', '✕', '✛'];

/**
 * Created by Administrator on 2017/1/24.
 */

var ViewTree = function (){

    ViewTree.__common = [];
    ViewTree.__common_index = {};
    ViewTree.__treeview_data = {};       //save all data here.
    ViewTree.__common_style = -1;
    ViewTree.__common_system = [];
    ViewTree.__common_system_cache = {};
    ViewTree.__common_cache = {};        //其它普遍因素
    ViewTree._after_change = loadLocalTreeData;

    var IsExistNodeByName = function (data, name){
        if(data==undefined || !("nodes" in data))return false;
        for(var i=0; i<data.nodes.length; i++){
            if(data.nodes[i].name==name)return true;
        }
        return false;
    };
    /*
     list to tree
     input:    'children':[{'id':101, 'pid':1, 'name':'电影'}, {'id':102, 'pid':1, 'name':'购物'}, {'id':1011, 'pid':101, 'name':'日韩'}]
     output:    {"nodes":[{"id":101,"pid":1,"name":"电影","nodes":[{"id":1011,"pid":101,"name":"日韩"}]},{"id":102,"pid":1,"name":"购物"}]}
     */
    ViewTree.formatTree = function (children){
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
    };
    //建树过程 - 递归
    var createTree = function (parent, lsc, src){
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
    };

    //-------------------------------------------------------------------------------------------------------------
    //遍历树通用函数
    var traversal = function (node, callback){
        callback(node);
        if(!('nodes' in node))return;
        node['nodes'].forEach(function(d){
            traversal(d, callback);
        });
    };

    /** 计算叶子结点权值 **/
    ViewTree.getLeafWeight = function (node){
        if(node.id=="root")node['value'] = 100;
        node.value = 1.0 * node.value / 100;
        if(!('nodes' in node))return;
        for(var i=0; i<node['nodes'].length; i++){
            node['nodes'][i].value *= node.value;
            ViewTree.getLeafWeight(node['nodes'][i]);
        }
    };

    //获取子树-根据id
    /** 暂未使用 **/
    this.getSubTreeById = function (tree, id){
        var data;
        traversal(tree, function(n){
            if('id' in n){
                if(n['id']==id) data = n;
            }
        });
        return data;
    };

    //获取树各节点子孙叶子节点数目信息
    this.getTreeTableData = function(tree){
        traversal(tree, function(n){
            var c = getNodeLeafCount(n);
            n['leafCount'] = c;
        });
        var maxH = 0;
        traversal(tree, function(n){
            if(maxH<n['height'])maxH = n['height'];
        });
        //按层级遍历树
        var layers = [], temp = [tree];
        for(var i=0; i<maxH+1; i++) layers.push([]);
        while(temp.length>0){
            var n = temp.pop();
            layers[n['height']].push(n);
            if(!('nodes' in n)) continue;
            n['nodes'].forEach(function(d){
                temp.push(d);
            });
        }
        var leafs = [];
        layers.forEach(function(ly, i){
            ly.forEach(function(e, j){
                if(e.isLeaf==1)leafs.push(e.id);
            });
        });
        //traversal(tree, function(n){ if(n['isLeaf']==1) leafs.push(n); });

        tree['id'] = "root";
        return [layers, leafs];
    };

    //-------------------------------------------------------------------------------------------------------------
    //一般函数区
    //获取节点叶子节点个数
    var getNodeLeafCount = function (node){
        var count = [0];
        traversal(node, function(n){
            if(!('nodes' in n)) {
                n['isLeaf'] = 1;
                count[0]++;
            }
        });
        return count[0];
    };
    //获取树深度：含各节点的深度记录
    var _getTreeHeight = function (node, height){
        node['height'] = height[1];
        if(!('nodes' in node))return;
        height[1]++;
        if(height[1]>height[0]) height[0] = height[1];
        node['nodes'].forEach(function(d){
            _getTreeHeight(d, height);
        });
        height[1]--;
    };
    //获取树的深度-算法2
    var getTreeHeightEx = function(node){
        if(!('nodes' in node))return 1;
        var maxH = 0;
        node['nodes'].forEach(function(d){
            var h = getTreeHeightEx(d);
            if(h>maxH)maxH = h;
        });
        return maxH + 1;
    };

    ViewTree.getTreeHeight = function(tree){
        var height = [0, 0];
        _getTreeHeight(tree, height);
        //(getTreeHeightEx(tree));
        return height[0] + 1;
    };
    //*********暂时已弃用*********
    var _getNodeList = function (node, list){
        if('id' in node)list.push([node['id'], ('name' in node) ? node['name'] : "", node['value']]);
        if(!('nodes' in node))return;
        node['nodes'].forEach(function(d){
            _getNodeList(d, list);
        });
    };
    ViewTree.getNodeList = function (tree){
        var list = [];
        traversal(tree, function(node){
            if('id' in node)list.push([node['id'], ('name' in node) ? node['name'] : "", node['value']]);
        });
        //_getNodeList(tree, list);
        return list;
    };
    ViewTree.getNodeListEx = function (tree){
        var list = [];
        traversal(tree, function(node){
            if('id' in node){
                var line = {};
                for(var k in node) line[k] = node[k];
                list.push(line);
            }
        });
        return list;
    };
    //获取子孙节点
    //*注：此算法未经深入验证
    var _getChildrenListById = function (node, id, list, flag, callback){
        if(flag==true)callback(node);
        if(!('nodes' in node))return;
        node['nodes'].forEach(function(d){
            if(d['id']==id)
                _getChildrenListById(d, id, list, true, callback);
            else
                _getChildrenListById(d, id, list, flag, callback);
        });
    };
    ViewTree.getChildrenListById = function (tree, id){
        var list = [];
        _getChildrenListById(tree, id, list, false, function(node){ list.push(node['id']); });
        return list;
    };
    ViewTree.getChildrenListByIdEx = function (tree, id){
        var list = [];
        _getChildrenListById(tree, id, list, false, function(node){ list.push(node); });
        return list;
    };

    //删除节点·含子树
    //*此算法有瑕疵，暂无时间修改
    //*删除元素后，迭代器索引可能越界
    var removeNodeById = function (node, id){
        if(!('nodes' in node))return;
        for(var i=0; i<node['nodes'].length; i++){
            if(node['nodes'][i]['id']==id){
                node['nodes'].splice(i, 1);
                if(node['nodes'].length==0)delete node['nodes'];
                return;
            }
            removeNodeById(node['nodes'][i], id);
        }
    };
    /*
     ********************************************************************************************
     * 树折叠相关
     */
    //树折叠事件
    function nodeCollapsed(event, data){
        var list = ViewTree.getNodeList(data);
        for(var i=1; i<list.length; i++){
            var obj = $("#ys"+list[i][0]);
            if(!obj.hasClass("hide"))obj.addClass("hide");
        }
    }
    //树展开事件
    function nodeExpanded(event, data){
        var list = getNodeExpanded(data);
        for(var i=0; i<list.length; i++){
            var obj = $("#ys"+list[i]);
            if(obj.hasClass("hide"))obj.removeClass("hide");
        }
    }
    //获取树展开节点
    function getNodeExpanded(tree){
        var list = [];
        tree['nodes'].forEach(function(d){
            list.push(d['id']);
        });
        return list;
    }

    //*********************************************************************************************
    function getTreeOption(){
        return {
            collapseIcon:"glyphicon glyphicon-triangle-bottom",
            expandIcon:"glyphicon glyphicon-triangle-right",
            color:'#643',
            backColor: 'white',
            showTags:true,
            highlightSelected:false,
            enableLinks: true,
            //nodeIcon:'glyphicon glyphicon-map-marker',
            onNodeCollapsed: nodeCollapsed,
            onNodeExpanded: nodeExpanded,
        };
    }

    /*
     ********************************************************************************************
     * 操作相关处理函数聚集
     ********************************************************************************************
     */

    function _removeTreeView(treeId){
        var p = $("#" + treeId).parent();
        if($("#" + treeId).hasClass("treeview")){
            $('#'+treeId).data('treeview').remove();
            $("#" + treeId).treeview("remove");
            $("#" + treeId).removeClass("treeview");
            $("#" + treeId).empty();
        }
        $("#" + treeId).remove();
        p.prepend('<div id="'+ treeId +'"></div>');
    }
    ViewTree.reloadTree = function (treeId, data, style){
        _removeTreeView(treeId);
        if(!('nodes' in data))return;
        traversal(data, function(node){
            if(('tags' in node) && ('id' in node)){
                //系统因素，不能添加子节点
                if(node.nature==1) node.tags = ['✎', '✕'];
                //通用因素， 不能被删除和修改
                if(node.id in ViewTree.__common_cache) node.tags = (node.nature==1) ? [] : ['✛'];

            }
        });

        var option = getTreeOption();
        option['data'] = data.nodes;         // data is not optional
        option['levels'] = ViewTree.getTreeHeight(data);
        $("#" + treeId).treeview(option);
        if(style==undefined)loadTableStyle();
    };
    ViewTree.loadViewStyle = function(){
        loadTableStyle();
    };

    function clickNodeForOperate(e){
        var treeId = $(this).parents("div.treeview").attr('id');
        var nodeId = $(this).parent().find("a").attr("href").replace("#node-", "");
        var lb = $(this).html();        //['✎', '✕', '✛'];
        var data = ViewTree.__treeview_data[treeId];

        if(lb=='✛') addChildClass(treeId, nodeId, data);
        else if(lb=='✕') removeNode(treeId, nodeId, data);
        else if(lb=='✎') editNode(treeId, nodeId, data);

    }

    //表现层：事件，效果等
    var loadTableStyle = function (){
        //__icons = ['✎', '✕', '✛']
        var titles = ["修改该分类名称或其对应值", "删除该分类及其所有子分类", "在该分类下添加子分类"];
        var colors = ["#31b0d5", "red", "#5cb85c"];
        __icons.forEach(function(d, i){
            var $obj = $("#table1").find("span.badge").filter(function(){ return $(this).text() === d});
            $obj.attr("title", titles[i]);
            $obj.css("color", colors[i]);
        });

        $("tr>td>div.newParent>span.badge").attr("title", "增加新的分类");
        $("tr>td>div.newParent>span.badge").unbind('click').on('click', function(e){
            var treeId = $(this).parent().attr('id').replace("new", "tree");
            addNewParentClass(treeId);

        });
        $("#table1>tr>td>div").off('click', 'ul>li>span.badge', clickNodeForOperate);
        $("#table1>tr>td>div").on('click', 'ul>li>span.badge', clickNodeForOperate);
    };

    //加载弹出框（添加因素）
    var loadNewFrame = function (treeId, nodeId, isRoot){
        var tree = ViewTree.__treeview_data[treeId], weight = 0, names = {};
        if(tree!=undefined && ('nodes' in tree)){   //有树存在
            var _temp = tree.nodes.map(function(d){ return d; });
            _temp.unshift( {value:0} );
            var children = isRoot ? _temp: ViewTree.getChildrenListByIdEx(tree, nodeId);
            weight = children.reduce(function(a, b, i){ a += (i==0) ? 0 : b.value ; return a; }, 0);
            names = ViewTree.getNodeListEx(tree).reduce(function(a, b){  a[b.name]=1; return a; }, {});
        }

        if(weight>=100){
            alert("该分支下所配权重已达到100%， 请调整后再添加！");
            return;
        };
        /* 弹出设置框 */
        $.colorbox({
            title:'绩效设置相关', opacity:0.8, overlayClose:false,escKey:false, inline:false, speed:0,
            html:ejs.render($("#tm_edit1").html(), { 'treeId':treeId, 'nodeId':nodeId }),
            onComplete:function(){
                $("#cboxWrapper").css("border", "5px solid #bbb");
                $("#cboxWrapper").css("background-color", "#bbb");
                $("#cboxClose").css("margin", "-5px 10px 10px 0px");
            }
        });
        $("#edit_value0").html("");
        $("#edit_value1").html("");

        for(var i=10-weight/10; i>0; i--){
            $("#edit_value0").append("<option value='"+ i*10 +"'>"+ i*10 +"%</option><option value='"+ (i*10-5) +"'>"+ (i*10-5) +"%</option>");
            $("#edit_value1").append("<option value='"+ i*10 +"'>"+ i*10 +"%</option><option value='"+ (i*10-5) +"'>"+ (i*10-5) +"%</option>");
        }
        ViewTree.__common_system.forEach(function(d){
            if(d.name in names) return;
            $("#edit_name1").append("<option value='"+ d.name +"'>"+ d.name +"</option>");
        });
        $("#btnAddSubmit").unbind('click').on('click', submitAddNewParentClass);

    };
    function getEditHtml(){

    }

    function editNode(treeId, nodeId, data){
        //cout(data);

    }

    var addChildClass = function (treeId, nodeId, data){
        //var newData = [];
        loadNewFrame(treeId, nodeId, false);

    };
    var addNewParentClass = function (treeId){
        var nodeId = treeId.substr(treeId.lastIndexOf("p")+1);
        loadNewFrame(treeId, nodeId, true);
    };

    //删除节点
    function removeNode(treeId, nodeId, data){
        var unitId = treeId.match(/tree(\S*)p/)[1];

        //后台删除数据
        removeNodeServer(nodeId, ViewTree.__common_style, unitId, function(){
            var list = ViewTree.getChildrenListById(data, nodeId);
            list.forEach(function(d){
                $("#ys"+d).remove();
            });
            removeNodeById(data, nodeId);       //*删除数据
            ViewTree.reloadTree(treeId, data);           //*重新加载
            ViewTree.__treeview_data[treeId] = data;     //*保存数据
        });
    }

    //**********************************************服务器交互**********************************************
    //获取
    //提交
    //******************************************************************************************************
    var submitAddNewParentClass = function (){
        //var style = $("#edit_custom");
        var style = $("input[name='ys_edit']:checked").val();
        var eName = $("#edit_name" + style).val().trim(),
            eValue = parseInt($("#edit_value" + style).val().replace("%", "")),
            treeId = $("#treeIdValue").val(),
            unitId = treeId.match(/tree(\S*)p/)[1],
            pid = $("#nodeIdValue").val(),
            level = parseInt(pid)==0 ? 1 : 99;
        var rootId = treeId.substr(treeId.lastIndexOf("p")+1);
        //cout("--------------------------------------");
        //cout(__treeview_data);
        //cout(__treeview_data[treeId]);

        if(eName==""){
            alert("名称不能为空");
            return;
        }

        if(IsExistNodeByName(ViewTree.__treeview_data[treeId], eName)){
            alert("该因素名称已存在，请重新输入");
            return;
        }
        if(style==0){


        }else{


        }
        var dt = {'userId':10001, 'unitId':unitId, 'style':1, 'nature':parseInt(style), 'parentId': pid,
            'name':eName, 'value':eValue, 'common':ViewTree.__common_style, 'level':level };

        //cout(dt);
        ajaxData('change_performance_setting', dt, function(data){
            if(data.error==false){
                //根据具体情况选择合适的加载函数
                ViewTree._after_change(unitId, rootId);
                //loadLocalTreeData(unitId, rootId);
            }
        });

    };

    //删除元素
    function removeNodeServer(nodeId, common, unitId, callback){
        showLoading();
        var param = {user:10001, 'nodeId':nodeId, 'common':common, 'unitId':unitId };
        ajaxData('del_performance_setting', param, function(data)
        {
            if(data.error==false){
                callback(data.data);
            }
            hideLoading();
        }, function(){
            //hideLoading();
        });
    }

    //局部刷新
    function loadLocalTreeData(unitId, parentId){
        showLoading();
        ajaxData('get_performance_setting_unit', {'unitId':unitId}, function(data){
            if(data.error==false){

                var treeId = "tree"+ unitId + 'p' + parentId;
                var settings = [];
                data.data.children.forEach(function(d){ if(d.level!=1)settings.push(d); });
                data.data.children = settings;
                var line = ViewTree.getFormatUnitData(data.data);
                ViewTree.__treeview_data[treeId] = line.tree[parentId];
                ViewTree.reloadTree(treeId, line.tree[parentId]);

                //刷新右侧单元格列表
                reloadLocalValue(treeId, line.tree[parentId]);
                //****************************************************************************
                //添加功能已搞定 - 2017-2-5


            }
            hideLoading();
        }, function(){
            hideLoading();
        });
    }
    //局部因素刷新：tree + 因素值
    function reloadLocalValue(treeId, data){
        var Id = treeId.replace("tree", "");
        var list = ViewTree.getNodeList(data);

        var html = "<div>";
        for(var i=0; i<list.length; i++)
            html += '<div id="ys' + list[i][0] + '"' + ' class="td_value">' + list[i][2] + '%</div>';
        html += "</div>";
        $("#value" + Id).html(html);

    }
    //-------------------------------------------------------------------------------------------------------
    //获取单个部门的数据格式化信息
    //通用过程
    ViewTree.getFormatUnitData = function (d){
        var line = {};
        line['unit'] = d.unit;
        line['uid'] = d.uid;
        var _tree = ViewTree.formatTree(d.children);
        var trees = {}, treeList = {}, maxL = 0;
        //各分树信息
        _tree.nodes.forEach(function(cd){
            if(!(cd.pid in trees))trees[cd.pid] = {'nodes':[]};
            trees[cd.pid]['nodes'].push(cd);
        });
        //各分树->列表
        ViewTree.__common.forEach(function(cd){
            if(cd.id in trees){
                treeList[cd.id] = ViewTree.getNodeList(trees[cd.id]);
                if(treeList[cd.id].length>maxL) maxL = treeList[cd.id].length;
            }
        });
        line['tree'] = trees;
        line['treeList'] = treeList;
        line['maxL'] = maxL;
        return line;
    };





};//    End Class

















