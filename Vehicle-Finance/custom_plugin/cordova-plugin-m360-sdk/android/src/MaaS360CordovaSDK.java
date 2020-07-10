package com.fiberlink.maas360sdk.cordova;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.cert.CertificateEncodingException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.fiberlink.maas360.android.dlpsdk.encrypt.MaaS360SecureInputStream;
import com.fiberlink.maas360.android.dlpsdk.encrypt.MaaS360SecureOutputStream;
import com.fiberlink.maas360.android.dlpsdk.print.MaaS360PrintHelper;
import com.fiberlink.maas360.android.dlpsdk.print.MaaS360PrintManager;
import com.fiberlink.maas360.android.ipc.model.v1.MaaS360CertPinningInfo;
import com.fiberlink.maas360.android.ipc.model.v1.MaaS360IPCEncryptionInfo;
import com.fiberlink.maas360.android.ipc.util.AuthenticationStatus;
import com.fiberlink.maas360.android.ipc.util.DeactivationReason;
import com.fiberlink.maas360.util.Maas360Logger;
import com.fiberlink.maas360sdk.core.MaaS360SDKContextWrapper;
import com.fiberlink.maas360sdk.exception.MaaS360SDKEnterpriseGatewayNotEnabledException;
import com.fiberlink.maas360sdk.exception.MaaS360SDKInitializationException;
import com.fiberlink.maas360sdk.exception.MaaS360SDKNotActivatedException;
import com.fiberlink.maas360sdk.external.MaaS360SDK;
import com.fiberlink.maas360sdk.service.IEnterpriseGatewayService;
import com.fiberlink.maas360sdk.util.MaaS360PrintPdfAdapter;
import com.fiberlink.maas360sdk.util.MaaS360ResourceInfo;
import com.fiberlink.maas360sdk.util.MaaS360SDKEncryptionHelper;
import com.fiberlink.maas360sdk.util.MaaS360SDKFilePathResolver;
import com.fiberlink.maas360sdk.util.MaaS360SDKUtils;

import android.annotation.TargetApi;
import android.app.Application;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.text.TextUtils;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 *
 * @author sbaral
 */
public class MaaS360CordovaSDK extends CordovaPlugin
{
    private static final String TAG = MaaS360CordovaSDK.class.getSimpleName();

    private static final String EVENT_DATA = "eventData";
    private static final String EVENT_ID = "eventId";
    private static final String STATUS = "status";
    private static final String REASON = "reason";

    private static final String INIT = "initializeSDK";
    private static final String INIT2 = "initializeSDK2";
    private static final String COMPOSE_EMAIL = "composeMail";
    private static final String OPEN_URL = "openURL";
    private static final String REFRESH_SDK_INFO = "refreshSDKInfo";
    private static final String ENTERPRISE_GATEWAY = "EnterpriseGateway";
    private static final String START_ENTERPRISE_GATEWAY = "startEnterpriseGateway";
    private static final String DISCONNECT_ENTERPRISE_GATEWAY = "disconnectEnterpriseGateway";
    private static final String CONSOLE_LOG = "consoleLog";
    private static final String VIEW_DOCUMENT = "viewDocument";
    private static final String EDIT_DOCUMENT = "editDocument";

    private static final String SDK_INFO_UPDATE = "SDKInfoUpdate";
    private static final String ACTIVATION_STATUS_CHANGE = "ActivationStatusChange";
    private static final String POLICY_INFO_CHANGE = "PolicyInfoChange";
    private static final String COMPLIANCE_INFO_CHANGE = "ComplianceInfoChange";
    private static final String SELECTIVE_WIPE_STATUS_CHANGE = "SelectiveWipeStatusChange";
    private static final String USER_INFO_CHANGE = "UserInfoChange";
    private static final String DEVICE_IDENTITY_ATTRIBUTES_CHANGE = "DeviceIdentityAttributesChange";
    private static final String APP_CONFIG = "AppConfig";
    private static final String CONTAINER_LOCK_UPDATE = "ContainerLockUpdate";

    private static final String ENCRYPT_TEXT = "encryptText";
    private static final String DECRYPT_TEXT = "decryptText";
    private static final String WRITE_ENCRYPTED_FILE = "writeEncryptedFile";
    private static final String READ_ENCRYPTED_FILE = "readEncryptedFile";

    private static final String IS_GATEWAY_CONNECTED = "isGatewayConnected";

    // String constants for generate encryption key
    private static final String ENCRYPTION_KEY = "encryptionKey";
    private static final String IV_KEY = "ivKey";
    private static final String RESOURCE_INFO = "resourceInfo";
    private static final String GENERATE_KEY = "generateKey";

