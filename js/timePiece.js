	function loadTimePiece(id, source) {
        var margin = {top: 10, right: 0, bottom: 10, left: 10};
        var div = d3.select("#" + id), width = parseInt(div.style('width')), height = parseInt(div.style('height')),
                w = width - margin.right - margin.left, h = height - margin.bottom - margin.top,
                svg = div.append('svg').attr('width', w + margin.right + margin.left)
                        .attr('height', h + margin.bottom + margin.top).append('g')
                        .attr('transform', "translate(" + margin.left + ',' + margin.top + ")");
        //svg.append('rect').attr('width', w).attr('height', h).style('fill', '#bbb');  //背景·布局精确测试

        var pos = {x1: 50, x2: 10, y1: 30, y2: 30, space: 50, textTop: 25, despW: 120},
                mw = w - pos.x1 - pos.x2 - pos.despW, mh = h - pos.y1 - pos.y2;
        svg.append('g').attr("transform", "translate(10," + (h/2+16) + ")").append('text')
                .text('时间线').attr("y", pos.x1 / 2).attr("transform", "rotate(-90)");

        //核心绘图区域
        svg.append('rect').attr('width', mw).attr('height', mh)
                .attr('transform', "translate(" + pos.x1 + ',' + pos.y1 + ")")
                .style('fill', '#fff');
        svg.append('rect').attr('width', mw).attr('height', mh - pos.space * 2)
                .attr('transform', "translate(" + pos.x1 + ',' + (pos.y1 + pos.space) + ")")
                .style('fill', '#f2f2f2');

        var time = function (h, m, s) { return new Date(h, m, s); };
        var timeS = function (s) { var tp = s.split(':'); return [parseInt(tp[0]), parseInt(tp[1]), parseInt(tp[2]) || 0]; };
        var timeToValue = function (d) { return d[0] * 3600 + d[1] * 60 + d[2]; };
        var sToValue = function (s) { return timeToValue(timeS(s)); };
        var tBegin = sToValue(source.drawtime.begin), tEnd = sToValue(source.drawtime.end);
        var xScale = d3.scale.linear().domain([tBegin, tEnd]).range([pos.x1, mw + pos.x1]),
                interpolate = d3.interpolateNumber(tBegin, tEnd), colorScale = d3.scale.category10();
        var x = function (d) { return xScale(sToValue(d)) };

        var timeLines = [source.drawtime.begin, source.drawtime.end];
        for (var k in source.worktime)timeLines.push(source.worktime[k]);

        var line = svg.append('g').selectAll('line').data(timeLines).enter();
        //时间线
        line.append('line').attr("x1", function (d) { return x(d); }).attr("y1", pos.y1 + pos.textTop)
                .attr("x2", function (d) { return x(d);})
                .attr("y2", pos.y1 + mh - pos.textTop).style("stroke-dasharray", ("3, 3"))
                .style("stroke-opacity", 0.9).style("stroke", '#aaa');
        //起始线
        line.append('line').attr("x1", x(source.drawtime.begin)).attr("y1", pos.y1 + pos.textTop)
                .attr("x2", x(source.drawtime.begin)).attr("y2", pos.y1 + mh - pos.textTop).style("stroke", '#ccc');
        //时间值·文字
        line.append('text').text(function (d) { return d;}).style('font-size', '13px')
                .attr('transform', function (d) {
                    return "translate(" + (x(d) - this.getBBox().width / 2) + ',' + (pos.y1 + mh - 5) + ")";
                })

        var workTimes = [[source.worktime.morning, 0], [source.worktime.night, 1], [source.worktime.nightIn, 0], [source.worktime.nightOff, 1]];
        var getPath = function (d) { //x,方向
            var y1 = pos.y1 + pos.textTop, y2 = pos.y1 + mh - pos.textTop, k = d[1] ? -1 : 1, m = ' M' + x(d[0]) + ' ';
            return m + y1 + ' V' + y2 + m + y1 + ' H' + (x(d[0]) + k * 25) + m + y2 + ' H' + (x(d[0]) + k * 25);
        };
        //标注线·上班时间
        svg.append('g').selectAll('path').data(workTimes).enter()
                .append('path').attr('d', function (d) { return getPath(d); })
                .style("stroke-dasharray", ("3, 3")).style("stroke", 'red');
        var workMarks = [[(x(workTimes[0][0]) + x(workTimes[1][0])) / 2, '上班时间'], [(x(workTimes[2][0]) + x(workTimes[3][0])) / 2, '加班时间']];
        svg.append('g').selectAll('text').data(workMarks).enter().append('text')
                .text(function (d) { return d[1]; }).style('font-size', '14px').style('fill', 'red')
                .attr('transform', function (d) {
                    return "translate(" + (d[0] - 28) + ',' + (pos.y1 + pos.textTop - 10) + ")";
                });
        //时间片
        source.data.push([source.drawtime.begin, source.worktime.morning, -1]); //片·上班前
        source.data.push([source.worktime.nightOff, source.drawtime.end, -1]);  //片·下班后
        var rect = svg.append('g').selectAll('rect').data(source.data).enter().append('rect')
                .attr('width', function (d) { return x(d[1]) - x(d[0]) }).attr('y', pos.y1 + pos.space)
                .attr('height', mh - pos.space * 2).attr('x', function (d) { return x(d[0]);})
                .style('fill', function (d) { return d[2] != -1 ? colorScale(d[2]) : '#ddd'; });
        //说明 lengend
        var lged = svg.append("g").attr("transform", "translate(" + (pos.x1 + mw) + "," + pos.y1 + ")")
                .append("g").attr('width', pos.despW).attr('height', mh);
        addDesp(lged, source.action, colorScale);
        addTooltip(rect, source.action);

    }
    function addDesp(svg, units, color, data) {
        var p_top = 20, p_left = 20;
        //类别说明
        var group = svg.append('g').selectAll("g").data(units).enter().append("g")
                .style("fill", function (d, i) { return color(i); })
        group.append('rect').attr('width', 23).attr('height', 13).attr('x', p_left)
                .attr('y', function (d, i) { return (13 + 10) * i + p_top; })
                .attr('rx', 4).attr('ry', 4).style('cursor', 'pointer')
                .attr('id', function (d, i) { return 'lged' + i; })
                .on('click', legend);
        group.append('text').style('font-size', '12px')
                .text(function (d) { return d; }).attr('x', 30 + p_left).style('cursor', 'pointer')
                .attr('y', function (d, i) { return (13 + 10) * i + this.getBBox().height - 2 + p_top; })
                .attr('id', function (d, i) { return 'desp' + i; })
                .on('click', legend);
        function legend(){}
    }

    //提示框  Tooltip
    function addTooltip(svg, actions){
        var tooltip = d3.select("body").append("div")
                .style('position', 'absolute').style('width', 120).style('height', 'auto')
                .style('font-family', 'simsun').style('font-size', '14px').style('text-align', 'left')
                .style('border-style', 'solid').style('border-width', '1px').style('background-color', 'white')
                .style('border-radius', '5px').style("opacity",0.0);
        svg.on("mouseover", function(d){
                if(d[2]==-1)return;
                var html =  "<br/>行为："+ actions[d[2]] + "<br />时间：" + d[0] + " - " + d[1]
                        + "<br />时长：<span style='color:red'>" + 90 + "分钟</span> <br/>&nbsp;";
                tooltip.html(html).style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY + 20) + "px").style("opacity",1.0);
                })
                .on("mousemove", function(d){
                    tooltip.style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY + 20) + "px");
                })
                .on("mouseout", function(d){ tooltip.style("opacity",0.0); });
    }