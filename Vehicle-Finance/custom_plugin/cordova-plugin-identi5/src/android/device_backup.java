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
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.TimeZone;
import java.util.regex.Pattern;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.device.evolute.bluetooth.BluetoothComm;
import org.apache.cordova.device.evolute.bluetooth.BluetoothPair;
import org.apache.cordova.device.evolute.lilygendemoapp.GlobalPool;
import org.apache.cordova.device.evolute.lilygendemoapp.constants;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;


import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.SystemClock;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.Toast;

import com.lillygen.api.FpsConfig;
import com.lillygen.api.FpsImageAPI;
import com.lillygen.api.General;
import com.lillygen.api.HexString;
import com.lillygen.api.Setup;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.regex.Pattern;

import com.lillygen.api.FPS;

import capacitor.android.plugins.R;


public class Device extends CordovaPlugin {
    public static final String TAG = "Device";

    public static String platform;                            // Device OS
    public static String uuid;                                // Device UUID

    private static final String ANDROID_PLATFORM = "Android";
    private static final String AMAZON_PLATFORM = "amazon-fireos";
    private static final String AMAZON_DEVICE = "Amazon";



    FPS fps;
    String sDevicetype;
    private GlobalPool mGP = null;
    public static BluetoothAdapter mBT = BluetoothAdapter.getDefaultAdapter();
    public static BluetoothDevice mBDevice = null;
    private Thread scanThread;
    private boolean mbBTstatusBefore = false;
    private Hashtable<String, String> mhtDeviceInfo = new Hashtable<String, String>();


    /**CONST: device type bluetooth 2.1*/
    public static final int DEVICE_TYPE_BREDR = 0x01;
    /**CONST: device type bluetooth 4.0 */
    public static final int DEVICE_TYPE_BLE = 0x02;
    /**CONST: device type bluetooth double mode*/
    public static final int DEVICE_TYPE_DUMO = 0x03;
    public final static String EXTRA_DEVICE_TYPE = "android.bluetooth.device.extra.DEVICE_TYPE";
    /** Discovery is Finished */
    private boolean _discoveryFinished;

    public final int MY_OP = 11;

    /**
     * Storage the found bluetooth devices
     * format:<MAC, <Key,Value>>;Key=[RSSI/NAME/COD(class of device)/BOND/UUID]
     * */
    private Hashtable<String, Hashtable<String, String>> mhtFDS = null;

    private boolean mbBonded = false;

    public static Setup setup = null;

    public General gen;

    public static Setup setupGen;

    OutputStream outputStream;
    InputStream inputStream;

    private boolean verifyUncompressed = false;

    FpsConfig fpsconfig = new FpsConfig();
    private byte[] bufValue = {};
    private int iRetVal;
    public static final int DEVICE_NOTCONNECTED = -100;
    private static final int MESSAGE_BOX = 1;
    private boolean verifyFinger = false;

    private byte[] image = {};
    private byte[] image1 = {};
    private boolean verifyCompressed = false;

    private String glbDevname = "";
    private String glbDevmac = "";
    private String fCount = "1";


    private boolean isProtoBuf = false,isRc = true, glbConnSwitch = false;

    private BroadcastReceiver _mPairingRequest = new BroadcastReceiver(){
        @Override
        public void onReceive(Context context, Intent intent){
            BluetoothDevice device = null;
            if (intent.getAction().equals(BluetoothDevice.ACTION_BOND_STATE_CHANGED)){
                device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                if (device.getBondState() == BluetoothDevice.BOND_BONDED)
                    mbBonded = true;
                else
                    mbBonded = false;
            }
        }
    };


