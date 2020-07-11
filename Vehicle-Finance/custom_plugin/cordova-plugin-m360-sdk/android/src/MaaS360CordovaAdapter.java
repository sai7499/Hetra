package com.fiberlink.maas360sdk.cordova;

import java.util.List;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.fiberlink.maas360.android.ipc.model.v1.MaaS360Context;
import com.fiberlink.maas360.android.ipc.model.v1.MaaS360DeviceIdentityAttributes;
import com.fiberlink.maas360.android.ipc.model.v1.MaaS360DeviceSecurityInfo;
import com.fiberlink.maas360.android.ipc.model.v1.MaaS360Policy;
import com.fiberlink.maas360.android.ipc.model.v1.MaaS360SelectiveWipeStatus;
import com.fiberlink.maas360.android.ipc.model.v1.MaaS360UserInfo;
import com.fiberlink.maas360.android.ipc.util.AuthenticationStatus;
import com.fiberlink.maas360.android.ipc.util.DeactivationReason;
import com.fiberlink.maas360.android.ipc.util.EnabledStatus;
import com.fiberlink.maas360.util.Maas360Logger;
import com.fiberlink.maas360sdk.exception.MaaS360SDKNotActivatedException;
import com.fiberlink.maas360sdk.external.MaaS360SDK;

/**
 * Adapts SDK model objects for cordova plugin.
 * 
 * @author sbaral
 */
public class MaaS360CordovaAdapter
{
    /**
     * Log tag.
     */
    public static final String TAG = MaaS360CordovaAdapter.class.getSimpleName();

    /**
     * Get activation failure.
     */
    public static String getActivationFailureStatus(AuthenticationStatus status, String reason) throws JSONException
    {
        JSONObject contextObject = new JSONObject();
        String  activationState = "activationState";
        String failureReason = "failureReason";

        switch (status)
        {
        case MAAS_NOT_INSTALLED:
            contextObject.put(activationState, "MaaS360AppNotInstalled");
            break;
        case MAAS_NOT_INITIALIZED:
            contextObject.put(activationState, "MaaS360AppNotInitialized");
            break;
        case MAAS_NOT_ENROLLED:
            contextObject.put(activationState, "MaaS360AppNotEnrolled");
            break;
        case UNABLE_TO_CONNECT_MAAS:
            contextObject.put(activationState, "UnableToConnectToMaaS360App");
            break;
        case INVALID_SDK_VERSION:
            contextObject.put(activationState, "InvalidSdkVersion");
            break;
        case AUTHENTICATION_FAILED:
            contextObject.put(activationState, "AuthenticationFailed");
            break;
        case MAAS_CONTAINER_BLOCKED:
            contextObject.put(activationState, "MaaS360AppContainerBlocked");
            break;
        case CONNECTION_NOT_PERMITTED:
            contextObject.put(activationState, "ConnectionNotPermitted");
            break;
        case UNKNOWN_ERROR:
            contextObject.put(activationState, "UnknownError");
            break;
        case SDK_NOT_ACTIVATED:
            contextObject.put(activationState, "SDKNotActivate");
            break;
        case SHARED_USER_NOT_SIGNED_IN:
            contextObject.put(activationState, "SharedUserNotSignedIn");
            break;
        case UNSUPPORTED_MAAS_VERSION:
            contextObject.put(activationState, "UnSupportedMaaSVersion");
            break;
        case WORKPLACE_SDK_INTEGRATION_NOT_ENABLED:
            contextObject.put(activationState, "WorkPlaceSDKIntegrationNotEnabled");
            break;
        case POLICY_NOT_AVAILABLE:
            contextObject.put(activationState, "PolicyNotAvailable");
            break;
        case FORCE_AUTHENTICATION:
            contextObject.put(activationState, "ForceAuthentication");
            break;
        case MAAS_NOT_OPERATIONAL:
            contextObject.put(activationState, "Maas not operational");
            break;
        case DEVICE_TIME_NOT_COMPLIANT:
            contextObject.put(activationState, "DeviceTimeNotCompliant");
            break;
        case DEVICE_LOCATION_NOT_COMPLIANT:
            contextObject.put(activationState, "DeviceLocationNotCompliant");
            break;
        case NEED_PERMISSION:
            contextObject.put(activationState, "NeedPermission");
            break;
        case SDK_ACTIVATION_BLOCKED:
            contextObject.put(activationState, "SDKActivationBlocked");
            break;
        default:
            contextObject.put(activationState, "NotActivated");
            break;
        }
        contextObject.put(failureReason, reason);

        return contextObject.toString();
    }

