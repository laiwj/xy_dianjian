// JavaScript Document
	var public_time_select = "#public_time_select";
	var init_flow_date_start = "2015-10-22";
	var init_flow_date_end = "2016-06-13";
	var init_trip_date_start = "2014-04-13";
	var init_trip_date_end = "2016-10-22";
	var init_people_date_start = "2014-04-13";
	var init_people_date_end = "2016-11-20";
	var init_date_start = "2015-10-02";
	var init_date_end = "2015-12-13";
	var init_date_month = "2016-5-1";
	var init_unit_clock = "征地移民处";
	var init_unit_common = "所有部门";
	var init_unit_online = "水工处";
	var init_unit_social = "机电处";
	var init_style_social = "腾讯通";
	var init_unit_interval = "所有部门";
	var init_unit_flow = "所有部门";
	var public_all_unit = "所有部门";
	var serverIp = "http://192.168.3.177";
	//var serverIp = "http://118.123.173.86";
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
	function Init3(option, id){
		var myChart = echarts.init(document.getElementById(id));
		myChart.setOption(option);
		return myChart;
	}
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

	function ajaxData(key, data, _callbackS, _callbackE){
		var cbkf = (parseInt(Math.random() * 1000) + 1000).toString();
		$.ajax({
			type:'GET', url:serverUrl + '/' + key + '/',
			//type:'GET', url:'http://118.123.173.86:8000/' + key + '/',
			data:data, dataType:'jsonp', jsonpCallback: 'call1back' + cbkf + 'a',
			success:function(data)
			{
				if(_callbackS)_callbackS(data);
			},
			error:function(data)
			{
				if(_callbackE)_callbackE(data);
				alert("error");
			}
		});
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
	_unit.forEach(function(d){ opt += '<option value ="'+ d +'">'+ d +'</option>'; });
	$("#" + id).append(div + sel1 + opt + '</select>' + '</div>');
	$("#" + id + 'sel1').val(init_unit_clock);
	$("#" + id + 'sel1').change(function(){ if(clickFunc!=undefined)clickFunc($(this).val()); });
}

function tableClick(tbId, _callback){
	$("#" + tbId +" tbody tr").click(function(e){
		$("#" + tbId +" tbody tr").css("background-color", '');
		$("#" + tbId +" tbody tr").css("color", '');
		$(this).css("background-color", "#FFF8D7");
		$(this).css("color", "green");
		var v1 = $(this).find("td").first().html(), v2 = $(this).find("td:eq(1)").html()
			, v3 = $(this).find("td:eq(2)").html();
		if(_callback)_callback($(this),v1, v2, v3);
	});
}
function csrfSafeMethod(method) {
	// these HTTP methods do not require CSRF protection
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
	// test that a given url is a same-origin URL
	// url could be relative or scheme relative or absolute
	var host = document.location.host; // host + port
	var protocol = document.location.protocol;
	var sr_origin = '//' + host;
	var origin = protocol + sr_origin;
	origin = serverUrl;
	// Allow absolute or scheme relative URLs to same origin
	return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
		(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
			// or any other URL that isn't scheme relative or absolute i.e relative.
		!(/^(\/\/|http:|https:).*/.test(url));
}
function ajaxSet(csrftoken) {
	$.ajaxSetup({
		crossDomain: true,
		beforeSend: function (xhr, settings) {
			if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
				// Send the token to same-origin, relative URLs only.
				// Send the token only if the method warrants CSRF protection
				// Using the CSRFToken value acquired earlier
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		}
	});
}
function ajaxToInput(key, data, viewId){
	var url = serverUrl + '/' + key + '/';
	var div = $("<div style='display: none'></div>");
	var form = $('<form action="' + url + '" method="post"></form>');
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
function delCookie(name)
{
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null)
		document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

