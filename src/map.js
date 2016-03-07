angular.module('myMap', [])
  .factory('d3', function() {
    return d3;
  })

  .directive('worldMap', ['d3', function(d3) {

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
      var width   = 960,
          height  = 480,
          projection,
          path,
          svg,
          features,
          graticule,
          baseMapJson = '../data/countries_topo.json',
          countries,
          countrySet;

      projection = d3.geo.equirectangular()
        .scale(153)
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
            .attr('d', path);

          return set;
      }

    }
  }]);