    // String constants for Certificate Pinning Info
    private static final String GET_CERT_PINNING_INFO = "getCertPinningInfo";
    private static final String CERT_PINNING_INFO = "certPinningInfo";
    private static final String IS_CERT_PIN_ENABLED = "isCertPinEnabled";
    private static final String CERTIFICATE_LIST = "certificateList";
    private static final String PROXY_CERTIFICATE_LIST = "proxyCertificateList";
    private static final String PINNING_URL = "pinningURL";
    private static final String PINNING_CERT = "pinningCert";
    private static final String PROXY_CERT = "proxyCert";
    private static final String CERTIFICATES_DIRECTORY = "maas360certificates";
    private static final String PRINT_DOCUMENT = "printDocumentIn";
    private static final String ENCRYPT_FILE_RESULT = "msg";

    private MaaS360CordovaSDKListener mListener = new MaaS360CordovaSDKListener(this);

    private static CallbackContext sCallBackContext;

    /**
     * {@inheritDoc}
     */
    @Override
    public void onResume(boolean multitasking)
    {
        super.onResume(multitasking);
        try {
            MaaS360SDKContextWrapper.getSharedInstance(false).checkForSSO(false, true);
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.e(TAG, "Resume : " + e.getMessage());
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException
    {
        sCallBackContext = callbackContext;
        Application application = cordova.getActivity().getApplication();

        // Validate that the action is not empty.
        if (TextUtils.isEmpty(action)) {
            Maas360Logger.e(TAG, "Invalid action - ", action);
            return false;
        }

        if (INIT.equals(action) || INIT2.equals(action)) {
            return handleInitSDK(args, action);
        }
        else if (REFRESH_SDK_INFO.equals(action)) {
            if (MaaS360SDK.isSDKActivated()) {
                handleSDKActivationSuccess();
            }
            else {
                handleSDKActivationFailed(mListener.mAuthStatus, null);
            }
            return true;
        }
        else if (COMPOSE_EMAIL.equals(action)) {
            try {

                JSONObject argValue = args.getJSONObject(0);
                JSONArray toRecipients = argValue.optJSONArray("to");
                JSONArray ccRecipients = argValue.optJSONArray("cc");
                JSONArray bccRecipients = argValue.optJSONArray("bcc");
                JSONArray attachmentPaths = argValue.optJSONArray("attachmentPaths");
                String subject = argValue.optString("subject");
                String body = argValue.optString("body");

                ArrayList<Uri> attachments = new ArrayList<Uri>();
                String[] attachmentPathStrings = getStringArray(attachmentPaths);
                if (attachmentPathStrings != null) {
                    for (String attachmentPath : attachmentPathStrings) {
                        attachments.add(Uri.fromFile(new File(attachmentPath)));
                    }
                }

                return MaaS360SDK.composeInSecureMail(cordova.getActivity().getApplication(),
                        getStringArray(toRecipients), // to
                        getStringArray(ccRecipients), // cc
                        getStringArray(bccRecipients), // bcc
                        subject, // subject
                        body, // body
                        attachments); // attachments
            }
            catch (MaaS360SDKNotActivatedException e) {
                Maas360Logger.e(TAG, e);
            }
            return false;
        }
        else if (OPEN_URL.equals(action)) {
            try {
                return MaaS360SDK.openURLInSecureBrowser(application, args.getJSONObject(0).getString("url"));
            }
            catch (MaaS360SDKNotActivatedException e) {
                Maas360Logger.e(TAG, e);
            }
            return false;
        }
        else if (START_ENTERPRISE_GATEWAY.equals(action)) {
            return handleStartEnterpriseGateway();
        }
        else if (DISCONNECT_ENTERPRISE_GATEWAY.equals(action)) {
            return handleDisconnectEnterpriseGateway();
        }
        else if (CONSOLE_LOG.equals(action)) {
            Maas360Logger.i(TAG, args.getString(0));
            callbackContext.success("");
            return true;
        }
        else if (VIEW_DOCUMENT.equals(action)) {
            try {
                return MaaS360SDK.viewDocument(cordova.getActivity().getApplicationContext(),
                        Uri.parse(args.getJSONObject(0).getString("uri")));
            }
            catch (MaaS360SDKNotActivatedException e) {
                Maas360Logger.e(TAG, e);
            }
            return false;
        }
        else if (EDIT_DOCUMENT.equals(action)) {
            try {
                return MaaS360SDK.editDocument(cordova.getActivity().getApplicationContext(),
                        Uri.parse(args.getJSONObject(0).getString("uri")));
            }
            catch (MaaS360SDKNotActivatedException e) {
                Maas360Logger.e(TAG, e);
            }
            return false;
        }
        else if (ENCRYPT_TEXT.equals(action)) {
            String strToEncrypt = args.getString(0);
            handleEncryptText(strToEncrypt, callbackContext);
            return true;
        }
        else if (DECRYPT_TEXT.equals(action)) {
            String strToDecrypt = args.getString(0);
            handleDecryptText(strToDecrypt, callbackContext);
            return true;
        }
        else if (WRITE_ENCRYPTED_FILE.equals(action)) {
            JSONObject argValue = args.getJSONObject(0);
            String fileName = argValue.optString("fileName");
            String textToWrite = argValue.optString("textToWrite");
            return handleWriteEncryptedFile(fileName, textToWrite, callbackContext);
        }
        else if (READ_ENCRYPTED_FILE.equals(action)) {
            String fileName = args.getString(0);
            handleReadFile(fileName, callbackContext);
            return true;
        }
        else if (IS_GATEWAY_CONNECTED.equals(action)) {
            handleGatewayConnectionStatus(callbackContext);
            return true;
        }
        else if (GENERATE_KEY.equals(action)) {
            JSONObject resourceInfo = args.getJSONObject(0);
            generateKeyForResource(resourceInfo, callbackContext);
            return true;
        }
        else if (GET_CERT_PINNING_INFO.equals(action)) {
            handleGetCertPinningInfo(callbackContext);
            return true;
        }
        else if (PRINT_DOCUMENT.equals(action)) {
            JSONObject printInfo = args.getJSONObject(0);
            handlePrintDocument(printInfo, callbackContext);
            return true;
        }
        else {
            Maas360Logger.e(TAG, "Unknown action ", action);
            return false;
        }
    }

    @TargetApi (19)
    private void handlePrintDocument(JSONObject printInfo, CallbackContext callbackContext)
    {
        String filePath = printInfo.optString("filePath");
        String fileName = printInfo.optString("fileName");
        Maas360Logger.i(TAG, "File URI: " + filePath + " File Name: " + fileName);
        if (TextUtils.isEmpty(fileName) || TextUtils.isEmpty(filePath)) {
            callbackContext.error("Empty FileName or URL");
        }

        String extension = FilenameUtils.getExtension(fileName);
        Uri fileURI = Uri.parse(filePath);

        try {
            InputStream is = null;
            final String resolvedFilePath = MaaS360SDKFilePathResolver.getPath(cordova.getActivity()
                    .getApplicationContext(), fileURI);
            if (MaaS360SDKFilePathResolver.isAssetUri(fileURI)) {
                is = cordova.getActivity().getAssets().open(resolvedFilePath);
            }
            else {
                is = new FileInputStream(new File(resolvedFilePath));
            }
            if (extension.equalsIgnoreCase("pdf")) {
                int totalPages = printInfo.optInt("totalPages");
                if (totalPages < 1) {
                    Maas360Logger.d(TAG, "No of pages for the pdf doc is either not defined or is zero");
                    return;
                }
                // handle pdf print using MaaS360PrintManager
                MaaS360PrintManager printManager = MaaS360PrintManager.getMaaS360PrintManager(cordova.getActivity());
                printManager.print(fileName, new MaaS360PrintPdfAdapter(is, totalPages), null);

            }
            else if (MaaS360SDKUtils.isImage(extension)) {
                Maas360Logger.i(TAG, "File Extension is image: ");
                // handle image print using MaaS360PrintHelper

                Bitmap bitmap = BitmapFactory.decodeStream(is);
                MaaS360PrintHelper photoPrinter = new MaaS360PrintHelper(cordova.getActivity());
                photoPrinter.setScaleMode(MaaS360PrintHelper.SCALE_MODE_FIT);
                photoPrinter.printBitmap(fileName, bitmap);

            }
            else if (extension.equalsIgnoreCase("html")) {
                // handle html print using MaaS360PrintManager
                cordova.getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run()
                    {
                        final WebView mPrintWebView = new WebView(cordova.getActivity().getApplicationContext());
                        mPrintWebView.setWebViewClient(new WebViewClient() {
                            @TargetApi (Build.VERSION_CODES.LOLLIPOP)
                            @Override
                            public void onPageFinished(WebView view, String url)
                            {
                                MaaS360PrintManager printManager = MaaS360PrintManager.getMaaS360PrintManager(cordova
                                        .getActivity());
                                printManager.print("Html_Print",
                                        mPrintWebView.createPrintDocumentAdapter("Html_Print"), null);
                            }
                        });
                        mPrintWebView.loadUrl(resolvedFilePath);
                    }
                });
            }
        }
        catch (IOException e) {
            Maas360Logger.e(TAG, e.getMessage(), "IO Exception");
        }
    }