    /* Scan for Bluetooth devices. (broadcast listener) */
    private BroadcastReceiver _foundReceiver = new BroadcastReceiver(){	//TODO
        public void onReceive(Context context, Intent intent){
            /* bluetooth device profiles*/
            Hashtable<String, String> htDeviceInfo = new Hashtable<String, String>();
            System.out.println("Scan for Bluetooth devices");
            /* get the search results */
            BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
            /* create found device profiles to htDeviceInfo*/
            Bundle b = intent.getExtras();
            htDeviceInfo.put("RSSI", String.valueOf(b.get(BluetoothDevice.EXTRA_RSSI)));
            if (null == device.getName())
                htDeviceInfo.put("NAME", "Null");
            else
                htDeviceInfo.put("NAME", device.getName());
            htDeviceInfo.put("COD",  String.valueOf(b.get(BluetoothDevice.EXTRA_CLASS)));
            if (device.getBondState() == BluetoothDevice.BOND_BONDED)
                htDeviceInfo.put("BOND", constants.actDiscovery_bond_bonded);
            else
                htDeviceInfo.put("BOND", constants.actDiscovery_bond_nothing);
            String exDeviceType = String.valueOf(b.get(EXTRA_DEVICE_TYPE));
            if (!exDeviceType.equals("null"))
                htDeviceInfo.put("DEVICE_TYPE", exDeviceType);
            else
                htDeviceInfo.put("DEVICE_TYPE", "-1");
            /*adding scan to the device profiles*/
            mhtFDS.put(device.getAddress(), htDeviceInfo);
            /*Refresh show list*/
            Enumeration<String> e = mhtFDS.keys();

            while (e.hasMoreElements()){
                HashMap<String, Object> map = new HashMap<String, Object>();
                String sKey = e.nextElement();
                map.put("MAC", sKey);
                map.put("NAME", mhtFDS.get(sKey).get("NAME"));
                map.put("RSSI", mhtFDS.get(sKey).get("RSSI"));
                map.put("COD", mhtFDS.get(sKey).get("COD"));
                map.put("BOND", mhtFDS.get(sKey).get("BOND"));
                map.put("DEVICE_TYPE", toDeviceTypeString(mhtFDS.get(sKey).get("DEVICE_TYPE")));

                System.out.println("Scanned Devices *******"+ map);

            }
        }

        private String toDeviceTypeString(String sDeviceTypeId){
            Pattern pt = Pattern.compile("^[-\\+]?[\\d]+$");
            if (pt.matcher(sDeviceTypeId).matches()){
                switch(Integer.valueOf(sDeviceTypeId)){
                    case DEVICE_TYPE_BREDR:
                        return constants.device_type_bredr;
                    case DEVICE_TYPE_BLE:
                        return constants.device_type_ble;
                    case DEVICE_TYPE_DUMO:
                        return constants.device_type_dumo;
                    default:
                        return constants.device_type_bredr;
                }
            }
            else
                return sDeviceTypeId;
        }
    };
    /**
     * Bluetooth scanning is finished processing.(broadcast listener)
     */
    private BroadcastReceiver _finshedReceiver = new BroadcastReceiver(){ //TODO
        @Override
        public void onReceive(Context context, Intent intent){
            System.out.println("Bluetooth scanning is finished");
            _discoveryFinished = true; //set scan is finished
            cordova.getActivity().unregisterReceiver(_foundReceiver);
            cordova.getActivity().unregisterReceiver(_finshedReceiver);
            if (null != mhtFDS && mhtFDS.size()>0){
                System.out.println("actDiscovery_msg_select_device");
//                String sKey = "00:04:3E:6F:86:96";
//                new PairTask().execute(sKey);
            } else {
                System.out.println("actDiscovery_msg_not_find_device");

            }
        }
    };
    private CallbackContext pluginCallback;


    /**
     * Constructor.
     */
    public Device() {
    }

    /**
     * Sets the context of the Command. This can then be used to do things like
     * get file paths associated with the Activity.
     *
     * @param cordova The context of the main Activity.
     * @param webView The CordovaWebView Cordova is running in.
     */
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

    }

    private void runInitSDK() {
        Context context =  cordova.getActivity().getApplicationContext();

        Intent intent = new Intent(context, SetupProwess.class);
        intent.putExtra("my_param", 0);

        cordova.startActivityForResult ((CordovaPlugin) Device.this, intent, MY_OP);

        this.scanBluetoothDevice();

//        cordova.getActivity().runOnUiThread(new Runnable() {
//            public void run() {
//
//            }
//        });
    }

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
                }else {
                    Log.e(TAG,"no result");
                }



