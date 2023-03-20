
$.root_ = $('body');	
$.navAsAjax = false; 
$.sound_path = "sound/";
$.sound_on = true; 
var root = this,	
debugState = false,	
debugStyle = 'font-weight: bold; color: #00f;',
debugStyle_green = 'font-weight: bold; font-style:italic; color: #46C246;',
debugStyle_red = 'font-weight: bold; color: #ed1c24;',
debugStyle_warning = 'background-color:yellow',
debugStyle_success = 'background-color:green; font-weight:bold; color:#fff;',
debugStyle_error = 'background-color:#ed1c24; font-weight:bold; color:#fff;',
throttle_delay = 350,
menu_speed = 235,	
menu_accordion = true,	
enableJarvisWidgets = true,
localStorageJarvisWidgets = true,
sortableJarvisWidgets = true,		

enableMobileWidgets = false,	

fastClick = false,

boxList = [],
showList = [],
nameList = [],
idList = [],
	
chatbox_config = {
	width: 200,
	gap: 35
},

ignore_key_elms = ["#header, #left-panel, #right-panel, #main, div.page-footer, #shortcut, #divSmallBoxes, #divMiniIcons, #divbigBoxes, #voiceModal, script, .ui-chatbox"],

voice_command = true,

voice_command_auto = false,

voice_command_lang = 'en-US',

voice_localStorage = true;
 	
var versaoJavascriptGlobal = "0.0.0.1";
 
var loading = "<div style='display: block; text-align:center'><i class='fa fa-circle-o-notch fa-spin''></i> Carregando...<div>";

var loadingGrid = "<tr><td colspan='10' style='background-color:#FFF;'>" + loading + "</td></tr>";

var zeroItemGrid = "<tr><td colspan='10' style='background-color:#FFF;'>Nenhum item encontrado</td></tr>";