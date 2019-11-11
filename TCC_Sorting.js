//Collecting a Landsat 5 image from collection by a point 
var spatialFiltered = l5.filterBounds(point);
print('spatialFiltered', spatialFiltered);
Map.addLayer(spatialFiltered)


var temporalFiltered = spatialFiltered.filterDate('1986-08-23', '1986-08-24');
print('temporalFiltered', temporalFiltered);
Map.addLayer(temporalFiltered);

//This will sort from least to most cloudy.
var sorted = temporalFiltered.sort('CLOUD_COVER');

//Get the first (least cloudy) image.
var scene = ee.Image(sorted.first());

//True Color Composite
Map.centerObject(scene, 9);
Map.addLayer(scene, {}, 'default RGB');
var visParams = {bands: ['B3', 'B2', 'B1'], max: 8000};
Map.addLayer(scene, visParams, 'true-color composite');
