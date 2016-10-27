// JavaScript Document

function Zoom(id, height_zoom){
	this.parent = $("#" + id);		//parent object
	this.id = id;					//parent div
	this.did = this.id + '_data';	//data div
	this.zid = this.id + '_zoom';	//zoom div
	this.tid = this.id + '_tail';	//tail div
	this.lid = this.id + '_label';	//label div
	this.margin_bottom = 20;
	this.margin_left = 30;
	this.hz = height_zoom || 30;	//height zoom
	this.hd = $("#" + this.id).height() - this.hz - this.margin_bottom;	//height data
	this.tpzooms = 0;	//zoom temp start pos
	this.tpzoome = 100;	//zoom temp end pos
	this.zoomdata = [];
	this.currentValue = 0;
	this.myChart = null;

	this.zoomOption = {
		dataZoom: { realtime: false, show: true, start: this.tpzooms, y: 0,  end:this.tpzoome, handleSize: 10, zoomLock: true, height: this.hz, shandleColor: 'rgba(70,130,180,0.8)',},
		xAxis: [{type: 'category', show: false, data: []}],
		yAxis: [{type: 'value'}],
		grid: {x: 0, y: this.hz, height: 0, x2:0},
		series: [{name: 'series1', type: 'line', data: []}]
	};
	this.loadLabel = function(){
		var ml = ';font-size:13px;text-align: center;float:left;', pml = ';padding-left:' + this.margin_left + 'px;clear:left;width:100%;padding-top:8px;';
		this.parent.append("<div id='" + this.lid + "' style='"+ pml +"height:" + this.margin_bottom + "px'></div>");
		var w = parseInt($("#"+this.zid).width() / this.zoomdata.length), obj = $("#"+this.lid);
		this.zoomdata.forEach(function(d){ obj.append("<div style='width:"+ w +"px"+ ml +"'>" + d[0] + "</div>"); });
	}
	this.datazoomInit = function (){
		var ml = ';padding-left:' + this.margin_left + 'px';
		this.parent.html();
		this.parent.append("<div id='" + this.did + "' style='width:100%;height:" + this.hd + "px'></div>").
			append("<div id='" + this.zid + "' style='width:100%;height:" + this.hz + "px"+ ml +"'></div>");
	};
	this.loadZoom = function (data, callback){
		this.zoomdata = data;
		console.log(data);
		this.zoomOption.dataZoom.end = 1/data.length * 100;
		this.zoomOption.xAxis[0].data = data.map(function(d){ return d[0]; });
		this.zoomOption.series[0].data = data.map(function(d){ return d[1]; });
		this.myChart = echarts.init(document.getElementById(this.zid));
		this.myChart.setOption(this.zoomOption, true);
		this.myChart.on("dataZoom", function(p){
			if(Math.abs(p.start - this.tpzooms)<1 && Math.abs(p.end - this.tpzoome)<1)return;
			this.tpzooms = p.start;
			this.tpzoome = p.end;
			if(callback)callback([p.start, p.end], 
				[data[Math.round(data.length * p.start / 100)], data[Math.round(data.length * p.end / 100)-1]]);
		});
		this.loadLabel();
		return this;
	};
	this.setData = function(list){
		this.zoomOption.series[0].data = list.map(function(d){ return d; });
		this.myChart.setOption(this.zoomOption, true);
	}
	this.addPlay = function(cb_click){
		$("#" + this.zid + " div:first-child").append("<div id='" + this.tid + 
			"' style='float:right;overflow:hidden;padding:0 10px 2px 5px;width:70px;height:" + this.hz + "px'></div>");
		//icon-play-circle
		$("#" + this.tid).append('<i class="icon-play-circle icon-3x" onclick="'+ cb_click+ '"></i>');
	}

	this.datazoomInit();
	//this.loadZoom();

}


function cout(obj){ console.log(obj); }