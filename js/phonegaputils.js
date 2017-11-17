/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var objPositionIni;
var objPositionAnt;
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

var Unidades =0;//cada 100mts o 23 segs
var segsSinMov=0;// para llevar el tiempo sin movimiento, se suma una unidad
var Banderazo=28;//al iniciar
var recNoct = 2100;
var recFest = 2000;
var carMinima = 50;// numero de unidades mínimas
var aFest = ["1;9","3;20","4;13","4;14","5;1","5,29","6;19","6;26","7;3","7;20","8;7","8;21","10;16","11;6","11;13","12;8","12;25"]; //mes;dia
var iSegs = 0;
var lMovido=false;//controla movimientos de carro;
var metrosCada100=0;
var ventana_ancho=0;
var ventana_alto=0;
var valorUnidad=83;
var bMostrandoMapa=false;
var averageProm;

var metMinRegPos=10;//metros minimos para registro de cambio de posicion

var bPriVez=false;//para saber si ya se obtuvo la primer posicion

//CON GPS USB

var aLin = [];
var fLinea=false;
var sLin="";

var sPosIni="";
var sPosAnt="";
var sPosAct="";
var bEnganchado = false;// para mostrar mapa y activar botones de envio a internet


function resetearValores(){
    objPositionIni=objPositionAct;
    objPositionAnt=objPositionAct;

    ventana_ancho = $(window).width();
    ventana_alto = $(window).height();
    bContaIni=false;
    horIni= new Date();
    horAct= new Date();
    aLat.length=0;
    aLon.length=0;
    millisegsIni=0;
    millisegsAct =0;
    bContaIni = false;
    fsumador=0;
    ftemp=0;
    segsSinMov=0;// para llevar el tiempo sin movimiento, se suma una unidad
    iSegs = 0;
    lMovido=false;//controla movimientos de carro;
    metrosCada100=0;
    Unidades=23;
    //GPSExt
    bEnganchado=false;
    aLin = [];
    fLinea=false;
    sLin="";
    sPosIni="";
    sPosAnt="";
    sPosAct="";
    /*
    if (bPriVez){
        mostrarPosiciones();
    }
    */
}

function obtener(){
    //navigator.geolocation.getCurrentPosition(mostrar, gestionarErrores);
    //navigator.geolocation.getCurrentPosition(mostrar,manejoErfileApi
    //ror);
    //
    
    $("#btnComenzar").buttonMarkup({theme: 'a'});
    $("#btnComenzar").text("Recomenzar");
    resetearValores();
    
    if  ($("#GPSExt").is(':checked')){
        leerPuerto();
    }
    else{
        var options = {maximumAge: 60000, timeout: 60000, enableHighAccuracy: true };
        watchID = navigator.geolocation.watchPosition(mostrar, manejoError, options);
    }
    
    //INICIAR CONTEO DE SEGUNDOS
    window.setInterval(function(){cuentaSegs(); }, 1000);
}

function cuentaSegs(){
    iSegs+=1;    
    if (!lMovido){
        if (iSegs>23){
            Unidades+=1;
            iSegs=0;
            $("#unidades").text(Unidades.toFixed(1));//solo mostramos el cambio en unidades
        }
        else{

        }
    }
    else{
        if (iSegs>5){
            lMovido=false;
        }
    }

}

