if ($("#gmap_jquery").length) {
	if("undefined"==typeof google){var googleLibsUrl="https://maps.google.com/maps/api/js?v=3&language=it";"undefined"!=typeof window.googleMapKey&&(googleLibsUrl+="&key="+googleMapKey);var gscript=document.createElement("script");gscript.type="text/javascript",gscript.src=googleLibsUrl;var s=document.head||document.getElementsByTagName("head")[0];s.appendChild(gscript)}var myStyles=[{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]}],infowindow,setDirection={options:{dirContainer:document.getElementById("dirContainer"),dirService:"",dirRenderer:"",myMarker:"",mapId:"",zoom:"",mapType:"",showCursor:"",maps:"",draggable:""},set:function(e,t,o,i,n,r){setDirection.options.mapId=e,setDirection.options.zoom=o,setDirection.options.mapType=i,setDirection.options.showCursor=n,setDirection.options.draggable=r,setDirection.options.myMarker=new Array;for(names in t)setDirection.options.myMarker[names]=t[names];setDirection.options.myMarker.infowindow='<div id="ballon" class="ballon"><h5>'+setDirection.addslashes(setDirection.options.myMarker.labelTitle)+"</h5>"+setDirection.options.myMarker.infowindow+"<br /><br />"+setDirection.addslashes(setDirection.options.myMarker.labelCalculate)+'<br /><a href="javascript:;" onclick="setDirection.init(\'<h5>'+setDirection.addslashes(setDirection.options.myMarker.labelTitle)+"</h5><br />"+setDirection.addslashes(setDirection.options.myMarker.labelCalculate)+"','"+setDirection.addslashes(setDirection.options.myMarker.labelFrom)+"','"+setDirection.addslashes(setDirection.options.myMarker.labelTo)+"','FROM','"+setDirection.options.myMarker.lat+","+setDirection.options.myMarker.lon+'\');" title="'+setDirection.options.myMarker.labelCalculate+'"><strong>'+setDirection.options.myMarker.labelFrom+'</strong></a> - <a href="javascript:;" onclick="setDirection.init(\'<h5>'+setDirection.addslashes(setDirection.options.myMarker.labelTitle)+"</h5><br />"+setDirection.addslashes(setDirection.options.myMarker.labelCalculate)+"','"+setDirection.addslashes(setDirection.options.myMarker.labelFrom)+"','"+setDirection.addslashes(setDirection.options.myMarker.labelTo)+"','TO','"+setDirection.options.myMarker.lat+","+setDirection.options.myMarker.lon+'\');" title="'+setDirection.options.myMarker.labelCalculate+'"><strong>'+setDirection.options.myMarker.labelTo+"</strong></a></div>",setDirection.openMap()},openMap:function(){var e=new google.maps.LatLng(setDirection.options.myMarker.lat,setDirection.options.myMarker.lon);void 0==setDirection.options.mapType&&(setDirection.options.mapType="ROADMAP"),void 0==setDirection.options.showCursor&&(setDirection.options.showCursor=!1);var t={disableDefaultUI:setDirection.options.showCursor,mapTypeControl:!0,mapTypeControlOptions:{style:google.maps.MapTypeControlStyle.DROPDOWN_MENU},zoom:setDirection.options.zoom,center:e,draggable:setDirection.options.draggable,mapTypeId:google.maps.MapTypeId[setDirection.options.mapType],styles:myStyles};setDirection.options.maps=new google.maps.Map(document.getElementById(setDirection.options.mapId),t);var o=new google.maps.LatLng(setDirection.options.myMarker.lat,setDirection.options.myMarker.lon),i=new google.maps.Marker({position:o,map:setDirection.options.maps,icon:setDirection.options.myMarker.icon,zIndex:1e4});""!=setDirection.options.myMarker.infowindow&&google.maps.event.addListener(i,"click",function(){infowindow.open(setDirection.options.maps)})},init:function(e,t,o,i,n){if(fromS=setDirection.addslashes(t),toS=setDirection.addslashes(o),document.getElementById("ballon")){setDirection.options.dirService=new google.maps.DirectionsService,setDirection.options.dirRenderer=new google.maps.DirectionsRenderer;var r,s;"FROM"==i?(r='<form name="direction" action="javascript:;" method="get"><input id="from-input" type="hidden" value="'+n+'" />',r+='<input id="to-input" type="text" value="" class="inputE" />',r+='<input class="inputB" onclick="setDirection.getDirections(document.getElementById(\'from-input\').value,document.getElementById(\'to-input\').value);" type="button" value=">" /></form>',s=e+"<br /><strong>"+t+'</strong> - <a href="javascript:;" onclick="setDirection.init(\''+e+"','"+fromS+"','"+toS+"','TO','"+n+"');\"><strong>"+o+"</strong></a>"+r):(r='<form name="direction" action="javascript:;" method="get"><input id="from-input" type="text" value="" class="inputE" />',r+='<input id="to-input" type="hidden" value="'+n+'" />',r+='<input class="inputB" onclick="setDirection.getDirections(document.getElementById(\'from-input\').value,document.getElementById(\'to-input\').value);" type="button" value=">" /></form>',s=e+'<br /><a href="javascript:;" onclick="setDirection.init(\''+e+"','"+fromS+"','"+toS+"','FROM','"+n+"');\"><strong>"+t+"</strong></a> - <strong>"+o+"</strong>"+r),document.getElementById("ballon").innerHTML=s}},getDirections:function(e,t){var o={origin:e,destination:t,travelMode:google.maps.DirectionsTravelMode.DRIVING,unitSystem:google.maps.DirectionsUnitSystem.METRIC,provideRouteAlternatives:!0};setDirection.options.dirService.route(o,setDirection.showDirections)},showDirections:function(e,t){return t!=google.maps.DirectionsStatus.OK?void(void 0!=typeof dirStatusError?alert(dirStatusError+"\n(Google reports: "+t+")"):alert("The address entered was not found\n(Google reports: "+t+")")):("function"==typeof jq?jq("html,body").animate({scrollTop:jq("#"+setDirection.options.mapId).offset().top-20},1e3):"function"==typeof jQuery&&$("html,body").animate({scrollTop:$("#"+setDirection.options.mapId).offset().top-20},1e3),setDirection.openMap(),setDirection.options.dirRenderer.setMap(null),setDirection.options.dirRenderer.setMap(setDirection.options.maps),document.getElementById("dirContainer").innerHTML="",setDirection.options.dirRenderer.setPanel(document.getElementById("dirContainer")),void setDirection.options.dirRenderer.setDirections(e))},addslashes:function(e){return(e+"").replace(/[\\"']/g,"\\$&").replace(/\u0000/g,"\\0")}};
}