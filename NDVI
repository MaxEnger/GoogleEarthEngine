// Landsat 5 image
var ls5 = ee.Image('LANDSAT/LT05/C01/T1_SR/LT05_114079_19860823')
var ndvi5 = ls5.normalizedDifference(['B4', 'B3']);

// Display the NDVI image - Use a grayscale stretch for display
Map.addLayer(ndvi,{min: -0.2, max:0.5, palette: ['FFFFFF', '339900']},"NDVI");


// Landsat 8 image
var ls8 = ee.Image('LANDSAT/LC08/C01/T1_SR/LC08_114079_20160825');
var ndvi8 = ls8.normalizedDifference(['B5', 'B4']);

// Display the NDVI image - Use a grayscale stretch for display
Map.addLayer(ndvi8,{min: -0.2, max:0.5, palette: ['FFFFFF', '339900']},"NDVI");

//Calculating the Difference
//Compute the multi-band difference image.
var diff = ndvi8.subtract(ndvi5);
Map.addLayer(diff,{bands: ['B5', 'B4', 'B3'], min: -32, max: 32},'difference');
Map.addLayer(diff, {min: -0.2, max:0.5, palette: ['FFFFFF', '339900']},"NDVI");

var geom = ee.Geometry.Point(115.27473449707031,-27.833307704783945);
//Create and print the chart.
//Create an MODIS NDVI chart.
var ndviChart = ui.Chart.image.series(diff, point, ee.Reducer.mean(), 30);
print(ndviChart);
 