function mostrarMapa(){
    var posicion = objPositionAct;
    var mapurl="img/logo.png";
    var ubicacion=document.getElementById('map');

        if ((posicion===null)||(posicion===undefined)){
            // SE TOMA EL VALOR ACTUAL DE LA POSICION 
            mapurl='http://maps.google.com/maps/api/staticmap?center='+
            objPositionAct.coords.latitude+','+objPositionAct.coords.longitude+
            '&zoom=12&size='+ventana_ancho.toString()+'x'+ventana_alto.toString()+'&sensor=false&markers='+objPositionAct.coords.latitude+
            ','+objPositionAct.coords.longitude;
        }
        else{
            mapurl='http://maps.google.com/maps/api/staticmap?center='+
            posicion.coords.latitude+','+posicion.coords.longitude+
            '&zoom=12&size='+ventana_ancho.toString()+'x'+ventana_alto.toString()+'&sensor=false&markers='+posicion.coords.latitude+
            ','+posicion.coords.longitude;

        }
    //para toglear entre mostrar mapa y datos
    if (bMostrandoMapa){
        $("#info").show();
        $("#btnVerMapa").buttonMarkup({theme: 'b'});
        $("#btnVerMapa").text("Ver Mapa");
    }
    else{
        $("#info").hide();
        $("#btnVerMapa").buttonMarkup({theme: 'a'});
        $("#btnVerMapa").text("Ver Info");
        ubicacion.innerHTML='<img src="'+mapurl+'">';
    }
    bMostrandoMapa=!bMostrandoMapa;


}

function mostrarMapaGPSExt(){
    var mapurl="img/logo.png";
    var ubicacion=document.getElementById('map');
    //var slat,slon ;
    
    sPosIni=extraerDato(aLin[0],"lat")+extraerDato(aLin[0],"lon");
    sPosAct=extraerDato(aLin[aLin.length-1],"lat")+extraerDato(aLin[aLin.length-1],"lon");
    
    //para toglear entre mostrar mapa y datos
    if (bMostrandoMapa){
        $("#info").show();
        $("#btnVerMapa").buttonMarkup({theme: 'b'});
        $("#btnVerMapa").text("Ver Mapa");
    }
    else{
        $("#info").hide();
        $("#btnVerMapa").buttonMarkup({theme: 'a'});
        $("#btnVerMapa").text("Ver Info");
        ubicacion.innerHTML='<img src="'+mapurl+'">';
    }
    bMostrandoMapa=!bMostrandoMapa;

    var slat,slon;
    slat=extraerDato(sPosAct,"lat");
    slon=extraerDato(sPosAct,"lon");
    if ((slat.lenght+slon.lenght)>8){
        // SE TOMA EL VALOR ACTUAL DE LA POSICION 
        mapurl='http://maps.google.com/maps/api/staticmap?center='+
        slat+','+slon+
        '&zoom=12&size='+ventana_ancho.toString()+'x'+ventana_alto.toString()+'&sensor=false&markers='+
        slat+','+slon;
    }
}

function mostrar(posicion){//USANDO GPS INTERNEO
    //esto no ha actualizado
    if (posicion.coords.accuracy<=metMinRegPos*2){//metMinRegPos*2 para que acepte otras lecturas 
        
        if (!bContaIni){
            horIni= new Date();
            objPositionAnt=posicion;
            objPositionAct=posicion;
            objPositionIni=posicion;
            bContaIni = true;
            aLat.push(objPositionIni.coords.latitude);
            aLon.push(objPositionIni.coords.longitude);
        }
        else{
            horAct = new Date();
            //ACTUALIZA POSICIONES
            objPositionAct=posicion;
            //CALCULA LOS METROS DEL MOVIMIENTO
            losMetros=getMetros(parseFloat(objPositionAct.coords.latitude),parseFloat(objPositionAct.coords.longitude),parseFloat(objPositionAnt.coords.latitude),parseFloat(objPositionAnt.coords.longitude));
            if (losMetros>metMinRegPos){
                objPositionAnt=objPositionAct;
                aLat.push(objPositionAct.coords.latitude);
                aLon.push(objPositionAct.coords.longitude);
                Unidades=Unidades+(losMetros/100);
                lMovido=true;
                $("#disRecUlt").text("Ultima Distancia recorrido Valida: " + losMetros.toString() + "mts");
            }
            else{
                $("#disRecUlt").text("Ultima Distancia recorrido No Valida: " + losMetros.toString() + "mts");
            }
                

        //$("#txtDato").value("Latitud :" + posicion.coords.latitude + " - Longitud :" +posicion.coords.longitude);
        }
        
        //$("#timRec").text(toString());
        mostrarTodo();

    }
    
}