    private boolean handleReadFile(String fileName, CallbackContext callbackContext) throws JSONException
    {
        if (TextUtils.isEmpty(fileName)) {
            callbackContext.error("Empty FileName");
            return false;
        }
        boolean success = false;
        String message = null;

        File file = new File(cordova.getActivity().getApplicationContext().getFilesDir(), fileName);
        ByteArrayOutputStream os = null;
        try {
            FileInputStream fis = new FileInputStream(file);
            MaaS360SecureInputStream mis = new MaaS360SecureInputStream(fis);
            os = new ByteArrayOutputStream();
            byte[] input = new byte[mis.available()];
            while (mis.read(input) != -1) {
                os.write(input);
            }
            mis.close();
            fis.close();
            success = true;
        }
        catch (IllegalStateException e) {
            Maas360Logger.e(TAG, e, e.getMessage());
            message = e.getMessage();
        }
        catch (IOException e) {
            Maas360Logger.e(TAG, e, "IOException during reading file", fileName);
            message = "Error while reading file";
        }
        catch (Exception e) {
            Maas360Logger.e(TAG, e, "Exception during reading file", fileName);
            message = "Error while reading file";
        }

        JSONObject response = new JSONObject();

        if (success) {
            response.put("textFromFile", os.toString());
            callbackContext.success(response);
            return true;
        }
        else {
            response.put("textFromFile", message);
            callbackContext.error(response);
            return false;
        }
    }

