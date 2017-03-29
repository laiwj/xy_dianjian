// JavaScript Document
	var public_time_select = "#public_time_select";
	var init_flow_date_start = "2017-2-01";
	var init_flow_date_end = "2017-02-28";
	var init_trip_date_start = "2016-02-22";
	var init_trip_date_end = "2017-02-28";
	var init_network_date_start = "2017-02-28";
	var init_network_date_end = "2017-02-28";
	var init_people_date_start = "2016-04-13";
	var init_people_date_end = "2016-11-20";
	var init_date_start = "2015-10-02";
	var init_date_end = "2015-12-13";
	var init_date_month = "2016-5-1";
	var init_unit_clock = "数字工程与信息技术中心";
	var init_unit_common = "-1";
	var init_unit_online = "数字工程与信息技术中心";
	var init_unit_social = "数字工程与信息技术中心";
	var init_style_social = "邮箱";	 //腾讯通
	var init_unit_interval = "所有部门";
	var init_unit_flow = "所有部门";
	var public_all_unit = "所有部门";
	var init_unit_performance = "10425";
	var Units = { 10421:"征地移民处", 10426:"水工处", 10406:"机电处" };

	//var serverIp = "http://10.101.1.177";
	//var serverIp = "http://118.123.173.86";
	var serverIp = "http://127.0.0.1";
	var serverPort = 8000;
	var serverUrl = serverIp + ":" + serverPort;



	function getQueryString(name) { 
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r != null) return unescape(r[2]); return null; 
	}
	function range(_min, _max){ var rt=[]; for(var i=_min;i<_max;i++)rt.push(i); return rt; }
	function set(){this.data={};this.keys=[];this.add=function(e){if(!this.data.hasOwnProperty(e))this.keys.push(e);this.data[e]=1;};}
	function sets(e){this.data=e?{e:1}:{};this.keys=e?[e]:[];this.add=function(e){if(!this.data.hasOwnProperty(e))this.keys.push(e);this.data[e]=1;};}
	function cout(d){ console.log(d); }
	function values(obj){ return Object.keys(obj).map(function(k){ return obj[k]; })}
	function items(obj){ return Object.keys(obj).map(function(k){ return [k, obj[k]]; })}

	function Init(option, id, eventName, callback, otherLibs){
		id=id || "main";
		var libs = ['echarts','echarts/chart/line','echarts/chart/bar','echarts/chart/pie'];
		if(otherLibs != null)otherLibs.forEach(function(d){ libs.push('echarts/chart/' + d) });
		require(libs,
            function (ec) {
                var myChart = ec.init(document.getElementById(id));				
				if(eventName != null)myChart.on(eventName, callback); 
				myChart.setOption(option);
				window.onresize = myChart.resize;
            }
        )	 		
	}
	function _$(id){ return document.getElementById(id); }
	
	function Init3(option, id){
		var myChart = echarts.init(document.getElementById(id));
		myChart.setOption(option);
		return myChart;
	}
	function GetMonthNow(){ return  new Date().format("yyyy-MM"); }
	function DateDTS(date) { return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds(); }
	function DateDTM(date) { return date.getHours() * 60 + date.getMinutes(); }
	function DateSTM(str){ var sp = str.split(" ")[1].split(":"); return parseInt(sp[0]) * 60 + parseInt(sp[1]); }
	function DateSTD(str){ var sp = str.split(/-| |:/); return new Date(parseInt(sp[0]), parseInt(sp[1]), parseInt(sp[2]),
		parseInt(sp[3]), parseInt(sp[4]), parseInt(sp[5])); }
	function DateDSTD(str){ var sp = str.split(/-| |:/); return new Date(parseInt(sp[0]), parseInt(sp[1])-1, parseInt(sp[2])); }
	function DateSTDS(str){ return str.split(" ")[0]; }
	function TimeT(str){ var sp = str.split(":"); return new Date(0, 0, 0, parseInt(sp[0]), parseInt(sp[1]), 0); }
	function TimeF(date){ return date.getHours() + ":" + date.getMinutes(); }
	function TimeSTM(str){ var sp = str.split(":"); return parseInt(sp[0]) * 60 + parseInt(sp[1]); }
	function TimeMTS(m){
		var h = parseInt(m/60), m = parseInt(m % 60), tm = h + ":" + (m>9 ? m : ("0" + m));
		return m<0 || h>24 ? "" : tm;
	}

	function ajaxData(key, data, _callbackS, _callbackE, _callbackC){
		var cbkf = (parseInt(Math.random() * 1000) + 1000).toString();
		data["session"] = getCookie('session');
		data['userId'] = getCookie('username')
		$.ajax({
			type:'GET', url:serverUrl + '/' + key + '/',
			data:data, dataType:'jsonp', jsonpCallback: 'call1back' + cbkf + 'a',
			crossDomain: true,
			success:function(data)
			{
				if(_callbackS)_callbackS(data);
				if(data.error!=undefined){
					if(data.error && data.errNum==1){
						hideLoading();
						alert("当前用户权限不够，请联系管理员！");
					}
				};
			},
			error:function(data)
			{
				if(_callbackE)_callbackE(data);
				alert("error");
			},
			complete:function(data)
			{
				if(_callbackC)_callbackC(data);
			}
		});
	}


	function showLoading(){
		var div = "<div id='inline_content' style='padding:0px; background:#fff; border:0px'>" +
			"<img src='../img/loading.gif' width='50'' height='50' />" + "</div>";
		$.colorbox({
			html: div, overlayClose: false, escKey: false, closeButton: false, inline: false, opacity: 0.8, speed: 0,
			onComplete: function () {
				$("#cboxWrapper").css("border", "0px solid #bbb");
				$("#cboxWrapper").css("background-color", "#fff");
			}
		});
	}
	function hideLoading(){
		$.colorbox.close();
	}
	function getNames(count){
		var all = [], names = {};
		var temp1 = ['赵','钱','孙','李','周','吴','郑','王','冯','陈','楚','卫','刘','何'];
		var temp2 = ["曼","婷","玥","婷","优","璇","雨","嘉","娅","楠","明","美","惠","茜","漫","妮","媛","馨","梦","涵","碧",
						"萱","慧","妍","璟","雯","梦","婷","雪","怡","彦","歆","芮","涵","笑","薇","婧","涵","鑫","蕾","淑","颖",
						"钰","彤","天","瑜","梦","洁","凌","薇","雅","静","雅","芙","思","颖","欣","然","滢","心","雪","馨","凌",
						"菲","钰","琪","婧","宸","靖","瑶","熙","雯","琪","涵","伶","韵","思","睿"];
		for(var i=0; i<count; i++){
			var nm = "";
			while(nm == "" || names[nm] == 1){
				nm = temp1[parseInt(Math.random() * temp1.length)] + temp2[parseInt(Math.random() * temp2.length)];
				if(Math.random()>0.5)nm += temp2[parseInt(Math.random() * temp2.length)];
			}
			names[nm] = 1; all.push(nm);
		}
		return all;
	}