function mostrarTodo(){
    var bMostrarMapa = false;
    var bGpsExterno = false;
    bMostrarMapa = $("#verMapa").is(':checked');
    bGpsExterno =$("#GPSExt").is(':checked');
    if (bGpsExterno){

        if (aLin.length>1){
            cargarPosicionesGPSExt();//actualiza los valores en sPosIni y sPosAct
            $("#horIni").text("Hora Inicio : "+extraerDato(aLin[0],"tmp"));
            $("#horAct").text("Hora Actual : "+extraerDato(aLin[aLin.length-1],"tmp"));
            $("#latlonIni").text("Inicio en : " + extraerDato(aLin[0],"lat") + " , " + extraerDato(aLin[0],"lon"));
            $("#latlonAct").text("Actual en : " + extraerDato(aLin[aLin.length-1],"lat") + " , " + extraerDato(aLin[aLin.length-1],"lon"));
            $("#latlonAnt").text("Anterior en : " + sPosAnt);
            var losMetros = getMetros(parseFloat(extraerDato(sPosAnt,"lat")),parseFloat(extraerDato(sPosAnt,"lon")),parseFloat(extraerDato(sPosAct,"lat")),parseFloat(extraerDato(sPosAct,"lon")));
            $("#disRecUlt").text("Ultima Distancia: " + losMetros.toString() + " mts");
            var losMetros = getMetros(parseFloat(extraerDato(sPosIni,"lat")),parseFloat(extraerDato(sPosIni,"lon")),parseFloat(extraerDato(sPosAct,"lat")),parseFloat(extraerDato(sPosAct,"lon")));
            $("#disRec").text(losMetros.toString() + " mts");
            $("#timRec").text(obtenerTiempoRecorrido());
            $("#unidades").text(Unidades.toFixed(1));
            eldato= calcularValorPorUnidades();
            $("#valor").text("$"+eldato.toString());
        }
    }
    else{
        if (aLat.length>1){//aseguramos que el arreglo tenga al menos dos medidas comparativas
            $("#horIni").text("Hora Inicio : "+horIni.getHours()+":"+horIni.getMinutes()+":"+horIni.getSeconds());
            $("#horAct").text("Hora Actual : "+horAct.getHours()+":"+horAct.getMinutes()+":"+horAct.getSeconds());
            $("#latlonIni").text("Inicio en : " + objPositionIni.coords.latitude + " , " + objPositionIni.coords.longitude);
            $("#latlonAnt").text("Anterior en : " + objPositionAnt.coords.latitude + " , " + objPositionAnt.coords.longitude);
            $("#latlonAct").text("Actual en : " + objPositionAct.coords.latitude + " , " + objPositionAct.coords.longitude);
            
            losMetros=getMetros(parseFloat(objPositionAct.coords.latitude),parseFloat(objPositionAct.coords.longitude),parseFloat(objPositionAnt.coords.latitude),parseFloat(objPositionAnt.coords.longitude));
            $("#disRecUlt").text(losMetros);
            losMetros= calcularDistanciaTotalEnMetros();
            $("#disRec").text( losMetros.toString() +"mts");
            $("#unidades").text(Unidades.toFixed(1));
            eldato= calcularValorPorUnidades();
            $("#valor").text("$"+eldato.toString());
            $("#geolocation").text("Exactitud en medida " + objPositionAct.coords.accuracy);
            ///TIEMPOS
            $("#timRec").text(restarFechasEnSegs( horIni, horAct)+" segs");    //$("#geolocation").text("Latitud :" + posicion.coords.latitude + " - Longitud :" +posicion.coords.longitude);
        }
        else{
            $("#listening").text("Esperando segunda lectura");
        }
        
    }
    if (tieneInternetSN() && bMostrarMapa ){
        if (!bGpsExterno){
            mostrarMapa();
        }
        else{
            mostrarMapaGPSExt();
        }
    }
}

/////////////////GPS EXTERNO/////////////////////////////////
 

