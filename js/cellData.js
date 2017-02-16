

var CellData = function(){
    CellData.__data = {};
    CellData.__keys = {};
    CellData.__change_key = "";
    CellData.checkValue = null;



    //上
    //````````````````````````````````````````````````````````````````````````````````````````````````````````````
    var getSubmitdata = function (){
        var data = {};
        $("#table1>.tableData").each(function(i, d){
            var _index = d.id.indexOf("ps");
            var unitId = d.id.substr(0, _index).replace("unit", ""), pId = d.id.substr(_index+2);
            if(!(unitId in data))data[unitId] = {};
            if(!(pId in data[unitId]))data[unitId][pId] = {};
            $(d).find(".e-value").each(function(i, e){
                if(e.value=="")return;
                if(!checkValueOk(e.value))return;
                if(CellData.checkValue!=null && !CellData.checkValue(this.value))return;
                if(isNaN(e.value))return;
                var eId = e.id.substr(e.id.lastIndexOf("p")+1);
                data[unitId][pId][eId] = parseFloat(e.value);
            });
        });
        return data;
    };

    //打包需要上传的数据
    //★★★★★注：
    //若已有值，被改动并置空但未输入新值，提交时不保存该项改动
    var checkLineUpload = function (srcs, u, p, lines){
        var objs = (p in CellData.__data) ? CellData.__data[p] : {};
        if(!(u in lines))lines[u] = {};
        for(var k in srcs){
            if(k in objs){
                if(srcs[k]!=objs[k]){   //值有改动
                    if(!(p in lines[u]))lines[u][p]=[];
                    lines[u][p].push([k, srcs[k], 1, 0]);  //更新
                }
            }else{          //新值
                if(!(p in lines[u]))lines[u][p]=[];
                lines[u][p].push([k, srcs[k], 0, 0]);      //插入
            }
        }
    };

    //检测本地待提交数据
    var checkSystemData = function (source){
        var lines = {};
        for(var u in source){
            for(var p in source[u]){
                checkLineUpload(source[u][p], u, p, lines);
            }
        }
        return lines;
    };

    /*  向服务器提交 */
    this.submitSystem = function (){
        var _temp = getSubmitdata(), data = checkSystemData(_temp), _index=0;
        for(var u in data){
            _index += Object.keys(data[u]).length;
        }
        if(_index==0)return;
        var selDate = $("#datetimepicker").val();
        if(selDate==undefined){
            alert("绩效时间错误！");
            return;
        }

        showLoading();
        ajaxData(CellData.__change_key, {'user':10001, 'dataTime':selDate, 'data':JSON.stringify(data)}, function(dt)
        {
            var eCount = 0;
            dt.data.forEach(function(d){
                var id="value"+ d.pid + "p" + d.eid;
                if(d.error==1){ //错误
                    HighLightCell(id);
                    eCount++;
                } else{
                    removeHighLightCell(id);
                    if($("#"+id).length!=1)return;
                    CellData.__data[d.pid][d.eid] = $("#"+id).val();
                }
            });

            if(eCount>0)alert("部分数据（高亮标识的单元格）输入有误，请检查后重新提交!");
        }, null, function(){
            hideLoading();
        });
    };

    //下
    //********************************************************

    //设置表行
    this.setTableData = function (data){
        $("#table1>.tableData").remove();
        $("#table1").append(ejs.render($("#tm_tbody1").html(), {'keys':values(CellData.__keys), 'data':data}));
        data.forEach(function(d){
            CellData.__data[d.personId] = {};
            d.children.forEach(function(e){
                var id="#value"+ d.personId + "p" + e.key;
                if($(id).length!=1)return;
                $(id).val(e.value);
                CellData.__data[d.personId][e.key] = e.value;
            });
        });

        setLimitInput();
    }

};
//---------------------------------Class End---------------------------------


//高亮效果
function HighLightCell(cId){
    var obj = $("#"+ cId);
    if(!obj.hasClass("cellHighlight"))obj.addClass("cellHighlight");
}

//去除高亮效果
function removeHighLightCell(cId){
    var obj = $("#"+ cId);
    if(obj.hasClass("cellHighlight"))obj.removeClass("cellHighlight");

}

//有效性检测
function checkValueOk(value){
    var v = parseFloat(value);
    if(v<0)return false;
    return true;
}

//文本框限制输入
function setLimitInput(callback){
    $(".e-value").on('afterpaste', function (e) {
        return;
    });
    $(".e-value").on("keyup", function (e) {
        if(e.keyCode==69 || e.keyCode==189) this.value = this.value.replace("e", "").replace("-", "");
    });
    $(".e-value").on("change", function (e) {
        cout(CellData.checkValue(this.value));
        if(checkValueOk(this.value) && (CellData.checkValue==null || CellData.checkValue(this.value))){
            if($(this).hasClass("e-error"))$(this).removeClass("e-error");
        }else{
            if(!$(this).hasClass("e-error"))$(this).addClass("e-error");
        }
    });
}