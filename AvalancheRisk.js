/*----------------------------------------------------------------------------------------*/
//Section 1:Data Import
var ned = ee.Image("USGS/NED"),
roads = ee.FeatureCollection("TIGER/2016/Roads");
var states = ee.FeatureCollection('ft:1fRY18cjsHzDgGiJiS2nnpUU3v9JPDc2HNaR7Xk8');

var mt = states.filter(ee.Filter.eq('Name', 'Montana'));
Map.addLayer(mt);

var mainSt =roads.filterBounds(mt).filterMetadata('fullname', 'contains', 'Main St');
Map.addLayer(mainSt);

var mtRoads =roads.filterBounds(mt);

//Shaded Relief: Create Hillshade from DEM
var hs = ee.Terrain.hillshade(ned);
Map.addLayer(hs);

//clip mt makes adjusts it to the state of mt
//.clip(mt);
var nedFt = ned.multiply(3.28084); 

//or ned = ned.clip(mt);
Map.addLayer(ned);
Map.addLayer(nedFt);

//Creates color ramp of elevations 
Map.addLayer(nedFt, {min: 0, 
                    max: 15000, 
                    palette:['green', 'brown', 'grey', 'white']},
                    'colorRamp', true, 0.5);


//Avalanche Risk Mapping

//Slope: >30 and <55
//Aspect: >330 OR <30
var slope = ee.Terrain.slope(nedFt);
var aspect = ee.Terrain.aspect(nedFt);
Map.addLayer(slope);
Map.addLayer(aspect);

//Risk: (GTE = greather than or equal to), (LTE = less than or equal to)
var slopeRisk = slope.gte(30).and(slope.lte(55));
var aspectRisk = aspect.gte(330).or(aspect.lte(30));
var risk = slopeRisk.multiply(aspectRisk);

Map.addLayer(risk.updateMask(risk), {min:1, max:1, palette: ['black']});

var roadDist = mtRoads.distance().lte(100);
var roadRisk = risk.updateMask(roadDist);
Map.addLayer(roadRisk, {min:1, max:1, palette: ['red']});
