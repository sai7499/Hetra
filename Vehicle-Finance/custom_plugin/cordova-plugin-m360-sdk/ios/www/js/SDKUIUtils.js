    var argscheck = require('cordova/argscheck'),
        utils = require('cordova/utils'),
        sdkPluginWrapper = require('./SDKPluginWrapper'),
        exec = require('cordova/exec');

    var backgroundImageSource = "images/MaaS360.png";
    var backgroundImageSourceLogin = "images/MaaS360_login.png";
    var loadingImageSource = "images/spinner.gif";

    var htmlResourcePath = "";

    var UIEvents = {
        "None": {
            value: 0,
            name: "M360SDKUIEventNone",
            data: "",
            progress: false
        },
        "NotInstalled": {
            value: 1,
            name: "M360SDKUIEventNotInstalled",
            data: "MaaS App Not Installed",
            progress: false
        },
        "NotEnrolled": {
            value: 2,
            name: "M360SDKUIEventNotEnrolled",
            data: "Device Not Enrolled",
            progress: false
        },
        "Enrolling": {
            value: 3,
            name: "M360SDKUIEventEnrolling",
            data: "Configuring",
            progress: true
        },
        "Wipe": {
            value: 4,
            name: "M360SDKUIEventWipe",
            data: "Selevtive Wipe",
            progress: false
        },
        "Compliance": {
            value: 5,
            name: "M360SDKUIEventOutOfCompliance",
            data: "",
            progress: false
        },
        "Gateway": {
            value: 6,
            name: "M360SDKUIEventGatewayLogin",
            data: "",
            progress: false
        }
    }

    var currentEventType;
    var eventQueue;

    var sdkUIUtils = {

        initWithConfig: function(config) {

            htmlPath = window.location.pathname;
            var indexOfWWW = htmlPath.lastIndexOf("/");
            if (indexOfWWW > -1)
                htmlResourcePath = htmlPath.substring(0, indexOfWWW + 1);

            currentEventType = "None";
            eventQueue = {};
        },

        processUIEvent: function(eventType, eventData) {
            var existingEvent = eventQueue[eventType];
            if (existingEvent !== undefined) {

                if (eventData.length > 0) {
                    existingEvent.data = eventData;
                }
                eventQueue[eventType] = existingEvent;
                if (currentEventType === eventType) {
                    sdkUIUtils.updateCurrentEvent(existingEvent);
                    return;
                }

            } else {

                var newEvent = UIEvents[eventType];
                if (eventData.length > 0) {
                    newEvent.data = eventData;
                }

                eventQueue[eventType] = newEvent;
            }

            if (eventType === 'Enrolling') {
                if (currentEventType === 'NotInstalled' || currentEventType === 'NotEnrolled')
                    sdkUIUtils.dismissUIEvent(currentEventType);
            }
            sdkUIUtils.processEventQueue();

        },

        updateCurrentEvent: function(event) {
            sdkUIUtils.dismissModalScreen();
            if (currentEventType === 'Gateway') {
                sdkUIUtils.presentLoginScreen();
            } else {
                sdkUIUtils.presentModalScreenWithMessage(event.data, event.progress);
            }

        },

        processEventQueue: function() {
            var topPriorityEvent = null;
            for (var eventType in UIEvents) {
                var event = eventQueue[eventType];
                if (event !== undefined) {
                    topPriorityEvent = event;
                    break;
                }
            }
            if (topPriorityEvent !== null) {
                currentEventType = Object.keys(UIEvents)[topPriorityEvent.value];
                if (currentEventType === 'Gateway') {
                    sdkUIUtils.presentLoginScreen();
                } else {
                    sdkUIUtils.presentModalScreenWithMessage(topPriorityEvent.data, topPriorityEvent.progress);
                }
            } else {
                currentEventType = 'None';
            }
        },

        dismissUIEvent: function(eventType) {
            if (currentEventType === eventType) {
                sdkUIUtils.dismissModalScreen();
            }
            delete eventQueue[eventType];

            sdkUIUtils.processEventQueue();
        },

        presentModalScreenWithMessage: function(message, showProgress) {

            sdkUIUtils.dismissModalScreen();

            //var height = window.screen.height;
            //var width = window.screen.width;

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
            image.src = htmlResourcePath + backgroundImageSource;
            image.id = "divBackgroundImage";
            image.style.height = height + 'px';
            image.style.width = width + 'px';

            var reasonBox = document.createElement("div");
            reasonBox.className = "blocking-reason";

            if (showProgress == true) {
                var loadingImg = document.createElement("img");
                loadingImg.src = htmlResourcePath + loadingImageSource;
                loadingImg.style.height = '40px';
                loadingImg.style.width = '40px';
                loadingImg.className = "loading-gif";
                reasonBox.className = "blocking-reason-progress";
                reasonBox.style.height = '100px';
                reasonBox.style.width = '256px';
            }
            else {
                reasonBox.style.height = '150px';
                reasonBox.style.width = window.innerWidth/2+'px';
                reasonBox.style.lineHeight= '2';
            }
            reasonBox.innerHTML = message;
            reasonBox.style.fontStyle = "italic";
            reasonBox.style.padding.left = '40%';
            reasonBox.style.display = 'block';

            modalBlockingBoxDiv.appendChild(image);
            if (showProgress == true) {
                modalBlockingBoxDiv.appendChild(loadingImg);
            }
            modalBlockingBoxDiv.appendChild(reasonBox);
            verticalOffsetDiv.appendChild(modalBlockingBoxDiv);

            modalWindowElement.appendChild(verticalOffsetDiv);
            body.appendChild(modalWindowElement);
        },

        dismissModalScreen: function() {
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

        presentLoginScreen: function() {
            var screen = document.getElementsByClassName("modalBlockingOverlay");
            if (screen.length > 0) {
                return;
            }
            screen = document.getElementsByClassName("loginform");
            if (screen.length > 0) {
                return;
            }
               
            //Changed to below in 2.98.SDK - ipad issue for WL gateway screen
            //var height = window.screen.height;
            //var width = window.screen.width;


            var height = window.innerHeight;
            var width = window.innerWidth;
               
            var body = document.getElementsByTagName("body")[0];
            var modalWindowLoginForm = document.createElement("div");
            modalWindowLoginForm.className = "loginform";
            modalWindowLoginForm.style.height = height + 'px';
            modalWindowLoginForm.style.width = width + 'px';

            modalWindowLoginForm.style.backgroundImage = 'url(' + htmlResourcePath + backgroundImageSourceLogin + ')';

            modalWindowLoginForm.innerHTML = '<h style="text-align: center;display: inline-block;font-size: 1.2em;width: 100%;padding-bottom: 20px;padding-top: 50px; color: white;">Gateway Login</h><br /><input type="text" id="EGUName" placeholder="Username" autocapitalize="off"><br /><input type="password" id="EGPass" placeholder="Password"><br /><input type="text" id="EGDName" placeholder="Domain" autocapitalize="off"><br />';

            var loginBtn = document.createElement("input");
            loginBtn.type = "button";
            loginBtn.value = "Login";
            loginBtn.className = "loginbutton";
            loginBtn.addEventListener('click', function() {

                var userName = document.getElementById("EGUName").value;
                if (userName == "") {
                    document.getElementById("EGUName").focus();
                    return;
                }
                var domainName = document.getElementById("EGDName").value;
                var password = document.getElementById("EGPass").value;
                if (password == "") {
                    document.getElementById("EGPass").focus();
                    return;
                }

                document.getElementById("EGUName").blur();
                document.getElementById("EGDName").blur();
                document.getElementById("EGPass").blur();

                //document.body.removeChild(modalWindowLoginForm);
                //modalWindowLoginForm = null;

                var loadingImg = document.createElement("img");
                loadingImg.src = htmlResourcePath + loadingImageSource;
                loadingImg.style.height = '40px';
                loadingImg.style.width = '40px';
                loadingImg.className = "loading-gif";
                loadingImg.style.top = '58%';
                loadingImg.style.display = 'block';
                loadingImg.style.margin = 'auto';

                modalWindowLoginForm.appendChild(loadingImg);

                var dict = {
                    "username": userName,
                    "domain": domainName,
                    "password": password
                };
                sdkPluginWrapper.startEnterpriseGateway(dict);

            });

            var cancelBtn = document.createElement("input"); //input element, Submit button
            cancelBtn.type = "button";
            cancelBtn.value = "Cancel";
            cancelBtn.className = "cancelbutton";
            cancelBtn.addEventListener('click', function() {
                document.body.removeChild(modalWindowLoginForm);
                modalWindowLoginForm = null;
            });

            modalWindowLoginForm.appendChild(loginBtn);
            modalWindowLoginForm.appendChild(cancelBtn);

            body.appendChild(modalWindowLoginForm);
        },

        removeLoadingGIF: function() {
            var screen = document.getElementsByClassName("loginform");
            var gif = document.getElementsByClassName("loading-gif");
            if (screen && screen.length > 0) {
                if (gif && gif.length > 0) {
                    screen[0].removeChild(gif[0]);
                }
            }
        }
    };

    module.exports = sdkUIUtils;