angular.module('myMap', [])
  .factory('d3', function() {
    return d3;
  })

  .directive('worldMap', ['d3', function(d3) {

    function draw(svg, data) {

      var hover = function(d) {
        var div = document.getElementById('tooltip');
        div.style.left = event.pageX + 'px';
        div.style.top = event.pageY + 'px';
        div.innerHTML = d.properties.name + '<br> ' + d3.format('%')(rateById.get(d.id)) + ' over weight';
        var selector = "#"+d.id;
        console.log(d3.selectAll(selector));
        d3.selectAll(selector)
          .classed('highlight', true);
        // console.log(d);
      };

      var reset = function(d) {
        var selector = "#"+d.id;
        d3.selectAll(selector)
          .classed('highlight', false);        
      }

      if (data) {
        console.log('draw function called with data defined');
        console.log(svg.selectAll('g .country'));

        var rateById = d3.map();
        var quantize = d3.scale.quantize()
          .domain([0, 0.9])
          .range(d3.range(5).map(function(i) { return 'q' + i + '-5'}));

        data.forEach(function(d) {
          rateById.set(d.location, parseFloat(d.mean));
        })

        // console.log(rateById);


        var countries = svg.selectAll('g .country')
          .attr('class', function(d) {
            return quantize(rateById.get(d.id)); })
          .attr('data-percent', function(d) {
            return rateById.get(d.id); })
          .on('mouseover', hover)
          .on('mouseleave', reset);

      } else {
        console.log('draw funtion called with no data');
      }
    }

    return {
      restrict: 'E',
      scope : {
        data: '=' // does this need to be '=?' ?
      },
      template:
      '<div class="map-wrapper">' +
        '<div class ="map"></div>' +
        '<div class="info"></div>' +
      '</div>',
      link: link
    };

    function link(scope, element, attrs) {

      var width   = 1152,
          height  = 576,
          projection,
          path,
          svg,
          features,
          graticule,
          baseMapJson = '../data/countries_topo.json',
          countries,
          countrySet;

      projection = d3.geo.equirectangular()
        .scale(180)
        .translate([width/2, height/2])
        .precision(0.1);

      path = d3.geo.path()
        .projection(projection);

      svg = d3.select(element[0]).select('.map')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      features = svg.append('g');

      features.append('path')
        .attr('class', 'background')
        .attr('d', path);

      d3.json(baseMapJson, function(error, world) {
        countries = topojson.feature(world, world.objects.countries).features;
        // console.log(countries);
        countrySet = drawFeatureSet('country', countries);

        var svg = d3.select('.map svg');

        svg.insert('path')
          .datum(topojson.mesh(world, world.objects.countries, function(a, b) {
            return a !== b;
          }))
          .attr('class', 'boundary')
          .attr('d', path);

        console.log('inside json callback...');
        console.log(d3.selectAll('.country'));

        scope.$watch('data', function(newVal, oldVal, scope) {
          var data = scope.data;
          draw(svg, data);
        }, true);
        scope.$digest();
      });

      function drawFeatureSet(className, featureSet) {

        var set = features.selectAll('.' + className)
          .data(featureSet)
          .enter()
          .append('g')
          .attr('class', className)
          .attr('data-name', function(d) {
            // console.log(d);
            return d.properties.name;
          })
          .attr('data-id', function(d) {
            return d.id;
          });

          set.append('path')
            .attr('class', 'land')
            .attr('d', path)
            .attr('id', function(d) { return d.id; });


          return set;
      } // end drawFeatureSet function

      // scope.$watch('data', function(newVal, oldVal, scope) {
      //   var data = scope.data;
      //   draw(svg, data);
      // }, true);
      //
    } // end link function
  }]);
