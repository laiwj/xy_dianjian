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
	var init_unit_clock = "数字工程与信息技术中心";
	var init_unit_common = "-1";
	var init_unit_online = "数字工程与信息技术中心";
	var init_unit_social = "数字工程与信息技术中心";
	var init_unit_manage = "数字工程与信息技术中心";
	var init_style_social = "邮箱";	 //腾讯通
	var init_unit_interval = "所有部门";
	var init_unit_flow = "所有部门";
	var public_all_unit = "所有部门";
	var init_unit_performance = "10425";
    var init_color_people = "#222";
	var Units = { 10421:"征地移民处", 10426:"水工处", 10406:"机电处" };

	//var serverIp = "http://10.101.1.177";
	//var serverIp = "http://118.123.173.86";
var serverIp = "http://10.101.1.23";
	//var serverIp = "http://10.101.1.119";
	//var serverIp = "http://192.168.102.198";
	//var serverIp = "http://127.0.0.1";

	var serverPort = 8001;
	var serverUrl = serverIp + ":" + serverPort;

	var P = new PublicModel();
	InitPublic();
    

	function InitPublic(){
		var d = P.getRecentMonthDate(1), m3 = P.getRecentMonthDate(3), m6 = P.getRecentMonthDate(5);  //getLastMonthDate
        
		init_flow_date_start = d.dateStart;
        init_flow_date_end = d.dateEnd;
        init_trip_date_start = m3.dateStart;
        init_trip_date_end = m3.dateEnd;
        init_network_date_start = d.dateStart;
        init_network_date_end = d.dateEnd;
        init_people_date_start = m6.dateStart;
        init_people_date_end = m6.dateEnd;
		//cout(d);

	}
	/* 通用函数封装，兼容老版本 */
	function PublicModel(){
		var $this = this;
		this.getLastMonth = function(){
            var _date = new Date(), y = _date.getFullYear(), m = _date.getMonth() + 1;
            if(m==1){ y = y - 1; m = 13; }
            m--;
            return y + "-" + (m>9 ? m : ("0"+m));
		};
    this.getRecentMonth = function(month){
        var _date = new Date(), y = _date.getFullYear(), m = _date.getMonth() + 1 - month;
        if(m<1){ y = y - 1; m += 12; }
        return y + "-" + (m>9 ? m : ("0"+m));
		}; 
    /* 获取最近几月日期区间 - 截止今天 */
    this.getRecentMonthDate = function(month){ 
        var mDate = $this.getRecentMonth(month), sp = mDate.split("-");
        return {'dateStart': sp[0] + '-' + sp[1] + '-1',
            'dateEnd':$this.DateF(new Date()) }
    };   
    this.getDateByMonth = function(date){ var sp = date.split("-");
        return {'dateStart': sp[0] + '-' + sp[1] + '-1',
            'dateEnd': sp[0] + '-' + sp[1] + '-' + (new Date(parseInt(sp[0]), parseInt(sp[1]),0)).getDate()}
    };
		this.getLastMonthDate = function(){
			return $this.getDateByMonth($this.getLastMonth());
		};

		this.getQueryString = function(name){
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        };
        
        this.range = function(_min, _max){ var rt=[]; for(var i=_min;i<_max;i++)rt.push(i); return rt; };
        this.values = function(obj){ return Object.keys(obj).map(function(k){ return obj[k]; })};
        this.items = function(obj){ return Object.keys(obj).map(function(k){ return [k, obj[k]]; })};

        this.GetMonthNow = function(){ return  new Date().format("yyyy-MM"); };
        
        this.DateF = function(date, _sp) { var sp = "-" || _sp; return [date.getFullYear(), date.getMonth()+1, date.getDate()].join(sp); };
        this.DateDTS = function(date) { return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds(); };
        this.DateDTM = function(date) { return date.getHours() * 60 + date.getMinutes(); };
        this.DateSTM = function(str){ var sp = str.split(" ")[1].split(":"); return parseInt(sp[0]) * 60 + parseInt(sp[1]); };
        this.DateSTD = function(str){ var sp = str.split(/-| |:/); return new Date(parseInt(sp[0]), parseInt(sp[1]), parseInt(sp[2]),
            parseInt(sp[3]), parseInt(sp[4]), parseInt(sp[5])); };
        this.DateDSTD = function(str){ var sp = str.split(/-| |:/); return new Date(parseInt(sp[0]), parseInt(sp[1])-1, parseInt(sp[2])); };
        this.DateSTDS = function(str){ return str.split(" ")[0]; };
        this.TimeT = function(str){ var sp = str.split(":"); return new Date(0, 0, 0, parseInt(sp[0]), parseInt(sp[1]), 0); };
        this.TimeF = function(date){ return date.getHours() + ":" + date.getMinutes(); };
        this.TimeFormat = function(str){ var sp = str.split(":"); return format0(sp[0]) + ":" + format0(sp[1]) + ":" + format0(sp[2]);  };
        this.TimeSTM = function(str){ var sp = str.split(":"); return parseInt(sp[0]) * 60 + parseInt(sp[1]); };
        this.TimeMTS = function(m){
            var h = parseInt(m/60), m = parseInt(m % 60), tm = h + ":" + (m>9 ? m : ("0" + m));
            return m<0 || h>24 ? "" : tm;
        };
        this.format0 = function(m){ return (parseInt(m)>9 ? m : ("0" + m));	};


		//-------------------------------------------cookie相关-----------------------------------------------
        this.setCookie = function(name,value, hour)
        {
            hour = hour || 2;
            var exp = new Date();
            exp.setTime(exp.getTime() + hour * 60*60*1000);
            document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
        };
        this.getCookie = function(name)
        {
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        };
        this.GetCookie = function(name) {
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
        };
        this.delCookie = function(name)
        {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval=getCookie(name);
            if(cval!=null)
                document.cookie= name + "="+cval+";expires="+exp.toGMTString();
        };

        //限制文本框数字
        this.LimitInput = function(obj){
            if(obj.value.length==1){obj.value=obj.value.replace(/[^0-9]/g,'')}else{
                obj.value=obj.value.replace(/\D/g,'');
                if(obj.value!="")$(obj).val(parseInt(obj.value));
            }
        };
		/* 获取数组中第二大的元素 */
        this.getSecondMax = function(ary){
            var a = ary[0]<ary[ary.length-1] ? ary[0] : [ary.length-1], b=a;
            for(var i=0; i<ary.length; i++){
                if(a<ary[i]){
                    b = a;
                    a = ary[i];
                }
            }
            return b;
        };


        function format0(m){ return (parseInt(m)>9 ? m : ("0" + m));	}

    };



	// function getQueryString(name) {
	// 	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	// 	var r = window.location.search.substr(1).match(reg);
	// 	if (r != null) return unescape(r[2]); return null;
	// }
	function cout(d){ console.log(d); }

