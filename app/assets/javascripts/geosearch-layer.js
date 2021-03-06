
function replaceMapTable(smaps) {
  for (var a = 0; a < smaps.length; a++) {
    var smap = smaps[a];
    var depicts_year = smap.depicts_year == null ? "" : smap.depicts_year;
    var tableRow = "<tr id='map-row-" + smap.id + "' class='minimap-tr'>" +
            "<td class='mini-map-thumb'><img src='" + mapThumbBaseURL + "/" + smap.id + "' height='70' ></td>" +
            "<td><span id='smap-title-"+ smap.id+"'></span><br /><span id='smap-year-"+ smap.id+"'></span><br />"+ 
            "<a href='" + mapBaseURL + "/" + smap.id + "' target='_blank'>"+I18n["geosearch"]["open_layer"]+"</a> </td></tr>";
    jQuery("#searchmap-table").append(tableRow);
    jQuery("#smap-title-"+smap.id).text(smap.name);
    jQuery("#smap-year-"+smap.id).text(depicts_year);
  }
  addClickToTable();
}
function insertMapTablePagination(total, per, current) {
  var num = current * per;
  var start = num - per;
  if (start  == 0){
    start = 1;
  }
  var last = false;
  var nextlot = current + 1;
  var prevlot = current - 1;
  if (total / per < current) {
    num = total;
    last = true;
  }
  if (total > 0) {
    var tableCaption = "<caption>"+I18n["geosearch"]["found"]+ " " + total + " "+ I18n["geosearch"]["found_layers"]+  " " + I18n["geosearch"]["showing"] + " "+ start + " - " + num;
  } else {
    var tableCaption = "<caption>"+ I18n["geosearch"]["found"] + " "+ total + " "+I18n["geosearch"]["found_layers"];
  }

  jQuery("#searchmap-table").append(tableCaption);


  var footer = "";
  var next = "<a href='#' onclick='do_search(" + nextlot + "); return false;'>"+I18n["geosearch"]["more"]+"<a/>";
  var previous = "";

  if (current > 1) {
    previous = "<a href='#' onclick='do_search(" + prevlot + ");'>"+I18n["geosearch"]["prev"]+"</a>&nbsp;&nbsp; ";
  }
  if (last) {
    next = "";
  }
  footer = "<tfoot><tr><td  colspan='2'>" + previous + next + "</td></tr></tfoot>";

  jQuery("#searchmap-table").append(footer);
}


function addMapToMapLayer(mapitem) {
  var bbox_array = mapitem.bbox.split(",").map(Number);
  var bbox = ol.proj.transformExtent(bbox_array, 'EPSG:4326', 'EPSG:3857');

  var feature = new ol.Feature({
    geometry: new ol.geom.Polygon.fromExtent(bbox),
    mapTitle: mapitem.name,
    mapId:   mapitem.id
  });
  mapIndexLayer.getSource().addFeature(feature);
}

function getPopupHTML(feature){
  var mapId = feature.get('mapId');

  var img = new Image();
  img.src = mapThumbBaseURL + mapId;
  img.onload = function(){
    var width = img.width;
    var height = img.height;
    var thumbHeight = 80;
    var thumbWidth = (thumbHeight / height) * width;
    var thumbWidth = Math.round(thumbWidth);
    jQuery(".searchmap-popup img").attr("height",thumbHeight);
    jQuery(".searchmap-popup img").attr("width",thumbWidth);
  }

  popupHTML = "<div class='searchmap-popup'><a href='" + mapBaseURL + "/" +
 mapId + "' target='_blank'>" +
  //feature.mapTitle+"</a><br />"+
  "<a href='#a-map-row-" + mapId + "' ><img id='popup-title' src='" + mapThumbBaseURL + "/" + mapId + "' height='80'></a>" +
  "<br /> <a href='" + mapBaseURL + "/" + mapId + "' target='_blank'>"+I18n["geosearch"]["open_layer"]+"</a>" +
  "</div>"

  return popupHTML;
}

function getTitle(feature){
  return feature.get('mapTitle');
}
