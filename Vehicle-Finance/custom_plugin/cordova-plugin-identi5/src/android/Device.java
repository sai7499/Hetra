/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/
package org.apache.cordova.device;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.Hashtable;
import java.util.List;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.provider.Settings;
import android.util.Log;


import android.widget.Toast;


import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.TimeZone;
import java.util.regex.Pattern;

import capacitor.android.plugins.R;


public class Device extends CordovaPlugin {
    public static final String TAG = "Device";

    public static String platform;                            // Device OS


    private CallbackContext pluginCallback;

    public static String uuid;                                // Device UUID

    private static final String ANDROID_PLATFORM = "Android";
    private static final String AMAZON_PLATFORM = "amazon-fireos";
    private static final String AMAZON_DEVICE = "Amazon";

    /**
     * Storage the found bluetooth devices
     * format:<MAC, <Key,Value>>;Key=[RSSI/NAME/COD(class of device)/BOND/UUID]
     * */
    private Hashtable<String, Hashtable<String, String>> mhtFDS = null;


    private String glbDevname = "";
    private String glbDevmac = "";
    private String fCount = "1";


    private boolean isProtoBuf = false,isRc = true, glbConnSwitch = false;


    @Override
    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        System.out.println("Output%%%%%%"+resultCode);

        Log.e(TAG, "onActivityResult requestCode : " + requestCode + " / resultCode : " + resultCode  + " cordova.getActivity().RESULT_OK:" + cordova.getActivity().RESULT_OK );
        boolean activate;

        if(requestCode == 3){

            String DeviceInfodata = data.getStringExtra("DEVICE_INFO");
            Log.e(TAG, "Device Info data:"+DeviceInfodata);
            if(data.hasExtra("PID_DATA")) {
                String piddata = data.getStringExtra("PID_DATA");
                Log.e(TAG, "capture data:" + piddata);

                try {
                    JSONObject r = new JSONObject();
                    r.put("uuid", Device.uuid);
                    r.put("version", this.getOSVersion());
                    r.put("platform", this.getPlatform());
                    r.put("model", piddata);
                    r.put("manufacturer", this.getManufacturer());
                    r.put("isVirtual", this.isVirtual());
                    r.put("serial", this.getSerialNumber());

                    pluginCallback.success(r);
                }catch (JSONException e){

                }

            }else {
                Log.e(TAG,"no result");
            }

            return;
        }else if(resultCode == cordova.getActivity().RESULT_CANCELED){
            System.out.println("Output%2%%%%"+resultCode);
            return;
        }
        // Handle other results if exists.
        super.onActivityResult(requestCode, resultCode, data);
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArry of arguments for the plugin.
     * @param callbackContext   The callback id used when calling back into JavaScript.
     * @return                  True if the action was valid, false if not.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        Context context = this.cordova.getActivity().getApplicationContext();

        this.pluginCallback = callbackContext;