function getQueryString(name){ return P.getQueryString(name); }

function range(_min, _max){ return P.range(_min, _max); }
function values(obj){ return P.values(obj); }
function items(obj){ return P.items(obj); }
	// function range(_min, _max){ var rt=[]; for(var i=_min;i<_max;i++)rt.push(i); return rt; }
	function set(){this.data={};this.keys=[];this.add=function(e){if(!this.data.hasOwnProperty(e))this.keys.push(e);this.data[e]=1;};}
	function sets(e){this.data=e?{e:1}:{};this.keys=e?[e]:[];this.add=function(e){if(!this.data.hasOwnProperty(e))this.keys.push(e);this.data[e]=1;};}
	// function values(obj){ return Object.keys(obj).map(function(k){ return obj[k]; })}
	// function items(obj){ return Object.keys(obj).map(function(k){ return [k, obj[k]]; })}

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

	function _$(id){ return document.getElementById(id); }

function GetMonthNow(){ return P.GetMonthNow(); }
function DateDTS(date){ return P.DateDTS(date); }
function DateDTM(date){ return P.DateDTM(date); }
function DateSTM(str){ return P.DateSTM(str); }
function DateSTD(str){ return P.DateSTD(str); }
function DateDSTD(str){ return P.DateDSTD(str); }
function DateSTDS(str){ return P.DateSTDS(str); }
function TimeT(str){ return P.TimeT(str); }
function TimeF(date){ return P.TimeF(date); }
function TimeFormat(str){ return P.TimeFormat(str); }
function TimeSTM(str){ return P.TimeSTM(str); }
function TimeMTS(m){ return P.TimeMTS(m); }
function format0(m){ return P.format0(m);	}

	// function GetMonthNow(){ return  new Date().format("yyyy-MM"); }
	// function DateDTS(date) { return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds(); }
	// function DateDTM(date) { return date.getHours() * 60 + date.getMinutes(); }
	// function DateSTM(str){ var sp = str.split(" ")[1].split(":"); return parseInt(sp[0]) * 60 + parseInt(sp[1]); }
	// function DateSTD(str){ var sp = str.split(/-| |:/); return new Date(parseInt(sp[0]), parseInt(sp[1]), parseInt(sp[2]),
	// 	parseInt(sp[3]), parseInt(sp[4]), parseInt(sp[5])); }
	// function DateDSTD(str){ var sp = str.split(/-| |:/); return new Date(parseInt(sp[0]), parseInt(sp[1])-1, parseInt(sp[2])); }
	// function DateSTDS(str){ return str.split(" ")[0]; }
	// function TimeT(str){ var sp = str.split(":"); return new Date(0, 0, 0, parseInt(sp[0]), parseInt(sp[1]), 0); }
	// function TimeF(date){ return date.getHours() + ":" + date.getMinutes(); }
	// function TimeFormat(str){ var sp = str.split(":"); return format0(sp[0]) + ":" + format0(sp[1]) + ":" + format0(sp[2]);  }
	// function TimeSTM(str){ var sp = str.split(":"); return parseInt(sp[0]) * 60 + parseInt(sp[1]); }
	// function TimeMTS(m){
	// 	var h = parseInt(m/60), m = parseInt(m % 60), tm = h + ":" + (m>9 ? m : ("0" + m));
	// 	return m<0 || h>24 ? "" : tm;
	// }
	// function format0(m){ return (parseInt(m)>9 ? m : ("0" + m));	}


	function ajaxData(key, data, _callbackS, _callbackE, _callbackC){
		var cbkf = (parseInt(Math.random() * 1000) + 1000).toString();
		data["session"] = getCookie('session');
		data['userId'] = getCookie('username');
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
	function refresh(){
		window.location.reload();
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
		tableSelRow(tbId, $(this));
		var v1 = $(this).find("td").first().html(), v2 = $(this).find("td:eq(1)").html()
			, v3 = $(this).find("td:eq(2)").html();
		if(_callback)_callback($(this),[v1, v2, v3]);
	});
}

