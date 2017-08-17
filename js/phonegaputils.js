/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var objPositionIni;
var objPositionAct;
var aLat=new Array();
var aLon=new Array();
var horIni;
var horAct;
var millisegsIni;
var millisegsAct;
var bContaIni = false;
var fsumador=0;
var ftemp=0;
var nomArchivoTexto="prueba.txt";

function get_loc() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(coordenadas);
    }else{
        alert('Este navegador es algo antiguo, actualiza para usar el API de localización');                  }
}

function coordenadas(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      var map = document.getElementById("map");
      map.src = "http://maps.google.com/maps/api/staticmap?center=" + lat + "," 
              + lon + "&amp;zoom=15&amp;size=300x300&amp;markers=color:red|label:A|" + lat + "," + lon + "&amp;sensor=false";
}

function iniciarMapa(){
    if ("geolocation" in navigator){ //check Geolocation available 
        //things to do
    }else{
        $("#geolocation").text("No existe geolocation");
    }
}

function onSuccess(position) {
    //var element = document.getElementById('geolocation');
    objPositionIni=position;
    coordenadas(position);  
    /*element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
                        'Longitude: ' + position.coords.longitude     + '<br />' +
                        '<hr />'      + element.innerHTML;
     */
    }

        // onError Callback receives a PositionError object
        //
function onError(error) {
    var errortmp="";
    errortmp = 'code: '  + error.code + '\n' +'message: ' + error.message + '\n';
     $("#geolocation").text(errortmp);
}

function obtener(){
    //navigator.geolocation.getCurrentPosition(mostrar, gestionarErrores);
    //navigator.geolocation.getCurrentPosition(mostrar,manejoErfileApi
    //ror);
    //
    horIni= new Date();
    $("#geolocation").text("obteniendo direccion...");
    var options = { timeout: 30000, enableHighAccuracy: true };
    $("#horAct").text("Hora Actual : "+horIni.getHours()+":"+horIni.getMinutes()+":"+horIni.getSeconds());
    //alert(horIni.toString());
    //$("#horIni").text(horIni.toString());
    watchID = navigator.geolocation.watchPosition(mostrar, manejoError, options);
    //mostrar();
    
}

function mostrarMapa(posicion){
    var mapurl="img/logo.png";
    var ubicacion=document.getElementById('map');
    if ((posicion===null)||(posicion===undefined)){
        // SE TOMA EL VALOR ACTUAL DE LA POSICION        
        mapurl='http://maps.google.com/maps/api/staticmap?center='+
        objPositionAct.coords.latitude+','+objPositionAct.coords.longitude+
        '&zoom=12&size=200x200&sensor=false&markers='+objPositionAct.coords.latitude+
        ','+objPositionAct.coords.longitude;
    }
    else{
        mapurl='http://maps.google.com/maps/api/staticmap?center='+
        posicion.coords.latitude+','+posicion.coords.longitude+
        '&zoom=12&size=200x200&sensor=false&markers='+posicion.coords.latitude+
        ','+posicion.coords.longitude;
        
    }
    ubicacion.innerHTML='<img src="'+mapurl+'">';
}

function mostrar(posicion){
    
    if (!bContaIni){
        horIni= new Date();
        objPositionIni=posicion;
        $("#horIni").text("Hora Inicio : "+horIni.getHours()+":"+horIni.getMinutes()+":"+horIni.getSeconds());        
        bContaIni = true;
        losMetros=parseFloat(objPositionAct.coords.latitude),parseFloat(objPositionAct.coords.longitude),parseFloat(objPositionIni.coords.latitude),parseFloat(objPositionIni.coords.longitude);
        if (losMetros>1) {
            aLat.push(objPositionIni.coords.latitude);
            aLon.push(objPositionIni.coords.longitude);
        }
        //aLat.push("4.59488357");
        //aLon.push("-74.15688198");
    }
    else{
        horAct = new Date();
        objPositionAct=posicion;
        $("#horAct").text("Hora Actual : "+horAct.getHours()+":"+horAct.getMinutes()+":"+horAct.getSeconds());
        losMetros=parseFloat(objPositionAct.coords.latitude),parseFloat(objPositionAct.coords.longitude),parseFloat(objPositionIni.coords.latitude),parseFloat(objPositionIni.coords.longitude);
        if (losMetros>1) {
            aLat.push(objPositionAct.coords.latitude);
            aLon.push(objPositionAct.coords.longitude);
        }
        $("#timRec").text(restarFechasEnSegs( horIni, horAct)+" segs");    //$("#geolocation").text("Latitud :" + posicion.coords.latitude + " - Longitud :" +posicion.coords.longitude);
        //$("#timRec").text(toString());
        mostrarPosiciones();
        if (tieneInternetSN() && $("verMapa").val()==="verMapa"){
            mostrarMapa(posicion);
        }
        //$("#txtDato").value("Latitud :" + posicion.coords.latitude + " - Longitud :" +posicion.coords.longitude);
    }


    
}

