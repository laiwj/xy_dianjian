


function getLastMonth(){
    var _date = new Date(), y = _date.getFullYear(), m = _date.getMonth() + 1;
    if(m==1){ y = y - 1; m = 13; }
    m--;
    return y + "-" + (m>9 ? m : ("0"+m));
}

//增加绩效时间选择相关
function addYearMonthList(id, callback, unitDivId){
    var input = '<input type="text" class="form-control" style="width: 80px; height: 25px" value="'+ getLastMonth() +'" id="datetimepicker">';
    var div = '<div id="yearMonthSel" style="float:right; margin-right:20px;">' + input + '</div>';
    $('.form_date').remove();
    $("#" + id).append(div);

    $('#datetimepicker').datetimepicker({
        language:  'zh-CN', format: 'yyyy-mm',weekStart: 0, todayBtn:  1, autoclose: 1, todayHighlight: 1, startView: 3, minView: 3, forceParse: 0,
    }).on('changeDate', function(e){
        var selDate = $("#datetimepicker").val();
        var unitId = $("#"+(unitDivId || id)+"sel1").val();
        cout("#"+(unitDivId || id)+"sel1");
        //alert(selDate);
        callback(unitId, selDate, "10001");
        //loadUnitPerformance(unitId, selDate, "10001");

    });
}

function getMonthFirstDay(date){ var sp = date.split("-"); return parseInt(sp[0])+'-'+parseInt(sp[1])+'-1';  }
function getDateByMonth(date){ var sp = date.split("-");
    return {'dateStart': sp[0] + '-' + sp[1] + '-1',
        'dateEnd': sp[0] + '-' + sp[1] + '-' + (new Date(parseInt(sp[0]), parseInt(sp[1]),0)).getDate()}
}