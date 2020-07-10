       var argscheck = require('cordova/argscheck'),
        utils = require('cordova/utils'),
        exec = require('cordova/exec'),
        sdkPluginWrapper = require('./SDKPluginWrapper');
               
    var backgroundImageSource = "images/MaaS360.png";
    var backgroundImageSourceLogin = "images/MaaS360_login.png";
    var loadingImageSource = "images/spinner.gif";
               
    var sdkUIUtils = {
        
       initWithConfig:function(config) {
           var fileref = document.createElement("link")
           fileref.setAttribute("rel", "stylesheet")
           fileref.setAttribute("type", "text/css")
           fileref.setAttribute("href", config);
           document.getElementsByTagName("head")[0].appendChild(fileref);
       },
       
       presentModalScreenWithMessage:function(message, showProgress) {
           sdkUIUtils.dismissModalScreen();
           var height = window.innerHeight;
           var width = window.innerWidth;
           
           var body = document.getElementsByTagName("body")[0];
           
           var modalWindowElement = document.createElement("div");
           modalWindowElement.className = "modalBlockingOverlay";
           modalWindowElement.style.height = height + 'px';
           modalWindowElement.style.width = width + 'px';
           
           var verticalOffsetDiv = document.createElement("div");
           verticalOffsetDiv.className = "vertical-offset";
           
           var modalBlockingBoxDiv = document.createElement("div");
           modalBlockingBoxDiv.className = "modalBlockingBox";
           
           var image = document.createElement("img");
           image.src = backgroundImageSource;
           image.style.height = height + 'px';
           image.style.width = width + 'px';
           
           var reasonBox = document.createElement ("div");
           reasonBox.className = "blocking-reason";

           if  (showProgress == true) {
             	var loadingImg = document.createElement("img");
                loadingImg.src = loadingImageSource;
              	loadingImg.style.height = '40px';
               	loadingImg.style.width = '40px';
               	loadingImg.className = "loading-gif";
                reasonBox.className = "blocking-reason-progress";
            }
               
           
           reasonBox.style.height = '100px';
           reasonBox.style.width = '256px';
           reasonBox.innerHTML = message;
           
           modalBlockingBoxDiv.appendChild(image);
           if  (showProgress == true) {
           		modalBlockingBoxDiv.appendChild(loadingImg);
           }
           modalBlockingBoxDiv.appendChild(reasonBox);
           verticalOffsetDiv.appendChild(modalBlockingBoxDiv);
           
           modalWindowElement.appendChild(verticalOffsetDiv);
           body.appendChild(modalWindowElement);
       },
       
       dismissModalScreen:function() {
           var body = document.getElementsByTagName("body")[0];
           var screen = document.getElementsByClassName("modalBlockingOverlay");
           if (screen.length > 0) {
               body.removeChild(screen[0]);
           }
           
           screen = document.getElementsByClassName("loginform");
           
           if (screen.length > 0) {
               body.removeChild(screen[0]);
           }
       },
       
       presentLoginScreen:function(sdkPlnWrapper) {
           var screen = document.getElementsByClassName("modalBlockingOverlay");
           if  (screen.length > 0) {
               return;
           }
           screen = document.getElementsByClassName("loginform");
           if  (screen.length > 0) {
               return;
            }
       
       
           var height = window.innerHeight;
           var width = window.innerWidth;
           var body = document.getElementsByTagName("body")[0];
           var modalWindowLoginForm = document.createElement("div");
           modalWindowLoginForm.className = "loginform";
           modalWindowLoginForm.style.height = height + 'px';
           modalWindowLoginForm.style.width = width + 'px';
           
           modalWindowLoginForm.style.backgroundImage = 'url(' + backgroundImageSourceLogin + ')';
           
           modalWindowLoginForm.innerHTML = '<h style="text-align: center;display: inline-block;font-size: 1.2em;width: 100%;padding-bottom: 20px;padding-top: 50px; color: white;">Gateway Login</h><br /><input type="text" id="EGDName" placeholder="Domain"><br /><input type="text" id="EGUName" placeholder="Username"><br /><input type="password" id="EGPass" placeholder="Password"><br />';
           
           var loginBtn = document.createElement("input");
           loginBtn.type = "button";
           loginBtn.value = "Login";
           loginBtn.className = "loginbutton";
           loginBtn.addEventListener('click', function (){
                                 
                 var userName = document.getElementById("EGUName").value;
                 if(userName == "")
                 {
                    document.getElementById("EGUName").focus();
                    return;
                 }
                 var domainName = document.getElementById("EGDName").value;
                 var password = document.getElementById("EGPass").value;
                 if(password == "")
                 {
                    document.getElementById("EGPass").focus();
                    return;
                 }
                 
                 document.getElementById("EGUName").blur();
                 document.getElementById("EGDName").blur();
                 document.getElementById("EGPass").blur();
                
                 var loadingImg = document.createElement("img");
                 loadingImg.src = loadingImageSource;
                 loadingImg.style.height = '40px';
                 loadingImg.style.width = '40px';
                 loadingImg.className = "loading-gif";
                 loadingImg.style.top = '58%';
                 modalWindowLoginForm.appendChild(loadingImg);
                 
                 var dict = {"username": userName,
                             "domain": domainName,
                             "password": password};
                 sdkPluginWrapper.startEnterpriseGateway(dict);                
            });
       
           var cancelBtn = document.createElement("input"); //input element, Submit button
           cancelBtn.type = "button";
           cancelBtn.value = "Cancel";
           cancelBtn.className = "cancelbutton";
           cancelBtn.addEventListener('click', function (){
                                      document.body.removeChild(modalWindowLoginForm);
                                      modalWindowLoginForm = null;
                                      });
           
           modalWindowLoginForm.appendChild(loginBtn);
           modalWindowLoginForm.appendChild(cancelBtn);
           
           body.appendChild(modalWindowLoginForm);
       },
       
       dismissLoginScreen:function() {
           var body = document.getElementsByTagName("body")[0];
           var screen = document.getElementsByClassName("modalBlockingOverlay");
           if (screen.length > 0) {
               body.removeChild(screen[0]);
           }
           
           screen = document.getElementsByClassName("loginform");
           
           if (screen.length > 0) {
               body.removeChild(screen[0]);
           }
       
       }

    };

    module.exports = sdkUIUtils;
