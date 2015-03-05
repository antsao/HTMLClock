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
   //https://api.imgur.com/3/account/me
   var accessToken = localStorage.getItem("OAuth2");
   alert(accessToken);
}
