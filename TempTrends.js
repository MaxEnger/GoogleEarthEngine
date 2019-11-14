//Image Collection
var gridmet = ee.ImageCollection("IDAHO_EPSCOR/GRIDMET");
print(gridmet.first());

var temp = gridmet.select(['tmmn', 'tmmx']);
print(temp.size());

temp = temp.map(function(img){
  var tempF = img.multiply(9/5).subtract(459.67);
   return tempF.copyProperties(img, ['sysem:time_start']);
 })
print(temp.first())

var summerTemp = temp.filter(ee.Filter.calendarRange(6,8,'month'));
var winterTemp = temp.filter(ee.Filter.calendarRange(1,3,'month'));

//List of years: From, TO, BY
var years = ee.List.sequence(1979,2017,1);
print(years)

//converting y to a number, a integer number than converted that to a string 
var yearlyAvg = ee.ImageCollection(years.map(function(y){
   var yr = ee.String(ee.Number(y).int());
   var d1 = ee.Date.parse('YYYY', yr);
   var d2 = d1.advance(1, 'year');
  
var winter = winterTemp.filterDate(d1, d2).select('tmmn').mean();
var summer = summerTemp.filterDate(d1, d2).select('tmmx').mean();
  
var yrTemp = winter.addBands(summer)
                     .rename(['winter', 'summer'])
                     .set('year', d1)
                     .set('system:time_start', d1.millis());
     return yrTemp
 }));

print(yearlyAvg);
Map.addLayer(yearlyAvg);

var winterTrend = yearlyAvg.select('winter')
                           .formaTrend();

Map.addLayer(winterTrend.select('long-trend'),
               {min: -0.1, max:0.1,
               palette:['blue', 'white', 'red']},
               'winterTrend', true);







