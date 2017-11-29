   var map = null;
   var marker = null;
   var geocoder = null;
   var infowindow = null;
   // posicion predeterminada
   //terminal vilavo 4.131590766153499, -73.60564483703615
   var ini_lat = 0;
   var ini_lng = -0;
   var lat = 3;
   var lon = 0;
   var zzoo = new Number(12); //por defecto 12

   // traducciones del tipo de localizaci�n
   var a_locations_type = new Array('APPROXIMATE', 'GEOMETRIC_CENTER', 'RANGE_INTERPOLATED', 'ROOFTOP');
   a_locations_type[a_locations_type[0]] = ['El resultado devuelto es aproximado.'];
   a_locations_type[a_locations_type[1]] = ['El resultado devuelto es el centro geomérico de un resultado como una línea (por ejemplo, una calle) o un polígono (una región).'];
   a_locations_type[a_locations_type[2]] = ['El resultado devuelto refleja una aproximación (normalmente en una carretera) interpolada entre dos puntos precisos (por ejemplo, intersecciones). Normalmente, los resultados interpolados se devuelven cuando los códigos geográficos de la parte superior no están disponibles para una dirección postal.'];
   a_locations_type[a_locations_type[3]] = ['El resultado devuelto refleja un código geográfico preciso.'];

   // traducciones del estatus de la geocodificaci�n
   var a_geocode_status = new Array('ERROR', 'INVALID_REQUEST', 'OK', 'OVER_QUERY_LIMIT', 'REQUEST_DENIED', 'UNKNOWN_ERROR', 'ZERO_RESULTS');
   a_geocode_status[a_geocode_status[0]] = ['Se ha producido un error al establecer la comunicación con los servidores de Google.'];
   a_geocode_status[a_geocode_status[1]] = ['La solicitud GeocoderRequest no es válida.'];
   a_geocode_status[a_geocode_status[2]] = ['Indica que la respuesta contiene un valor GeocoderResponse válido.'];
   a_geocode_status[a_geocode_status[3]] = ['La página web ha superado el límite de solicitudes en un periodo de tiempo demasiado breve.'];
   a_geocode_status[a_geocode_status[4]] = ['No se permite que la página web utilice el geocoder.'];
   a_geocode_status[a_geocode_status[5]] = ['No se pudo procesar una solicitud de codificación geográfica debido a un error del servidor. Puede que la solicitud se realice correctamente si lo intentas de nuevo.'];
   a_geocode_status[a_geocode_status[6]] = ['No se ha encontrado ningún resultado para esta solicitud GeocoderRequest.'];

   // funciones para nuestro mapa
   function initGMaps() {
      // crear los objetos necesarios, primero el mapa

      //alert(typeof(zzoo));
      //alert(ini_lat);
      //alert(ini_lng);
      map = new google.maps.Map(document.getElementById("map_canvas"), {
         'zoom': zzoo
         , 'center': new google.maps.LatLng(ini_lat, ini_lng)
         , 'mapTypeId': google.maps.MapTypeId.HYBRID
         , 'scaleControl': true
         , 'scrollwheel': false
      });
      // el marcador (pin)
      //alert(ini_lat);
      var image = 'sp.png';
      marker = new google.maps.Marker({
         map: map
         , position: new google.maps.LatLng(ini_lat, ini_lng)
         , draggable: true
         , icon: image
         , visible: true
      });
      // la ventana de info (globo)
      infowindow = new google.maps.InfoWindow();
      // el geocodificador
      geocoder = new google.maps.Geocoder();
      // crear los eventos para acciones del mouse sobre el marcador (pin)
      google.maps.event.addListener(marker, "dragend", function() {
         showLatLongPos();
      });
      google.maps.event.addListener(marker, "rightclick", function() {
         showLatLongPos();
      });
   }

   function showAddress(address) {
      // alert (lat);
      if (geocoder) {
         // obtener la Geo-Codificaci�n Forward,
         // introduciendo un dato string (address)
         geocoder.geocode({'address': address}
         , function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
               if (results[0]) {
                  // preparar la info de la posici�n latitud y longitud
                  var input = results[0].geometry.location.toUrlValue();
                  var latlngStr = input.split(",", 2);
                  var lat_co = parseFloat(latlngStr[0]);
                  var lng_co = parseFloat(latlngStr[1]);
                  var latLong_co = new google.maps.LatLng(lat_co, lng_co);
                  // centrar el mapa en la posici�n encontrada
                  map.setZoom(16);
                  map.setCenter(latLong_co);
                  marker.setPosition(latLong_co);
                  marker.setVisible(true);
                  //
                  google.maps.event.trigger(marker, 'click');
                  // llenar con la info de la codificaci�n inversa, o sea, la direcci�n humanamente legible
                  var location_type_co = results[0].geometry.location_type
                  infowindow.setContent('<b>' + results[0].formatted_address + '</b>' + '<br/><br/><i style="color: #777;">' + a_locations_type[location_type_co] + '</i>');
                  infowindow.open(map, marker);
               } else {
                  alert(a_geocode_status[status]);
               }
            } else {
               alert(a_geocode_status[status]);
            }
         });
      } // endif
   }

   function retLatLng(address,zoo) {
      
      geocoder = new google.maps.Geocoder();
      if (geocoder) {
         // obtener la Geo-Codificaci�n Forward,
         // introduciendo un dato string (address)
         
         geocoder.geocode({'address': address, 'region': 'ten'}
         , function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
               if (results[0]) {
                  // preparar la info de la posici�n latitud y longitud
                  var input = results[0].geometry.location.toUrlValue();
                  var latlngStr = input.split(",", 2);
                  
                  /*var lat_co = parseFloat(latlngStr[0]);
                  var lng_co = parseFloat(latlngStr[1]);*/
                 
                  ini_lat = parseFloat(latlngStr[0]);
                  ini_lng = parseFloat(latlngStr[1]);
                   mostrarValores(parseFloat(latlngStr[0]),parseFloat(latlngStr[1]),results[0].formatted_address);
                  /*alert (results[0].formatted_address);
                    document.getElementById("lat").innerHTML = ini_lat;
                    document.getElementById("lon").innerHTML = ini_lng;*/
                  //cargarValores(lat_co,lng_co);
                  //var latLong_co = new google.maps.LatLng(lat_co, lng_co);
                  //return latLong_co
                  //alert( lat);
               } else {
                  ini_lat = 4.629724;
                  ini_lng = -74.105892;
                  mostrarValores(ini_lat,ini_lng,"NA");
                  alert(a_geocode_status[status]);

               }
            } else {
               alert(a_geocode_status[status]);
            }
         });
      } else {
        alert("no se creo geocoder");
      }
   }
