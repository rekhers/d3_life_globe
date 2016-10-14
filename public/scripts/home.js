$(document).ready(function(){
    globe();
});


function globe(){

    var start = Date.now(),
        speed = 1e-2;

    click_count = 0;

    var width = 600,
    height = 500;
    var projection = d3.geo.orthographic()
                        .scale(245)
                        .rotate([0,0])
                        .rotate([75, -20])
                        .translate([width / 2, height / 2])
                        .clipAngle(90)
                        .precision(.5);
    
    // projection.center([-97.767, 30.267]);


var path = d3.geo.path()
            .projection(projection);


var sphere = {type: "Sphere"};

var svg = d3.select("#globeDiv")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            // .attr("viewBox", "0 0 600 500")
            // .attr("preserveAspectRatio", "xMinYMin meet");

queue()
    .defer(d3.json, "https://raw.githubusercontent.com/rekhers/d3_maps/gh-pages/data/world-110m2.json")
    .defer(d3.tsv, "public/data/world-names.tsv")
    .defer(d3.json, "public/data/cities.json")
    .await(ready);



function ready(error, world, names, cities){


    var countries = topojson.feature(world, world.objects.countries).features,
        neighbors = topojson.neighbors(world.objects.countries.geometries);


  countriesWithNames = countries.filter(function(d) {
    return names.some(function(n) {
      if (d.id == n.id) return d.name = n.name;
    });
  }).sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });



    /*
    *   City Master List
    *
    */
    var cityList = ["Raleigh", "Austin", "London", "Seattle", "Washington"];
    var cityCoords = {"Amherst": {}};

    //we need to add amherst manually :)
    var amherst = {geometry: {coordinates: [-72.519854, 42.373222], type: "Point"}, type: "Feature", properties: {city: "Amherst", wikipedia: "Amherst,_Massachusetts"}, id: "Amherst"};

    cityCoords["Amherst"] = amherst;
    //make an object keyed by city name with corresponding coordinates
    for(var z = 0; z < cityList.length; z++){
        cityCoords[cityList[z]] = _.findWhere(cities.features, {id: cityList[z]});
    }


    console.log(cityCoords);


    //draw water
 var water = svg.append("path")
                  .datum({type: "Sphere"})
                  .attr("class", "water")
                  .attr("d", path);


    //draw countries
 var land = svg.selectAll("path.land")
                    .data(countries)
                    .enter()
                    .append("path")
                    .attr("class", "land")
                    .attr("d", path);


 //how we're going to add points 
  svg.insert("path")
    .datum({type: "Point", coordinates: [amherst.geometry.coordinates[0], amherst.geometry.coordinates[1]]})
    .attr("class", "points")
    .attr("d", path)
    .style("fill", "red")
    .attr("stroke-width", 25);

  

    d3.select("#listDiv").on("mouseover", function() {
    var US = _.findWhere(countriesWithNames, {name: "United States"});
    var UK = _.findWhere(countriesWithNames, {name: "United Kingdom"});

      var rotate = projection.rotate(),
      p = d3.geo.centroid(UK);

      // p = d3.geo.centroid([20, 20]);
      console.log(UK);

      svg.selectAll(".focused").classed("focused", focused = false);

    //Globe rotating

    (function transition() {
      d3.transition()
      .duration(3000)
      .tween("rotate", function() {
        var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
        return function(t) {
          projection.rotate(r(t));
          svg.selectAll("path").attr("d", path)
        };
      })
      })();
    });





}
}