    /**
     * Get activation status.
     */
    public static String getActivationStatus() throws JSONException
    {
        try {
            MaaS360Context context = MaaS360SDK.getContext();
            if (context == null) {
                Maas360Logger.e(TAG, "No context found");
                return "";
            }

            JSONObject contextObject = new JSONObject();

            contextObject.put("billingid", context.getBillingId());
            contextObject.put("csn", context.getDeviceCsn());
            contextObject.put("username", context.getUsername());
            contextObject.put("domain", context.getDomain());
            contextObject.put("emailAddress", context.getEmailAddress());
            contextObject.put("deviceOwnership", context.getDeviceOwnership().name());
            contextObject.put("activationType", context.isMDMCustomer() ? "MDM" : "NON_MDM");
            contextObject.put("activationState", "Activated");
            contextObject.put("mailboxManaged", context.isMailboxManaged());

            return contextObject.toString();
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.e(TAG, e);
        }

        return "";
    }

    /**
     * Get compliance info
     */
    public static String getComplianceInfo() throws JSONException
    {
        try {
            MaaS360DeviceSecurityInfo securityInfo = MaaS360SDK.getDeviceSecurityInfo();
            if (securityInfo == null) {
                Maas360Logger.e(TAG, "No securityInfo found");
                return "";
            }

            JSONObject complianceObject = new JSONObject();

            complianceObject.put("policyCompliant", securityInfo.isPolicyCompliant());
            complianceObject.put("masterKeyVulnerabilityPresent", securityInfo.isMasterKeyVulnerabilityPresent());

            List<String> oocReasons = securityInfo.getOocReasons();
            if (oocReasons != null && !oocReasons.isEmpty()) {
                complianceObject.put("oocReasons", new JSONArray(oocReasons));
            }

            complianceObject.put("encryptionEnabled", securityInfo.hardwareEncryptionEnabled().name());
            complianceObject.put("passcodeComplianceStatus", securityInfo.devicePasscodeStatusCompliant().name());
            complianceObject.put("rooted", securityInfo.isDeviceRooted());

            return complianceObject.toString();
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.e(TAG, e);
        }

        return "";
    }

    /**
     * Get selective wipe status
     */
    public static String getSelectiveWipeStatus(DeactivationReason reason) throws JSONException
    {
        try {
            MaaS360SelectiveWipeStatus selectiveWipeStatus = MaaS360SDK.getSelectiveWipeStatus();
            JSONObject selectiveWipeStatusObject = new JSONObject();
            if (reason != null) {
                selectiveWipeStatusObject.put("wipeStatus", "APPLIED");
                selectiveWipeStatusObject.put("blockContainer", true);
                selectiveWipeStatusObject.put("selectiveWipeReason", reason.name());
                return selectiveWipeStatusObject.toString();
            }

            if (selectiveWipeStatus == null) {
                Maas360Logger.e(TAG, "No selectiveWipeStatus found");
                return "";
            }

            String wipeStatus = selectiveWipeStatus.isSelectiveWipeEnforced() ? "APPLIED" : "REVOKED";
            selectiveWipeStatusObject.put("wipeStatus", wipeStatus);
            selectiveWipeStatusObject.put("blockContainer", selectiveWipeStatus.isBlockContainerOnWipe());

            if (selectiveWipeStatus.isSelectiveWipeEnforced()) {
                selectiveWipeStatusObject.put("selectiveWipeReason",
                        selectiveWipeStatus.getSelectiveWipeReason().name());
            }

            return selectiveWipeStatusObject.toString();
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.e(TAG, e);
        }

        return "";
    }

