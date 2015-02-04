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

function insertAlarm(hours, mins, ampm, alarmName) {
   var newDiv = $("<div></div>").addClass("flexible");
   var first = $("<div></div>").addClass("name");
   first.html(alarmName);
   var second = $("<div></div>").addClass("time");
   second.html(hours + ":" + mins + " " + ampm);
   newDiv.append(first);
   newDiv.append(second);
   $("#alarms").append(newDiv);
}

function addAlarm() {
   var hours = $("#hours option:selected").text();
   var mins = $("#mins option:selected").text();
   var ampm = $("#ampm option:selected").text();
   var alarmName = $("#alarmName").val();
   insertAlarm(hours, mins, ampm, alarmName);
   hideAlarmPopup();
}