//---------------------------------一般通用函数--------------------------------------------------
function addUnitSel(id, _unit, clickFunc){
	var div = '<div style="float:right; margin-right:15px;">', sel1 = '<select style="height:25px" id="'+ id + 'sel1">', opt='';
	_unit.forEach(function(d){ opt += '<option value ="'+ d[0] +'">'+ d[0] +'</option>'; });
	$("#" + id).append(div + sel1 + opt + '</select>' + '</div>');
	$("#" + id + 'sel1').val(init_unit_clock);
	$("#" + id + 'sel1').change(function(){ if(clickFunc!=undefined)clickFunc($(this).val()); });
}
function addUnitSelEx(id, _unit, clickFunc){
	var div = '<div style="float:right; margin-right:15px;">', sel1 = '<select style="height:25px" id="'+ id + 'sel1">', opt='';
	_unit.forEach(function(d){
		Units[d[1]] = d[0];
		opt += '<option value ="'+ d[1] +'">'+ d[0] +'</option>';
	});
	$("#" + id).append(div + sel1 + opt + '</select>' + '</div>');
	$("#" + id + 'sel1').val(init_unit_performance);
	$("#" + id + 'sel1').change(function(){
		var u = $(this).find("option:selected").text();
		if(clickFunc!=undefined)clickFunc([u, $(this).val()]);
	});
}