//            Bundle extras = data.getExtras();// Get data sent by the Intent
//            String base64Data = extras.getString("data");
//
//            System.out.println("Output%2%%%%"+base64Data);
//
//            try {
//                JSONObject r = new JSONObject();
//                r.put("uuid", Device.uuid);
//                r.put("version", this.getOSVersion());
//                r.put("platform", this.getPlatform());
//                r.put("model", base64Data);
//                r.put("manufacturer", this.getManufacturer());
//                r.put("isVirtual", this.isVirtual());
//                r.put("serial", this.getSerialNumber());
//                pluginCallback.success(r);
//            }catch (JSONException e){
//
//            }


            return;
        }else if(resultCode == cordova.getActivity().RESULT_CANCELED){
            System.out.println("Output%2%%%%"+resultCode);
            return;
        }
        // Handle other results if exists.
        super.onActivityResult(requestCode, resultCode, data);
    }

    public  void scanBluetoothDevice(){
        mGP = ((GlobalPool) cordova.getActivity().getApplicationContext());
        if(mGP!=null){
            mGP.closeConn();
            new startBluetoothDeviceTask().execute("");
        }else{
            new startBluetoothDeviceTask().execute("");
        }
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

           // this.runInitSDK();
//            JSONObject r = new JSONObject();
//            r.put("uuid", Device.uuid);
//            r.put("version", this.getOSVersion());
//            r.put("platform", this.getPlatform());
//            r.put("model", this.getModel());
//            r.put("manufacturer", this.getManufacturer());
//	        r.put("isVirtual", this.isVirtual());
//            r.put("serial", this.getSerialNumber());
//            callbackContext.success(r);



        }else if("initProwessSDK".equals(action)){
//            this.runInitSDK();
        }else if("scanBluetooth".equals(action)){

        }else if("pairDevice".equals(action)){
            String sKey = "00:04:3E:6F:86:96";
            new PairTask().execute(sKey);

        }else if("captureFinger".equals(action)){
            System.out.println("Fps capture finger");
            CaptureFingerAsyn captureFinger = new CaptureFingerAsyn();
            captureFinger.execute(0);
        }else if("verifyFinger".equals(action)){
            System.out.println("Fps capture finger");
            CaptureFingerAsyn captureFinger = new CaptureFingerAsyn();
            captureFinger.execute(0);
        }
        else {
            return false;
        }
        return true;
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

    private class startBluetoothDeviceTask extends AsyncTask<String, String, Integer> {
        private static final int RET_BULETOOTH_IS_START = 0x0001; //TODO
        private static final int RET_BLUETOOTH_START_FAIL = 0x04;
        private static final int miWATI_TIME = 15;
        private static final int miSLEEP_TIME = 150;
        private ProgressDialog mpd;
        @Override
        public void onPreExecute(){
            mbBTstatusBefore = mBT.isEnabled();
        }
        @Override
        protected Integer doInBackground(String... arg0){
            int iWait = miWATI_TIME * 1000;
            /* BT isEnable */
            if (!mBT.isEnabled()){
                mBT.enable();
                //Wait miSLEEP_TIME seconds, start the Bluetooth device before you start scanning
                while(iWait > 0){
                    if (!mBT.isEnabled())
                        iWait -= miSLEEP_TIME;
                    else
                        break;
                    SystemClock.sleep(miSLEEP_TIME);
                }
                if (iWait < 0)
                    return RET_BLUETOOTH_START_FAIL;
            }
            return RET_BULETOOTH_IS_START;
        }

        @Override
        public void onPostExecute(Integer result){
            if (RET_BLUETOOTH_START_FAIL == result){
                mBT.disable();
//                finish();
            } else if (RET_BULETOOTH_IS_START == result){
                openDiscovery();
            }
        }

        private void openDiscovery() {
            new scanDeviceTask().execute("");

        }
    }

    private class scanDeviceTask extends AsyncTask<String, String, Integer>{
        /**Constants: Bluetooth is not turned on*/	//TODO
        private static final int RET_BLUETOOTH_NOT_START = 0x0001;
        /**Constant: the device search complete*/
        private static final int RET_SCAN_DEVICE_FINISHED = 0x0002;
        /**Wait a Bluetooth device starts the maximum time (in S)*/
        private static final int miWATI_TIME = 10;
        /**Every thread sleep time (in ms)*/
        private static final int miSLEEP_TIME = 150;
        /**Process waits prompt box*/
        private ProgressDialog mpd = null;

        @Override
        public void onPreExecute(){
            startSearch();
        }

        @Override
        protected Integer doInBackground(String... params){
            if (!mBT.isEnabled())
                return RET_BLUETOOTH_NOT_START;

            int iWait = miWATI_TIME * 1000;
            //Wait miSLEEP_TIME seconds, start the Bluetooth device before you start scanning
            while(iWait > 0){
                if (_discoveryFinished)
                    return RET_SCAN_DEVICE_FINISHED;
                else
                    iWait -= miSLEEP_TIME;
                SystemClock.sleep(miSLEEP_TIME);;
            }
            return RET_SCAN_DEVICE_FINISHED;
        }

        @Override
        public void onPostExecute(Integer result){
            if (mBT.isDiscovering())
                mBT.cancelDiscovery();
            if (RET_SCAN_DEVICE_FINISHED == result){

            }else if (RET_BLUETOOTH_NOT_START == result){
                System.out.println(constants.actDiscovery_msg_bluetooth_not_start);
            }
        }
    }

    private void startSearch(){
        _discoveryFinished = false;
        if (null == mhtFDS)
            this.mhtFDS = new Hashtable<String, Hashtable<String, String>>();
        else
            this.mhtFDS.clear();

        /* Register Receiver*/
        IntentFilter discoveryFilter = new IntentFilter(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
        this.cordova.getActivity().registerReceiver(_finshedReceiver, discoveryFilter);
        IntentFilter foundFilter = new IntentFilter(BluetoothDevice.ACTION_FOUND);
        this.cordova.getActivity().registerReceiver(_foundReceiver, foundFilter);
        mBT.startDiscovery();//start scan

    }


    private class PairTask extends AsyncTask<String, String, Integer>{ //TODO
        /**Constants: the pairing is successful*/
        static private final int RET_BOND_OK = 0x00;
        /**Constants: Pairing failed*/
        static private final int RET_BOND_FAIL = 0x01;
        /**Constants: Pairing waiting time (15 seconds)*/
        static private final int iTIMEOUT = 1000 * 15;

        @Override
        public void onPreExecute(){
            System.out.println(constants.actMain_msg_bluetooth_Bonding);

            cordova.getActivity().registerReceiver(_mPairingRequest, new IntentFilter(BluetoothPair.PAIRING_REQUEST));
            cordova.getActivity().registerReceiver(_mPairingRequest, new IntentFilter(BluetoothDevice.ACTION_BOND_STATE_CHANGED));
        }

        @Override
        protected Integer doInBackground(String... arg0){
            final int iStepTime = 150;
            int iWait = iTIMEOUT;
            try{
                mBDevice = mBT.getRemoteDevice(arg0[0]);//arg0[0] is MAC address
                BluetoothPair.createBond(mBDevice);
                mbBonded = false;
            }catch (Exception e1){
                //Log.e(TAG, getString(R.string.app_name)+ " create Bond failed!");
                System.out.println(" create Bond failed!");
                e1.printStackTrace();
                return RET_BOND_FAIL;
            }
            while(!mbBonded && iWait > 0){
                SystemClock.sleep(iStepTime);
                iWait -= iStepTime;
            }
            if(iWait > 0){
                //RET_BOND_OK
                Log.e("Application", "create Bond failed! RET_BOND_OK ");
            }else{
                //RET_BOND_FAIL
                Log.e("Application", "create Bond failed! RET_BOND_FAIL ");
            }
            return (int) ((iWait > 0)? RET_BOND_OK : RET_BOND_FAIL);
        }


        @Override
        public void onPostExecute(Integer result){
            cordova.getActivity().unregisterReceiver(_mPairingRequest);
            if (RET_BOND_OK == result){
                System.out.println(constants.actMain_msg_bluetooth_Bond_Success);
                mhtDeviceInfo.put("BOND", constants.actDiscovery_bond_bonded);
            } else {
                System.out.println(constants.actMain_msg_bluetooth_Bond_fail);

                try {
                    BluetoothPair.removeBond(mBDevice);
                } catch (Exception e){
                    System.out.println("removeBond failed!");
                    e.printStackTrace();
                }


                System.out.println("mBDevice.getAddress()"+mBDevice.getAddress());
                new connSocketTask().execute(mBDevice.getAddress());
            }
        }
    }


    private class connSocketTask extends AsyncTask<String, String, Integer>{ //TODO
        /**Process waits prompt box*/
        private ProgressDialog mpd = null;
        /**Constants: connection fails*/
        private static final int CONN_FAIL = 0x01;
        /**Constant: the connection is established*/
        private static final int CONN_SUCCESS = 0x02;

        @Override
        public void onPreExecute(){
        }

        @Override
        protected Integer doInBackground(String... arg0){
            Log.e("Connect","doInBackground");
            if (mGP.createConn(arg0[0])){
                Log.e("Main Activity", "inside createconn[]");
                SystemClock.sleep(2000);
                try{
                    Log.e("Main Activity ","Reading Device Serial No.........>");
                    //Reading device serial number
                    sDevicetype = gen.sGetSerialNumber();
                    System.out.println("DEVICE TYPE.........>"+sDevicetype);
                    sDevicetype = sDevicetype.substring(0, 2);
                    System.out.println("DEVICE TYPE.........>"+sDevicetype);
                }catch(NullPointerException e){
                    Log.e("Main Activity ","DEVICE TYPE.........>"+e);
                }catch (IndexOutOfBoundsException e) {
                    // TODO: handle exception
                }catch(Exception e){
                    System.out.println("Exception "+e);
                }
                System.out.println("&&&&&&&&&&"+sDevicetype);
                return CONN_SUCCESS;
            }else{
                Log.e("Main Activity", "inside else of mgp.createconnn");
                return CONN_FAIL;
            }
        }

        @Override
        public void onPostExecute(Integer result){

            if (CONN_SUCCESS == result){
                //showBaudRateSelection();
                System.out.println(constants.actMain_msg_device_connect_succes);
//        Intent all_intent = new Intent(getApplicationContext(), Act_SelectPeripherals.class);
//        all_intent.putExtra("connected to Gen", true);
//        Log.e(TAG, " Radio btn EZY 1");
//        startActivity(all_intent);

                // Obtaining Input and Output Streams from Bluetooth Connection
                try {
                    outputStream = BluetoothComm.mosOut;
                    inputStream = BluetoothComm.misIn;
                    fps = new FPS(SetupProwess.setupGen, outputStream, inputStream);
                    System.out.println("FPS instantiated");
                } catch (Exception e) {
                    // TODO Auto-generated catch block
                    System.out.println("FPS not instantiated");
                    e.printStackTrace();
                }


            }else{
                System.out.println(constants.actMain_msg_device_connect_fail);
            }
        }
    }

    /* Handler to display UI response messages */
    @SuppressLint("HandlerLeak")
    Handler handler = new Handler() {
        public void handleMessage(android.os.Message msg) {
            switch (msg.what) {
                case MESSAGE_BOX:
                    String str = (String) msg.obj;
                    System.out.println(str);
                    break;
                default:
                    break;
            }
        };
    };

    /* This method shows the CaptureFinger AsynTask operation */
    public class CaptureFingerAsyn extends AsyncTask<Integer, Integer, Integer> {
        /* displays the progress dialog until background task is completed */
        @Override
        protected void onPreExecute() {
            super.onPreExecute();
        }

        /* Task of CaptureFinger performing in the background */
        @Override
        protected Integer doInBackground(Integer... params) {
            try {
                bufValue = new byte[3500];
                fpsconfig = new FpsConfig(0, (byte) 0x0F);
                bufValue = fps.bFpsCaptureMinutiae(fpsconfig);
                iRetVal = fps.iGetReturnCode();
                byte[] bMinutiaeData =fps.bGetMinutiaeData();
                String str1 = HexString.bufferToHex(bMinutiaeData);
                Log.i("Capture","Finger Data:\n"+str1);
            } catch (NullPointerException e) {
                iRetVal = DEVICE_NOTCONNECTED;
                return iRetVal;
            }
            return iRetVal;
        }

        /*
         * This function sends message to handler to display the status messages
         * of Diagnose in the dialog box
         */
        @Override
        protected void onPostExecute(Integer result) {
            if (iRetVal == DEVICE_NOTCONNECTED) {
                handler.obtainMessage(DEVICE_NOTCONNECTED,"Device not connected").sendToTarget();
            } else if (iRetVal == FPS.SUCCESS) {
                verifyFinger = true;
                handler.obtainMessage(MESSAGE_BOX, "Capture finger success").sendToTarget();
            } else if (iRetVal == FPS.FPS_INACTIVE_PERIPHERAL) {
                handler.obtainMessage(MESSAGE_BOX,"Peripheral is inactive").sendToTarget();
            } else if (iRetVal == FPS.TIME_OUT) {
                handler.obtainMessage(MESSAGE_BOX, "Capture finger time out").sendToTarget();
            } else if (iRetVal == FPS.FAILURE) {
                handler.obtainMessage(MESSAGE_BOX, "Capture finger failed").sendToTarget();
            } else if (iRetVal == FPS.PARAMETER_ERROR) {
                handler.obtainMessage(MESSAGE_BOX, "Parameter error").sendToTarget();
            } else if (iRetVal == FPS.FPS_INVALID_DEVICE_ID) {
                handler.obtainMessage(MESSAGE_BOX,"Connected  device is not license authenticated.").sendToTarget();
            } else if (iRetVal == FPS.FPS_ILLEGAL_LIBRARY) {
                handler.obtainMessage(MESSAGE_BOX,"Library not valid").sendToTarget();
            }

//            VerifyTempleAsync verifyTemp = new VerifyTempleAsync();
//            verifyTemp.execute(0);

            super.onPostExecute(result);

        }
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

}


