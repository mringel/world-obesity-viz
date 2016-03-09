angular.module('myChart', [])
  .factory('d3', function() {
    return d3;
  })

  .directive('barChart', ['d3', function(d3) {

    function draw(svg, x, xAxis, y, yAxis, data) {
      if (data) {

        var margin = {top: 20, left: 20, right: 20, bottom: 20},
          width = 1152 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

        var plotData = data.map(function(d) {
          return {x: d.location_name, y: +d.mean};
        });

        x.domain(plotData.map(function(d) {return d.x;}));
        y.domain([0, d3.max(plotData, function(d) { return d.y})])

        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0, '+ height + ')')
          .call(xAxis)

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
          .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Percent Overwight');

        svg.selectAll('.bar')
            .data(plotData)
          .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) { return x(d.x); })
            .attr('width', x.rangeBand())
            .attr('y', function(d) { return y(d.y); })
            .attr('height', function(d) { return height - y(d.y); });

      }
    }

    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template:
      '<div class="chart-wrapper">' +
        '<div class="barChart"></div>' +
      '</div>',
      link: link
    };

    function link(scope, element, attrs) {

      var margin = {top: 20, left: 20, right: 20, bottom: 20},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(10, '%');

      var svg = d3.select('.barChart').append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      scope.$watch('data', function(newVal, oldVal, scope) {
        var data = scope.data;
        draw(svg, x, xAxis, y, yAxis, data);
      }, true);



    }

  }]);
