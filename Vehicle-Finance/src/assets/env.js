(function(window) {
    window["env"] = window["env"] || {};
  
    // Environment variables
    window["env"]["hostUrl"] = "/appiyo/";
    // window["env"]["hostEnvironment"] = "PRD";
    // window["env"]["hostEnvironment"] = "UAT";
    window["env"]["hostEnvironment"] = "DEV";
    window["env"]["userUATConfig"] = "@esfbuat.in"; // for UAT
    window["env"]["userDEVConfig"] = "@equitasbank.in"; // for dev
    window["env"]["userPRDConfig"]=""; // for production
    window["env"]["useDEVADAuth"] = false; // for DEV
    window["env"]["useUATADAuth"] = true; // for UAT
    window["env"]["usePRDADAuth"] = true; // for production
    window["env"]["version"] = "0.45.1"; 
    window["env"]["buildDate"] = "26-02-2021";
    window["env"]["sessionTime"] = "14";
    window["env"]["expriyAlertTime"] = "30";
  })(this);
  