    private boolean handleWriteEncryptedFile(String fileName, String textToWrite, CallbackContext callbackContext) throws JSONException
    {
        JSONObject response = new JSONObject();
        if (TextUtils.isEmpty(fileName)) {
            response.put(ENCRYPT_FILE_RESULT, "Empty FileName");
            callbackContext.error(response);
            return false;
        }

        File file = new File(cordova.getActivity().getApplicationContext().getFilesDir(), fileName);
        try {
            FileOutputStream fos = new FileOutputStream(file);
            MaaS360SecureOutputStream mos = new MaaS360SecureOutputStream(fos);
            mos.write(textToWrite.getBytes());
            mos.close();
            response.put(ENCRYPT_FILE_RESULT, "Encrypt File Completed");
            callbackContext.success(response);
            return true;
        }
        catch (IOException e) {
            Maas360Logger.e(TAG, e, "IOException while write encrypted file");
            response.put(ENCRYPT_FILE_RESULT, "Error while write encrypted file");
            callbackContext.error(response);
            return false;
        }
        catch (IllegalStateException e) {
            Maas360Logger.e(TAG, e, e.getMessage());
            response.put(ENCRYPT_FILE_RESULT, "Error while write encrypted file");
            callbackContext.error(response);
            return false;
        }
    }

    private void handleEncryptText(String strToEncrypt, CallbackContext callbackContext) throws JSONException
    {
        boolean success = false;
        String result;
        if (TextUtils.isEmpty(strToEncrypt)) {
            result = strToEncrypt;
            success = true;
        }
        else {
            try {
                result = MaaS360SDKEncryptionHelper.encrypt(strToEncrypt, true);
                success = true;
            }
            catch (IllegalStateException exception) {
                Maas360Logger.e(TAG, exception, "Exception while encrypted text during encryption");
                result = "NOT_SUPPORTED - " + exception.getMessage();
            }
            catch (Exception e) {
                Maas360Logger.e(TAG, e, "Exception while encrypted text during encryption");
                result = "ERROR";
            }
        }

        JSONObject response = new JSONObject();
        response.put("encryptTextResult", result);

        if (success) {
            callbackContext.success(response);
        }
        else {
            callbackContext.error(response);
        }
    }

    private void handleDecryptText(String strToDecrypt, CallbackContext callbackContext) throws JSONException
    {
        boolean success = false;
        String result;
        if (TextUtils.isEmpty(strToDecrypt)) {
            result = strToDecrypt;
            success = true;
        }
        else {
            try {
                result = MaaS360SDKEncryptionHelper.decrypt(strToDecrypt, true);
                success = true;
            }
            catch (IllegalStateException exception) {
                Maas360Logger.e(TAG, exception, "Exception while decrypted text during encryption");
                result = "NOT_SUPPORTED - " + exception.getMessage();
            }
            catch (Exception e) {
                Maas360Logger.e(TAG, e, "Exception while decrypted text during encryption");
                result = "ERROR";
            }
        }

        JSONObject response = new JSONObject();
        response.put("decryptTextResult", result);

        if (success) {
            callbackContext.success(response);
        }
        else {
            callbackContext.error(response);
        }
    }

    private void handleGatewayConnectionStatus(CallbackContext callbackContext) throws JSONException
    {
        boolean success = false;
        String result;
        boolean isSDKActivated = MaaS360SDK.isSDKActivated();
        boolean isConnected;
        JSONObject response = new JSONObject();
        if (isSDKActivated) {
            try {
                isConnected = MaaS360SDK.getEnterpriseGatewayService().isConnected();
                if (isConnected) {
                    result = "Connected";
                }
                else {
                    result = "Not Connected";
                }
                success = true;
            }
            catch (MaaS360SDKEnterpriseGatewayNotEnabledException exception) {
                Maas360Logger.e(TAG, exception, "Exception trying to get gateway status");
                result = "GATEWAY_NOT_ENABLED_YET";
            }
            catch (Exception e) {
                Maas360Logger.e(TAG, e, "Exception while trying to get gateway status");
                result = "ERROR";
            }
            response.put("gatewayConnectionStatus", result);
        }
        else {
            result = "SDK Not Activated";
            response.put("gatewayConnectionStatus", result);
        }

        if (success) {
            callbackContext.success(response);
        }
        else {
            callbackContext.error(response);
        }
    }