//查找表格行
function tableFindRow(tbId, value, colIndex){
	var tds = $("#" + tbId).find("td"), colIndex = colIndex || -1;
	for(var i=0; i<tds.length; i++){
		if(colIndex!=-1 && colIndex!=i)continue;
		if(tds[i].innerHTML==value)return $(tds[i]).parent();
	}
	return null;
}

function tableSelRowByValue(tbId, value, colIndex, _callback){
	var row = tableFindRow(tbId, value, colIndex);
	if(row==null)return;
	tableSelRow(tbId, row, _callback);
	$(row)[0].cells[1].scrollIntoView(false);
}

function tableSelRow(tbId, row, _callback){
	$("#" + tbId +" tbody tr td").css("background-color", '');
	$("#" + tbId +" tbody tr").css("background-color", '');
	$("#" + tbId +" tbody tr").css("color", '');
	$(row).css("background-color", "#2C9949");
	$(row).find("td").css("background-color", "#2C9949");
	$(row).css("color", "#fff");
	if(_callback)_callback();
}

function tableClick(ft, tbId, _callback){
	_tableClick(tbId, _callback);
	ft.on('after.ft.paging', function(e){
		_tableClick(tbId, _callback);
	});
}

function tableClickEx(ftInit, tbId, _callback){
	_tableClick(tbId, _callback);
	ftInit.$el.on('after.ft.paging', function(e){
		_tableClick(tbId, _callback);
	});
}

