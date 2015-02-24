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
   ga('send', 'event', 'Alarm', 'Delete');
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   FB.getLoginStatus(function(response) {
      if (response.status === "connected") {
         FB.api('/me', function(response) {
            query.find({
               success: function(results) {
                  for (var i = 0; i < results.length; i++) {
                     console.log(results[i].get("alarmName"));
                     if (results[i].get("alarmName").replace(/\s+/g, '') == alarmName &&
                         results[i].get("id").replace(/\s+/g, '') == response.id) {
                        results[i].destroy({});
                        $("#" + alarmName).remove();
                     }
                  }
               }
            });
         });
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
   ga('send', 'event', 'Alarm', 'Add');
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
   FB.getLoginStatus(function(response) {
      if (response.status === "connected") {
         FB.api('/me', function(response) {
            alarmObject.save({"id": response.id, "time": time, "alarmName": alarmName}, {
               success: function(object) {
                  insertAlarm(hours, mins, ampm, alarmName);
                  hideAlarmPopup();
               }
            });
         });
      }
      else {
         console.log("what");
      }
   });

}

function getAllAlarms(id) {
   Parse.initialize("J4BNDShNSeoQJpsuoiaIjl78WUU9IqFsZIseU8gg", "oze02hbWGqTI51Rc9A6yIPnDFrmgozLJEklcIkx3");
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   query.find({
      success: function(results) {
         for (var i = 0; i < results.length; i++) {
            if (id == results[i].get("id")) {
               var time = results[i].get("time");
               insertAlarm(time.hours, time.mins, time.ampm, results[i].get("alarmName"));
            }
         }
      }
   });
}

function testAPI() {
   FB.api('/me', function(response) {
      document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';
      getAllAlarms(response.id)
   });
}

function statusChangeCallback(response) {
   if (response.status === 'connected') {
      testAPI();
   }
   else if (response.status === 'not_authorized') {
      document.getElementById('status').innerHTML = 'Please log into this app.';
      $("#alarms").empty();
   }
   else {
      document.getElementById('status').innerHTML = 'Please log into Facebook.';
      $("#alarms").empty();
   }
}

function checkLoginState() {
   FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
   });
}

window.fbAsyncInit = function() {
   FB.init({
      appId      : '1424223797870774',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.1'
});

FB.getLoginStatus(function(response) {
   statusChangeCallback(response);
});

};