    /**
     * Handle SDK init.
     */
    private boolean handleInitSDK(JSONArray args, String action) throws JSONException
    {
        if (!MaaS360SDK.isSDKActivated()) {

            final String developerKey = args.getJSONObject(0).getString("developerKey");

            final String licenseKey = args.getJSONObject(1).getString("licenseKey");

            final boolean shouldEnforceCopyPasteRestriction = args.getBoolean(2);
            final boolean shouldEnforceSSORestriction = args.getBoolean(3);
            final boolean shouldEnforceScreenshotRestriction = args.getBoolean(4);
            final boolean shouldEnforceWipeRestriction = args.getBoolean(5);
            final boolean shouldEnforceGatewayRestriction = args.getBoolean(6);
            final boolean shouldAutoEnforceRestrictExport = args.getBoolean(7);
            final boolean shouldAutoEnforceRestrictRootedDevice = args.getBoolean(8);
            final boolean shouldAutoEnforceRestrictImport = args.getBoolean(9);
            final boolean shouldAutoEnforceRestrictPrint = args.getBoolean(10);
            final boolean shouldAutoEnforceRestrictShare = args.getBoolean(11);
            final String enableAnalytics = args.getJSONObject(12).getString("enableAnalytics");
            final boolean shouldEnableAnalytics;
            if (enableAnalytics.equalsIgnoreCase("true")) {
                shouldEnableAnalytics = true;
            }
            else {
                shouldEnableAnalytics = false;
            }

            if (INIT.equals(action)) {
                cordova.getThreadPool().execute(new Runnable()
                {

                    @Override
                    public void run()
                    {
                        try {
                            MaaS360SDK
                                .initSDK(cordova.getActivity().getApplication(), developerKey, licenseKey, mListener,
                                    new com.fiberlink.maas360sdk.cordova.IMaaS360SDKPolicyAutoEnforceInfoFactory(
                                        shouldEnforceCopyPasteRestriction, shouldEnforceSSORestriction,
                                        shouldEnforceScreenshotRestriction, shouldEnforceWipeRestriction,
                                        shouldEnforceGatewayRestriction, shouldAutoEnforceRestrictExport,
                                        shouldAutoEnforceRestrictRootedDevice, shouldAutoEnforceRestrictImport,
                                        shouldAutoEnforceRestrictPrint, shouldAutoEnforceRestrictShare));
                        }
                        catch (MaaS360SDKInitializationException e) {
                            Maas360Logger.e(TAG, e);
                            return;
                        }
                    }
                });
            }
            else if (INIT2.equals(action)) {
                cordova.getThreadPool().execute(new Runnable()
                {

                    @Override
                    public void run()
                    {
                        try {
                            MaaS360SDK
                                .initSDK(cordova.getActivity().getApplication(), developerKey, licenseKey, mListener,
                                    new com.fiberlink.maas360sdk.cordova.IMaaS360SDKPolicyAutoEnforceInfoFactory(
                                        shouldEnforceCopyPasteRestriction, shouldEnforceSSORestriction,
                                        shouldEnforceScreenshotRestriction, shouldEnforceWipeRestriction,
                                        shouldEnforceGatewayRestriction, shouldAutoEnforceRestrictExport,
                                        shouldAutoEnforceRestrictRootedDevice, shouldAutoEnforceRestrictImport,
                                        shouldAutoEnforceRestrictPrint, shouldAutoEnforceRestrictShare), null,
                                    shouldEnableAnalytics);
                        }
                        catch (MaaS360SDKInitializationException e) {
                            Maas360Logger.e(TAG, e);
                            return;
                        }
                    }
                });
            }

            return true;
        }
        else {
            Maas360Logger.i(TAG, "SDK already activated. Sending activation success callback");
            handleSDKActivationSuccess();
            return false;
        }
    }