function mostrarValores(lat,lng,address){
    
    document.getElementById("lat").innerHTML = lat;
    document.getElementById("lon").innerHTML = lng;
    document.getElementById("dir").innerHTML=address;
    
    var latori=document.getElementById("latori").innerHTML;
    var lngori=document.getElementById("lonori").innerHTML;
    obtenerDistanciayTiempo(latori,lngori,lat,lng);
}
function cargarValores(sAdress,zoo){
    //inicializa los valores del mapa antes de mostrarlo
    //alert(ini_lat);

    retLatLng(sAdress,zoo);
    //alert("direccion " + ini_lat);
    
}
function cargarValores2(ilat,ilng,zoo){
    //inicializa los valores del mapa antes de mostrarlo
    //alert(ini_lat);
    ini_lat=ilat;
    ini_lng=ilng;
    zzoo=zoo;
    
}
function showLatLongPos(){
      // preparar la info de la posicion latitud y longitud
      var location = marker.getPosition().toUrlValue(7);
      var latlngStr = location.split(",", 2);
      var lat_mx = parseFloat(latlngStr[0]);
      var lng_mx = parseFloat(latlngStr[1]);
      var latLong_mx = new google.maps.LatLng(lat_mx, lng_mx);
      //alert("mostrar showLatLongPos")
      // obtener la Geo-Codificaci�n Inversa, o sea, la direcci�n humanamente legible
      // introduciendo un dato latLong
      geocoder.geocode({'latLng': latLong_mx, 'region': 'CO'} , function(results) {
         var location_type_mx = results[0].geometry.location_type;
         //document.getElementById("dir") = results[0].formatted_address;
          mostrarValores(lat_mx,lng_mx,results[0].formatted_address);
         infowindow.setContent('<b>' + results[0].formatted_address + 'dd </b>' + '<br/><br/><i style="color: #777;">' + a_locations_type[location_type_mx] + '</i>');
         infowindow.open(map, marker);
      });
      /*document.getElementById("lat").innerHTML=lat_mx;
      document.getElementById("lon").innerHTML=lng_mx;*/
      //alert (results[0].formatted_address);
      //document.getElementById("dir").innerHTML=results[0].formatted_address;
      // llenar los campos de texto con los valores latitud y longitud respectivamente
      // document.getElementById("latitud").value = lat_mx;
      //document.getElementById("longitud").value = lng_mx;
   }
function CarculaDistancia(latA,lngA,latB,lngB){
       /*
        * Dist = 6371 * ACOS(COS(LatA) * COS(LatB) * COS(LngB - LngA) + SIN(LatA) * SIN(LatB))
        *         */
        Distancia = Dist(latA, lngA, latB, lngB);   //Retorna numero en Km
   }
function Dist(LatA, LngA, LatB, LngB)
  {
       /* HECHO PARA JAVASCRIPT TOCA PROBARLO
        * Dist = 6371 * ACOS(COS(LatA) * COS(LatB) * COS(LngB - LngA) + SIN(LatA) * SIN(LatB))
        *         */
  rad = function(x) {return x*Math.PI/180;}

  var R     = 6371;                          //Radio de la tierra en km
  var dLat  = rad( LatB - LatA );
  var dLong = rad( LngB - LngA );

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(LatA)) * Math.cos(rad(LatB)) * Math.sin(dLong/2) * Math.sin(dLong/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  return d.toFixed(3);                      //Retorna tres decimales
}
function obtenerDistanciayTiempo(latori,lngori,latdes,lngdes){

    var origin1 = new google.maps.LatLng(latori, lngori);
    var destinationA = new google.maps.LatLng(latdes, lngdes);

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
        origins: [origin1],
        destinations: [destinationA],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false
        }, callback);

function callback(response, status) {
  if (status == google.maps.DistanceMatrixStatus.OK) {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;

    //for (var i = 0; i < origins.length; i++) {
    //NO HACEMOS FOR PUES SOLO HAY UN ORIGEN y UN DESTINO
      var results = response.rows[0].elements;
      //for (var j = 0; j < results.length; j++) {
        var element = results[0];
        var distance = element.distance.text;
        var duration = element.duration.text;
        mortrarValoresDistanciaYduracion(distance,duration);
        //var from = origins[i];
        //var to = destinations[j];
      //}
    //}
  }
}

}
function mortrarValoresDistanciaYduracion(distance,duration){
    
    document.getElementById("dis").innerHTML = distance;
    document.getElementById("dur").innerHTML = duration;
    
}
