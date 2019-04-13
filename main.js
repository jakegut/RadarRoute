const getTimestamps = async () => {
    var response = await fetch('https://tilecache.rainviewer.com/api/maps.json');
    var json = await response.json();
    var r = [];
    for(var i = 0; i < json.length; i++){
        r[i] = String(`https://tilecache.rainviewer.com/v2/{type}/${json[i]}/{size}/{z}/{x}/{y}.png?color={color}`)
    }
    return r;
}

var mymap = L.map('mapid').setView([30.6333, -97.6780], 9);
var timeArr;
getTimestamps().then(result => timeArr = result);
var radarLayer;
console.log(timeArr);

async function generateRadarUrl(index){
    if(timeArr === undefined){
        getTimestamps().then(result => timeArr = result);
    }
    console.log(`https://tilecache.rainviewer.com/v2/{type}/${timeArr[index]}/{size}/{z}/{x}/{y}.png?color={color}`);
    return `https://tilecache.rainviewer.com/v2/{type}/${ timeArr[index] }/{size}/{z}/{x}/{y}.png?color={color}`;
    
}

async function makeRadar(layer){
    timeStamps = await getTimestamps();
    layer.setUrl(`https://tilecache.rainviewer.com/v2/{type}/${ timeStamps[timeStamps.length - 1] }/{size}/{z}/{x}/{y}.png?color={color}`)
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiYm9yZ2R1ZGUiLCJhIjoiY2puOGVuemh6MWNxNDNxbnZ3YzQ0YjNpZyJ9.VaJs5Z8DbmAr_07rx1UEqA'
}).addTo(mymap);

radarLayer = L.tileLayer(`https://tilecache.rainviewer.com/v2/{type}/1554594000/{size}/{z}/{x}/{y}.png?color={color}`,{
    attribution: 'Imagery © <a href="https://www.openweathermap.org/">OpenWeather</a>',
    type: 'radar',
    size: 512,
    opacity: 0.5,
    color: 4
});
radarLayer.addTo(mymap);
makeRadar(radarLayer);

// setTimeout(function(){
    
//     radarLayer.addTo(mymap)
//     var i = 0;
//     setInterval(function(){
//         radarLayer.setUrl(timeArr[i++]);
//         if(i >= 18)
//             i = 0;
//     }, 300);
// }, 1000);

L.Routing.control({
    waypoints: [

    ],
    routeWhileDragging: true,
    geocoder: L.Control.Geocoder.nominatim()
}).addTo(mymap);