function restarFechasEnSegs(hini,hfin){
    millisegsIni = hini.getTime();
    millisegsAct = hfin.getTime();
    return (millisegsAct - millisegsIni)/1000;
}

 function manejoError(error){
    var errortmp="";
    errortmp = 'code: '  + error.code + '\n' +'message: ' + error.message + '\n';
     $("#geolocation").text(errortmp);
 }

 function tieneInternetSN(){
     /*retorna Si tiene internet los siguientes numeros*
      * 1-desconocido
      * 2-ethernet
      * 3-wifi
      * 4-2g
      * 5-3g
      * 6-4g
      * 7-cell
      * 8-none
      * @type window.navigator.connection.type|navigator.connection.type|Navigator.connection.type
      */
     var internetSN = false;
     var retCon = navigator.connection.type;
     retCon.toUpperCase();
     $("#red").text(navigator.connection.type);
     /*if ((retCon === 2) || (retCon === 3) || (retCon === 4) || (retCon === 5) || (retCon === 6) || (retCon === 7)){
         internetSN = true;
     }*/
    if ((retCon !== "UNKNOWN") || (retCon !== "NONE"))
        internetSN = true;
    else
        internetSN = false;
    return internetSN;
 }
 
 function mostrarPosiciones(){
     $("#latlonIni").text("Inicio en : " + objPositionIni.coords.latitude + " , " + objPositionIni.coords.longitude);
     $("#latlonAct").text("Actual en : " + objPositionAct.coords.latitude + " , " + objPositionAct.coords.longitude);
     //$("#disRec").text("Distancia recorrido : " + calcularDistanciaTotal().toString());
     eldato= calcularDistanciaTotal();
     $("#disRec").text("Distancia recorrido : " + eldato.toString());
     $("#valor").text("$"+(eldato*1000).toString());
     
     eldato=getMetros(parseFloat(objPositionAct.coords.latitude),parseFloat(objPositionAct.coords.longitude),parseFloat(objPositionIni.coords.latitude),parseFloat(objPositionIni.coords.longitude));
     $("#disRecUlt").text("Ultima Distancia recorrido : " + eldato.toString());
     $("#listening").text("se va a escribir");
     
     escribir();
  }
 
 function calcularDistanciaTotal(){
     
     fsumador=0;
     //return getKilometros(4.59488357,-74.15688198,4.6261026,-74.1476059);
     for (i = 1; i < aLat.length; i++) {
         fsumador = fsumador + parseFloat(getKilometros(parseFloat(aLat[i-1]),parseFloat(aLon[i-1]),parseFloat(aLat[i]),parseFloat(aLon[i])));
     }
     return fsumador;
     
 }

