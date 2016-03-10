angular.module('myTreeMap', [])
  .factory('d3', function() {
    return d3;
  })

  .directive('treeMap', ['d3', function(d3) {

    function draw(color, div, width, height, data, treemap) {
      if (data) {
        console.log('drawing treemap...');

        var oWomen = (data.filter(function(d) {
          return d.sex_id==2;})[0].mean)*100;

        var oMen = (data.filter(function(d) {
          return d.sex_id==1;})[0].mean)*100;

        var tree = {
          name: "tree",
          children: [
            {name: "Overweight Women",
            size: oWomen},
            {name: "Overweight Men",
            size: oMen},
            {name: "Other Women",
            size: (100 - oWomen)},
            {name: "Other Men",
            size: (100 - oMen)}
          ]
        };
        console.log(tree);



        console.log(treemap.nodes);

        var node = div.datum(tree).selectAll(".node")
              .data(treemap.nodes);

            node.exit().remove();

            node.enter().append("div")
              .attr("class", "node");

            node
              .call(position)
              .style("background-color", function(d) {
                  return d.name == 'tree' ? '#fff' : color(d.name); })
              // .append('div')
              .style("font-size", function(d) {
                  // compute font size based on sqrt(area)
                  return Math.max(20, 0.18*Math.sqrt(d.area))+'px'; })
              .text(function(d) { return d.children ? null : d.name; });



        function position() {
          this.style("left", function(d) { console.log(d.x); return d.x + "px"; })
              .style("top", function(d) { return d.y + "px"; })
              .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
              .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
              }
      }
    }

    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template:
      '<div class="tree-map-wrapper">' +
        '<div class="treeMap"></div>' +
      '</div>',
      link: link
    };

    function link(scope, element, attrs) {

      var margin = {top: 20, left: 40, right: 20, bottom: 40},
        width = 300 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

      var color = d3.scale.category10();
      var div = d3.select('.treeMap').append('div').style('position', 'relative');

      var treemap = d3.layout.treemap()
          .size([width, height])
          // .sticky(true)
          .value(function(d) { return d.size; });

      scope.$watch('data', function(newVal, oldVal, scope) {
        var data = scope.data;
        draw(color, div, width, height, data, treemap);
      }, true);

    } // end link funciton

  }]);
