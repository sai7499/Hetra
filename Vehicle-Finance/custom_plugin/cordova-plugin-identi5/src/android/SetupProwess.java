package org.apache.cordova.device;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Parcelable;
import android.widget.Button;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.os.Handler;

import com.lillygen.api.FPS;
import com.lillygen.api.FpsConfig;
import com.lillygen.api.FpsImageAPI;
import com.lillygen.api.General;
import com.lillygen.api.HexString;
import com.lillygen.api.Setup;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.concurrent.TimeUnit;


import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.regex.Pattern;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.SystemClock;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.Button;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.TextView;
import android.widget.Toast;


import org.apache.cordova.device.evolute.bluetooth.BluetoothComm;
import org.apache.cordova.device.evolute.bluetooth.BluetoothPair;
import org.apache.cordova.device.evolute.lilygendemoapp.GlobalPool;
import org.apache.cordova.device.evolute.lilygendemoapp.constants;

import capacitor.android.plugins.R;

public class SetupProwess extends Activity {
    public static Setup setupGen;

    General gen;
    FPS fps;

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

    public static BluetoothAdapter mBT = BluetoothAdapter.getDefaultAdapter();
    /** bluetooth List View*/
    private ListView mlvList = null;

    public static final byte REQUEST_DISCOVERY = 0x01;
    public static final byte REQUEST_ABOUT = 0x05;

    /**
     * Storage the found bluetooth devices
     * format:<MAC, <Key,Value>>;Key=[RSSI/NAME/COD(class of device)/BOND/UUID]
     * */
    private Hashtable<String, Hashtable<String, String>> mhtFDS = null;
    /**(List of storage arrays for display) dynamic array of objects / ** ListView's */
    private ArrayList<HashMap<String, Object>> malListItem = null;
    /**SimpleAdapter object (list display container objects)*/
    Context context = this;
    private SimpleAdapter msaListItemAdapter = null;
    private boolean mbBTstatusBefore = false;

    Button btnScan, btnClose, captureFingerprint, fpsImgCompress;
    private boolean mbBonded = false;
    public static BluetoothDevice mBDevice = null;

    public static Setup setup = null;
    String sDevicetype;
    private final int MESSAGE_BOX = 1;
    private int iRetVal;

    OutputStream outputStream;
    InputStream inputStream;

    static ProgressDialog dlgCustom,dlgpd;

    FpsConfig fpsconfig = new FpsConfig();
    private byte[] bufValue = {};
    private byte[] image = {};
    private byte[] image1 = {};
    public static final int DEVICE_NOTCONNECTED = -100;
    private boolean verifyFinger = false;
    private boolean verifyCompressed = false;
    private boolean verifyUncompressed = false;




    /* Scan for Bluetooth devices. (broadcast listener) */
    private BroadcastReceiver _foundReceiver = new BroadcastReceiver(){	//TODO
        public void onReceive(Context context, Intent intent){
            /* bluetooth device profiles*/
            Hashtable<String, String> htDeviceInfo = new Hashtable<String, String>();
            System.out.println(">>Scan for Bluetooth devices");
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
                htDeviceInfo.put("BOND", (constants.actDiscovery_bond_nothing));
            String sDeviceType = String.valueOf(b.get(EXTRA_DEVICE_TYPE));
            if (!sDeviceType.equals("null"))
                htDeviceInfo.put("DEVICE_TYPE", sDeviceType);
            else
                htDeviceInfo.put("DEVICE_TYPE", "-1");
            /*adding scan to the device profiles*/
            mhtFDS.put(device.getAddress(), htDeviceInfo);
            /*Refresh show list*/
            showDevices();
        }
    };

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
    /**
     * Bluetooth scanning is finished processing.(broadcast listener)
     */
    private BroadcastReceiver _finshedReceiver = new BroadcastReceiver(){ //TODO
        @Override
        public void onReceive(Context context, Intent intent){
           System.out.println(">>Bluetooth scanning is finished");
            _discoveryFinished = true; //set scan is finished
            unregisterReceiver(_foundReceiver);
            unregisterReceiver(_finshedReceiver);
            if (null != mhtFDS && mhtFDS.size()>0){
                Toast.makeText(SetupProwess.this,
                        (constants.actDiscovery_msg_select_device),
                        Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(SetupProwess.this,
                        (constants.actDiscovery_msg_not_find_device),
                        Toast.LENGTH_LONG).show();
            }
        }
    };

    private GlobalPool mGP = null;

    private TextView mtvDeviceInfo = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.white_bg);

