function redirectInit() {
   var accessToken = location.hash.substring(1);
   var regex = /([^&=]+)=([^&]*)/g;
   localStorage.setItem("OAuth2", regex.exec(accessToken)[2]);
   var callback = localStorage.getItem("callback");
   window.opener.eval(callback)();
   window.close();
}

window.onload = redirectInit;
