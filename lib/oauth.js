function init(result) {
   localStorage.setItem("clientId", result.client_id);
   localStorage.setItem("type", result.type);
   localStorage.setItem("callback", result.callback_function);
}

function login() {
   newWindow = window.open("http://ec2-54-148-31-3.us-west-2.compute.amazonaws.com/redirect.html",
      'name',
      'height=200,width=150');
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