    /**
     * Handle SDK activation success.
     */
    void handleSDKActivationSuccess() throws JSONException
    {
        JSONObject activationStatusObject = new JSONObject();
        activationStatusObject.put(EVENT_ID, ACTIVATION_STATUS_CHANGE);
        activationStatusObject.put(EVENT_DATA, MaaS360CordovaAdapter.getActivationStatus());

        JSONObject policyObject = new JSONObject();
        policyObject.put(EVENT_ID, POLICY_INFO_CHANGE);
        policyObject.put(EVENT_DATA, MaaS360CordovaAdapter.getPolicy());

        JSONObject complianceObject = new JSONObject();
        complianceObject.put(EVENT_ID, COMPLIANCE_INFO_CHANGE);
        complianceObject.put(EVENT_DATA, MaaS360CordovaAdapter.getComplianceInfo());

        JSONObject selectiveWipeStatusObject = new JSONObject();
        selectiveWipeStatusObject.put(EVENT_ID, SELECTIVE_WIPE_STATUS_CHANGE);
        selectiveWipeStatusObject.put(EVENT_DATA, MaaS360CordovaAdapter.getSelectiveWipeStatus(null));

        JSONObject userInfoObject = new JSONObject();
        userInfoObject.put(EVENT_ID, USER_INFO_CHANGE);
        userInfoObject.put(EVENT_DATA, MaaS360CordovaAdapter.getUserInfo());

        JSONObject deviceIdentityAttributesObject = new JSONObject();
        deviceIdentityAttributesObject.put(EVENT_ID, DEVICE_IDENTITY_ATTRIBUTES_CHANGE);
        deviceIdentityAttributesObject.put(EVENT_DATA, MaaS360CordovaAdapter.getDeviceIdentityAttributes());

        JSONObject appConfigObject = new JSONObject();
        appConfigObject.put(EVENT_ID, APP_CONFIG);
        appConfigObject.put(EVENT_DATA, MaaS360CordovaAdapter.getAppConfigUpdate());

        JSONArray eventData = new JSONArray();
        eventData.put(policyObject);
        eventData.put(complianceObject);
        eventData.put(selectiveWipeStatusObject);
        eventData.put(userInfoObject);
        eventData.put(activationStatusObject);
        eventData.put(deviceIdentityAttributesObject);
        eventData.put(appConfigObject);

        JSONObject response = new JSONObject();
        response.put(EVENT_ID, SDK_INFO_UPDATE);
        response.put(EVENT_DATA, eventData);

        Maas360Logger.i("MaaS360CordovaSDK: activation info: ", response.toString());

        sendCallBackResponse(response);
    }

    /**
     * Handle SDK activation failed.
     */
    void handleSDKActivationFailed(AuthenticationStatus status, String failureReason) throws JSONException
    {
        if (status == null) {
            Maas360Logger.i(TAG, "Failure reason is null.");
            return;
        }
        JSONObject activationStatusObject = new JSONObject();
        activationStatusObject.put(EVENT_ID, ACTIVATION_STATUS_CHANGE);
        activationStatusObject.put(EVENT_DATA, MaaS360CordovaAdapter.getActivationFailureStatus(status, failureReason));

        JSONArray eventData = new JSONArray();
        eventData.put(activationStatusObject);

        JSONObject response = new JSONObject();
        response.put(EVENT_ID, SDK_INFO_UPDATE);
        response.put(EVENT_DATA, eventData);

        sendCallBackResponse(response);
    }

    /**
     * Handle Enterprise gateway start.
     */
    private boolean handleStartEnterpriseGateway() throws JSONException
    {
        try {
            IEnterpriseGatewayService gatewayService = MaaS360SDK.getEnterpriseGatewayService();
            if (MaaS360SDK.getPolicy().isMaaS360GatewayForAppSdkEnabled()) {
                Maas360Logger.i(TAG, "MEG enabled");
                gatewayService.connect();
            }
        }
        catch (Exception e) {
            handleEnterpriseGatewayConnectFail(e.getMessage());
            return false;
        }

        return true;
    }

    /**
     * Handle Enterprise gateway disconnect.
     */
    private boolean handleDisconnectEnterpriseGateway() throws JSONException
    {
        try {
            IEnterpriseGatewayService gatewayService = MaaS360SDK.getEnterpriseGatewayService();
            gatewayService.disconnect();
        }
        catch (Exception e) {
            return false;
        }

        return true;
    }

    /**
     * Handle enterprise gateway connection failure.
     */
    void handleEnterpriseGatewayConnectFail(String reason) throws JSONException
    {
        JSONObject gatewayPayload = new JSONObject();
        gatewayPayload.put(STATUS, "GatewayLoginFailure");
        gatewayPayload.put(REASON, reason);

        JSONObject response = new JSONObject();
        response.put(EVENT_ID, ENTERPRISE_GATEWAY);
        response.put(EVENT_DATA, gatewayPayload);

        sendCallBackResponse(response);
    }

    /**
     * Handle enterprise gateway disconnect complete callback.
     */
    void handleEnterpriseGatewayDisconnected() throws JSONException
    {
        JSONObject gatewayPayload = new JSONObject();
        gatewayPayload.put(STATUS, "GatewayLogoutComplete");

        JSONObject response = new JSONObject();
        response.put(EVENT_ID, ENTERPRISE_GATEWAY);
        response.put(EVENT_DATA, gatewayPayload);

        sendCallBackResponse(response);
    }

