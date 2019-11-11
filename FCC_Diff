//Adjust The Bands to: B3, B2, B1 and Stretch 1 = True Color Composite
var ls5 = ee.Image('LANDSAT/LT05/C01/T1_SR/LT05_114079_19860823')
  .select(['B4', 'B3', 'B2']);
Map.addLayer(ls5,{min: 0, max: 3000, gamma:[0.95, 1.1, 1] }, 'false color composite');

var ls8 = ee.Image('LANDSAT/LC08/C01/T1_SR/LC08_114079_20160825')
  .select(['B5', 'B4', 'B3']);
Map.addLayer(ls8, {min:0, max: 2000, gamma: [0.95, 1.1, 1]}, 'false color composite');

// Compute the multi-band difference image.
var FCdiff = ls5.subtract(ls8);
Map.addLayer(diff,{bands: ['B5', 'B4', 'B3'], min: -32, max: 32},'difference');

Map.addLayer(FCdiff, {min: 0, max:3000, gamma: [0.95, 1.1, 1]}, 'false color composite');
