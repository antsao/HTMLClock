function getTime() {
   var date = new Date();
   var hours = date.getHours();
   var minutes = date.getMinutes();
   var seconds = date.getSeconds();
   document.getElementById('clock').innerHTML = hours + ":" + minutes + ":" + seconds;
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
