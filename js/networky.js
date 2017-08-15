"use strict";


var networky = function(){
	this.Graph = function(){ return new Graph(); }

	this.karate_club_graph = function(){
		var lks = "2 1,3 1,3 2,4 1,4 2,4 3,5 1,6 1,7 1,7 5,7 6,8 1,8 2,8 3,8 4,9 1,9 3,10 3,11 1,11 5,11 6,12 1,13 1,13 4,"+
				"14 1,14 2,14 3,14 4,17 6,17 7,18 1,18 2,20 1,20 2,22 1,22 2,26 24,26 25,28 3,28 24,28 25,29 3,30 24,"+
				"30 27,31 2,31 9,32 1,32 25,32 26,32 29,33 3,33 9,33 15,33 16,33 19,33 21,33 23,33 24,33 30,33 31,33 32,"+
				"34 9,34 10,34 14,34 15,34 16,34 19,34 20,34 21,34 23,34 24,34 27,34 28,34 29,34 30,34 31,34 32,34 33";
		var G=new Graph();
		var eds = lks.split(",");
		eds.forEach(function(d, i){
			var tuple = d.split(" ");
			G.add_edge([tuple[0], tuple[1]]);	
		});
		return G;
	}
};

//networky.prototype.Graph = function(){
var Graph = function(){	
	/*
	nodes		[ { key: b, _delete:0, id:index, lsChild:[], label: key } ]
	edges		[ [aI, bI, key2] ]
	__nodes	{ key : index }
	__links	{ key : { value:1, weight:weight, _delete:0 } }
	*/
	var nodes = [], edges = [];
	var netmd5 = 0, __links = {}, __nodes = {}, __nodex = {},//key - index
		 _string = "string", _number = "number", _object = "object",  _sp = "y*_*y", index = 0, _array = "array";
	var cache_betweenness_centrality = {'md5':-1, 'data':null}, cache_floyd = {'md5':-1, 'data':null},
		cache_label_propagation = {'md5':-1, 'data':null}, cache_connected_component = {'md5':-1, 'data':null};
	
	this.change = function(){
		return netmd5++;
	}
	this.add_edge = function(edge){
		this.change();
		var a = edge[0], b = edge[1], aI=-1, bI=-1, weight=edge[2] || 1, type = typeof(edge[0]);
		if(_string == type){
			this._add_edge_string(a, b, weight);
		}else if(_number == type){
			this._add_edge_string(a.toString() , b.toString() , weight);
		}else if(_object == type){
			this._add_edge_object(a, b, weight);
		}
	};
	/* the common way to create network */
	this._add_edge_string = function(a, b, weight){
		if(a == b)return;
		var nd = [a, b], inx = [-1, -1];
		nd.forEach(function(d, i){
			if(__nodes[d] != undefined){ //if exist d
				inx[i] = __nodes[d];
			}else{
				nodes.push({ key: d, _delete:0, id:index, lsChild:[], label: d });
				__nodes[d] = index;
				__nodex[index] = d;
				inx[i] = index++;
			}
		});
		var key1 = a + _sp + b, key2 = b + _sp + a;
		if(__links[key1]){
			__links[key1].value++;
			__links[key1].weight += weight;
		}else{
			if(__links[key2]){
				__links[key2].value++;
				__links[key2].weight += weight;					
			}else{
				__links[key2]={ value:1, weight:weight, _delete:0 };
				edges.push([inx[0], inx[1], key2]);
				nodes[inx[0]].lsChild.push(inx[1]);
				nodes[inx[1]].lsChild.push(inx[0]);		
			}
		}
	};
	/* complex way to create network */
	this._add_edge_object = function(a, b, weight){
		console.error("we have not implemented this type");
	}
	this.add_edges_from = function(_edges){
		for(var i=0; i<_edges.length; i++)this.add_edge(_edges[i]);
	};
	this.add_node = function(n){
		this.change();		
	};
	this.add_nodes_from = function(_nodes){
		for(var i=0; i<_nodes.length; i++)this.add_node(_nodes[i]);
	};
	this.remove_node = function(n){
		nodes[__nodes[n]]._delete = 1;
		nodes[__nodes[n]].lsChild.forEach(function(d){ __array_remove(nodes[d].lsChild, __nodes[n]); });		
		for(var i=edges.length - 1; i>-1; i--){
			if(nodes[edges[i][0]].key == n || nodes[edges[i][1]].key == n){
				__links[edges[i][2]]._delete = 1;
				edges.splice(i, 1);	
			}
		}
		return nodes.length;
	}
	this.remove_edge = function(_edges){
		var key = get_edge_key(_edges), einx = __array_find(edges, function(d){ return d[2] == key; });
		__links[key]._delete = 1;
		edges.splice(einx, 1);	
		__array_remove(nodes[__nodes[_edges[0]]].lsChild, __nodes[_edges[1]]);
		__array_remove(nodes[__nodes[_edges[1]]].lsChild, __nodes[_edges[0]]);
	}
	this.nodes = function(key){
		if(key != null)return nodes[__nodes[key]];
		return nodes.filter(function(d){ return 0==d._delete }).map(function(d){ return d.key; });
	}
	var get_nodes = function(){
		return nodes.filter(function(d){ return 0==d._delete });
	}
	this.edges = function(_weight, tuple){	
		return get_edges(_weight, tuple);
	}
	var get_edge_key = function(tuple){
		return __links[tuple[0] + _sp + tuple[1]] != undefined ? tuple[0] + _sp + tuple[1] : 
			__links[tuple[1] + _sp + tuple[0]] != undefined ? tuple[1] + _sp + tuple[0] : null;		
	}
	var get_edges = function(_weight, tuple){	//_weight - true or false, tuple - [key1, key2]
		if(tuple != null){
			var key = get_edge_key(tuple);
			return __links[key] && __links[key]._delete==0 ? [key.split(_sp), __links[key].weight]: null;
		}
		return edges.map(function(d){
			return _weight ? [nodes[d[0]].key, nodes[d[1]].key, __links[d[2]].weight] : [nodes[d[0].key], nodes[d[1]].key];
		});
	}
	this.weight = function(tuple){	//tuple - [id1, id2]
		var t = typeof(tuple[0]) == _number ? [nodes[tuple[0]].key, nodes[tuple[1]].key] : tuple,
			e = get_edges(true, t);
		return e ? e[1] : null;
	}
	this.labels = function(_index){	//_index - 节点索引
		if(_index != null)return nodes[_index]._delete==0 ? nodes[_index].label : null;
		return get_nodes().map(function(d){ return d.label; });
	}
	this.degree = function(node, _weight){
		return get_nodes().reduce(function(a, b){ a[b.key] = b.lsChild.length; return a; }, {});
	}
	this.number_of_nodes = function(){
		return get_nodes().length;
	}
	this.number_of_edges = function(){
		return edges.length;
	}
	this.size = function(){
		return this.number_of_edges();
	}
	this.average_degree = function(){
		return get_nodes().reduce(function(a, b){ return a + b.lsChild.length; }, 0) / this.number_of_nodes();
	}
	var cache_data = function(cache){
		
	}
	//A Faster Algorithm for Betweenness Centrality.Ulrik Brandes, Journal of Mathematical Sociology 25(2):163-177, 2001.
	this.betweenness_centrality = function(){
		if(cache_betweenness_centrality.md5 == netmd5)return cache_betweenness_centrality.data;	//缓存数据
		/* 算法来源：Ulrik Brandes */
		var BTC = {}, nds = get_nodes(), l = nds.length, tpo = {}, tpd = {}, tpp = {}, tpq = {};
		tpo = nds.reduce(function(a, b){ a[b.id]=0; return a; }, {});
		BTC = __copy_object(tpo);
		tpd = __copy_object(tpo);
		tpp = __copy_object(tpo);
		tpq = __copy_object(tpo);		
		nds.forEach(function(d){
			var S = [], Q = [d.id];
			for(var e in tpp)tpp[e]=[];
			__init_object(tpo, 0);
			__init_object(tpd, -1);	
			tpo[d.id] = 1;
			tpd[d.id] = 0;
			while(Q.length != 0){
				var v = Q.pop();
				S.push(v);
				nodes[v].lsChild.forEach(function(w){
					if(tpd[w]<0){
						Q.unshift(w);
						tpd[w] = tpd[v] + 1;
					}
					if(tpd[w] == (tpd[v] + 1)){
						tpo[w] += tpo[v];
						tpp[w].push(v);
					}
				});
			}
			__init_object(tpq, 0);
			while(S.length != 0){
				var w = S.pop();
				tpp[w].forEach(function(v){ tpq[v] += (tpo[v] / tpo[w]) * (1 + tpq[w]); });
				if(w!=d.id) BTC[w] += tpq[w];
			}
		});
		var f = 2.0 /((l-1) * (l-2)), betweenness = {};
		for(var e in BTC) betweenness[nodes[e].key] = BTC[e] / 2 * f; 
		/* 算法结束 */
		cache_betweenness_centrality = {'md5':netmd5, 'data': betweenness};
		return cache_betweenness_centrality.data;
	}
	this.shortest_path_length = function(param){
		if(param == null){ //全部
			var lh = this.floyd().length, nds = get_nodes(), pl = {};
			for(var i=0; i<nds.length; i++)
				for(var j=0; j<nds.length; j++)
					pl[nds[i].key + "->" + nds[j].key] = lh[nds[i].id][nds[j].id];
			return pl;

			
		}else if(typeof(param)==_string){ //节点
			
		}else if(typeof(param)==_object){ //节点对
			
		}
	}
	this.dijkstra_path = function(node){	//node - key
		var bigNum = 65535, source = [{"key":node, "value":0} ], nds = get_nodes(), target=[];
		for(var i=0; i<nds.length; i++)
			if(node != nds[i].key)target.push({ "key":nds[i].key, "value":bigNum }) 
		while(source.length < nds.length){
			var last = source[source.length-1], minV = target[0].value, minI = 0;
			for(var i=0; i<target.length; i++){
				var e = this.edges(true, [last.key, target[i].key]); //是否有边
				if(e && (last.value + 1) < target[i].value) target[i].value =  last.value + 1;
				if(minV > target[i].value){ minV = target[i].value, minI = i; }				
			}
			source.push(target[minI]);
			target.splice(minI, 1);
		}
		return source.reduce(function(a, b){ a[b.key] = b.value; return a; }, {});
	}	
	this.floyd = function(){
		if(cache_floyd.md5 == netmd5)return cache_floyd.data;	//缓存数据	
		/* 算法来源： */
		var bigNum = 9, l = get_nodes().length, mtx = new Array(l), _path = new Array(l), 
			onePath = __get_array(l, -1), n = {}, nx = {}, inx = 0, _tp = [-1, -1], paths = new Array(l);
		for(var i=0; i<l; i++){
			mtx[i] = __get_array(l, bigNum);	//默认最大值
			mtx[i][i] = 0;		//自身
			_path[i] = __get_array(l, -1);
		}
		edges.forEach(function(d){		//邻接矩阵
			for(var i=0; i<2; i++){
				if(n[d[i]] == undefined) nx[inx] = d[i] ;	//反向索引
				_tp[i] = n[d[i]] = n[d[i]] != undefined ? n[d[i]] : inx++;	//正向索引
			}
			mtx[_tp[0]][_tp[1]] = mtx[_tp[1]][_tp[0]] = __links[d[2]].weight;
		});
		var _length = __copy_array(mtx), sl = nodes.length, length = new Array(sl), spath = new Array(sl);
		for (var i = 0; i < l; i++)		//运行时数据索引最短距离矩阵
			for (var j = 0; j < l; j++)
				for (var k = 0; k < l; k++){
					if (_length[j][k] > _length[j][i] + _length[i][k]) {
						_length[j][k] = _length[j][i] + _length[i][k];	// 如果存在更短路径则取更短路径
						_path[j][k] = i;	// 把经过的点加入
					}
				}
		for(var i=0; i<sl; i++){	//nodes索引最短距离矩阵
			length[i] = __get_array(sl, bigNum);
			for(var j=0; j<sl; j++)
				if(n[i] != undefined && n[j] != undefined)length[i][j] = _length[n[i]][n[j]];
		}
		function _key2run(key){ return n[__nodes[key]]; }
		function _run2key(run){ return __nodex[nx[run]]; }
		function _view_path(begin, end, list){
			if(_path[begin][end]>=0){
				_view_path(begin, _path[begin][end], list);
				if(list != null)list.push(_run2key(_path[begin][end]));
		        _view_path(_path[begin][end], end, list);	
			}
		}
		for(var i=0; i<sl; i++){
			paths[i] = __get_array(sl, []);		
			for(var j=0; j<sl; j++){
				paths[i][j] = [];
				_view_path(n[i], n[j], paths[i][j]);
			}
		}
		/* 算法结束 */
		cache_floyd = {'md5':netmd5, 'data':{"length":length, "paths":paths} };
		return cache_floyd.data;
		console.log(length[_key2run("17")][_key2run("13")] );
		console.log(paths[__nodes["17"]][__nodes["1"]]);
		console.log(paths[__nodes["17"]][__nodes["34"]]);
	}
	this.connected_component = function(){
		if(cache_connected_component.md5 == netmd5)return cache_connected_component.data;	//缓存数据
		var nds = get_nodes(), cnn = {}, cncp = [];
		while(1){
			var i, stk=[], tp = [];	
			for(i=0; i<nds.length; i++)
				if(cnn[nds[i].key] == undefined)break;
			if(i == nds.length)break;
			stk = [nds[i].key]
			while(stk.length>0){
				var p = stk.pop();
				tp.push(p);
				nodes[__nodes[p]].lsChild.forEach(function(d){ 
					if(cnn[nodes[d].key] == undefined){
						cnn[nodes[d].key] = 1;
						stk.push(nodes[d].key); 
					}
				});
			}
			cncp.push(tp);
		}
		console.log(cncp);
	}
	this.label_propagation = function(){
		if(cache_label_propagation.md5 == netmd5)return cache_label_propagation.data;	//缓存数据	
		/* 算法来源： */
		var labels = this.labels, weight = this.weight, nds = get_nodes(), times = nodes.length + 1; //同值选取方案
		function _stop(_nds){
			for(var i=0; i<_nds.length; i++)
				if(_nds[i]._delete == 0 && _nds[i].label != _get_max_label(_nds[i].key))return 0;
			return 1;
		}
		function _get_max_label(node){	//node - key
			var lbs = nodes[__nodes[node]].lsChild.reduce(function(a, b){
				a[labels(b)] = a[labels(b)]!=undefined ? a[labels(b)]+= weight([__nodes[node], b]) : weight([__nodes[node], b]);
				return a;
			}, {});	
			var st = __items(lbs).sort(function(a, b){ return a[1] < b[1]; }),
				ft = st.filter(function(d, i){ return d[1]==st[0][1]; });
			return __keys(lbs).length == 0 ? null : ft[times++ % ft.length][0];// __get_rand(ft)[0];
		};
		while(_stop(nds) == 0)
			nds.forEach(function(d, i){ nds[i].label = _get_max_label(nds[i].key); });
		/* 算法结束 */
		cache_label_propagation = {'md5':netmd5, 'data': nds.reduce(function(a, b){ a[b.key] = b.label; return a; }, {})};
		return cache_label_propagation.data;
	}
	this.community_detection = this.label_propagation;
	this.get_graph_d3 = function(){
		var n = nodes.filter(function(d){ return 0==d._delete }),
			nd = n.reduce(function(a, b, i){ a[b.key] = i; return a }, {});	//防止删除节点
		return { "nodes":  n.map(function(d){
				return { "name":d.key, "group":d.label };	
			}), "links": edges.map(function(d){
			return { "source":nd[nodes[d[0]].key], "target":nd[nodes[d[1]].key], "value":__links[d[2]].weight };
		}) };
	}
	this.get_graph_echarts = function(labels){
		var index = 0, n = nodes.filter(function(d){ return 0==d._delete }),
			nd = n.reduce(function(a, b, i){ a[b.key] = i; return a }, {});	//防止删除节点
		var groups = n.reduce(function(a, b){ if(!a.hasOwnProperty(b.label))a[b.label]=index++ ; return a; }, {});
		return { "nodes":  n.map(function(d){
				return { "id":d.id, "name":labels?labels[d.key]:d.key, "category":groups[d.label],
					 "label":{normal:{show:true}}, "draggable":false}
			}), "links": edges.map(function(d){
				return { "source":nd[nodes[d[0]].key], "target":nd[nodes[d[1]].key], "lineStyle":{"normal":{}} };
			}), "groups": __keys(groups).map(function(d, i){ return {"name":"社团" + (i+1)}; })
		 };
	}
	this.draw = function(id, labels){
		
		var div=d3.select("#"+id), width=parseInt(div.style("width")), height=parseInt(div.style("height")),
			color = d3.scale.category10(), graph = this.get_graph_d3();
		var force = d3.layout.force().charge(-280).linkDistance(30).size([width, height]);
		var svg = d3.select("#" + id).append("svg").attr("width", width).attr("height", height);
		//cout(graph);
		force.nodes(graph.nodes).links(graph.links).start();
		
		var link = svg.selectAll(".link")
			.data(graph.links).enter().append("line").attr("class", "link")
			.style("stroke-width", function(d) { return Math.sqrt(d.value); })
			.style("stroke", "#999").style("stroke-opacity", .6);

		var node = svg.selectAll(".node")
			.data(graph.nodes).enter().append("circle")
			.style("stroke", "#fff").style("stroke-width", "1.5px").attr("r", 5)
			.style("fill", function(d) { return color(d.group); })
			.call(force.drag);
		
		node.append("title").text(function(d) { return !labels ? d.name : labels[d.name]; });
		force.on("tick", function() {
			link.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });
			node.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; });
		});
	};
	this.debug = function(){
		//cout(nodes);
		//cout(__nodes);
		//cout(nodes.map(function(d, i){ return [d.key, d.label] }))
		//cout();
		//cout(__keys(__nodes).length);	
		var a = new Array(2,3,4,5);
		var c = __copy_array(a);

	}
	var __array_remove = function(ls, v){
		var inx = ls.indexOf(v);
		if(inx != -1)ls.splice(inx, 1);
	}
	var __init_object = function(obj, value){
		for(var e in obj) obj[e] = value;
	}
	var __copy_object = function(obj){
		var nobj = {};
		for(var e in obj) nobj[e] = obj[e];
		return nobj
	}
	var __array_find = function(ls, callback){
		var i;
		for(i=0; i<ls.length; i++)if(callback(ls[i]))return i;
		return -1;
	}
	var __init_array = function(ary, value){
		for(var i=0; i<ary.length; i++)ary[i] = value;
	}
	var __get_array = function(length, value){
		var ary = new Array();
		for(var i=0; i<length; i++)ary.push(value);
		return ary;
	}
	var __copy_array = function(ary){
		var ls = new Array();
		ary.forEach(function(d){
			ls.push(typeof(d) == _object ? d.reduce(function(a, b){ a.push(b); return a; }, []) : d);
		});
		return ls;
	}
	var __keys = function(obj){
		var ls=[];
		for(var key in obj){ ls.push(key); }
		return ls;
	}
	var __items = function(obj){
		var ls=[];
		for(var key in obj){ ls.push([key, obj[key]]); }
		return ls;
	}
	var __get_rand = function(ary){
		return ary[Math.floor( Math.random() * ary.length )];
	}
	var __range = function(begin, end){
		var b = end == null ? 0 : begin,
			e=end == null ? begin : end, ls=[];
		for(var i=b; i<e; i++)ls.push(i);
		return ls;
	}
};


var ny = new networky();