    /**
     * Get user info
     */
    public static String getUserInfo() throws JSONException
    {
        try {
            MaaS360UserInfo userInfo = MaaS360SDK.getUserInfo();
            if (userInfo == null) {
                Maas360Logger.e(TAG, "No userInfo found");
                return "";
            }

            MaaS360Context context = MaaS360SDK.getContext();
            if (context == null) {
                Maas360Logger.e(TAG, "No context found");
                return "";
            }

            JSONObject userInfoObject = new JSONObject();

            userInfoObject.put("username", context.getUsername());
            userInfoObject.put("userDN", userInfo.getUserDN());

            List<String> userGroups = userInfo.getUserGroups();
            if (userGroups != null && !userGroups.isEmpty()) {
                userInfoObject.put("groups", new JSONArray(userGroups));
            }

            return userInfoObject.toString();
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.e(TAG, e);
        }

        return "";
    }

    /**
     * Get policy.
     */
    public static String getPolicy() throws JSONException
    {
        try {
            MaaS360Policy policy = MaaS360SDK.getPolicy();
            if (policy == null) {
                Maas360Logger.e(TAG, "No policy found");
                return "";
            }

            JSONObject policyObject = new JSONObject();

            policyObject.put("policyname", policy.getName());
            policyObject.put("policyversion", policy.getVersion());

            Set<String> whitelistedApps = policy.getWhiteListedApps();
            if (whitelistedApps != null && !whitelistedApps.isEmpty()) {
                policyObject.put("whiteListedApps", new JSONArray(whitelistedApps));
            }

            policyObject.put("copyPasteAllowed", policy.isCopyPasteAllowed());
            policyObject.put("shouldRestrictRootedDevice", policy.shouldRestrictRootedDevice());
            policyObject.put("printAllowed", policy.isPrintAllowed());
            policyObject.put("saveAsAllowed", policy.isSaveAsAllowed());
            policyObject.put("screenshotAllowed", (!(policy.isScreenshotAllowed() == EnabledStatus.DISABLED)));
            policyObject.put("egEnabled", policy.isEGEnabled());
            policyObject.put("maas360egEnabled", policy.isMaaS360GatewayForAppSdkEnabled());

            return policyObject.toString();
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.e(TAG, e);
        }

        return "";
    }

    /**
     * Get device identity attributes
     * 
     * @throws JSONException
     */
    public static String getDeviceIdentityAttributes() throws JSONException
    {
        try {
            MaaS360DeviceIdentityAttributes deviceIdentityAttributes = MaaS360SDK.getDeviceIdentityAttributes();

            if (null == deviceIdentityAttributes) {
                Maas360Logger.e(TAG, "No device identity attributes found");
                return "";
            }

            JSONObject deviceIdentityAttrObj = new JSONObject();
            Set<String> keySet = deviceIdentityAttributes.getKeySet();

            if (null != keySet && !keySet.isEmpty()) {
                for (String key : keySet) {
                    deviceIdentityAttrObj.put(key, deviceIdentityAttributes.getValue(key));
                }

                return deviceIdentityAttrObj.toString();
            }
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.e(TAG, e);
        }

        return "";
    }

    /**
     * Get app configurations
     * 
     * @throws JSONException
     */
    public static String getAppConfigUpdate() throws JSONException
    {
        try {
            byte[] appConfig = MaaS360SDK.getAppConfiguration();

            if (null == appConfig) {
                Maas360Logger.e(TAG, "No app config found");
                return "";
            }

            JSONObject appConfigObject = new JSONObject();
            appConfigObject.put("appConfig", new String(appConfig));

            return appConfigObject.toString();
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.e(TAG, e);
        }

        return "";
    }
}
