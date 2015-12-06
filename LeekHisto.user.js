// ==UserScript==
// @name        LeekHisto
// @namespace   Brom19
// @description Stats des précédents combats
// @include     http://leekwars.com/*
// @version     1
// @grant		   GM_getValue
// @grant		   GM_setValue
// @grant		   GM_deleteValue
// @grant		   GM_getResourceURL
// @grant		   GM_xmlhttpRequest
// @grant		   GM_log
// ==/UserScript==


var url = location.href;


/******************************* Google Chrome *******************************/
/*
if (!GM_getValue) {
    function GM_getValue(key, defaultVal) {
        var retValue = localStorage.getItem(key);
        if (!retValue) {
            return defaultVal;
        }
        return retValue;
    }
    
    function GM_setValue(key, value) {
        localStorage.setItem(key, value);
    }
}

//*/

/******************************* Save Stats combat *******************************/
function saveFightStats() {
    var teams = document.getElementById('report-general').getElementsByClassName('report');
    for (var team of teams) {
        var name = team.getElementsByClassName('name')[0].innerHTML.split("/leek/")[1].split('">')[0];
        //alert(name);
        if ((team.innerHTML.indexOf('class="dead"', 0)) > 0)	{
            var alive = -1;
        }else if ((team.innerHTML.indexOf('class="alive"', 0)) > 0)	{
            var alive = +1;
        }
        alert(name + ' : ' + alive);
    }
    //*
    
    //*/
    //GM_setValue(name1 + name2, start_time + '|' + qMet + '|' + qCri + '|' + qDeu);
}


function LunchChallenge() {
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
	var meLeek = "40661";
	var enLeek = "5402";
	var leeks = document.getElementById('garden-challenge').getElementsByClassName('leek enemy');
    for (var leek of leeks) {
        var enLeekID = leek.getAttribute("leek");
        if (enLeekID = enLeek) {
			leek.dispatchEvent(evt);
        }
    }
}


function getMeLeeks() {
    var leeks = document.getElementById('menu').getElementsByClassName('leeks')[0].getElementsByClassName('section'),
        leekList = "";
    for (var leek of leeks) {
        var meLeekID = leek.getAttribute("leek");
        if (meLeekID > 0) {
            if (leekList != "") leekList += "|";
            leekList += meLeekID;
        }
        //alert("Me leek : " + meLeekID);
    }
    GM_setValue("LeekWars-meLeeks", leekList);
}


function SeeReport() {
	url = url.replace('/fight/', '/report/');
	window.location = url;
}


function addEvtListener() {
	var leeks = document.getElementById('garden-page').getElementsByClassName('leek enemy');
    for (var leek of leeks) {
        var enLeekID = leek.getAttribute("leek");
        leek.addEventListener("mouseover", getFightStats);
    }
}


window.addEventListener("change", function (event) {
	alert("ok");
	//Pour afficher une page en cache
	//document.getElementById('center').innerHTML += "<iframe name=\"tempo\" id=\"ifram\" style=\"display:none;\"></iframe>";
	document.getElementById('center').innerHTML += "<iframe name=\"tempo\" id=\"ifram\"></iframe>";
	
    if ((url.indexOf('/report/', 0)) > 0)	{
        setTimeout(saveFightStats, 1000);
	} else if ((url.indexOf('/fight/', 0)) > 0)	{
		setTimeout(SeeReport, 2000);
	} else if ((url.indexOf('/garden', 0)) > 0)	{
        if ((url.indexOf('/garden/challenge', 0)) > 0)	{
			setTimeout(LunchChallenge, 1000);
		} else {
			setTimeout(addEvtListener, 1000);
		}
    }
	
	setTimeout(getMeLeeks,100);
	
	//http://leekwars.com/garden/challenge/<ID>
	
	var meLeeks = GM_getValue('LeekWars-meLeeks', '0').split('|');
	
	
	//alert(meLeeks);
	
    //saveFightStats();
	
    // http://leekwars.com/report/*
	
}, false);