    /**
     * Handle enterprise gateway connection success.
     */
    void handleEnterpriseGatewayConnectSuccess() throws JSONException
    {
        try {
            IEnterpriseGatewayService gatewayService = MaaS360SDK.getEnterpriseGatewayService();
            gatewayService.proxy((WebView) webView);
        }
        catch (Exception e) {
            Maas360Logger.e(TAG, e, "Failed to proxy web view");
        }

        JSONObject gatewayPayload = new JSONObject();
        gatewayPayload.put(STATUS, "GatewayLoginComplete");

        JSONObject response = new JSONObject();
        response.put(EVENT_ID, ENTERPRISE_GATEWAY);
        response.put(EVENT_DATA, gatewayPayload);

        sendCallBackResponse(response);
    }

    /**
     * Handle policy info change
     *
     * @throws JSONException
     */
    public void handlePolicyInfoChange() throws JSONException
    {
        JSONObject policyStatusObject = new JSONObject();
        policyStatusObject.put(EVENT_ID, POLICY_INFO_CHANGE);
        policyStatusObject.put(EVENT_DATA, MaaS360CordovaAdapter.getPolicy());

        sendCallBackResponse(policyStatusObject);
    }

    /**
     * Handle selective wipe info change
     *
     * @throws JSONException
     */
    public void handleSelectiveWipeStatusChange(DeactivationReason reason) throws JSONException
    {
        JSONObject selectiveWipeStatusObject = new JSONObject();
        selectiveWipeStatusObject.put(EVENT_ID, SELECTIVE_WIPE_STATUS_CHANGE);
        selectiveWipeStatusObject.put(EVENT_DATA, MaaS360CordovaAdapter.getSelectiveWipeStatus(reason));

        sendCallBackResponse(selectiveWipeStatusObject);
    }

    /**
     * Handle user info change
     *
     * @throws JSONException
     */
    public void handleUserInfoChange() throws JSONException
    {
        JSONObject userInfoStatusObject = new JSONObject();
        userInfoStatusObject.put(EVENT_ID, USER_INFO_CHANGE);
        userInfoStatusObject.put(EVENT_DATA, MaaS360CordovaAdapter.getUserInfo());

        sendCallBackResponse(userInfoStatusObject);
    }

    /**
     * Handle device security info change
     *
     * @throws JSONException
     */
    public void handleDeviceSecurityInfoChange() throws JSONException
    {
        JSONObject deviceSecurityInfoObject = new JSONObject();
        deviceSecurityInfoObject.put(EVENT_ID, COMPLIANCE_INFO_CHANGE);
        deviceSecurityInfoObject.put(EVENT_DATA, MaaS360CordovaAdapter.getComplianceInfo());

        sendCallBackResponse(deviceSecurityInfoObject);
    }

    /**
     * Handle device identity attributes change
     *
     * @throws JSONException
     */
    public void handleDeviceIdentityAttributesChange() throws JSONException
    {
        JSONObject deviceSecurityInfoObject = new JSONObject();
        deviceSecurityInfoObject.put(EVENT_ID, DEVICE_IDENTITY_ATTRIBUTES_CHANGE);
        deviceSecurityInfoObject.put(EVENT_DATA, MaaS360CordovaAdapter.getDeviceIdentityAttributes());

        sendCallBackResponse(deviceSecurityInfoObject);
    }

    /**
     * Handle app configuration change
     *
     * @throws JSONException
     */
    public void handleAppConfigUpdate() throws JSONException
    {
        JSONObject appConfigUpdate = new JSONObject();
        appConfigUpdate.put(EVENT_ID, APP_CONFIG);
        appConfigUpdate.put(EVENT_DATA, MaaS360CordovaAdapter.getAppConfigUpdate());

        sendCallBackResponse(appConfigUpdate);
    }

    /**
     * Handle container lock update
     *
     * @throws JSONException
     */
    public void handleContainerLockUpdate(boolean isLocked) throws JSONException
    {
        JSONObject containerLockUpdate = new JSONObject();
        containerLockUpdate.put(EVENT_ID, CONTAINER_LOCK_UPDATE);
        containerLockUpdate.put(EVENT_DATA, isLocked);

        sendCallBackResponse(containerLockUpdate);
    }

    /**
     * Get String array from JSONArray.
     */
    private static String[] getStringArray(JSONArray array) throws JSONException
    {
        if (array == null) {
            return null;
        }

        String[] value = new String[array.length()];
        for (int i = 0; i < array.length(); i++) {
            value[i] = array.getString(i);
        }

        return value;
    }