function getKilometros(lat1,lon1,lat2,lon2){
    var R = 6378.137; //Radio de la tierra en km
    //R = 60000000;//para hacer pruebas
    var dLat = rads( lat2 - lat1 );
    var dLong = rads( lon2 - lon1 );
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rads(lat1)) * Math.cos(rads(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d.toFixed(3); //Retorna tres decimales
    //return R;
}

function getMetros(lat1,lon1,lat2,lon2){
    var R = 6378137; //Radio de la tierra en mts
    //R = 60000000;//para hacer pruebas
    var dLat = rads( lat2 - lat1 );
    var dLong = rads( lon2 - lon1 );
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rads(lat1)) * Math.cos(rads(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d.toFixed(3); //Retorna tres decimales
    //return R;
}

function rads(x){
    return x*Math.PI/180;
}

function escribir(){
    $("#listening").text("escribiendo archivo1");
    window.requestFileSystem(cordova.file.externalRootDirectory, 0, gotFS, fail);

    //window.requestFileSystem(cordova.file.externalRootDirectory,0, gotFS, fail);

    $("#listening").text("directorio externo:"+cordova.file.externalRootDirectory);

    
    //fileApi.writeTextFile("pepito.txt","prueba");
    //$("#listening").text("escribiendo archivo2");
}
/*
function gotFS(fileSystem) {
    fileSystem.root.getFile("/datos/pepito.txt", {create: true, exclusive: false}, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
    writer.onwrite = function(evt) {
        $("#listening").text("se escribio ok");
    };
    writer.seek(writer.length);
    //writer.write(objPositionAct.coords.latitude);
    writer.write("alguna cosa");
}

function fail(error) {
    $("#listening").text(error.code + "mio");
}*/
/*
var fileApi = {
  initialize: function(){
    //window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, fileApi.onDir, fileApi.onError);
  },
  onDir: function(directoryEntry) {
    fileApi.dir = directoryEntry;
  },
  onError: function(err) {
    alert(err.code);
  },
   writeTextFile: function(file, content, callback) {
    var onFile = function(fileEntry) {
      fileEntry.createWriter(function(fileWriter){
        fileWriter.write(content);
        callback && callback(content);
      }, fileApi.onError);
    };
    fileApi.dir.getFile(file, {create: true}, onFile, fileApi.onError);
  },
  readTextFile: function(file, callback) {
    var onFile = function(fileEntry) {
      //convierte el fileEntry en un fileObject
      fileEntry.file(function(fileObject){
        var reader = new FileReader();
        reader.onloadend = function(){
          callback && callback(this.result);
        };
        reader.readAsText(fileObject);
      });
    };
    fileApi.dir.getFile(file, {create:false}, onFile, fileApi.onError);
  }
};
var onFile = function(fileEntry) {
      fileEntry.createWriter(function(fileWriter){
        fileWriter.write(content);
        //callback && callback(content);
      }, fileApi.onError);
      $("#listening").text("Se escribio el archivo");
    };
  */ 
   
function gotFS(fileSystem) {
    fileSystem.root.getDirectory("DO_NOT_DELETE", 
        {create: true, exclusive: false}, 
        gotDirEntry, 
        fail);
}
function gotDirEntry(dirEntry) {
    dir = dirEntry;
    dirEntry.getFile(nomArchivoTexto, 
        {create: false, exclusive: false}, 
        readSuccess, 
        fileDonotexist);
}
function fileDonotexist(dirEntry) {
    dir.getFile(nomArchivoTexto, 
        {create: true, exclusive: false}, 
        gotFileEntry, 
        fail);
}
function gotFileEntry(fileEntryWrite) {
    $("#listening").text("gotFileEntry");
    fileEntryWrite.createWriter(gotFileWriter, fail);
}
function gotFileWriter(writer) {
    $("#listening").text("gotFileWriter");
    writer.onerror = function(evt) {
    };
    writer.write("algo");
    writer.onwriteend = function(evt) {
        dir.getFile(nomArchivoTexto, 
            {create: false, exclusive: false}, 
            readSuccess, 
            fail);
    };
}
function readSuccess(fileE) {
    fileE.file(readAsText, fail);
    $("#listening").text("readSuccess");
}
function fail(error) {
    $("#listening").text("error nume: "+ error.code);
}
function readAsText(readerDummy) {
    var reader = new FileReader();

    reader.onloadstart = function(evt) {};
    reader.onprogress = function(evt) {};
    reader.onerror = function(evt) {};

    reader.onloadend = function(evt) {
        $("#listening").text("lectura hecha");
    };
    reader.readAsText(readerDummy);
}   