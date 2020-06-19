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

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringReader;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.Hashtable;
import java.util.List;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.icu.text.SimpleDateFormat;
import android.provider.Settings;
import android.util.Log;


import android.widget.Toast;


import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Locale;
import java.util.Properties;
import java.util.TimeZone;
import java.util.regex.Pattern;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import capacitor.android.plugins.R;


public class Device extends CordovaPlugin {
    public static final String TAG = "Device";

    public static String platform;                            // Device OS


    private CallbackContext pluginCallback;

    public static String uuid;                                // Device UUID

    private static final String ANDROID_PLATFORM = "Android";
    private static final String AMAZON_PLATFORM = "amazon-fireos";
    private static final String AMAZON_DEVICE = "Amazon";

    KeyStore p12;

    /**
     * Storage the found bluetooth devices
     * format:<MAC, <Key,Value>>;Key=[RSSI/NAME/COD(class of device)/BOND/UUID]
     * */
    private Hashtable<String, Hashtable<String, String>> mhtFDS = null;


    private String glbDevname = "";
    private String glbDevmac = "";
    private String fCount = "1";

    Properties uidPrefs;

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
                Document doc = null;
                try {
                    doc = toXmlDocument(piddata);
                } catch (ParserConfigurationException e) {
                    e.printStackTrace();
                } catch (SAXException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }

                String authXMLdata =  createAuthXML(piddata);

//                Element element=doc.getDocumentElement();
//                element.normalize();
//
//                NodeList nList = doc.getElementsByTagName("PidData");
//                String skey, hMac, dataEnc;
//
//                for (int i=0; i<nList.getLength(); i++) {
//
//                    Node node = nList.item(i);
//                    if (node.getNodeType() == Node.ELEMENT_NODE) {
//                        Element element2 = (Element) node;
//
//                        skey = getValue("Skey", element2);
//                        hMac = getValue("Hmac", element2);
//
//                        dataEnc = getValue("Data", element2);
//
//                        System.out.println("skey"+skey);
//                        System.out.println("hMac"+hMac);
//
//                        System.out.println("dataEnc"+dataEnc);
//
//                    }
//                }