function cargarPosicionesGPSExt(){
    sPosIni="";
    sPosAct="";
    sPosIni=aLin[0];
    sPosAct=aLin[aLin.length-1];
    
}
  
function calcularDistanciaTotalEnMetrosGPSExt(){
     
    fsumador=0;
    //return getKilometros(4.59488357,-74.15688198,4.6261026,-74.1476059);
    for (i = 1; i < aLin.length; i++) {
        fsumador = fsumador + parseFloat(getMetros(parseFloat(extraerDato(aLin[i-1],"lat")),parseFloat(extraerDato(aLin[i-1],"lon")),parseFloat(extraerDato(aLin[i],"lat")),parseFloat(extraerDato(aLin[i],"lon"))));
    }
    return parseFloat(fsumador.toFixed(1));
     
 }
  
  
function restarFechasEnSegs(hini,hfin){
    millisegsIni = hini.getTime();
    millisegsAct = hfin.getTime();
    return (millisegsAct - millisegsIni)/1000;
}

 function manejoError(error){
    var errortmp="";
    errortmp = 'error geolocaliza code: '  + error.code + 'message: ' + error.message ;
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
     retCon=retCon.toUpperCase();
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
 

 
 function calcularValorPorUnidades(){
     var retVal=0;
     horAct = new Date();
     if (Unidades<50) retVal=4100;
        
     else{
        retVal=Unidades*valorUnidad;
        if (horAct.getHours()>20) retVal=retVal+recNoct;
     } 

    //parseFloat(retVal.toFixed(3));
    return parseInt(retVal);
 }
 
 function calcularDistanciaTotalEnMetros(){
     
     fsumador=0;
     //return getKilometros(4.59488357,-74.15688198,4.6261026,-74.1476059);
     for (i = 1; i < aLat.length; i++) {
         fsumador = fsumador + parseFloat(getMetros(parseFloat(aLat[i-1]),parseFloat(aLon[i-1]),parseFloat(aLat[i]),parseFloat(aLon[i])));
     }
     return parseFloat(fsumador.toFixed(1));
     
 }

 function calcularDistanciaTotalEnMetrosGPSExt(){
     
     fsumador=0;
     //return getKilometros(4.59488357,-74.15688198,4.6261026,-74.1476059);
     for (i = 1; i < aLat.length; i++) {
         
         fsumador = fsumador + getMetros(parseFloat(extraerDato(aLin[i-1],"lat")),parseFloat(extraerDato(aLin[i-1],"lon")),parseFloat(extraerDato(aLin[i],"lat")),parseFloat(extraerDato(aLin[i-1],"lat")));
     }
     return parseFloat(fsumador.toFixed(1));
     
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
    return parseFloat(d.toFixed(3)); //Retorna tres decimales
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
    bPriVez=true;
    }

        // onError Callback receives a PositionError object
        //
function onError(error) {
    var errortmp="";
    errortmp = 'code: '  + error.code + '\n' +'message: ' + error.message + '\n';
     $("#geolocation").text(errortmp);
}


    function leerPuerto(){

       abrirPuertoYleerBuffer();
       //recibirDatoSerial("194  15:12:10.2$GPRMC,200414.000,A,0438.1299,N,07408.9062,W,0.00,285.72,131117,,,A*7B50  15:04:14.383  37$GPRMC,200414.000,A,0438.1400,N,07408.9300,W,0.00,285.72,131117,,,A*7B50  15:04:14.383  37$PGLL,,,,,201210.092,V,N*71");
    }
    

    function uintToString(uintArray) {
        var encodedString = String.fromCharCode.apply(null, uintArray),
            decodedString = decodeURIComponent(escape(encodedString));
        return decodedString;
    }
    
    function recibirDatoSerial(sDatoSerial){
        var sLetra="";
        
        //$("#debug1").text(sDatoSerial);
        
        for (i=0;i < sDatoSerial.length;i++){
            sLetra = sDatoSerial.substr(i,1);
            if (sLetra ==="$"){
                if (fLinea){
                    if (sLin.substr(0,6)==="$GPRMC" && sLin.substr(18,1)==="A"){//Solo agrega al array los Recommended Minimum position data (including position, velocity and time).
                        $("#debug2").text(sLin);
                        if (aLin.length===0){
                            sPosIni=sLin;
                            sPosAct=sLin;
                            sPosAnt=sLin;
                            aLin.push(sLin);//se agrega el primer registro
                        }
                        else if (aLin.length>0){//indica que ya hay mas de un dato GPRMC
                            sPosIni=aLin[0];
                            sPosAct=sLin;
                            sPosAnt=aLin[aLin.length-1];
                            sLatAnt = extraerDato(sPosAnt,"lat");
                            sLonAnt = extraerDato(aLin[aLin.length-1],"lon");
                            sLatAct = extraerDato(sLin,"lat");
                            sLonAct = extraerDato(sLin,"lon");
                            losMetros = getMetros(Number(sLatAnt),Number(sLonAnt),Number(sLatAct),Number(sLonAct));
                            if (losMetros>metMinRegPos){
                                aLin.push(sLin);
                                Unidades=Unidades+(losMetros/100);
                                lMovido=true;
                            }
                            mostrarTodo();
                        }
                        bEnganchado = true;
                    }
                }
                sLin="$";
                fLinea=true;
                
            }
            else{
                sLin = sLin + sLetra;
            }
            //$("#debug2").text(sLin);
        }
    }
    
    function convertirGraaDec(sGradosMinutos, bLatLon){
        /*
         * 
         * (23° 08' 06'' N) = (23 + (08 / 60) + (06 / 3600)) = 23.134999
         */
        var dd="";
        var mm="";
        //var ss="";
        var retVal=0;
        
        if (bLatLon){//si es verdadeso saca Latitud ddmm.ssss
            dd=sGradosMinutos.substr(0, 2);
            mm=sGradosMinutos.substr(2, 7);
            //ss=sGradosMinutos.substr(5, 4);
        }//longitud dddmm.ssss
        else{
            dd=sGradosMinutos.substr(0, 3);
            mm=sGradosMinutos.substr(3, 7);
            //ss=sGradosMinutos.substr(6, 4);
            
        }
        retVal=Number(dd)+(Number(mm)/60);
        return retVal.toString();
    }
    
    function extraerDato(sLinea,sDat){
        //EXTRAE EL DATO Y LO FORMATEA RETORNA STRINGS
        //$GPRMC,013732.000,A,3150.7238,N,11711.7278,E,0.00,0.00,220413,,,A*68
        var sRetVal="";
        aTmp=sLinea.split(",");
        if (sDat==="lat"){
            sRetVal=convertirGraaDec(aTmp[3],true);
            if (aTmp[3]==="S"){
                sRetVal="-"+sRetVal;
            }
        }
        else if(sDat==="lon"){
            sRetVal=convertirGraaDec(aTmp[5],false);
            if (aTmp[6]==="W"){
                sRetVal="-"+sRetVal;
            }
        }
        else if(sDat==="tmp"){
            //hhmmss.sss
            shhmmss=aTmp[1];
            //ddmmyyyy
            sddmmyyyy=aTmp[9];
            sRetVal=sddmmyyyy.substr(0,2)+"/"+sddmmyyyy.substr(2,2)+"/"+sddmmyyyy.substr(4,4);
            sRetVal= sRetVal + " " +shhmmss.substr(0,2)+":"+shhmmss.substr(2,2)+":"+shhmmss.substr(4,2);
        }
        else if(sDat==="val"){
            sRetVal=aTmp[2];
        }
        return sRetVal;
    }
    
 function obtenerTiempoRecorrido(){
    var dIni = "";
    var dFin = "";
    var segs = "";
    if (aLin.length>1){
        dIni = new Date(extraerDato(aLin[0],"tmp"));
        dFin = new Date(extraerDato(aLin[aLin.length-1],"tmp"));
        segs = restarFechasEnSegs(dIni,dFin);
    }
    return segs;
 }