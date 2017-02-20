


function getLastMonth(){
    var _date = new Date(), y = _date.getFullYear(), m = _date.getMonth() + 1;
    if(m==1){ y = y - 1; m = 13; }
    m--;
    return y + "-" + (m>9 ? m : ("0"+m));
}

//增加绩效时间选择相关
function addYearMonthList(id, callback){
    var input = '<input type="text" class="form-control" style="width: 80px; height: 25px" value="'+ getLastMonth() +'" id="datetimepicker">';
    var div = '<div id="yearMonthSel" style="float:right; margin-right:20px;">' + input + '</div>';
    $('.form_date').remove();
    $("#" + id).append(div);

    $('#datetimepicker').datetimepicker({
        language:  'zh-CN', format: 'yyyy-mm',weekStart: 0, todayBtn:  1, autoclose: 1, todayHighlight: 1, startView: 3, minView: 3, forceParse: 0,
    }).on('changeDate', function(e){
        var selDate = $("#datetimepicker").val();
        var unitId = $("#"+id+"sel1").val();
        //alert(selDate);
        callback(unitId, selDate, "10001");
        //loadUnitPerformance(unitId, selDate, "10001");

    });
}