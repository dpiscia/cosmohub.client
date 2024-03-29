'use strict';

/* Directives */


angular.module('d3Pie', ['d3'])
.directive('d3Pie', ['d3',function(d3) {
  // data should contain name(stirng)  variable and count (integer ) value
	return {
		restrict: 'EA',
		scope: {data: '=data',
				type: '=type',
				updateFn: '&',
				filter:'=filter',
				},
		link: function(scope, element, attrs){
			scope.w = 300;
			scope.h = 300;
			var data_raw = []
			
			//define variable name mapping 
			var status = 'name';
			//define variable number mapping
			var data = 'nbr';
			var svg = d3.select(element[0])
				.append("svg")
				.attr("width", scope.w +40)
				.attr("height", scope.h);

			scope.$watch(
				'data', 
				function(){
					return scope.render();
				}, true);
// define render function
			
			scope.render = function(){
				svg.selectAll('g.legend').remove();
				svg.selectAll('g.state').remove();
				svg.selectAll(".arc").remove(); 
				console.log("pie chart");
				var radius  =100;
				var data_mod = scope.data;

				
				radius = Math.min(scope.w, scope.h) / 2;
				var color = d3.scale.category20();
				
				var arc = d3.svg.arc()
    				.innerRadius(40)
    				.outerRadius(90);

				var pie = d3.layout.pie()
				    .sort(null)
				    .value(function(d) { return d[data]; });
      
				data_mod.forEach(function(d) {
				    d[data] = +d[data];
				    
				  });

  				/*var legend = svg.selectAll('g').data(pie(data_mod)).enter().append('g').attr('class', 'legend').attr("transform", "translate(0 ,20 )");
				legend.append('rect')
					.attr('x', function(d, i){ return i *  70;})
					.attr('y', 300)
					.attr('width', 10)
					.attr('height', 10)
					.style('fill', function(d) { if (d.data.access == false) return "#8F8F8F";
					  else return color(d.data[status]);
					});

				legend.append('text')
					.attr('x', function(d, i){ return (i *  70) + 19;})
					.attr('y', 310)
					.text(function(d)
					{ return d.data[status]+" "+d.data[data]; });
        
        		*/
				var g = svg.selectAll(".arc")
					.data(pie(data_mod));
				g.exit().remove();
				g.enter().append("g")
					.attr("transform", "translate(180 ,120 )")
					.attr("class", "arc")


				var path = g.append("path")
					.attr("d", arc)
					.style("fill",  function(d) { if (d.data.access == false) return "#8F8F8F";
						else return color(d.data[status]);
						})
					.style("cursor", "pointer")
					.each(function(d) { this._current = d; })
										.on("click", function(d) 
						{ if (d.data.access != false) {
							scope.updateFn({'type': scope.type ,'name' : d.data.name} )} }); // redraw the arcs
   
				g.append("text")
					.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
					.attr("dy", ".35em")
					.style("text-anchor", "middle")
					.style("cursor", "pointer")
					.on("click", function(d) 
						{ if (d.data.access != false) {
							scope.updateFn({'type': scope.type ,'name' : d.data.name} )} })
					.text(function(d) { 
						if (d.data['meta'] != null) return d.data['meta'] 
							else return d.data[status]; });
				};

		}
	};     
}]);