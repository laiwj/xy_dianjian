// JavaScript Document
	var public_time_select = "#public_time_select";
	var init_date_start = "2016-09-22";
	var init_date_end = "2016-11-13";
	var init_date_month = "2016-5-1";
	var init_unit_clock = "院长工作部";
	var init_unit_common = "所有部门";
	var init_unit_interval = "所有部门";


	function getQueryString(name) { 
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r != null) return unescape(r[2]); return null; 
	}
	function range(_min, _max){ var rt=[]; for(var i=_min;i<_max;i++)rt.push(i); return rt; }
	function set(){this.data={};this.keys=[];this.add=function(e){if(!this.data.hasOwnProperty(e))this.keys.push(e);this.data[e]=1;};}
	function cout(d){ console.log(d); }
	function values(obj){ return Object.keys(obj).map(function(k){ return obj[k]; })}

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
			type:'GET', url:'http://192.168.3.177:8000/' + key + '/',
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