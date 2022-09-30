$(document).ready(function(){

	var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

	var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox/light-v11', attribution: mbAttr}),
		streets  = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
	var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
	});
	var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});
	var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});

	var myStyle = {
	"fillColor": "#fff",
	"fillOpacity": 0.6,
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
	};

	var districtStyle = {"color":"#000", "weight": 0.5,
	"opacity": 0.5, "fillColor": "#fff","fillOpacity": 0.0};//color: #4287f5

	var distritctLayer, volunteersLayer, infoAgencies = `<div class="info"><b>Volunteers by agency</b><br>`,
	quickSummary = `<div class="info"><b>Quick Summary</b><br>`, infoDistricts = `<div class="info"><b>Volunteers by district</b><br>`;

	var geojsonMarkerOptions = {
		radius: 8,
		fillColor: "#ff7800",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	};

	var customIcon = L.icon({
		iconUrl: 'image/icons/icon1.svg',
		//shadowUrl: 'leaf-shadow.png',

		iconSize:     [24, 24], // size of the icon
		//shadowSize:   [50, 64], // size of the shadow
		iconAnchor:   [8, 8], // point of the icon which will correspond to marker's location
		//shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor:  [0, -8] // point from which the popup should open relative to the iconAnchor
	});

	function volunteerOnEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.district && 
			feature.properties.province && 
			feature.properties.volunteer && 
			feature.properties.agency && 
			feature.properties.photo) {
            layer.bindPopup(`
			<div id="popup-container">
				<div>
					<img src="${feature.properties.photo}" class="popup-img"/>
				</div>
				<div id="details">
					<table>
						<tr>
							<th>Name</th>
						</tr>
						<tr>
							<td>${feature.properties.volunteer}</td>
						</tr>
						<tr>
							<th>Agency</th>
						</tr>
						<tr>
							<td>${feature.properties.agency}</td>
						</tr>
						<tr>
							<th>District</th>
						</tr>
						<tr>
							<td>${feature.properties.district}</td>
						</tr>
						<tr>
							<th>Province</th>
						</tr>
						<tr>
							<td>${feature.properties.province}</td>
						</tr>
					</table>
				</div>
			</div>
			`);
        }else{
			console.log('error');
		}
    }
	volunteersLayer = L.geoJSON(volunteers, {onEachFeature: volunteerOnEachFeature,
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {icon: customIcon});
		}
	});
	//console.log(volunteerLayer);
    var volunteerMarkers = L.markerClusterGroup();
	

	function districtOnEachFeature(feature, layer) {
    // does this feature have a property named id, titular, identificacao, numero, area, benfeitorias and comentario
    	if (feature.properties && feature.properties.DISTRITO && feature.properties.PROVINCIA) {
        	//console.log(feature.properties.DISTRITO.toLowerCase());
			layer.bindPopup(`
			<table>
				<tr>
					<th align="right">District:</th>
					<td>${feature.properties.DISTRITO}</td>
				</tr>
				<tr>
					<th align="right">Province:</th>
					<td>${feature.properties.PROVINCIA}</td>
				</tr>
				<tr>
					<th align="right">Volunteers:</th>
					<td>${ 
						volunteers.features.filter(f => feature.properties.DISTRITO.toLowerCase().indexOf(f.properties.district.toLowerCase()) != -1).length > 0 
						? volunteers.features.filter(f => feature.properties.DISTRITO.toLowerCase().indexOf(f.properties.district.toLowerCase()) != -1).length :
						'No one'}</td>
				</tr>
			</table> 
			`);
    	}else{
    		console.log("District popup display failed!");
    	}
	}

	distritctLayer = L.geoJson(districts, {
		onEachFeature: districtOnEachFeature, 
		style: districtStyle
	});

	volunteerMarkers.addLayer(volunteersLayer);

	var map = L.map('vmap', {
		//center: [-25.96666667,32.58333333],
		center: [-18.6693182,35.52639008],
		zoom: 5,//12
		layers: [osm, distritctLayer, volunteerMarkers]
	});

	var baseLayers = {
		//"Grayscale": grayscale,
		"Streets": osm,
		"Open Topo Map": OpenTopoMap,
		"Esri World Imagery": Esri_WorldImagery
	};

	var overlays = {
		"Volunteers": volunteerMarkers,
		"Districts": distritctLayer
	};

	var layerControl = L.control.layers(baseLayers, overlays);
	layerControl.addTo(map);
	var scale = L.control.scale({position: 'bottomleft'});
	scale.addTo(map);

	var agencies = getAgencies();
	for(var i = 0; i < agencies.length - 1; i++)
		infoAgencies += `${agencies[i]} (${volunteers.features.filter(f => f.properties.agency == agencies[i]).length}), `;
	infoAgencies += `${agencies[agencies.length - 1]} (${volunteers.features.filter(f => f.properties.agency == agencies[agencies.length - 1]).length}).<br></div>`;
	/*agencies.forEach(agency => {
		infoText += `${agency} (${volunteers.features.filter(f => f.properties.agency == agency).length}), `;
	});*/
	//infoText += `<b>Total: ${volunteers.features.length}</b>`
	var districtList = getDistricts();
	var districtsCount = getDistricts().length;
	var provincesCount = districtList.length;
	quickSummary += provincesCount + ' provinces<br>';
	quickSummary += districtsCount + ' districts<br>';
	quickSummary += agencies.length + ' agencies<br>';
	quickSummary += getVolunteers().length + ' volunteers<br></div>';
	let hideStats =  L.control({position: "bottomright"});
	hideStats.onAdd = function(){
		let div = L.DomUtil.create("div", "hide-show-btn");
		div.innerHTML = "Hide Stats";
		return div;
	}
	
	for(var i = 0; i < districtList.length - 1; i++)
		infoDistricts += `${districtList[i]} (${volunteers.features.filter(f => f.properties.district == districtList[i]).length}), `;
	infoDistricts += `${districtList[districtList.length - 1]} (${volunteers.features.filter(f => f.properties.district == districtList[districtList.length - 1]).length}).<br>
	<br><i>Tip: Click on a district on the map to see its details<i></div>`;
	
	let infoStat = L.control({position: "bottomright"});
	infoStat.onAdd = function() {
	let div = L.DomUtil.create("div", "infoStat");
	div.innerHTML = quickSummary + infoAgencies + infoDistricts;
	return div;
	};
	
	infoStat.addTo(map);
	hideStats.addTo(map);
	let dropdown = L.control({position: "topleft"});
	dropdown.onAdd = function() {
	let div = L.DomUtil.create("div", "dropdown");
	div.innerHTML =
	'<select id="filter_sel">' +
		'<option value = "">Click to select a filter:</option>' +
		'<option value = "fbn">Filter by name</option>' +
		'<option value = "fba">Filter by agency</option>' +
		'<option value = "fbd">Filter by district</option>' +
		'<option value = "fbp">Filter by province</option>' +
	'</select>';
	return div;
	};
	dropdown.addTo(map);
	let nameFilterForm = L.control({position: "topleft"});
	nameFilterForm.onAdd = function() {
	let div = L.DomUtil.create("div", "nameFilterForm");
	div.innerHTML =
	`<form class="filterForm">
		<input type="text" id="volunteer_filter" class="filter-form-input" placeholder="Enter name"/>
	</form>
	`;
	return div;
	};

	
	let agencyFilterForm = L.control({position: "topleft"});
	agencyFilterForm.onAdd = function() {
	let div = L.DomUtil.create("div", "agencyFilterForm");
	div.innerHTML =
	`<form class="filterForm">
		<input type="text" id="agency_filter" class="filter-form-input" placeholder="Enter agency"/>
	</form>
	`;
	return div;
	};
	//agencyFilterForm.addTo(map);
	let districtFilterForm = L.control({position: "topleft"});
	districtFilterForm.onAdd = function() {
	let div = L.DomUtil.create("div", "districtFilterForm");
	div.innerHTML =
	`<form class="filterForm">
		<input type="text" id="district_filter" class="filter-form-input" placeholder="Enter district"/>
	</form>
	`;
	return div;
	};
	//districtFilterForm.addTo(map);
	let provinceFilterForm = L.control({position: "topleft"});
	provinceFilterForm.onAdd = function() {
	let div = L.DomUtil.create("div", "provinceFilterForm");
	div.innerHTML =
	`<form class="filterForm">
		<input type="text" id="province_filter" class="filter-form-input" placeholder="Enter province"/>
	</form>
	`;
	return div;
	};

	let resetSearchButton = L.control({position: "topright"});
	resetSearchButton.onAdd = function() {
	let div = L.DomUtil.create("div", "resetSearchButton");
	div.innerHTML =
	`<button id="cs_btn">Clear Search</button>
	`;
	return div;
	};

	$(".hide-show-btn").on("click", e => {
		if($(".hide-show-btn").text() == "Hide Stats"){
			$(".infoStat").fadeOut();
			$(".hide-show-btn").text("Show Stats");
		}else{
			$(".infoStat").fadeIn();
			$(".hide-show-btn").text("Hide Stats");
		}
	});
	
	//provinceFilterForm.addTo(map);
	var filter_sel = document.getElementById("filter_sel");
	filter_sel.addEventListener("change", e => {
		//console.log(filter_sel.value);
		switch(filter_sel.value){
			case "fbn":
				removeMapFilterForms();
				nameFilterForm.addTo(map);
				$("#volunteer_filter").autocomplete({
					source: getVolunteers(),
					minLength: 2,
					select: function(event, ui) {
						var volunteer = ui.item.value;
						//console.log(volunteer);
						var count = 0;
						var volunteerLayer = L.geoJSON(volunteers, {
							filter: function(feature, layer) {
								var cmp = feature.properties.volunteer == volunteer;
								return cmp;
							},
							onEachFeature: volunteerOnEachFeature,
							pointToLayer: function (feature, latlng) {
								count++;
								return L.marker(latlng, {icon: customIcon});
							}
						});
						if(count > 0){
							resetMap();
							volunteerLayer.addTo(volunteerMarkers);
							layerControl.addOverlay(volunteerMarkers, "Volunteers")
							volunteerMarkers.addTo(map);
							map.setView([
								volunteerMarkers.getBounds()._northEast.lat,
								volunteerMarkers.getBounds()._northEast.lng
							], 10);
							resetSearchButton.addTo(map);
							hideButton(document.getElementById("cs_btn"));
						}else{
							console.log(count);
						}
						
						/*layerControl.addOverlay(volunteerMarkers, "Volunteers")
						//volunteerMarkers.addTo(map);
						map.flyToBounds(volunteerMarkers.getBounds());*/
						
					}
				});
				break;
			case "fba":
				removeMapFilterForms();
				agencyFilterForm.addTo(map);
				$("#agency_filter").autocomplete({
					source: getAgencies(),
					minLength: 2,
					select: function(event, ui) {
						var agency = ui.item.value;
						//console.log(volunteer);
						var count = 0;
						var volunteerLayer = L.geoJSON(volunteers, {
							filter: function(feature, layer) {
								var cmp = feature.properties.agency == agency;
								return cmp;
							},
							onEachFeature: volunteerOnEachFeature,
							pointToLayer: function (feature, latlng) {
								count++;
								return L.marker(latlng, {icon: customIcon});
							}
						});
						if(count > 0){
							resetMap();
							volunteerLayer.addTo(volunteerMarkers);
							layerControl.addOverlay(volunteerMarkers, "Volunteers")
							volunteerMarkers.addTo(map);
							if(count == 1){
								map.setView([
									volunteerMarkers.getBounds()._northEast.lat,
									volunteerMarkers.getBounds()._northEast.lng
								], 10);
							}
							else{
								map.flyToBounds(volunteerMarkers.getBounds());
							}
							resetSearchButton.addTo(map);
							hideButton(document.getElementById("cs_btn"));
						}else{
							console.log(count);
						}
						
					}
				});
				break;
			case "fbd":
				removeMapFilterForms();
				districtFilterForm.addTo(map);
				$("#district_filter").autocomplete({
					source: getDistricts(),
					minLength: 2,
					select: function(event, ui) {
						var district = ui.item.value;
						//console.log(volunteer);
						var count = 0;
						var volunteerLayer = L.geoJSON(volunteers, {
							filter: function(feature, layer) {
								var cmp = feature.properties.district == district;
								return cmp;
							},
							onEachFeature: volunteerOnEachFeature,
							pointToLayer: function (feature, latlng) {
								count++;
								return L.marker(latlng, {icon: customIcon});
							}
						});
						if(count > 0){
							resetMap();
							volunteerLayer.addTo(volunteerMarkers);
							layerControl.addOverlay(volunteerMarkers, "Volunteers")
							volunteerMarkers.addTo(map);
							if(count == 1){
								map.setView([
									volunteerMarkers.getBounds()._northEast.lat,
									volunteerMarkers.getBounds()._northEast.lng
								], 10);
							}
							else{
								map.flyToBounds(volunteerMarkers.getBounds());
							}
							resetSearchButton.addTo(map);
							hideButton(document.getElementById("cs_btn"));
						}else{
							console.log(count);
						}
						
					}
				});
				break;
			case "fbp":
				removeMapFilterForms();
				provinceFilterForm.addTo(map);
				$("#province_filter").autocomplete({
					source: getProvinces(),
					minLength: 2,
					select: function(event, ui) {
						var province = ui.item.value;
						//console.log(volunteer);
						var count = 0;
						var volunteerLayer = L.geoJSON(volunteers, {
							filter: function(feature, layer) {
								var cmp = feature.properties.province == province;
								return cmp;
							},
							onEachFeature: volunteerOnEachFeature,
							pointToLayer: function (feature, latlng) {
								count++;
								return L.marker(latlng, {icon: customIcon});
							}
						});
						if(count > 0){
							resetMap();
							volunteerLayer.addTo(volunteerMarkers);
							layerControl.addOverlay(volunteerMarkers, "Volunteers")
							volunteerMarkers.addTo(map);
							if(count == 1){
								map.setView([
									volunteerMarkers.getBounds()._northEast.lat,
									volunteerMarkers.getBounds()._northEast.lng
								], 10);
							}
							else{
								map.flyToBounds(volunteerMarkers.getBounds());
							}
							resetSearchButton.addTo(map);
							hideButton(document.getElementById("cs_btn"));
						}else{
							console.log(count);
						}
						
					}
				});
				break;
			default:
				removeMapFilterForms();
				break;
		}
	});
	function hideButton(button){
		button.addEventListener("click", e => {
			var volunteerLayer = L.geoJSON(volunteers, {
				onEachFeature: volunteerOnEachFeature,
				pointToLayer: function (feature, latlng) {
					return L.marker(latlng, {icon: customIcon});
				}
			});
			resetMap();
			volunteerLayer.addTo(volunteerMarkers);
			layerControl.addOverlay(volunteerMarkers, "Volunteers");
			volunteerMarkers.addTo(map);
			map.setView([-18.6693182,35.52639008], 5);
			//document.getElementById("cs_btn").style.display = 'none';z
			$(".resetSearchButton").hide();
			removeMapFilterForms();
			filter_sel.value = "";
		});
	}
	
	function removeMapFilterForms(){
		$(".filterForm").hide();
	}
	function getVolunteers(){
		var foundVolunteers = [];
		var fts = volunteers.features;
		for (i=0; i<fts.length;i++){
			var volunteer = fts[i].properties.volunteer;
			if(foundVolunteers.indexOf(volunteer) == -1)
				foundVolunteers.push(volunteer);
				
		}
		//console.log(foundVolunteers);
		return foundVolunteers;
	}
	function getProvinces(){
		var foundProvinces = [];
		var fts = volunteers.features;
		for (i=0; i<fts.length;i++){
			var province = fts[i].properties.province;
			if(foundProvinces.indexOf(province) == -1)
				foundProvinces.push(province);
				
		}
		return foundProvinces;
	}
	function getAgencies(){
		var foundAgencies = [];
		var fts = volunteers.features;
		for (i=0; i<fts.length;i++){
			var agency = fts[i].properties.agency;
			if(foundAgencies.indexOf(agency) == -1)
				foundAgencies.push(agency);
				
		}
		
		return foundAgencies;
	}
	function getDistricts(){
		var foundDistricts = [];
		var fts = volunteers.features;
		for (i=0; i<fts.length;i++){
			var district = fts[i].properties.district;
			if(foundDistricts.indexOf(district) == -1)
				foundDistricts.push(district);
				
		}
		//console.log(foundDistricts);
		return foundDistricts;
	}
	function resetMap(){
		if(map.hasLayer(volunteerMarkers)){
			map.removeLayer(volunteerMarkers);
			layerControl.removeLayer(volunteerMarkers);
		}
		volunteerMarkers = L.markerClusterGroup();
	}
});