                try {
                    JSONObject r = new JSONObject();
                    r.put("uuid", Device.uuid);
                    r.put("version", this.getOSVersion());
                    r.put("platform", this.getPlatform());
                    r.put("model", authXMLdata);
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



    private static Document toXmlDocument(String str) throws ParserConfigurationException, SAXException, IOException {

        DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder = docBuilderFactory.newDocumentBuilder();
        Document document = docBuilder.parse(new InputSource(new StringReader(str)));

        return document;
    }

    private static String getValue(String tag, Element element) {
        NodeList nodeList = element.getElementsByTagName(tag).item(0).getChildNodes();
        Node node = nodeList.item(0);
        return node.getNodeValue();
    }

//    public String createAuthXML(String piddataxml) {
//
//        String uid = "";
//        Log.e(TAG, " :: createAuthXMLRegistered | ENTER");
//        uidPrefs = loadPreferences("staging.properties");
//        char[] password;
//        String sigAlias;
//        String txn = null;
//        String ns2 = "";
//        String xmlns = "xmlns=\"http://www.uidai.gov.in/authentication/uid-auth-request/2.0\"";
//        String xmlnsBfd = "";
//        String type = "A";
//        String pi = "n";
//
//        String errcode		= "1";
//        String errinfo		= null;
//        String fcount		= null;
//        String pid		    = null;
//        String skey			= null;
//        String ci			= null;
//        String hmac			= null;
//        String rdsId	    = null;
//        String rdsVer	    = null;
//        String dpId			= null;
//        String dc			= null;
//        String mi			= null;
//        String mc			= null;
//
//        try {
//            Log.e(TAG, " :: createAuthXMLRegistered Parsing | ENTER");
//            InputStream is = new ByteArrayInputStream(piddataxml.getBytes());
//
//            DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
//            domFactory.setIgnoringComments(true);
//            DocumentBuilder builder = domFactory.newDocumentBuilder();
//            Document doc = builder.parse(is);
//
//            errcode = doc.getElementsByTagName("Resp").item(0).getAttributes().getNamedItem("errCode").getTextContent();
//            if (errcode.equals("1")) {
//                errinfo = doc.getElementsByTagName("Resp").item(0).getAttributes().getNamedItem("errInfo").getTextContent();
//            } else {
//                fcount = doc.getElementsByTagName("Resp").item(0).getAttributes().getNamedItem("fCount").getTextContent();
//                pid = doc.getElementsByTagName("Data").item(0).getTextContent();
//                skey = doc.getElementsByTagName("Skey").item(0).getTextContent();
//                ci = doc.getElementsByTagName("Skey").item(0).getAttributes().getNamedItem("ci").getTextContent();
//                hmac = doc.getElementsByTagName("Hmac").item(0).getTextContent();
//                type = doc.getElementsByTagName("Data").item(0).getAttributes().getNamedItem("type").getTextContent();
//                dc = doc.getElementsByTagName("DeviceInfo").item(0).getAttributes().getNamedItem("dc").getTextContent();
//                mi = doc.getElementsByTagName("DeviceInfo").item(0).getAttributes().getNamedItem("mi").getTextContent();
//                mc = doc.getElementsByTagName("DeviceInfo").item(0).getAttributes().getNamedItem("mc").getTextContent();
//                Log.e(TAG, "device Public certificate: " + mc);
//                Log.e(TAG, "device skey: " + skey);
//                skey = skey.replaceAll(" ", "\n");
//                Log.e(TAG, "device skey: " + skey);
//
////                SimpleDateFormat sdfTxn = new SimpleDateFormat("yyyyMMddHHmmssSSS", Locale.US);
////                txn = "" +sdfTxn.format(date);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            errcode = "1";
//            errinfo = "xml Parsing error";
//        }
//
//        if (!errcode.equals("1")) {
//            try {
//                Log.e(TAG, " :: createAuthXMLRegistered xml building| ENTER");
//                //TODO :	rc hardcoded to y in authxml
//
//                String authXML = String.format(
//                        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" +
//                                "<" + ns2 + "Auth " + "ac=\"" + uidPrefs.getProperty("auaCode")
//                                + "\" " + "lk=\"" + uidPrefs.getProperty("auaLicenseKey") + "\" " + "rc=\"" + (isRc? "Y":"N") +"\""+"sa=\""
//                                + uidPrefs.getProperty("sa") + "\" " + "tid=\"registered\" "
//                                + "txn=\"" + txn + "\" " + "uid=\"" + uid + "\" " + "ver=\"2.0\" " + xmlnsBfd + xmlns + ">"
//                                + "<Uses " + "bio=\"y\" " + "bt=\"FMR\" " + "otp=\"n\" " + "pa=\"n\" " + "pfa=\"n\" "
//                                + "pi=\"" + pi + "\" " + "pin=\"n\"/>"
//                                + "<Meta "  + "dc=\"" + dc + "\" "
//                                + "mi=\"" + mi + "\" "
//                                + "mc=\"" + mc + "\" "
//                                + "rdsId=\"" + rdsId + "\" "
//                                + "rdsVer=\"" + rdsVer + "\" "
//                                + "dpId=\"" + dpId + "\" "
//                                + "udc=\"" + uidPrefs.getProperty("udc") + "\"/>"
//                                + "<Skey " + "ci=\"" + ci + "\">" + skey + "</Skey>"
//                                + "<Data "+ "type=\""+ type +"\">" + pid + "</Data>"
//                                + "<Hmac>" + hmac + "</Hmac>" + "</" + ns2 + "Auth>");
//
//                Log.e(TAG, " :: AuthXML is:" + authXML);
//                password = uidPrefs.getProperty("signaturePassword").toCharArray();
//                sigAlias = uidPrefs.getProperty("signatureAlias");
//                p12 = KeyStore.getInstance("pkcs12");
//                InputStream is = this.cordova.getActivity().getApplicationContext().getAssets().open(uidPrefs.getProperty("signKeyStore"));
//                p12.load(is, password);
//                PrivateKey privKey = (PrivateKey) p12.getKey(sigAlias, password);
//                X509Certificate cert = (X509Certificate) p12.getCertificate(sigAlias);
//                String signedXML = XmlSigner.generateXmlSignature(authXML, privKey, cert);
//                is.close();
//                Log.e(TAG, " :: signedXML is:" + signedXML);
//                return signedXML;
//            } catch (Exception e) {
//                e.printStackTrace();
//                errcode = "1";
//                errinfo = "xml formation error";
//            }
//        }
//
//        return null;
//    }

    private Properties loadPreferences(String prefsFile) {
        InputStream is = null;
        Properties prefs = null;
        try {
            is = this.cordova.getActivity().getApplicationContext().getAssets().open(prefsFile);
            if (is != null) {
                prefs = new Properties();
                prefs.load(is);
            }
        } catch (IOException ex) {
            Log.e(this.toString(), "Error accessing preferences file");
            return null;
        } finally {
            try {
                if (is != null) {
                    is.close();
                }
            } catch (IOException ex) {
                Log.e(this.toString(), "Error closing preferences file");
            }
        }
        return prefs;
    }

    public String createAuthXML(String piddataxml) {
        Log.e(TAG, " :: createAuthXMLRegistered | ENTER");
        char[] password;
        String sigAlias;
        String txn = null;
        String ns2 = "";
        String xmlns = "xmlns=\"http://www.uidai.gov.in/authentication/uid-auth-request/2.0\"";
        String xmlnsBfd = "";
        String type = "A";
        String pi = "n";

        String errcode = "1";
        String errinfo = null;
        String fcount = null;
        String pid = null;
        String skey = null;
        String ci = null;
        String hmac = null;
        String rdsId = null;
        String rdsVer = null;
        String dpId = null;
        String dc = null;
        String mi = null;
        String mc = null;

        try {
            Log.e(TAG, " :: createAuthXMLRegistered Parsing | ENTER");
            InputStream is = new ByteArrayInputStream(piddataxml.getBytes());

            DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
            domFactory.setIgnoringComments(true);
            DocumentBuilder builder = domFactory.newDocumentBuilder();
            Document doc = builder.parse(is);

            errcode = doc.getElementsByTagName("Resp").item(0).getAttributes().getNamedItem("errCode").getTextContent();
            if (errcode.equals("1")) {
                errinfo = doc.getElementsByTagName("Resp").item(0).getAttributes().getNamedItem("errInfo").getTextContent();
            } else {
                fcount = doc.getElementsByTagName("Resp").item(0).getAttributes().getNamedItem("fCount").getTextContent();
                pid = doc.getElementsByTagName("Data").item(0).getTextContent();
                skey = doc.getElementsByTagName("Skey").item(0).getTextContent();
                ci = doc.getElementsByTagName("Skey").item(0).getAttributes().getNamedItem("ci").getTextContent();
                hmac = doc.getElementsByTagName("Hmac").item(0).getTextContent();
                type = doc.getElementsByTagName("Data").item(0).getAttributes().getNamedItem("type").getTextContent();
                dpId = doc.getElementsByTagName("DeviceInfo").item(0).getAttributes().getNamedItem("dpId").getTextContent();
                rdsId = doc.getElementsByTagName("DeviceInfo").item(0).getAttributes().getNamedItem("rdsId").getTextContent();
                rdsVer = doc.getElementsByTagName("DeviceInfo").item(0).getAttributes().getNamedItem("rdsVer").getTextContent();
                dc = doc.getElementsByTagName("DeviceInfo").item(0).getAttributes().getNamedItem("dc").getTextContent();
                mi = doc.getElementsByTagName("DeviceInfo").item(0).getAttributes().getNamedItem("mi").getTextContent();
                mc = doc.getElementsByTagName("DeviceInfo").item(0).getAttributes().getNamedItem("mc").getTextContent();
                Log.e(TAG, "device Public certificate: " + mc);
                Log.e(TAG, "device Public certificate: " + mc);
                Log.e(TAG, "device skey: " + skey);
                skey = skey.replaceAll(" ", "\n");
                Log.e(TAG, "device skey: " + skey);

//                SimpleDateFormat sdfTxn = new SimpleDateFormat("yyyyMMddHHmmssSSS", Locale.US);
//                txn = "" +sdfTxn.format(date);
            }
        } catch (Exception e) {
            e.printStackTrace();
            errcode = "1";
            errinfo = "xml Parsing error";
        }

        if (!errcode.equals("1")) {
            try {
                Log.e(TAG, " :: createAuthXMLRegistered xml building| ENTER");
                //TODO :	rc hardcoded to y in authxml

                String authXML = String.format(
                        "<Uses bio=\"y\" bt=\"FMR\" otp=\"n\" pa=\"n\" pfa=\"n\" pi=\"n\" pin=\"n\" />"+
                                "<Meta "  + "dc=\"" + dc + "\" "
                                + "mi=\"" + mi + "\" "
                                + "mc=\"" + mc + "\" "
                                + "rdsId=\"" + rdsId + "\" "
                                + "rdsVer=\"" + rdsVer + "\" "
                                + "dpId=\"" + dpId + "\" "
                                + "udc=\"" + "ESB000011205764" + "\"/>"+
                                "<Skey " + "ci=\"" + ci + "\">" + skey + "</Skey>"
                                + "<Data " + "type=\"" + type + "\">" + pid + "</Data>"
                                + "<Hmac>" + hmac + "</Hmac>");

                Log.e(TAG, " :: AuthXML is:" + authXML);
                return authXML;
            } catch (Exception e) {
                e.printStackTrace();
                errcode = "1";
                errinfo = "xml formation error";
            }
        }

        return null;
    }
}





