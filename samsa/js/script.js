$(document).ready(function(){

    $("#city-spots").fadeToggle();

    $("#city-spots-btn").on('click', e => {
        $("#spots").fadeToggle();
        $("#city-spots").fadeToggle();
        $("#city-spots-btn").addClass("current-spots");
        $("#campus-spots-btn").removeClass("current-spots");
    });
    $("#campus-spots-btn").on('click', e => {
        $("#spots").fadeToggle();
        $("#city-spots").fadeToggle();
        $("#city-spots-btn").removeClass("current-spots");
        $("#campus-spots-btn").addClass("current-spots");
    });
    var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
    var mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

    var streets = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    var map = L.map('map', {
        center: [-25.956694, 32.599225],
        zoom: 15,
        layers: [osm]
    });

    var baseLayers = {
        'OpenStreetMap': osm,
        'Streets': streets
    };
    var campusAndCityPopups = L.markerClusterGroup();
    var layerControl = L.control.layers(baseLayers).addTo(map);
    L.control.locate({position: 'topright'}).addTo(map);
    
    var satellite = L.tileLayer(mbUrl, {id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
    layerControl.addBaseLayer(satellite, 'Satellite');
    

    $("#gallery").on('click', e => {
        var latLong = [-25.952401, 32.602626];
        var spotName = 'Art Gallery';
        var img = 'galeria de arte.PNG';
        var popup = L.responsivePopup().setContent(
            `<div class="popup-text">
            <img src="img/thumbnails/${img}"  width = "300"/><br>
            <b>${spotName}</b>
            </div>
            `
        );
        campusAndCityPopups.clearLayers();
        var marker = L.marker(latLong).bindPopup(popup);
        campusAndCityPopups.addLayer(marker).addTo(map);
        map.flyTo(latLong, 13 * 1.25, {animate: true});
    });
    $("#space").on('click', e => {
        var latLong = [-25.951572, 32.600813];
        var spotName = 'Eduardo Mondlane Space';
        var img = 'espaco em.PNG';
        mapFly(img, spotName, latLong);
    });
    $("#aquino").on('click', e => {
        var latLong = [-25.951832, 32.600856];
        var spotName = '<b>Aquiço de Bragança Space</b>';
        var img = 'espaco aquino.PNG';
        mapFly(img, spotName, latLong);
    });
    $("#memorial").on('click', e => {
        var latLong = [-25.949806, 32.600352];
        var spotName = '<b>Memorial (1/05/1976)</b>';
        var img = 'memorial.PNG';
        mapFly(img, spotName, latLong);
    });
    $("#wall1").on('click', e => {
        var latLong = [-25.950289, 32.601328];
        var spotName = '<b>Bento Mukeswane and Ciro Wall</b>';
        var img = 'mural bento.PNG';
        mapFly(img, spotName, latLong);
    });
    $("#wall2").on('click', e => {
        var latLong = [-25.950047, 32.601714];
        var spotName = '<b>Malangatana Wall</b>';
        var img = 'mural malangatana.PNG';
        mapFly(img, spotName, latLong);
    });
    $("#press").on('click', e => {
        var latLong = [-25.950588, 32.601832];
        var spotName = '<b>Press Space</b>';
        var img = 'espaco imprensa.PNG';
        mapFly(img, spotName, latLong);
    });
    $("#garden").on('click', e => {
        var latLong = [-25.952353, 32.604568];
        var spotName = '<b>Botanical Garden</b>';
        var img = 'jardim botanico.PNG';
        mapFly(img, spotName, latLong);
    });
    $("#mpm").on('click', e => {
        var latLong = [-25.905942, 32.582617];
        var spotName = '<b>Maputo International Airport</b>';
        var img = 'mpm.jpg';
        mapFly(img, spotName, latLong);
    });
    $("#cfm").on('click', e => {
        var latLong = [-25.97101, 32.56447];
        var spotName = '<b>Maputo Railway Station</b>';
        var img = 'cfm.jpg';
        mapFly(img, spotName, latLong);
    });
    $("#fortress").on('click', e => {
        var latLong = [-25.97480, 32.57053];
        var spotName = '<b>Fortress of Maputo</b>';
        var img = 'fortress.jpg';
        mapFly(img, spotName, latLong);
    });

    $("#stayeasy").on('click', e => {
        var latLong = [-25.94449, 32.62026];
        var spotName = `<b>Stayeasy - Maputo</b><br>Address: 151 Avenida Da Marginal, Maputo, Maputo, Mozambique<br>
        Email: semaputo.reservations@southernsun.com<br>Contact: +258 20 607030<br>
        <b>6175 MZN Standard</b><br>
        <a href="https://www.southernsun.com/stayeasy-maputo/contact-us">Book</a>`;
        var img = 'stayeasy.jpg';
        mapFly(img, spotName, latLong);
    });

    $("#resotel").on('click', e => {
        var latLong = [-25.96423, 32.57535];
        var spotName = `<b>Resotel - Maputo</b><br>
        Address: 1304 Av. Karl Marx, 1304 Maputo Mozambique<br>
        Email: info@resotel.co.mz, reservas@resotel.co.mz, admin@resotel.co.mz<br>
        Contact: +258 87 039 4786, +258 82 224 76 43, +258 84 560 44 76, +258 84 590 03 69<br>
        <b>5500 MZN Standard</b><br>
        <a href="mailto:reservas@resotel.co.mz">Book</a>
        `;
        var img = 'resotel.jpg';
        mapFly(img, spotName, latLong);
    });//-25.9440555555556, 32.6093055555556

    $("#citylodge").on('click', e => {
        var latLong = [-25.9440555555556, 32.6093055555556];
        var spotName = `<b>City Lodge - Maputo, Mozambique</b><br>Contact: +258 83 301 3652<br>
        <b>6175 MZN Standard</b><br>
        <a href="https://clhg.com/hotels/830/City-Lodge-Hotel-Maputo-Mozambique#book_a_hotel" target="_blank">Book</a>
        `;
        var img = 'citylodge.jpg';
        mapFly(img, spotName, latLong);
    });
    $("#gloriahotel").on('click', e => {
        var latLong = [-25.955035, 32.608366];
        var spotName = `<b>Gloria Hotel - Maputo, Mozambique</b><br>Address: Av. Marginal No.4441 , 1102 Maputo, Moçambique<br>Email: res.ggmpmb@gloriahotels.com<br>Contact: +258 21266676<br>
        <b>6300 MZN Standard</b><br>
        <a href="http://gloriahotel.co.mz/booking" target="_blank">Book</a>
        `;
        var img = 'gloriahotel.jpg';
        mapFly(img, spotName, latLong);
    });

    $("#museu").on('click', e => {
        var popup = L.responsivePopup().setContent(
            `<div class="popup-text">
            <img src="img/thumbnails/museu_historia_natural.jpg"  width = "300"/><br>
            <b>Natural History Museum</b>
            </div>
            `
        );
        campusAndCityPopups.clearLayers();
        var marker = L.marker([-25.977114, 32.587112]).bindPopup(popup);
        campusAndCityPopups.addLayer(marker).addTo(map);
        map.flyTo([-25.977114, 32.587112], 13 * 1.25, {animate: true});
    });

    $("#maputo-hotel").on('click', e => {
        var popup = L.responsivePopup().setContent(
            `<div class="popup-text">
            <img src="img/thumbnails/maputo-hotel.jpg"  width = "300"/><br>
            <b>Hotel Maputo</b><br>
            Address:<br>
            Avenida Ho Chi Min, 110, Central B, Maputo<br><br>
            <b>3500 MZN Double Room</b><br>   
            <b>3000 MZN Single Room</b><br>
            <a target="_blank" href="https://www.booking.com/hotel/mz/maputo.pt-pt.html">Book</a>
            </div>
            `
        );
        campusAndCityPopups.clearLayers();
        var marker = L.marker([-25.969193, 32.57607]).bindPopup(popup).addTo(map);
        campusAndCityPopups.addLayer(marker).addTo(map);
        map.flyTo([-25.969193, 32.57607], 13 * 1.25, {animate: true});
    });
    function mapFly(img, spotName, latLong){
        var popup = L.responsivePopup().setContent(
            `<div class="popup-text">
            <img src="img/thumbnails/${img}"  width = "300"/><br>
            ${spotName}
            </div>
            `
        );
        campusAndCityPopups.clearLayers();
        var marker = L.marker(latLong).bindPopup(popup);
        campusAndCityPopups.addLayer(marker).addTo(map);
        map.flyTo(latLong, 13 * 1.25, {animate: true});
    }
});