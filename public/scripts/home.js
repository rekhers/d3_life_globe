$(document).ready(function(){


/*
* 
* TODO: convert to react class and store global variables in state 
*
*/
   start = Date.now(),
      speed = 1e-2,
      width = 600,
      height = 500,
      projection = d3.geo.orthographic()
                        .scale(245)
                        .rotate([0,0])
                        .rotate([75, -20])
                        .translate([width / 2, height / 2])
                        .clipAngle(90)
                        .precision(.5);
    
 path = d3.geo.path()
            .projection(projection);

 svg = d3.select("#globeDiv")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", "0 0 600 500")
            .attr("preserveAspectRatio", "xMinYMin meet");
            queueData();
});



//loads necessary shapefiles before building globe
function queueData(){
    queue()
        .defer(d3.json, "https://raw.githubusercontent.com/rekhers/d3_maps/gh-pages/data/world-110m2.json")
        .defer(d3.tsv, "public/data/world-names.tsv")
        .defer(d3.json, "public/data/cities.json")
        .await(ready)

}



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
    var cityList = ["Raleigh", "Austin", "London",  "Seattle", "Washington"];
    var cityCoords = {"Amherst": {}};

    //we need to add amherst manually :)
    var amherst = {geometry: {coordinates: [-72.519854, 42.373222], type: "Point"}, type: "Feature", properties: {city: "Amherst", wikipedia: "Amherst,_Massachusetts"}, id: "Amherst"};

    cityCoords["Amherst"] = amherst;
    //make an object keyed by city name with corresponding coordinates
    for(var z = 0; z < cityList.length; z++){
        cityCoords[cityList[z]] = _.findWhere(cities.features, {id: cityList[z]});
    }

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


    //after we build the city coordinate data to feed to the globe, set up the hover event
    hover(cityCoords);

}






function hover(cityCoords){

$("#listDiv div").hover(function() {

  if(currCity){
    var lastCity = currCity;
  }
    var currCity = $(this).attr('data-id');

    //for London
    var UK = _.findWhere(countriesWithNames, {name: "United Kingdom"});
    //for all the rest 
    var US = _.findWhere(countriesWithNames, {name: "United States"});

    var india = _.findWhere(countriesWithNames, {name: "India"});

    var france = _.findWhere(countriesWithNames, {name: "France"});



    $(".points").remove();

    if (currCity == "Hyderabad"){
      var p = d3.geo.centroid(india);
    } else if(currCity == "Paris"){
      var p = d3.geo.centroid(france);
    }else if(currCity == "London"){
      var p = d3.geo.centroid(UK);
    } else {
      var p = d3.geo.centroid(US);
    }



 //how we're going to add points 
  svg.append("path")
    .datum({type: "Point", coordinates: [cityCoords[currCity].geometry.coordinates[0], cityCoords[currCity].geometry.coordinates[1]]})
    .attr("class", "points")
    .attr("d", path)
    .style("fill", "red")
    .attr("stroke-width", 25);



  var plane = svg.append("path")
                   .attr("class", "plane")
                   .attr("d", "m25.21488,3.93375c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0z");


console.log(cityCoords);

svg.append("path")
      .datum({type: "LineString", coordinates: 
        [[-97, 30], [-0.117, 51.5]] // points in decimal degrees
             })
      .attr("d", path)
      .style({'fill': '#B10000', 'fill-opacity': 0.3})
      .style({'stroke-width': 2, 'stroke': '#B10000', 'stroke-linejoin': 'round'});




if(lastCity){

    svg.append("path")
    .datum({type: "Point", coordinates: [cityCoords[lastCity].geometry.coordinates[0], cityCoords[lastCity].geometry.coordinates[1]]})
    .attr("class", "points")
    .attr("d", path)
    .style("fill", "red")
    .attr("stroke-width", 25);


  


}
    var rotate = projection.rotate();

    //Globe rotating
    (function transition() {
      d3.transition()
      .duration(2000)
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
