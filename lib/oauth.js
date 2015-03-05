function init(result) {
   localStorage.setItem("clientId", result.client_id);
   localStorage.setItem("type", result.type);
   localStorage.setItem("callback", result.callback_function);
}

function login() {
   var clientId = localStorage.getItem("clientId");
   var type = localStorage.getItem("type");
   var url = 'https://api.imgur.com/oauth2/authorize?client_id='
      + clientId
      + '&response_type='
      + type;
   newWindow = window.open(url, 'name', 'height=200,width=150');
   if (window.focus) {
      newWindow.opener = this.window;
      newWindow.focus();
   }
}

function callback() {
   $.ajax({
      url: "https://api.imgur.com/3/account/me",
      type: 'GET',
      dataType: 'json',
      success: function (result) {
         alert('Logged in as: ' + result.data.url);
      },
      error: function (result) {
         console.log(JSON.stringify(result));
      },
      beforeSend: function(xhr) {
         xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("OAuth2"));
      }
   });
}