    /**
     * Get the Key for the specific resource
     *
     * @param resourceInfo
     *            for which the key is required
     * @param callbackContext
     * @throws JSONException
     */
    void generateKeyForResource(JSONObject resourceInfo, CallbackContext callbackContext) throws JSONException
    {
        boolean success = false;
        MaaS360IPCEncryptionInfo maas360IPCEncryptionInfo = null;
        if (resourceInfo != null) {
            MaaS360ResourceInfo maaS360ResourceInfo = new MaaS360ResourceInfo(resourceInfo.getString("resourceKey"),
                    resourceInfo.getString("resourceType"), resourceInfo.getString("dataClassType"));
            try {
                maas360IPCEncryptionInfo = MaaS360SDK.generateKeyForResource(maaS360ResourceInfo);
                success = true;
            }
            catch (MaaS360SDKNotActivatedException exception) {
                Maas360Logger.e(TAG, exception, "SDK is not yet activated");
            }
        }

        JSONObject response = new JSONObject();
        if (success) {
            JSONObject keyForResource = new JSONObject();
            keyForResource.put(ENCRYPTION_KEY, maas360IPCEncryptionInfo.getEncodedEncKey());
            keyForResource.put(IV_KEY, maas360IPCEncryptionInfo.getEncodedIv());
            keyForResource.put(RESOURCE_INFO, resourceInfo);
            response.put("keyInfo", keyForResource);
            callbackContext.success(response);
        }
        else {
            response.put("keyInfo", null);
            callbackContext.error(response);
        }
    }

    private void handleGetCertPinningInfo(CallbackContext callbackContext) throws JSONException
    {
        boolean success = false;
        String result = null;
        boolean isSDKActivated = MaaS360SDK.isSDKActivated();
        MaaS360CertPinningInfo certPinningInfo = null;
        JSONObject response = new JSONObject();
        if (isSDKActivated) {
            try {
                certPinningInfo = MaaS360SDK.getCertPinningInfo();
                success = true;
            }
            catch (Exception e) {
                Maas360Logger.e(TAG, e, "Exception while trying to get cert pinning info");
                result = "ERROR";
            }
        }
        else {
            result = "SDK Not Activated";
        }

        if (success) {
            File certificateDirectory = setUpCertificatesDirectory();
            JSONArray certList = new JSONArray();
            for (MaaS360CertPinningInfo.CertPinningInfo certPin : certPinningInfo.getCertPinningInfoList()) {
                String fileName = getFileNameFromURL(certPin.getPinningUrl()) + ".cer";
                JSONObject cert = new JSONObject();
                cert.put(PINNING_URL, certPin.getPinningUrl());
                cert.put(PINNING_CERT,
                        storeCertificateToStorage(certPin.getPinningCert(), certificateDirectory, fileName));
                certList.put(cert);
            }

            JSONArray proxyCertList = new JSONArray();
            List<X509Certificate> proxyCerts = certPinningInfo.getProxyPinningCerts();
            for (int i = 0; i < proxyCerts.size(); i++) {
                String fileName = "Proxy_" + (i + 1) + ".cer";
                JSONObject cert = new JSONObject();
                cert.put(PROXY_CERT, storeCertificateToStorage(proxyCerts.get(i), certificateDirectory, fileName));
                proxyCertList.put(cert);
            }

            JSONObject certPinInfo = new JSONObject();
            certPinInfo.put(IS_CERT_PIN_ENABLED, certPinningInfo.isCertPinningEnabled());
            certPinInfo.put(CERTIFICATE_LIST, certList);
            certPinInfo.put(PROXY_CERTIFICATE_LIST, proxyCertList);

            response.put(CERT_PINNING_INFO, certPinInfo);

            callbackContext.success(response);
        }
        else {
            response.put(CERT_PINNING_INFO, result);
            callbackContext.error(response);
        }
    }

    private String storeCertificateToStorage(X509Certificate cert, File certificatesPath, String fileName)
    {
        try {
            FileOutputStream fos = new FileOutputStream(certificatesPath + File.separator + fileName);
            fos.write(cert.getEncoded());
            fos.flush();
            fos.close();
        }
        catch (FileNotFoundException e) {
            Maas360Logger.e(TAG, e);
        }
        catch (CertificateEncodingException e) {
            Maas360Logger.e(TAG, e);
        }
        catch (IOException e) {
            Maas360Logger.e(TAG, e);
        }

        return fileName;
    }

    private String getFileNameFromURL(String urlName)
    {
        try {
            URL url = new URL(urlName);
            String host = url.getHost();
            return host.replace('.', '_');
        }
        catch (MalformedURLException e) {
            Maas360Logger.e(TAG, e);
        }
        return null;
    }

    /**
     * Setup the Certificates folder. If present clears all old certificates, else create directory
     */
    private File setUpCertificatesDirectory()
    {
        File certificatesPath = new File(cordova.getActivity().getApplicationContext().getFilesDir() + File.separator
                + CERTIFICATES_DIRECTORY);
        if (!certificatesPath.exists()) {
            certificatesPath.mkdir();
        }
        for (File file : certificatesPath.listFiles()) {
            file.delete();
        }

        return certificatesPath;
    }

    private void sendCallBackResponse(JSONObject response)
    {
        PluginResult result = new PluginResult(Status.OK, response);
        result.setKeepCallback(true);
        sCallBackContext.sendPluginResult(result);
        Maas360Logger.i("MaaS360CordovaSDK: sending callback ");
    }
}