function _tableClick(tbId, _callback){

	//$("#" + tbId +" tbody tr").click(function(e){
	$("#" + tbId).on("click", "tbody>tr", function(e){
		$("#" + tbId +" tbody tr").css("background-color", '');
		$("#" + tbId +" tbody tr").css("color", '');
		$(this).css("background-color", "#FFF8D7");
		$(this).css("color", "green");
		var v1 = $(this).find("td").first().html(), v2 = $(this).find("td:eq(1)").html()
			, v3 = $(this).find("td:eq(2)").html();
		if(_callback)_callback($(this),[v1, v2, v3]);
	});
}
function tableClick(ft, tbId, _callback){
	_tableClick(tbId, _callback);
	ft.on('after.ft.paging', function(e){
		_tableClick(tbId, _callback);
	});
}

function ajaxToInput(key, data, viewId){
	var url = serverUrl + '/' + key + '/';
	var div = $("<div style='display: none'></div>");
	var form = $('<form action="' + url + '" method="post"></form>');
	data['userId'] = getCookie('username');
	for(var k in data){
		var ipt = $("<input type='text' name='"+ k +"' value="+ "'' />");
		form.append(ipt);
		ipt.val(data[k].toString().replace(/"/g, "'"));
	}

	div.append(form);
	$("#"+viewId).append(div);
	form.submit();
}

function getBadgeClass(v){
	var c = v==10 ? 'c-danger': 'c-info';
	if(v>7 && v<10) c = 'c-warning';
	if(v<4) c = 'c-success';
	return c;
}
function checkLogin(){
	var session = getCookie('session'), userName = getCookie('username'),
		nickName = getCookie('nickname'), level = getCookie('level');
	if(level!=null)level = parseInt(level);
	if(!session || !userName || !nickName || !level){
		window.location.href="login.html";
	}else{
		$('#u_username').html(userName);
		$('#u_nickname').html(nickName);
		$('#u_level').html('lv '+ level);
		$('#u_lvname').html(level>1 ? '普通用户' : (level==0?'超级管理员':'管理员'));
	}
}
function quit(){
	delCookie('session');
	delCookie('username');
	window.location.href="login.html";
}
function setCookie(name,value, hour)
{
	hour = hour || 2;
	var exp = new Date();
	exp.setTime(exp.getTime() + hour * 60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getCookie(name)
{
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}
function GetCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

function delCookie(name)
{
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null)
		document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

//限制文本框数字
function LimitInput(obj){
	if(obj.value.length==1){obj.value=obj.value.replace(/[^0-9]/g,'')}else{
		obj.value=obj.value.replace(/\D/g,'');
		if(obj.value!="")$(obj).val(parseInt(obj.value));
	}
}
Date.prototype.format = function(fmt) {
	var o = {
		"M+" : this.getMonth()+1,                 //月份
		"d+" : this.getDate(),                    //日
		"h+" : this.getHours(),                   //小时
		"m+" : this.getMinutes(),                 //分
		"s+" : this.getSeconds(),                 //秒
		"q+" : Math.floor((this.getMonth()+3)/3), //季度
		"S"  : this.getMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt)) { fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); }
	for(var k in o) {
		if(new RegExp("("+ k +")").test(fmt)){ fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); }
	}
	return fmt;
};

function getObjValue(obj, key){
	return (key in obj) ? obj[key] : null;
}

function ShowLoading(id){
	return echarts.init(document.getElementById(id)).showLoading();
}
function HideLoading(id) {
	var obj = document.getElementById(id);
	echarts.init(obj).clear();
	obj.innerHTML = "<h3 style='margin: 30px'>暂无数据</h3>";
}



/* 获取数组中第二大的元素 */
function getSecondMax(ary){
	var a = ary[0]<ary[ary.length-1] ? ary[0] : [ary.length-1], b=a;
	for(var i=0; i<ary.length; i++){
		if(a<ary[i]){
			b = a;
			a = ary[i];
		}
	}
	return b;
}