        this.mGP = ((GlobalPool)this.getApplicationContext());

        captureFingerprint = (Button)findViewById(R.id.capture_fingerprint);

        fpsImgCompress = (Button) findViewById(R.id.fps_img_compress);

        this.mlvList = (ListView)this.findViewById(R.id.actDiscovery_lv);


        captureFingerprint.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                CaptureFingerAsyn captureFinger = new CaptureFingerAsyn();
                captureFinger.execute(0);
            }
        });

        fpsImgCompress.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                FpsImagecompressed fpsImgCompress = new FpsImagecompressed();
                fpsImgCompress.execute();
            }
        });

        mtvDeviceInfo = (TextView)this.findViewById(R.id.textView1);


        btnScan = (Button)findViewById(R.id.scan_but);
        btnScan.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {



                if(mGP!=null){
                    mGP.closeConn();
                    new startBluetoothDeviceTask().execute("");
                }else{
                    new startBluetoothDeviceTask().execute("");
                }
            }
        });


        this.mlvList.setOnItemClickListener(new OnItemClickListener(){
            @Override
            public void onItemClick(AdapterView<?> arg0, View arg1, int arg2, long arg3){
                String sMAC = ((TextView)arg1.findViewById(R.id.device_item_ble_mac)).getText().toString();
                Intent result = new Intent();
                result.putExtra("MAC", sMAC);
                result.putExtra("RSSI", mhtFDS.get(sMAC).get("RSSI"));
                result.putExtra("NAME", mhtFDS.get(sMAC).get("NAME"));
                result.putExtra("COD", mhtFDS.get(sMAC).get("COD"));
                result.putExtra("BOND", mhtFDS.get(sMAC).get("BOND"));
                result.putExtra("DEVICE_TYPE", toDeviceTypeString(mhtFDS.get(sMAC).get("DEVICE_TYPE")));
                setResult(Activity.RESULT_OK, result);
                new PairTask().execute(sMAC);

//                finish();
            }
        });


    }

    /* Handler to display UI response messages */
    @SuppressLint("HandlerLeak")
    Handler handler = new Handler() {
        public void handleMessage(android.os.Message msg) {
            switch (msg.what) {
                case MESSAGE_BOX:
                    String str = (String) msg.obj;
                    ShowDialog(str);
                    break;
                default:
                    break;
            }
        };
    };

    /* To show response messages */
    public void ShowDialog(String str) {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(context);
        alertDialogBuilder.setTitle(constants.dialog_title_alert);
        alertDialogBuilder.setMessage(str).setCancelable(false)
                .setPositiveButton(constants.btn_ok, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        dialog.dismiss();
                    }
                });
        // create alert dialog
        AlertDialog alertDialog = alertDialogBuilder.create();
        // show it
        alertDialog.show();
    }




    @Override
    protected void onStart() {
        super.onStart();
        this.onCreate();

    }

    private void onCreate() {
        try {


            setupGen = new Setup();
            boolean activate = setupGen.blActivateLibrary(this, R.raw.licence_lillyfull);
            if (activate == true) {
                System.out.println("Gen Library Activated......");
                // Send parameters to retrieve in cordova.
//                Intent intent = new Intent();
//                intent.putExtra("data", "Data is back");
//                setResult(Activity.RESULT_OK, intent);

               // finish();// Exit of this activity !



            } else if (activate == false) {
                System.out.println("Gen Library Not Activated......");
            }
        } catch (Exception e) {
            System.out.println("Exception......"+e);
        }
    }

    /* Show devices list */
    protected void showDevices(){ //TODO
        if (null == this.malListItem)
            this.malListItem = new ArrayList<HashMap<String, Object>>();


        if (null == this.msaListItemAdapter){
            //Generate adapter Item and dynamic arrays corresponding element
            this.msaListItemAdapter = new SimpleAdapter(this,malListItem,//Data Sources
                    R.layout.list_view_item_devices,//ListItem's XML implementation
                    //Child corresponding dynamic arrays and ImageItem
                    new String[] {"NAME","MAC", "COD", "RSSI", "DEVICE_TYPE", "BOND"},
                    //A ImageView ImageItem XML file inside, two TextView ID
                    new int[] {R.id.device_item_ble_name,
                            R.id.device_item_ble_mac,
                            R.id.device_item_ble_cod,
                            R.id.device_item_ble_rssi,
                            R.id.device_item_ble_device_type,
                            R.id.device_item_ble_bond
                    }
            );

            this.mlvList.setAdapter(this.msaListItemAdapter);
        }

        mlvList.setVisibility(View.VISIBLE);
        captureFingerprint.setVisibility(View.GONE);
        fpsImgCompress.setVisibility(View.GONE);



        this.malListItem.clear();//Clear history entries
        Enumeration<String> e = this.mhtFDS.keys();

        while (e.hasMoreElements()){
            HashMap<String, Object> map = new HashMap<String, Object>();
            String sKey = e.nextElement();
            map.put("MAC", sKey);
            map.put("NAME", this.mhtFDS.get(sKey).get("NAME"));
            map.put("RSSI", this.mhtFDS.get(sKey).get("RSSI"));
            map.put("COD", this.mhtFDS.get(sKey).get("COD"));
            map.put("BOND", this.mhtFDS.get(sKey).get("BOND"));
            map.put("DEVICE_TYPE", toDeviceTypeString(this.mhtFDS.get(sKey).get("DEVICE_TYPE")));
            this.malListItem.add(map);
        }
        this.msaListItemAdapter.notifyDataSetChanged();
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
            this.mpd = new ProgressDialog(SetupProwess.this);
            this.mpd.setMessage(constants.actDiscovery_msg_scaning_device);
            this.mpd.setCancelable(true);
            this.mpd.setCanceledOnTouchOutside(true);
            this.mpd.setOnCancelListener(new DialogInterface.OnCancelListener(){
                @Override
                public void onCancel(DialogInterface dialog){
                    _discoveryFinished = true;
                }
            });
            this.mpd.show();
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
                SystemClock.sleep(miSLEEP_TIME);
            }
            return RET_SCAN_DEVICE_FINISHED;
        }

        @Override
        public void onPostExecute(Integer result){
            if (this.mpd.isShowing())
                this.mpd.dismiss();
            if (mBT.isDiscovering())
                mBT.cancelDiscovery();
            if (RET_SCAN_DEVICE_FINISHED == result){

            }else if (RET_BLUETOOTH_NOT_START == result){
                Toast.makeText(SetupProwess.this, constants.actDiscovery_msg_bluetooth_not_start,
                        Toast.LENGTH_SHORT).show();
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
        registerReceiver(_finshedReceiver, discoveryFilter);
        IntentFilter foundFilter = new IntentFilter(BluetoothDevice.ACTION_FOUND);
        registerReceiver(_foundReceiver, foundFilter);
        mBT.startDiscovery();//start scan

        this.showDevices(); //the first scan clear show list
    }


    private class startBluetoothDeviceTask extends AsyncTask<String, String, Integer>{
        private static final int RET_BULETOOTH_IS_START = 0x0001; //TODO
        private static final int RET_BLUETOOTH_START_FAIL = 0x04;
        private static final int miWATI_TIME = 15;
        private static final int miSLEEP_TIME = 150;
        private ProgressDialog mpd;
        @Override
        public void onPreExecute(){
            mpd = new ProgressDialog(SetupProwess.this);
            mpd.setMessage(constants.actDiscovery_msg_starting_device);
            mpd.setCancelable(false);
            mpd.setCanceledOnTouchOutside(false);
            mpd.show();
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
            if (mpd.isShowing())
                mpd.dismiss();
            if (RET_BLUETOOTH_START_FAIL == result){
                AlertDialog.Builder builder = new AlertDialog.Builder(SetupProwess.this);
                builder.setTitle(constants.dialog_title_sys_err);
                builder.setMessage(constants.actDiscovery_msg_start_bluetooth_fail);
                builder.setPositiveButton(constants.btn_ok, new DialogInterface.OnClickListener(){
                    @Override
                    public void onClick(DialogInterface dialog, int which){
                        mBT.disable();
                        finish();
                    }
                });
                builder.create().show();
            } else if (RET_BULETOOTH_IS_START == result){
                openDiscovery();
            }
        }
    }

    private void openDiscovery() {
        new scanDeviceTask().execute("");

    }

    private class PairTask extends AsyncTask<String, String, Integer>{ //TODO
        /**Constants: the pairing is successful*/
        static private final int RET_BOND_OK = 0x00;
        /**Constants: Pairing failed*/
        static private final int RET_BOND_FAIL = 0x01;
        /**Constants: Pairing waiting time (15 seconds)*/
        static private final int iTIMEOUT = 1000 * 15;
        private ProgressDialog mpd;

        @Override
        public void onPreExecute(){
            Toast.makeText(SetupProwess.this,
                    constants.actMain_msg_bluetooth_Bonding,
                    Toast.LENGTH_SHORT).show();
            registerReceiver(_mPairingRequest, new IntentFilter(BluetoothPair.PAIRING_REQUEST));
            registerReceiver(_mPairingRequest, new IntentFilter(BluetoothDevice.ACTION_BOND_STATE_CHANGED));
            mpd = new ProgressDialog(SetupProwess.this);
            mpd.setMessage(constants.pairing_msg_starting_device);
            mpd.setCancelable(false);
            mpd.setCanceledOnTouchOutside(false);
            mpd.show();
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
            unregisterReceiver(_mPairingRequest);
            if (mpd.isShowing())
                mpd.dismiss();

            if (RET_BOND_OK == result){
                Toast.makeText(SetupProwess.this,
                        constants.actMain_msg_bluetooth_Bond_Success,
                        Toast.LENGTH_SHORT).show();
                mhtDeviceInfo.put("BOND", constants.actDiscovery_bond_bonded);

                showDeviceInfo(mBDevice.getAddress());


            } else {
//                Toast.makeText(SetupProwess.this,
//                        constants.actMain_msg_bluetooth_Bond_fail,
//                        Toast.LENGTH_LONG).show();
                System.out.println(constants.actMain_msg_bluetooth_Bond_fail);
                try {
                    BluetoothPair.removeBond(mBDevice);
                } catch (Exception e){
                    System.out.println("removeBond failed!");
                    e.printStackTrace();
                }

                showDeviceInfo(mBDevice.getAddress());

                new connSocketTask().execute(mBDevice.getAddress());
            }
        }
    }

    private void showDeviceInfo(String sMAC){

        System.out.println("&&&&&&&&&&&&"+  mhtFDS.get(sMAC).get("NAME"));

        mtvDeviceInfo.setText(mhtFDS.get(sMAC).get("NAME")+": MAC "+sMAC+ "+:"+mhtFDS.get(sMAC).get("BOND"));

        Toast.makeText(SetupProwess.this,
                "Connected Successfully",
                Toast.LENGTH_SHORT).show();
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data){
        if (requestCode == REQUEST_DISCOVERY){
            if (Activity.RESULT_OK == resultCode){
                this.mhtDeviceInfo.put("NAME", data.getStringExtra("NAME"));
                this.mhtDeviceInfo.put("MAC", data.getStringExtra("MAC"));
                this.mhtDeviceInfo.put("COD", data.getStringExtra("COD"));
                this.mhtDeviceInfo.put("RSSI", data.getStringExtra("RSSI"));
                this.mhtDeviceInfo.put("DEVICE_TYPE", data.getStringExtra("DEVICE_TYPE"));
                this.mhtDeviceInfo.put("BOND", data.getStringExtra("BOND"));
                if (this.mhtDeviceInfo.get("BOND").equals(constants.actDiscovery_bond_nothing)){
                }else{
                    mBDevice = mBT.getRemoteDevice(this.mhtDeviceInfo.get("MAC"));
                }
            }else if (Activity.RESULT_CANCELED == resultCode){
                this.finish();
            }
        } else if (requestCode==3) {
            finish();
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
            this.mpd = new ProgressDialog(SetupProwess.this);
            this.mpd.setMessage(constants.actMain_msg_device_connecting);
            this.mpd.setCancelable(false);
            this.mpd.setCanceledOnTouchOutside(false);
            this.mpd.show();

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
                    Log.e("Main Activity ","DEVICE TYPE.........>"+sDevicetype);
                    sDevicetype = sDevicetype.substring(0, 2);
                    Log.e("Main Activity ","DEVICE TYPE.........>"+sDevicetype);
                }catch(NullPointerException e){
                    Log.e("Main Activity ","DEVICE TYPE.........>"+e);
                }catch (IndexOutOfBoundsException e) {
                    // TODO: handle exception
                }catch(Exception e){
                    System.out.println("Excepton...."+e);
                }
                return CONN_SUCCESS;
            }else{
                Log.e("Main Activity", "inside else of mgp.createconnn");
                return CONN_FAIL;
            }
        }

        @Override
        public void onPostExecute(Integer result){
            this.mpd.dismiss();

            if (CONN_SUCCESS == result){
                Toast.makeText(SetupProwess.this,constants.actMain_msg_device_connect_succes,Toast.LENGTH_SHORT).show();
                //showBaudRateSelection();
                try {
                    outputStream = BluetoothComm.mosOut;
                    inputStream = BluetoothComm.misIn;
                    fps = new FPS(SetupProwess.setupGen, outputStream, inputStream);
                    System.out.println("FPS instantiated");

                    mlvList.setVisibility(View.GONE);
                    captureFingerprint.setVisibility(View.VISIBLE);
//                    fpsImgCompress.setVisibility(View.VISIBLE);



                } catch (Exception e) {
                    // TODO Auto-generated catch block
                    System.out.println("FPS not instantiated");
                    e.printStackTrace();
                }

            }else{
                Toast.makeText(SetupProwess.this, constants.actMain_msg_device_connect_fail,Toast.LENGTH_SHORT).show();
            }
        }
    }

    /* This method shows the CaptureFinger AsynTask operation */
    public class CaptureFingerAsyn extends AsyncTask<Integer, Integer, Integer> {
        /* displays the progress dialog until background task is completed */
        public String resHexStr;
        @Override
        protected void onPreExecute() {
            progressDialog(context, "Place your finger on FPS ...");
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
                resHexStr = HexString.bufferToHex(bMinutiaeData);
                Log.i("Capture","Finger Data:\n"+resHexStr);
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
            dlgCustom.dismiss();
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

            Intent intent = new Intent();
            intent.putExtra("data", resHexStr);
            setResult(Activity.RESULT_OK, intent);
            finish();
            super.onPostExecute(result);
        }
    }

    /* This performs Progress dialog box to show the progress of operation */
    public static void progressDialog(Context context, String msg) {
        dlgCustom = new ProgressDialog(context);
        dlgCustom.setMessage(msg);
        dlgCustom.setTitle(constants.dialog_title_alert);
        dlgCustom.setIndeterminate(true);
        dlgCustom.setCancelable(false);
        dlgCustom.show();
    }

    @SuppressLint("NewApi")
    private void Horigontalprogress(Context context, String string) {
        // TODO Auto-generated method stub
        dlgpd = new ProgressDialog(context);
        dlgpd.setMessage(string);
        dlgpd.setCancelable(false);
        dlgpd.setIndeterminate(true);
        dlgpd.setProgressNumberFormat(null);
        dlgpd.setProgressPercentFormat(null);
        dlgpd.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        dlgpd.show();
    }




    @Override
    protected void onDestroy(){ //TODO
        super.onDestroy();
        if (mBT.isDiscovering())
            mBT.cancelDiscovery();
	this.mGP.closeConn();
	if (null != mBT && !this.mbBTstatusBefore)
		mBT.disable();
    }


    Bitmap bitmapimage = null;
    byte[] bCmpData;
    byte[] bUncmpData;
    byte[] bBmpData;

    /* This method shows the FpsImagecompressed AsynTask operation */
    public class FpsImagecompressed extends AsyncTask<Integer, Integer, Integer> {
        /* displays the progress dialog until background task is completed */
        public String resHexStr;

        @Override
        protected void onPreExecute() {
            System.out.println("Place your finger for capture and please wait for the response...");
            super.onPreExecute();
        }

        /* Task of FpsImagecompressed performing in the background */
        @Override
        protected Integer doInBackground(Integer... params) {
            try {
                image = new byte[3500];
                iRetVal = fps.iGetFingerImageCompressed(image,new FpsConfig(1, (byte) 0x0f));
                if(iRetVal<0){
                    return iRetVal;
                }
                bCmpData = fps.bGetImageData();
                bufValue =fps.bGetMinutiaeData();
                resHexStr = HexString.bufferToHex(bufValue);
                Log.i("Minutiae","Image Compressed Data:\n"+resHexStr);
                bUncmpData = FpsImageAPI.bGetUncompressedRawData(bCmpData);
                bBmpData = FpsImageAPI.bConvertRaw2bmp(bUncmpData);
            } catch (NullPointerException e) {
                iRetVal = -100;
                return iRetVal;
            }
            return iRetVal;
        }

        @Override
        protected void onProgressUpdate(Integer... values) {
            // TODO Auto-generated method stub
            super.onProgressUpdate(values);
        }

        /*
         * This function sends message to handler to display the status messages
         * of Diagnose in the dialog box
         */
        @Override
        protected void onPostExecute(Integer result) {
            System.out.println("Uncompressed ssss"+ iRetVal);
            if (iRetVal == DEVICE_NOTCONNECTED) {
                handler.obtainMessage(DEVICE_NOTCONNECTED,"Device not connected").sendToTarget();
            } else if (iRetVal >0) {
                System.out.println("Uncompressed Success");
                verifyFinger = true;
                verifyCompressed = true;
                handler.obtainMessage(MESSAGE_BOX, "Capture UncompressedImage finger success").sendToTarget();
                Bitmap bmpfinalnew = BitmapFactory.decodeByteArray(bBmpData, 0,bBmpData.length);
                System.out.println(bmpfinalnew);
            } else if (iRetVal == FPS.FPS_INACTIVE_PERIPHERAL) {
                handler.obtainMessage(MESSAGE_BOX,"Peripheral is inactive").sendToTarget();
            } else if (iRetVal == FPS.TIME_OUT) {
                handler.obtainMessage(MESSAGE_BOX, "Capture finger time out").sendToTarget();
            } else if (iRetVal == FPS.FPS_ILLEGAL_LIBRARY) {
                handler.obtainMessage(MESSAGE_BOX, "Illegal library").sendToTarget();
            } else if (iRetVal == FPS.FAILURE) {
                handler.obtainMessage(MESSAGE_BOX,"Captured template verification is failed,Wrong finger placed").sendToTarget();
            } else if (iRetVal == FPS.PARAMETER_ERROR) {
                handler.obtainMessage(MESSAGE_BOX, "Parameter error").sendToTarget();
            } else if (iRetVal == FPS.FPS_INVALID_DEVICE_ID) {
                handler.obtainMessage(MESSAGE_BOX,"Library is in demo version").sendToTarget();
            } else if (iRetVal == FPS.FPS_INVALID_DEVICE_ID) {
                handler.obtainMessage(MESSAGE_BOX,"Connected  device is not license authenticated.").sendToTarget();
            } else if (iRetVal == FPS.FPS_ILLEGAL_LIBRARY) {
                handler.obtainMessage(MESSAGE_BOX,"Library not valid").sendToTarget();
            }

            Intent intent = new Intent();
            intent.putExtra("data", resHexStr);
            setResult(Activity.RESULT_OK, intent);
            finish();
            super.onPostExecute(result);
        }
    }



}