function ShowLoadingUI(){
	$("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:$(window).height()}).appendTo("body");
	$("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候。。。").appendTo("body").css({display:"block",left:($(document.body).outerWidth(true) - 190) / 2,top:($(window).height() - 45) / 2});
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
		nickName = getCookie('nickname'), level = getCookie('level'), unitName = getCookie('unitname') || '';
	if(level!=null)level = parseInt(level);
	if(!session || !userName || !nickName || !level){
		window.location.href="login.html";
	}else{
		$('#u_username').html(userName);
		$('#u_nickname').html(nickName);
		$('#u_unitname').html(unitName);
		$('#u_level').html('lv '+ level);
		$('#u_lvname').html((level<2 && '普通用户') || (level<3 && '高级用户') || (level<4 && '管理员')
			|| (level<4 && '系统管理员') || ("超级管理员"));
	}
}
function quit(){
	delCookie('session');
	delCookie('username');
	window.location.href="login.html";
}

function setCookie(name,value, hour){ return P.setCookie(name,value, hour); }
function getCookie(name){ return P.getCookie(name); }
function GetCookie(name){ return P.GetCookie(name); }
function delCookie(name){ return P.delCookie(name); }
//限制文本框数字
function LimitInput(obj){ return P.LimitInput(obj); }

// function setCookie(name,value, hour)
// {
// 	hour = hour || 2;
// 	var exp = new Date();
// 	exp.setTime(exp.getTime() + hour * 60*60*1000);
// 	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
// }
// function getCookie(name)
// {
// 	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
// 	if(arr=document.cookie.match(reg))
// 		return unescape(arr[2]);
// 	else
// 		return null;
// }
// function GetCookie(name) {
// 	var cookieValue = null;
// 	if (document.cookie && document.cookie != '') {
// 		var cookies = document.cookie.split(';');
// 		for (var i = 0; i < cookies.length; i++) {
// 			var cookie = jQuery.trim(cookies[i]);
// 			if (cookie.substring(0, name.length + 1) == (name + '=')) {
// 				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
// 				break;
// 			}
// 		}
// 	}
// 	return cookieValue;
// }
//
// function delCookie(name)
// {
// 	var exp = new Date();
// 	exp.setTime(exp.getTime() - 1);
// 	var cval=getCookie(name);
// 	if(cval!=null)
// 		document.cookie= name + "="+cval+";expires="+exp.toGMTString();
// }
//
// //限制文本框数字
// function LimitInput(obj){
// 	if(obj.value.length==1){obj.value=obj.value.replace(/[^0-9]/g,'')}else{
// 		obj.value=obj.value.replace(/\D/g,'');
// 		if(obj.value!="")$(obj).val(parseInt(obj.value));
// 	}
// }

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
function getSecondMax(ary){ return P.getSecondMax(ary); }

// /* 获取数组中第二大的元素 */
// function getSecondMax(ary){
// 	var a = ary[0]<ary[ary.length-1] ? ary[0] : [ary.length-1], b=a;
// 	for(var i=0; i<ary.length; i++){
// 		if(a<ary[i]){
// 			b = a;
// 			a = ary[i];
// 		}
// 	}
// 	return b;
// }
