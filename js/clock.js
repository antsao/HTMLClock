function getTime() {
   var date = new Date();
   var hours = date.getHours();
   var minutes = "" + date.getMinutes();
   var seconds = "" + date.getSeconds();
   var ampm;
   if (hours >= 12) {
      ampm = "pm";
      if (hours != 12) {
         hours = hours - 12;
      }
   }
   else {
      if (hours == 0) {
         hours = 12;
      }
      ampm = "am";
   }
   if (minutes.length < 2) {
      minutes = "0" + minutes;
   }
   if (seconds.length < 2) {
      seconds = "0" + seconds;
   }
   document.getElementById('clock').innerHTML = hours + ":" + minutes + ":" + seconds + " " + ampm;
   setTimeout(function(){ getTime() }, 1000);
}

function getTemp() {
   $.getJSON(
      "https://api.forecast.io/forecast/5c730cebc98c866622950570302580d9/35.300399,-120.662362?callback=?",
      function (data) {
         $("#forecastLabel").html(data.daily.summary);
         $("#forecastIcon").attr("src", "img/" + data.daily.icon + ".png");
         var temp = data.daily.data[0].temperatureMax;
         if (temp < 60) {
            $("body").addClass("cold");
         }
         else if (temp >= 60) {
            $("body").addClass("chilly");
         }
         else if (temp >= 70) {
            $("body").addClass("nice");
         }
         else if (temp >= 80) {
            $("body").addClass("warm");
         }
         else if (temp >= 90) {
            $("body").addClass("hot");
         }
      });
}

function showAlarmPopup() {
   $("#mask").removeAttr("class");
   $("#popup").removeAttr("class");
}

function hideAlarmPopup() {
   $("#mask").attr("class", "hide");
   $("#popup").attr("class", "hide");
}

function deleteAlarm(alarmName) {
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   query.find({
      success: function(results) {
         for (var i = 0; i < results.length; i++) {
            console.log(results[i].get("alarmName"));
            if (results[i].get("alarmName").replace(/\s+/g, '') == alarmName) {
               results[i].destroy({});
               $("#" + alarmName).remove();
            }
         }
      }
   });
}

function insertAlarm(hours, mins, ampm, alarmName) {
   var newDiv = $("<div></div>").addClass("flexible");
   var id = alarmName;
   id = id.replace(/\s+/g, '');
   newDiv.attr("id", id);
   var first = $("<div></div>").addClass("name");
   first.html(alarmName);
   var second = $("<div></div>").addClass("time");
   second.html(hours + ":" + mins + " " + ampm);
   newDiv.append(first);
   newDiv.append(second);
   var button = $('<input type="button" value="Delete" class="button"/>');
   button.attr("onclick", "deleteAlarm(\"" + id + "\")");
   newDiv.append(button);
   $("#alarms").append(newDiv);
}

function addAlarm() {
   var hours = $("#hours option:selected").text();
   var mins = $("#mins option:selected").text();
   var ampm = $("#ampm option:selected").text();
   var alarmName = $("#alarmName").val();

   var AlarmObject = Parse.Object.extend("Alarm");
   var alarmObject = new AlarmObject();
   var time = {
      hours : hours,
      mins : mins,
      ampm : ampm,
   };
   alarmObject.save({"time": time, "alarmName": alarmName}, {
      success: function(object) {
         insertAlarm(hours, mins, ampm, alarmName);
         hideAlarmPopup();
      }
   });
}

function getAllAlarms() {
   Parse.initialize("J4BNDShNSeoQJpsuoiaIjl78WUU9IqFsZIseU8gg", "oze02hbWGqTI51Rc9A6yIPnDFrmgozLJEklcIkx3");
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   query.find({
      success: function(results) {
         for (var i = 0; i < results.length; i++) {
            var time = results[i].get("time");
            insertAlarm(time.hours, time.mins, time.ampm, results[i].get("alarmName"));
         }
      }
   });
}

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
   console.log('statusChangeCallback');
   console.log(response);
   // The response object is returned with a status field that lets the
   // app know the current login status of the person.
   // Full docs on the response object can be found in the documentation
   // for FB.getLoginStatus().
   if (response.status === 'connected') {
      // Logged into your app and Facebook.
      getTime();
      getTemp();
      getAllAlarms();
   }
   else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log into this app.';
   }
   else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log into Facebook.';
   }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
   FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
   });
}

window.fbAsyncInit = function() {
   FB.init({
      appId      : '1424223797870774',
      cookie     : true,  // enable cookies to allow the server to access the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.1' // use version 2.1
});

// Now that we've initialized the JavaScript SDK, we call
// FB.getLoginStatus().  This function gets the state of the
// person visiting this page and can return one of three states to
// the callback you provide.  They can be:
//
// 1. Logged into your app ('connected')
// 2. Logged into Facebook, but not your app ('not_authorized')
// 3. Not logged into Facebook and can't tell if they are logged into
//    your app or not.
//
// These three cases are handled in the callback function.
FB.getLoginStatus(function(response) {
   statusChangeCallback(response);
});

};

// Load the SDK asynchronously
(function(d, s, id) {
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) return;
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
   console.log('Welcome!  Fetching your information.... ');
   FB.api('/me', function(response) {
   console.log('Successful login for: ' + response.name);
   document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';
   });
}
