var lsRect;	
	
	//判断矩形相交	 true:相交	console.log(cross([100,100,150,150], [151,125,300,300]));
	function Unicode(str) { return escape(str).replace(/%u/gi, ''); };  
	function cross(rt1, rt2){
		var minx = Math.max(rt1[0], rt2[0]), miny = Math.max(rt1[1], rt2[1]), 
				maxx = Math.min(rt1[2], rt2[2]), maxy = Math.min(rt1[3], rt2[3]);
		return (minx > maxx) || (miny > maxy) ? false : true; 
	};
	function LoadScaff(id, source){
		var div=d3.select("#"+id), desp_width = 130,
			w=parseInt(div.style("width")), h=parseInt(div.style("height"));
		lsRect = [];
		
		//检测是否与已有标签冲突		true:冲突
		function rect(d, t){ 
			var rt = [xScale(d.score)- t.width/2, yScale(d.money)-t.height/2, 
					xScale(d.score)+ t.width/2, yScale(d.money)+t.height/2], i, l = lsRect.length;
			for(i=0; i<lsRect.length; i++)if(cross(lsRect[i], rt))break;
			if(i==l)lsRect.push(rt);
			return (i==l) ? false : true ;
		};
		function order(a, b) { return b.year - a.year; }
		
		var margin = {top: 29.5, right: 29.5, bottom: 29.5, left: 52.5},
			width = w - margin.right, height = h - margin.top - margin.bottom, cwidth = w-desp_width-margin.left;
		var xScale = d3.scale.linear().domain([0, source.maxX+1000]).range([0, cwidth]),
			yScale = d3.scale.linear().domain([-10, source.maxY+10]).range([height, 0]),
			radiusScale = d3.scale.sqrt().domain([0, source.maxR]).range([0, 25]),
			colorScale = d3.scale.category10();
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(10, d3.format(",d")),
			yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);
		var svg = d3.select("#"+id).append("svg")
			.attr("width", w).attr("height", h)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		var desp = svg.append("g").attr("transform", "translate(" + (cwidth + 5) + "," + 0 + ")")
			.append("g").attr('width', desp_width).attr('height', h).style('fill', 'green');
		
		addDesp(desp, [], colorScale, radiusScale, source.data);
		
		svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
		svg.append("g").attr("class", "y axis").call(yAxis);
		
		svg.append("text")
			.attr("class", "x label").attr("text-anchor", "end").style('font-size', '16px')
			.attr("x", cwidth).attr("y", height - 6).style('font-weight', '100')
			.text("薪资");
		svg.append("text")
			.attr("class", "y label").attr("text-anchor", "end").style('font-weight', '100')
			.attr("y", 6).attr("dy", ".75em").attr("transform", "rotate(-90)")
			.style('font-size', '16px')
			.text("绩效");
		var avgr = source.data.reduce(function(a, b){ return a + b.year; }, 0)/source.data.length;

		var dot = svg.append("g")
		  	.selectAll(".dot")
			.attr("class", "dot")
			.data(source.data)
		  	.enter().append("circle")
			.attr("cx", function(d) { return xScale(d.money); })
			.attr("cy", function(d) { return yScale(d.score); })
			.attr("id", function(d) { return 'rect' + Unicode(d.unit + 'p' + d.name); })
			.style('cursor', 'pointer')
			.attr("r", function(d) { return radiusScale(d.year); })
			.style("fill", function(d) { return colorScale(d.unit); })
			.sort(order);
		
		var txt = svg.append("g").selectAll("text").data(source.data).enter().sort(order)
			.append("text")
      		.attr("dy", ".40em")
			.style("font-size", "12px")
      		.attr("text-anchor", "middle")
			.attr("id", function(d) { return 'text' + Unicode(d.unit + 'p' + d.name); })
			.style('cursor', 'pointer')
      		.text(function(d) { return d.year > (avgr*0.8) ? d.name : ''; })
			.attr('transform', function(d, i){
				var f = rect(d, this.getBBox()); //检测相交
				return "translate(" + (f ? -100 : xScale(d.money)) + "," + (f ? -100 : yScale(d.score)) + ")";
			});
		addTooltip(dot);
		addTooltip(txt);
		/*
		dot.append("title").text(function(d) { 
			return d.name+' [' + d.unit + '], 月薪：'+d.money+',  绩效：'+d.score+',  从业年限：'+d.year + '年'; 
		});	
		*/
	}
	//提示框  Tooltip
	function addTooltip(svg){
		var tooltip = d3.select("body").append("div")
			.style('position', 'absolute').style('width', 120).style('height', 'auto')
			.style('font-family', 'simsun').style('font-size', '14px').style('text-align', 'left')
			.style('border-style', 'solid').style('border-width', '1px').style('background-color', 'white')
			.style('border-radius', '5px').style("opacity",0.0);
		svg.on("mouseover", function(d){
			console.log('OK');
			tooltip.html(d.name + "<br />部门：" + d.unit + "<br />月薪：<span style='color:red'>" + d.money + '</span>'
				+ "<br />绩效：" + d.score + "<br />从业年限：" + d.year )
            .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY + 20) + "px")
            .style("opacity",1.0);
		})
		.on("mousemove", function(d){
	    	tooltip.style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY + 20) + "px");
		})
		.on("mouseout", function(d){ tooltip.style("opacity",0.0); });
	}
	//说明 lengend
	function addDesp(svg, units, color, radius, data){
		units = ['现金管理部', '营销管理部', '投资银行部', '企业业务部', '风险管理部', '金融市场部', '机构业务部'];
		var p_top = 20, p_left = 20;
		
		//类别说明
		var group = svg.append('g').selectAll("g").data(units).enter().append("g")
			.style("fill",function(d, i){ return color(d); })
		group.append('rect').attr('width', 23).attr('height', 13).attr('x', p_left)
			.attr('y', function(d, i){ return (13 + 10) * i + p_top; })
			.attr('rx', 4).attr('ry', 4)
			.attr('id', function(d, i){ return 'lg' + i; })
			.style('cursor', 'pointer')
			.attr('id', function(d, i){ return 'lged' + i; })
			.on('click', legend);
		group.append('text').style('font-size', '12px')
			.text(function(d){ return d; }).attr('x', 30 + p_left)
			.attr('y', function(d, i){ var h = this.getBBox().height; return (13 + 10) * i + h-2 + p_top; })
			.style('cursor', 'pointer')
			.attr('id', function(d, i){ return 'desp' + i; })
			.on('click', legend);
		
		var posTop = (13 + 10) * units.length + p_top + 30, pos=posTop, r = 0;
		data.forEach(function(d){ r = d.year < r ? r : d.year; });
		var sizes = [0.5, 1, 2, 3], posY = sizes.map(function(d, i){	
				var t = posTop; posTop += (4+radius(d)*2); return t+radius(d);
		});
		
		//半径说明
		var rclr = '#043';
		var g2 = svg.append("g").selectAll("g").data(sizes).enter().append("g")
			.style("fill", rclr)
			.attr("transform", "translate(" + 10 + "," + 0 + ")");
		g2.append('circle')
			.attr('cy', function(d, i){ return posY[i]; })
			.attr('cx', function(d){ return 10 + radius(sizes[sizes.length-1]); })
			.attr('r', function(d, i){ return radius(d) ; })
		g2.append('text').style('font-size', '14px')
			.text(function(d){ return d+'年'; }).attr("transform", function(d, i){
				return "translate(" + (20 + 2*radius(sizes[sizes.length-1])) + "," 
				+ (posY[i] + this.getBBox().height/2) + ")"; 
			})	
		
		//文字标题，矩形阴影
		svg.append('text').text('从业年限').style('font-size', '12px').style('fill', rclr)
			.attr("transform", "translate(" + 20 + "," + (pos-10) + ")")
		svg.append('rect').attr('width', 2*radius(sizes[sizes.length-1]))
			.attr('height', sizes.reduce(function(a, b){ return a + radius(b)*2 + 4; }, 0))
			.style('fill', '#bbb').style('fill-opacity', 0.2)
			.attr("transform", "translate(" + 20 + "," + pos + ")");
		
		function legend(d){
			var e = d3.select(this), num = this.id.substr(4), c = 'rgb(205, 205, 205)',
					clr = e.style('fill') == c ? color(d) : c, hide = e.style('fill') == c ? 'block' : 'none' ;
				console.log(parseInt(num));
				var lsP = data.filter(function(c){ return c.unit == d; })
					.map(function(c){ return Unicode(c.unit + 'p' + c.name); });
				lsP.forEach(function(c){ 
					d3.select('#rect' + c).style('display', hide);
					d3.select('#text' + c).style('display', hide);
				});
				d3.select('#lged' + num).style('fill', clr);
				d3.select('#desp' + num).style('fill', clr);
		}
	}