        if ("getDeviceInfo".equals(action)) {
            Device.uuid = getUuid();
            this.connectRDservice(context);

        }
        return true;
    }

    private void connectRDservice(Context ctx) {
        try {
            Intent act = new Intent("in.gov.uidai.rdservice.fp.CAPTURE");
            PackageManager packageManager = ctx.getPackageManager();
            List activities = packageManager.queryIntentActivities(act,PackageManager.MATCH_DEFAULT_ONLY);
            final boolean isIntentSafe = activities.size() > 0;
            Log.d(TAG, "Boolean check for activities = "+isIntentSafe);
            if (!isIntentSafe) {
                Toast.makeText(ctx.getApplicationContext(), "No RD Service Available",Toast.LENGTH_SHORT).show();
            }
            Log.d(TAG, "No of activities = "+activities.size());
            act.putExtra("PID_OPTIONS",getInputData());
            cordova.startActivityForResult ((CordovaPlugin) Device.this, act, 3);

        } catch (Exception e) {
            Log.e(TAG,"Error while connecting to RDService");
            e.printStackTrace();
        }

    }

    private String getInputData() {

        String dname = "christus valerian";

        Log.e(TAG, "startCaptureRegistered");
        String sConnStat="";
        if (glbConnSwitch)
            sConnStat = "<Param " + "name=\"" + "Connection" + "\" " + "value=\"" + (glbConnSwitch? "Y":"N") + "\"/> ";
        else
            sConnStat ="";

        String inputxml = String.format(
                "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
                        + "<PidOptions ver =\"1.0\">" + "<Opts "
                        + "env=\"P\" "+ "fCount=\""+ fCount + "\""+ "fType=\"0\" "+ "iCount=\"1\" "+ "iType=\"0\" "+ "pCount=\"1\" "
                        + "pType=\"0\" "+ "format=\""+(isProtoBuf? "1":"0")+ "\" "+ "pidVer=\""+ "2.0"+ "\" "+ "timeout=\""+ "10000"+ "\" "
                        + "otp=\""+ "" + "\" "
                        + "wadh=\""+ "" + "\" "
                        + "posh=\""+ "UNKNOWN"+ "\"/>"
//                        + "<Demo>" + "</Demo>"
                        + "<Demo lang=\"07\">"
                        + "<Pi "+ "name=\""+ dname + "\""
//                        +"ms=\""+"E"+"\" "
//                        +"gender=\""+"M"+"\" "
                        + "/>"
                        + "</Demo>"
                        + "<CustOpts>"
                        + "<Param " + "name=\"" + glbDevname + "\" " + "value=\"" + glbDevmac + "\"/> "
                        + sConnStat // This is an optional parameter for retaining the BT connection without
                        // this the connection with the device will be disconnected after every operation.
                        + "</CustOpts>"
                        + "</PidOptions>");
        Log.e(TAG, "PidOptions: " + inputxml);

        return inputxml;
    }


    //--------------------------------------------------------------------------
    // LOCAL METHODS
    //--------------------------------------------------------------------------

    /**
     * Get the OS name.
     *
     * @return
     */
    public String getPlatform() {
        String platform;
        if (isAmazonDevice()) {
            platform = AMAZON_PLATFORM;
        } else {
            platform = ANDROID_PLATFORM;
        }
        return platform;
    }

    /**
     * Get the device's Universally Unique Identifier (UUID).
     *
     * @return
     */
    public String getUuid() {
        String uuid = Settings.Secure.getString(this.cordova.getActivity().getContentResolver(), android.provider.Settings.Secure.ANDROID_ID);
        return uuid;
    }

    public String getModel() {
        String model = android.os.Build.MODEL;
        return model;
    }

    public String getProductName() {
        String productname = android.os.Build.PRODUCT;
        return productname;
    }

    public String getManufacturer() {
        String manufacturer = android.os.Build.MANUFACTURER;
        return manufacturer;
    }

    public String getSerialNumber() {
        String serial = android.os.Build.SERIAL;
        return serial;
    }

    /**
     * Get the OS version.
     *
     * @return
     */
    public String getOSVersion() {
        String osversion = android.os.Build.VERSION.RELEASE;
        return osversion;
    }

    public String getSDKVersion() {
        @SuppressWarnings("deprecation")
        String sdkversion = android.os.Build.VERSION.SDK;
        return sdkversion;
    }

    public String getTimeZoneID() {
        TimeZone tz = TimeZone.getDefault();
        return (tz.getID());
    }

    /**
     * Function to check if the device is manufactured by Amazon
     *
     * @return
     */
    public boolean isAmazonDevice() {
        if (android.os.Build.MANUFACTURER.equals(AMAZON_DEVICE)) {
            return true;
        }
        return false;
    }

    public boolean isVirtual() {
        return android.os.Build.FINGERPRINT.contains("generic") ||
                android.os.Build.PRODUCT.contains("sdk");
    }


}



