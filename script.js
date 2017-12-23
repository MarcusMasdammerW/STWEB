var lock;

// Wizard variables
var oldMapName;
var didInt;
var didIntCnt

//connect to server
var socket = io.connect('http://localhost:3000');

//Webpage Navigation
//- Main Tab
function openTab(evt, tabName){
  // Declare all variables
  var i, tabcontent;
  //Pending
  //Declare location of Status Bar
  var statusBar = document.getElementById("statusBar");
  //Check if lock is on, if true prompomt confirm
  if(lock == true){
      wizz(0);
    }
  }
  //If lock is off change tab
  if(lock == false){
  // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
     }

    // Show the current tab requested
    document.getElementById(tabName).style.display = "block";
  }
  // Change tab look
  switch (tabName) {
    case 'status':
      document.getElementById("naviBar").src="../StarTracker_GUI_Images/statusTab.svg";
      break;
    case 'maps':
      document.getElementById("naviBar").src="../StarTracker_GUI_Images/mapsTab.svg";
      break;
    case 'ccdoff':
      document.getElementById("naviBar").src="../StarTracker_GUI_Images/CCDOffsetTab.svg";
      break;
    case 'trackingOutput':
      document.getElementById("naviBar").src="../StarTracker_GUI_Images/trackingOutputTab.svg";
      break;
    case 'advanced':
      document.getElementById("naviBar").src="../StarTracker_GUI_Images/advancedTab.svg";
      break;
    default:
      document.getElementById("naviBar").src="../StarTracker_GUI_Images/statusTab.svg";
      break;
  }
}
//- Maps Navigation
function mapsTab(pge){
  // Get all elements with class="Maps Content" and hide them
    var mapcontent = document.getElementsByClassName("mapsContent");
    for (i = 0; i < tabcontent.length; i++) {
      mapcontent[i].style.display = "none";
     }
    // Show the current tab requested
    document.getElementById(pge).style.display = "block";
  }
}
//- Wizard Navigation
function wizz(pge){
  var statusBar = document.getElementById("statusBar");
  switch(pge){
    case 0:
    //reset all values and exit after prompt
    if(confirm("Are you sure you want to quit?\n (All changes will be lost and the previous map reloaded)")==true){
      openTab(event,'status');
      wizzardres();
      locking(false);
      statusBar.style.display = "block";
      emitMapLoad(oldMapName);
    }
    break;
    case 1: //Get StarTracker ready and load wizzard 1
    oldMapName = document.getElementById("mapName").value;
    emitStd('newMapName');
    mapsTab('wz1');
    locking(true);
    statusBar.style.display = "none";
      mapsTab('wz2');
    break;
    case 3: //loads wizzard 3 after checking values
    var stH=document.getElementById("starHeightVal").value;
    if(isNaN(stH)){
      alert("Must input numbers");
    }else{
      emitInt('starHeightVal');
      emitStd('cameraDirection');
      mapsTab('wz3');
    }
    break;
    case 4://loads wizzard 4 after checking int is completed
    //Has int been completed;
    if(didInt==true){
      socket.emit('mappingTgl');
      mapping
      mapsTab('wz4');
    }else {
      alert("Must complete initialisation");
    }
    break;
    case 6://Completed Wizzard return to status screen after checking values
    var oX=document.getElementById("O_Xinput").value;
    var stH=document.getElementById("stHeight").value;
    if (isNaN(oX)||isNaN(stH))
    {
      alert("Must input numbers");
    }else{
      locking(2);
      openTab(event, 'status');
      wizzardres();
      alert("You Have Completed The Wizard");
      statusBar.style.display = "block";
    }
  }
}
//-- wizzard reset
function wizzardres(){
  var name = document.getElementById("newMapName");
  name.value = null;
  document.getElementById("expoVal").value = document.getElementById("expoVal").defaultValue;
  document.getElementById("radVal").value = document.getElementById("radVal").value.defaultValue;
  document.getElementById("starHeightVal").value = document.getElementById("starHeightVal").defaultValue;
  document.getElementById("O_Xinput").value = document.getElementById("O_Xinput").defaultValue;
  document.getElementById("stHeight").value = document.getElementById("stHeight").defaultValue;
  didInt = false;
  didIntCnt = 0;
}


//- Menu locking
function locking(state){
  if (state = true){
    lock = true;
  }else if (false) {
    lock = false;
    var statusBar = document.getElementById("StatusBar");
    statusBar.style.display = "block";
  }
}

//Server communitcation
//- Incomming


//- Outgoing
//-- Subtracts by factor and emits a change call
function negIncre(source, factor){
  var toChg = (document.getElementById(source).value)*1;
  var chgBy = factor*1;

  var newVal = ((toChg/chgBy)-(chgBy/chgBy))/chgBy;
  document.getElementById(source).value = newVal;
  // emmit change to server
  socket.emit('change',{
    source: source,
    value: newVal
  })
}
//-- Adds by factor and emits a change call
function posIncre(source, factor){
  var toChg = (document.getElementById(source).value)*1;
  var chgBy = factor*1;

  var newVal = ((toChg/chgBy)+(chgBy/chgBy))/chgBy;
  document.getElementById(source).value = newVal;
  // emmit change to server
  socket.emit('change',{
    source: source,
    value: newVal
  })
}
//-- Check if num and then emits
function emitInt(source){
  var valInt = document.getElementById(source).value;
  if(isNaN(valInt)){
    alert("Must input Numbers Only!!!");
  }else{
    socket.emit('change',{
      source: source,
      value: valInt
    })
  }
}
//-- Standard output
function emitStd(source){
  var toSend = document.getElementById(source).vale;
  socket.emit('change',{
    source: source,
    value: toSend
  })
}
//-- Map Load
function emitMapLoad(map){
  socket.emit('mapLoad',{
    toLoad: map
  })
}
// Misc.
//- Incrementals that don't send
//-- negative increment
function stdNegIncre(source, factor){
  var toChg = (document.getElementById(source).value)*1;
  var chgBy = factor*1;

  var newVal = ((toChg/chgBy)-(chgBy/chgBy))/chgBy;
  document.getElementById(source).value = newVal;
}
//-- positive increment
function stdPosIncre(source, factor){
  var toChg = (document.getElementById(source).value)*1;
  var chgBy = factor*1;

  var newVal = ((toChg/chgBy)+(chgBy/chgBy))/chgBy;
  document.getElementById(source).value = newVal;
}
//- Interger Checker
function intChk(source){
  var valInt = document.getElementById(source).value;
  if(isNaN(valInt)){
    alert("Must input Numbers Only!!!");
    valInt.value = valInt.defaultValue;
  }
}
//- initialisation
function initWiz(valIn){
  didInt = true;
  socket.emit('initFam');
  didIntCnt =+ 1;
  switch (valIn) {
    case 0:
    didInt = false;
    didIntCnt = 0;
      break;
    case 1:
    var btnText = getElementById('toggleBtnInit').innerHTML;

      break;
    default:

  }
}
//- HUD Manager
//-- Minimize All
function hideAll(){

}
//-- Minimize all but div Button
function btnAndStars(){

}
