/**
 * Created by Administrator on 2016/12/20.
 */
var listJson = [];
var listT = '';
$(document).ready(function(){
    $('.form_date').remove();
    if(window.location.hash == '#list'){
        $(".jsecond").hide();
        $(".jthree").show();
        $(".progressBar").hide();
        $("#final_list").hide();
        $("#final_list1").show();
    }

        $(".J_edit").colorbox({inline:true,href:"#dialog-add",title:'任务因素与配比',innerWidth:510,initialHeight:700,
        onOpen:function(){
            /*添加因素配比 select*/
            $(".append-con  .list-li").not(":first").remove();
            $("#J_add_select").on('click',function(){
                $(".append-con").append('<div class="list-li">'+
                '<select class="span3 second_select" style="margin-right: 3px;width: 47%;">'+
                '<option value="任务">任务</option>'+
                '<option value="考勤">考勤</option>'+
                '<option value="工作时间">工作时间</option>'+
                '<option value="加班情况">加班情况</option>'+
                '<option value="员工关系">员工关系</option>'+
                '<option value="异常情况">异常情况</option>'+
                '<option value="学习能力">学习能力</option>'+
                '<option value="创新">创新</option>'+
                '</select>'+
                '<select class="span3 three_select" style="width: 47%;">'+
                '<option selected="selected" value="10%">10%</option>'+
                '<option value="20%">20%</option>'+
                '<option value="30%">30%</option>'+
                '<option value="40%">40%</option>'+
                '<option value="50%">50%</option>'+
                '<option value="60%">60%</option>'+
                '<option value="70%">70%</option>'+
                '<option value="80%">80%</option>'+
                '<option value="90%">90%</option>'+
                '<option value="100%">100%</option>'+
                '</select>'+
                '<i class="icon-delete J_delete_add" ></i>'+
                '</div>');
                $.colorbox.resize();
                /* 删除 因素配比 select*/
                $(".J_delete_add").on("click",function(){
                    $(this).parent('.list-li').remove();
                    $.colorbox.resize();
                });

            });


        }
    });
    /*保存*/
    $("#J_save_select").click(function(){
        window.location.href = 'index.html?key=performance-list';

    });
    $("#add").colorbox({inline:true,href:"#dialog-add",title:'任务因素与配比',innerWidth:510,initialHeight:700,
        onOpen:function(){
            $(".append-con  .list-li").not(":first").remove();
            /*添加因素配比 select*/
            $("#J_add_select").on('click',function(){
                $(".append-con").append('<div class="list-li">'+
                '<select class="span3 second_select" style="margin-right: 3px;width: 47%;">'+
                '<option value="任务">任务</option>'+
                '<option value="考勤">考勤</option>'+
                '<option value="工作时间">工作时间</option>'+
                '<option value="加班情况">加班情况</option>'+
                '<option value="员工关系">员工关系</option>'+
                '<option value="异常情况">异常情况</option>'+
                '<option value="学习能力">学习能力</option>'+
                '<option value="创新">创新</option>'+
                '</select>'+
                '<select class="span3 three_select" style="width: 47%">'+
                '<option selected="selected" value="10%">10%</option>'+
                '<option value="20%">20%</option>'+
                '<option value="30%">30%</option>'+
                '<option value="40%">40%</option>'+
                '<option value="50%">50%</option>'+
                '<option value="60%">60%</option>'+
                '<option value="70%">70%</option>'+
                '<option value="80%">80%</option>'+
                '<option value="90%">90%</option>'+
                '<option value="100%">100%</option>'+
                '</select>'+
                '<i class="icon-delete J_delete_add" ></i>'+
                '</div>');
                $.colorbox.resize();
                /* 删除 因素配比 select*/
                $(".J_delete_add").on("click",function(){
                    $(this).parent('.list-li').remove();
                    $.colorbox.resize();
                });

            });

        /*保存*/
            $("#J_save_select").click(function(){
                $.colorbox.close();
                $(".jsecond").show();
                $(".jfirst").hide();
                $(".circle").addClass("step_on");
                $(".line").addClass("line_on");
                var firstSe = $('.first_select option:selected').val();
                for(var i =0; i<$(".list-li").length;i++){
                    var secondSe = $($(".list-li")[i]).find(".second_select option:selected").val();
                    var threeSe  = $($(".list-li")[i]).find(".three_select option:selected").val();
                    listJson.push({"se":secondSe,"th":threeSe});
                }
                var ArrList = ["张三","李四","王小二"];

                list(listJson,firstSe,ArrList);
                listT = firstSe;
            });
        }
    });
    /*保存个人绩效*/
    $("#J_save_person").click(function(){
        $(".jsecond").hide();
        $(".jfirst").hide();
        $(".jthree").show();;
        $(".progressBar").hide()

        var lastArr = [];
        var lastArr1 = '';
        for(var i= 0 ;i<$("#name_tbody tr").length; i++){
            var name = $($("#name_tbody tr")[i]).find(".name_td").text();
            var input = $($("#name_tbody tr")[i]).find("input");
            lastArr1 = '';
            for(var j= 0 ;j<input.length ;j++){
                var  h= $($(input)[j]).val();
                if(h == ""){
                    h = 0
                }
                lastArr1 += h+",";
            }
            lastArr1=lastArr1.substring(0,lastArr1.length-1);
            lastArr.push({"se":name,"th":lastArr1});

        }
        lastList(lastArr);

    });

})
function lastList(lastArr){
    var f = "";
    var d = "";
    $.each(lastArr,function(index,val){
        f+='<tr class="accordion-heading accordion-toggle" for="#collapseOne0" data-parent="#accordion1" data-toggle="collapse"> <td class="name " >'+val.se+'</td><td class="name last_name_td">人力资源部门</td>'
        var arr = val.th.split(",");
        var sum = 0, tp = [0.6, 0.3, 0.1];
        $.each(arr, function(i){
            f+='<td class="name nameval" >'+arr[i]+'</td>';
            sum += parseInt(arr[i]++) * tp[i];
        })
        f+= '<td class="name fb nameval">'+sum+'</td></tr>';
    });
    $("#final_list").append(f);

}
function list(listJson,firstSe,name){
    var arr = ''
    var arr1 = ''
    var arr2 = ''
    $.each(name,function(index,val){
        arr2 += ' <tr class="accordion-heading accordion-toggle" for="#collapseOne0" data-parent="#accordion1" data-toggle="collapse"> <td class="name name_td">'+val+'</td> </tr>'
    });
    $.each(listJson,function(index,val){
        arr += '<th class="sorting" role="columnheader" tabindex="0" aria-controls="dt_gal" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending">'+val.se+"("+val.th+")"+'</th>'
        arr1 += ' <td class="name "><input type="text"/></td>'
    });
    $("#name_tbody").append(arr2);
    $("#name_row").after(arr);
    $(".name_td").after(arr1);
    $(".bumengname").text(firstSe)

}
