/* Core Javascript for the Interactive Workshop
 * Post date: 8-23-2013
 * */
$(function() {
//variable to hold current position so arrows can control menu color
var current_position = 0;
//variable to enable the active header color to operate correctly
var current_lab_section = 0;

//variable to determine if the pull out tray text is open.
var contentshowing =false;

/*Load the JSON and Build the Page*/
//Holds json for the assets
var holder = null;

/*Get the page parameters if they exist  index.html?jsonId=123456798&pin=datascience */
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

//json id reads a parameter to get the json control file
//var jsonId = 'https://isdportal.oracle.com/pls/portal/tsr_admin.isd_portlets4.download_repo?p_id='+getUrlParameter('jsonId');
var jsonId = 'js/microservices-devops.json';

//the pin serves as a redirect in case the generic launchpad does not have an authenticated user.
var pin = getUrlParameter('pin');
console.log("Parameter check json repo id is: "+jsonId+"    PIN is:  " + pin);


/*$.getJSON(jsonId, function (data) {*/
$.getJSON('js/microservices-devops.json', function (data) { 
try{
        holder = data;
        buildPageDesign();
        buildHeader();
        buildInteractiveLab();
        buildMobileLab();
}
        catch(err){
            log('Error building core HTML from JSON.',err.message);
        }
}).error(function() { 
//Error function is in place if the user has not authenticated.
console.log("Can not retrieve json control file redirecting for authenitcation to https://launch.oracle.com/?"+ pin);
//window.location="https://launch.oracle.com/?"+pin;
});

function buildPageDesign(){

try{
//set title if present
if (!holder.title || !holder.title.length){    }
else {document.title =holder.title;
$("#menu-title h1").text(holder.title);
}

//set background color
if (!holder.background_color || !holder.background_color.length){    }
else { $("html").css('background-color',holder.background_color); }


//set background image
if (!holder.background_image || !holder.background_image.length){    }
else { 
$("#hidden_preload").replaceWith('<div id="hidden_preload"><img src="'+holder.background_image+' "/></div>');
$("html").css('background','url('+holder.background_image+') no-repeat fixed center center / cover'); 
}

//set how it works video
if (!holder.howitworks || !holder.howitworks.length){    }
else { $(".howto").attr("video-name",holder.howitworks);
$(".howto").show();
}


}
catch(err){
  log('Error in buildPageDesign() ',err.message);
}

}


/*Function Build Header construct the header menu
 * at the top of the page.
 * */
function buildHeader(){
//Variables to build the header
var index_mcs=0;
var labnum=0;
var labstep_number=0;
var currentHeader ="";


var htmlStr= "<header><ul id=\"menu\" class=\"menu_bg\"> <li class=\"divider first_spacer\">";

$.each(holder.workshop_content, function(index, mcsdata) {
    //if the index equals zero then we create the main elment and first sub menu
    if (index_mcs==0) {
        htmlStr=htmlStr+"<a m_num=\""+index_mcs+"\" sectionLab=\""+labnum+"\" lab=\""+labnum+"\"  href=\"#\" class=\"menuOffColor lab\">"+mcsdata.Section+"</a><ul class=\"sub-menu\">";
        currentHeader = mcsdata.Section;
    }
    //if not the first element begin building out the sublist
    else {
        //If the current index equals the new index then we create a li object
        if (currentHeader===mcsdata.Section) {
          htmlStr=htmlStr+"<li><a m_num=\""+index_mcs+"\" lab=\""+labnum+"\"  class=\"lab\" href=\"#\">"+mcsdata.SubTitle+"</a></li>";
          labstep_number++;
        }
        else {
        //close elements and create new main element
         htmlStr =htmlStr+"</ul></li>";
         labnum++;
         htmlStr = htmlStr +"<li class=\"divider\"><a  sectionLab=\""+labnum+"\" m_num=\""+index_mcs+"\" lab=\""+labnum+"\"  href=\"#\" class=\"menuOffColor lab\">" +mcsdata.Section +"</a><ul class=\"sub-menu\">";
         currentHeader =  mcsdata.Section;
         labstep_number = 0;
         }
    }
    index_mcs++;
});

htmlStr= htmlStr+"</ul></li></ul></header>";
console.log("Build Header Completed");
$("header").replaceWith(htmlStr);

//set navigation title background color if specified
if (!holder.nav_bg_color || !holder.nav_bg_color.length){    }
else { 
$(".menu_bg").css('background-color',holder.nav_bg_color);
}

//set navigation title background color if specified
if (!holder.nav_font_off_color || !holder.nav_font_off_color.length){    }
else { 
$('<style>.menuOffColor { color:'+ holder.nav_font_off_color+'; }</style>' ).appendTo( "head" );
}

//set navigation title background color if specified
if (!holder.nav_font_on_color || !holder.nav_font_on_color.length){    }
else { 
$('<style>.menuActiveColor { color:'+ holder.nav_font_on_color+'; }</style>' ).appendTo( "head" );

}




}

 
function buildInteractiveLab(){
console.log("Starting to InteractiveWebBody");
var menu_number=0;
var count=1;
var temp_video = "";
var temp_lab = "";
var temp_class = "";
var temp_text = "";
var htmlStr= "<ul id=\"wi-el\" class=\"wi-container\">";


//Loop through and build architecture frames inside HTML page
$.each(holder.workshop_content, function(index, mcsdata) {
count=1;
//We need to determine if there is a Lab to place in the content tray
if (!mcsdata.Link || !mcsdata.Link.length) {
//insert the trayhidden into div ltray when lab guide not present.
temp_lab ="<div class=\"l_tray l_traysize trayhidden\">" +
"<div class=\"l_icon showlab\" lab-link=\"no lab\">" +
"<img src=\"images/lab_guide_icon-01.svg\" class=\"lab_icon\" alt=\"video_icon\"/>" +
"</div><div class=\"l_text\">View Lab Guide</div></div>";
}
else{
temp_lab = "<div class=\"l_tray l_traysize\">" +
"<div class=\"l_icon showlab\" lab-link=\"" + mcsdata.Link +"\">" +
"<img src=\"images/lab_guide_icon-01.svg\" class=\"lab_icon\" alt=\"video_icon\"/>" +
"</div><div class=\"l_text showlab\" lab-link=\"" + mcsdata.Link +"\">View Lab Guide</div></div>";
count++;
} 


//We need to determine if there is a Video to place in the content tray
if (!mcsdata.Video || !mcsdata.Video.length) {
//insert the trayhidden into div v_tray when lab guide not present.
temp_video ="<div id=\"v_tray\" class=\"v_tray v_traysize trayhidden\">" +
"<div id=\"v_icon\" class=\"v_icon showvideo\" video-name=\"no video\" video-poster=\"noPoster\">" +
"<img src=\"images/play_icon-01.svg\" class=\"video_icon\" alt=\"video_icon\"/>" +
"</div><div id=\"v_text\" class=\"v_text\">Watch Demonstration</div></div>";
}
else {
temp_video = "<div id=\"v_tray\" class=\"v_tray v_traysize\">" +
"<div id=\"v_icon\" class=\"v_icon showvideo\" video-name=\"" + mcsdata.Video +
"\" video-poster=\"" + mcsdata.Poster + "\">" +
"<img src=\"images/play_icon-01.svg\" class=\"video_icon\" alt=\"video_icon\"/></div>" +
"<div id=\"v_text\" class=\"v_text showvideo\" video-name=\"" + mcsdata.Video +
"\" video-poster=\"" + mcsdata.Poster + "\">Watch Demonstration</div></div>";
count++;
}

//Since the elements in and around the content tray are dynamic we need set the CSS Classes 
//for promper formating
switch (count) {
case 1:
  temp_class = "c_height1";
  temp_text = "text_1";
  break;
case 2:
  temp_class = "c_height2";
  temp_text = "text_2";
  break;
case 3:
  temp_class = "c_height3";
  temp_text = "text_3";
  break;
default:
//do nothing
}



//Build Core Element HTML
htmlStr = htmlStr +"<li e_num=\""+menu_number+"\"><div id=\"title\" class=\"" + isFirst(menu_number) +" "+
hasTitle(mcsdata.Title.length, mcsdata.SubTitle.length)+ "\">\n<h3>" +
mcsdata.Title+"</h3><h4>" + mcsdata.SubTitle+"</h4>"+
"</div><div id=\"previousbutton\" class=\"" + isFirst(menu_number) + "\">" +
"<img src=\"images/btn_left.png\" class=\"gotoprevious\" alt=\"previous button\"/>" +
"</div><div id=\"architecture\"><img id=\"arch_img_" + menu_number +
"\" src=\"" +imgPrefixCheck(mcsdata.Image)+ mcsdata.Image + "\" alt=\"Your Image is not showing\"/>" +
"</div><div id=\"nextbutton\" class=\""+isLast(menu_number)+"\"><img src=\"images/btn_right.png\" class=\"gotonext\" alt=\"NextNavigationimage\"/>" +
"</div><div id=\"contents\" class=\"" + temp_class + "\">" +
"<div id=\"tray_nav_wrapper\"> "+ 
temp_lab + temp_video+
"<div id=\"c_tray\" class=\"c_tray showcontents c_traysize\"><div class=\"c_icon\">" +
"<img src=\"images/icon_contents.svg\" class=\"contents_icon\" alt=\"video_icon\"/>" +
"<div id=\"c_label\"><p>Details</p></div></div>" +
"<div id=\"c_text\" class=\"c_text\">Details</div>\n" +
"</div></div><div id=\"text\" class=\"showme " + temp_text + "\"><p>" +
mcsdata.Text + "</p></div></div></li>";
menu_number++;
});

htmlStr= htmlStr+"</ul></li></ul></header>";
$("#wi-el").replaceWith(htmlStr);
$("#wi-el li[e_num="+current_position+"]").css({display:'list-item'});

} 

/*function pre-check determines if a http element is present and if not defaults to a local image*/
function imgPrefixCheck(a){
 if (a.indexOf("http")>-1) {
  return "";
 }
return "images/architecture/";
  
}


function buildMobileLab(){
var video_css ="";
var lab_css ="";
var hideActions = "";
var htmlStr ="<div id=\"m_container\">";

$.each(holder.workshop_content, function(index, mcsdata) {
     if (!mcsdata.Link || !mcsdata.Link.length) {   
            lab_css ="trayhidden";
        }
     if (!mcsdata.Video || !mcsdata.Video.length) {
            video_css = "trayhidden";
        }   
     if (!mcsdata.Video || !mcsdata.Video.length && !mcsdata.Link || !mcsdata.Link.length) {
            hideActions = "trayhidden";
     }
     htmlStr =htmlStr+"<figure><div id=\"m_title\" class=\"" + hasTitle(mcsdata.Title.length,mcsdata.SubTitle.length) + "\"><h3>"+ mcsdata.Title +"</h3><h4>"+ mcsdata.SubTitle +
            "</h4></div><img src=\""+imgPrefixCheck(mcsdata.Image)+ mcsdata.Image +"\" alt=\"Architecture Image\" class=\"m_architecture\"/>" +
            "<figcaption>" + mcsdata.Text +"<div id=\"m_actions\" class=\""+hideActions+"\">" +
            "<a href=\"#\" class=\"showvideo action "+video_css+"\" video-name=\""+mcsdata.Video +"\" video-poster=\""+ mcsdata.Poster +"\">&nbsp;&nbsp;&#x25BA;&nbsp;&nbsp;Demo&nbsp;&nbsp;</a>" +
            "<a href=\"#\" class=\"showlab action "+lab_css+"\" lab-link=\""+ mcsdata.Link +"\">&nbsp;&nbsp;&#x25BC;&nbsp;&nbsp;Download&nbsp;&nbsp;</a>" +
            "</div></figcaption><div id=\"m_scroll\" class=\"loaderwhite\"><span>&or;</span><span><br>&or;</span><span><br>&or;</span></div></figure>";
    
});
htmlStr =htmlStr+"</div>";
$("#m_container").replaceWith(htmlStr);

}

//funciton to determine if first JSON element
function isFirst(a){
if (a==0) {
return "notShown\"";    
}
return "";
} 

//funciton to determine if last JSON element
function isLast(a){
if (a>=holder.workshop_content.length-1) {
return "notShown";    
}
return "";
} 

function hasTitle(a,b){
    try { 
    if (a<3 && b<3) {
    return "notShown";
    }    
    
    return "";   
    }
    
    catch (err){
    console.log("Error in hasTitle. " + err);
    return "";
    }

}
 

/*On go to previous Click*/
$(document.body).on('click', '.gotoprevious' , function(e) {
  
   previous();
   log($('#arch_img_'+current_position).attr("src"),'Previous Button Clicked Viewing Architecture Image');

} );

$(document.body).on('click', '.gotonext' , function(e) {
   
   next();
   log($('#arch_img_'+current_position).attr("src"),'Next Button Clicked Viewing Architecture Image');
} );


//Move to the next step in the array
function next() {

if (current_position<(holder.workshop_content.length-1)){
    //hide current value
    $("#wi-el li[e_num="+current_position+"]").css({display:'none'});
    current_position++;

    //Show New Value
    $("#wi-el li[e_num="+current_position+"]").css({display:'list-item'});
    ActiveMenu($(".lab[m_num="+current_position+"]").attr('lab'));
    trayLogger();
}

}

//go to the previous item in the architecture
function previous() {
   if (current_position!=0){
   //hide current value
   $("#wi-el li[e_num="+current_position+"]").css({display:'none'});
   
   current_position--;
   
   //Show New Value
   $("#wi-el li[e_num="+current_position+"]").css({display:'list-item'});
   ActiveMenu($(".lab[m_num="+current_position+"]").attr('lab'));
   trayLogger();
   } 
}

/*Function goTo takes a user to a specific step in the architecture flow.*/
function goTo(a){
    if (current_position>=0 && current_position<=holder.workshop_content.length) {
        //hide current value
        $("#wi-el li[e_num="+current_position+"]").css({display:'none'});
        
        //Set curent value
        current_position=a;
        
        //Show New Value
        $("#wi-el li[e_num="+current_position+"]").css({display:'list-item'});
        trayLogger();
    }
}

/*On architecture change if content tray is open log it. 
 * */
function trayLogger(){
    if(contentshowing){
        log(' ' ,'Content Tray Opened on Slide Change by Default');    
    }
}


/*Left hand menu controls. This code manages the actions in the pull out tray.*/



/*On hover show the text for Watching the video
 * */
  $(document.body).on('mouseenter', '.v_icon' , function() {
if (!contentshowing) { $(".v_text").show(); }
});

$(document.body).on('mouseleave', '.v_icon' , function() {
$(".v_text").hide();
});



/*On hover show the text for viewing the lab guide. 
*/
$(document.body).on('mouseenter', '.l_icon' , function() {
if (!contentshowing) { $(".l_text").show(); }
});

$(document.body).on('mouseleave', '.l_icon' , function() {
$(".l_text").hide();
});


/*On hover show the text for Watching the video
 * */
 $(document.body).on('mouseenter', '.c_tray' , function() {
if (!contentshowing) { $(".c_text").show(); }
});

$(document.body).on('mouseleave', '.c_tray' , function() {
$(".c_text").hide();
});
 


//Get the paths of the video and poster directories
 var _video = document.getElementById("playvideo");
 var src='empty'; 
 var poster='empty';
 var isVideoShowing =false;
 
 
/*function swaps out video and poster for playing another*/
function swapvideo() {
//swap the poster image
$('#playvideo').attr('poster', poster);
//swap the core html
$('#playvideo').html('<source src="'+src+'" type="video/mp4"/>' +
'<p><br><br>' +'Your browser does not support the HTML 5 video. ' +
'<a href="'+src+'"> ' +'Try downloading the video instead from here.<\/a><\/p>');

$('#playvideo').load();
$('#playvideo').show();
} 

/*Code to close the video*/
$(document.body).on('click', '#c_video' , function() {
     log(_video.currentTime,'Video Timecode at close/pause: ');
      //Pause the video
     _video.pause();
      //hide video region
     $("#blackout").hide();
     isVideoShowing =false;
     
     log(src,'Video Window Closed');
} );

/*Function to show video with blackout*/
function showvideo(){
   //Fade in video
   $("#blackout").fadeIn(400);
}; 


/*On click play the video*/
$(document.body).on('click', '.showvideo' , function() {
//get the videoname into the src variable * poster into poster variable. These are custom attributes.
src = $(this).attr('video-name'); 
poster=  $(this).attr('video-poster');
//alert('Poster is '+ poster+'  filename is: '+src);  
swapvideo();
showvideo();
_video.play();
isVideoShowing =true;
log(src,'Video Playing');
});


/*When video ends show the poster*/
_video.addEventListener('ended', function () {
log(_video.currentTime,'Video Ended Timecode, Total watch Time: ');
_video.pause();
_video.currentTime = 1;
log(src,'Video Ended');
}, false);


/*onclick open the lab guide*/
var lab_path="";

$(document.body).on('click', '.showlab' , function() {
window.open(lab_path+$(this).attr('lab-link'));
log($(this).attr('lab-link') ,'Document Downloaded');
});


/*Code to close the instructions*/
$(document.body).on('click', '#c_instructions' , function() {
      //hide video region
     $("#instructions").hide();
     log(' ','Instructions Hidden');
} );

/*Show the instructions*/
$(document.body).on('click', '#ins_menu' , function() {
     $("#instructions").show();
     log(' ','Instructions Shown');
} );


/*Onclick activate the pull out tray to show more text.
 * The method uses dummy . CSS classes to insure one click can functionally
 * handle all the changes regardless of architecture image
 * */ 
 $(document.body).on('click', '.showcontents' , function() {
        if(contentshowing) {
            hideContentsTray();
        }
        else {
            showContentsTray();
        }
});


/*function to abstract the actions required to hide the contents pull out tray.
 * Abstracting for clearing tray when previous or next arrow clicked.
 * */
function hideContentsTray (){
           $(".showme").hide();
           $( ".l_tray" ).removeClass( "movemenu" );
           $( ".v_tray" ).removeClass( "movemenu" );
           $( ".c_tray" ).removeClass( "movemenu" );
           $( ".l_tray" ).addClass( "l_traysize" );
           $( ".v_tray" ).addClass( "v_traysize" );
           $( ".c_tray" ).addClass( "c_traysize" );
           contentshowing=false;
           log( ' ' ,'Content Tray Closed');
}


function showContentsTray() {
           $(".c_text").hide();
           $(".showme").fadeIn(300);
           $( ".l_tray" ).removeClass( "l_traysize" );
           $( ".v_tray" ).removeClass( "v_traysize" );
           $( ".c_tray" ).removeClass( "c_traysize" );
           $( ".l_tray" ).addClass( "movemenu" );
           $( ".v_tray" ).addClass( "movemenu" );
           $( ".c_tray" ).addClass( "movemenu" );
           contentshowing=true;
           log( ' ' ,'Content Tray Opened');
}


function ActiveMenu(menunumber) {
$(".lab[sectionlab="+current_lab_section+"]").removeClass("menuActiveColor");
$(".lab[sectionlab="+current_lab_section+"]").addClass("menuOffColor");
current_lab_section=menunumber;
$(".lab[sectionlab="+menunumber+"]").removeClass("menuOffColor");
$(".lab[sectionlab="+menunumber+"]").addClass("menuActiveColor");
}


/*When someone clicks on the top left title we navigate to the intro current_lab_section*/
$(document.body).on('click', '#menu-title' , function() {
goTo(0);
ActiveMenu(0);
log(holder.title,'Header Menu Title Click');
log( $('#arch_img_'+current_position).attr("src"),'Header Tab Click -' +  holder.workshop_content[0].Section +holder.workshop_content[0].Title+" "+holder.workshop_content[0].SubTitle); 
});
    
/*On any click in the header we need to perform the following actions.*/   
$(document.body).on('click', '.lab' , function() {
goTo($(this).attr('m_num'));
ActiveMenu($(this).attr('lab'));
log( $('#arch_img_'+current_position).attr("src"),'Header Tab Click -' +  holder.workshop_content[$(this).attr('m_num')].Title +" "+holder.workshop_content[$(this).attr('m_num')].SubTitle); 
});



/*End of the Jquery Header Actions*/
$(document.body).on('click', '#contact_us' , function() {
goTo(holder.workshop_content.length-1);
});

/*Hot Key navigation left and right to scroll through the architecture diagrams.*/
document.addEventListener("keyup", function(e) {

        //if C pressed
        if (e.keyCode == 67) {
           if(contentshowing){
               hideContentsTray();
           }else {
              showContentsTray();
           }
        }

        //if right arrow pressed
        if (e.keyCode == 39) {
        
        if(isVideoShowing) {
          //do not progress the slides if video is showing   
        }
        else {
            next();
            log($('#arch_img_'+current_position).attr("src"),'Right Key Pressed Clicked Viewing Architecture Image');
         }
        }
        
        //if left arrow pressed
        if (e.keyCode == 37) {
                if(isVideoShowing) {
          //do not progress the slides if video is showing   
        }
        else {
            previous();
            log($('#arch_img_'+current_position).attr("src"),'Left Key Pressed Clicked Viewing Architecture Image');
        }
       }
    }, false);


//Test to see if we can log page load time wait 10 seconds then log
setTimeout(function(){log('Page Load Time is: ',millisecondsLoading);},8500);

/*Check to see accessing device is mobile when the page loads and post version number*/
var viewportWidth = $(window).width();
var viewportHeight = $(window).height();
var device_dimensions='Browser Width: ' + viewportWidth+ '  Height: '+viewportHeight;
if ($('#m_container').is(':visible')) {   
  log( 'Mobile Device Experience Enabled.',device_dimensions );  
}
else {
  log( 'Web Experience Enabled.',device_dimensions );  
}

});