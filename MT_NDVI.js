/*----------------------------------------------------------------------------*/
//A1 = Fusion Table of Merged County Geometry and Census Data with County KML and US County Census Data 2010
//A2 = Landsat 9 Image Collection
//B2 = Landsat 7 image Collection
// Section 1
var A2 = A1.filterMetadata('StateName', 'equals', 'Montana')

//Montana Counties
var A3 = [[30001,	"Beaverhead"],
          [30003,	"Big Horn"],
          [30005,	"Blaine"],
          [30007,	"Broadwater"],
          [30009,	"Carbon"],
          [30011,	"Carter"],
          [30013,	"Cascade"],
          [30015,	"Chouteau"],
          [30017,	"Custer"],
          [30019,	"Daniels"],
          [30021,	"Dawson"],
          [30023,	"Deer Lodge"],
          [30025,	"Fallon"],
          [30027,	"Fergus"],
          [30029,	"Flathead"],
          [30031,	"Gallatin"],
          [30033,	"Garfield"],
          [30035,	"Glacier"],
          [30037,	"Golden Valley"],
          [30039,	"Granite"],
          [30041,	"Hill"],
          [30043,	"Jefferson"],
          [30045,	"Judith Basin"],
          [30047,	"Lake"],
          [30049,	"Lewis and Clark"],
          [30051,	"Liberty"],
          [30053,	"Lincoln"],
          [30055,	"McCone"],
          [30057,	"Madison"],
          [30059,	"Meagher"],
          [30061,	"Mineral"],
          [30063,	"Missoula"],
          [30065,	"Musselshell"],
          [30067,	"Park"],
          [30069,	"Petroleum"],
          [30071,	"Phillips"],
          [30073,	"Pondera"],
          [30075,	"Powder River"],
          [30077,	"Powell"],
          [30079,	"Prairie"],
          [30081,	"Ravalli"],
          [30083,	"Richland"],
          [30085,	"Roosevelt"],
          [30087,	"Rosebud"],
          [30089,	"Sanders"],
          [30091,	"Sheridan"],
          [30093,	"Silver Bow"],
          [30095,	"Stillwater"],
          [30097,	"Sweet Grass"],
          [30099,	"Teton"],
          [30101,	"Toole"],
          [30103,	"Treasure"],
          [30105,	"Valley"],
          [30107,	"Wheatland"],
          [30109,	"Wibaux"],
          [30111,	"Yellowstone"],
          [30113,	"Yellowstone Nat Park"]];


var A4 = ee.FeatureCollection(A3.map(function(x){
  var foo = x[0];
  var bar = ee.Feature(A2.filter(ee.Filter.eq('FIPS', foo)).first());
  return bar.set({'countyName': x[1]});
}));

Map.addLayer(A4)

/*----------------------------------------------------------------------------*/
// Section 2

//Adding two landsat datasets

var B1_func = function(img){
  var foo = img.normalizedDifference(['B5', 'B4']).toFloat();
  var bar = img.select(['pixel_qa']);
  return foo.addBands(bar)
          .select([0,1], ['ndvi', 'pixel_qa'])
          .copyProperties(img, ['system:time_start']);
  };


var B2_func = function(img){
  var foo = img.normalizedDifference(['B4', 'B3']).toFloat();
  var bar = img.select(['pixel_qa']);
  return foo.addBands(bar)
          .select([0,1], ['ndvi', 'pixel_qa'])
          .copyProperties(img, ['system:time_start']);
  };


// Mask Landsat surface reflectance images
// Creates a mask for clear pixels 
var Cfmask = function(img){
  var quality =img.select(['pixel_qa']);
  var clear = quality.bitwiseAnd(8).eq(0) // cloud shadow
                .and(quality.bitwiseAnd(32).eq(0) // cloud
                .and(quality.bitwiseAnd(4).eq(0) // water
                .and(quality.bitwiseAnd(16).eq(0)))); // snow
  return img.updateMask(clear).select(0)                                    
            .copyProperties(img, ['system:time_start']);
};

var B1_A = B1.map(B1_func)
                .map(Cfmask);

var B2_A = B2.map(B2_func)
                .map(Cfmask); 


var B3 = ee.ImageCollection(B1_A.merge(B2_A));


// /*----------------------------------------------------------------------------*/
// Section 3
var C1 = ['2013', '2014', '2015', '2016', '2017'];


var C2 = ee.Reducer.mean().combine({
  reducer2: ee.Reducer.stdDev(),
  sharedInputs: true
  });


// /*----------------------------------------------------------------------------*/
// Section 4

var E1 = ee.FeatureCollection(C1.map(function(y){
  var foo = ee.FeatureCollection(A4.map(function(f){
    var bar1 = y + '-05-01';
    var bar2 = y + '-08-01';
    var temp1 = B3.filterBounds(f.geometry()).filterDate(bar1, bar2).mean();
    var temp2 = f.get('countyName')
    var temp3 = temp1.reduceRegion({
      reducer: C2,
      geometry: f.geometry(),
      scale: 30,
      crs: "EPSG:4326",
      maxPixels: 1e13
    });
    
    var temp4 = temp3.get('ndvi_mean')
    var temp5 = temp3.get('ndvi_stdDev')
    
    return ee.Feature(null, ({'County': temp2,
                              'year' : y,
                              'ndvi_mean': temp4,
                              'ndvi_stdDev': temp5
    }));
  }))
    
  return foo
  
})).flatten();



/*----------------------------------------------------------------------------*/
// Section 5


Export.table.toDrive({
  collection: E1,
  fileNamePrefix: "exportTable", 
  description: "exported table", 
  folder: ''
  
});
