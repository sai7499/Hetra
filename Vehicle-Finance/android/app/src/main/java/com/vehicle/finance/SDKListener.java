package com.vehicle.finance;

import java.util.Date;

import android.content.Intent;

import com.fiberlink.maas360.android.dlpsdk.eg.EnterpriseGatewayServiceState;
import com.fiberlink.maas360.android.ipc.model.v1.MaaS360AppConfig;
import com.fiberlink.maas360.android.ipc.model.v1.MaaS360Context;
import com.fiberlink.maas360.android.ipc.model.v1.MaaS360DeviceIdentityAttributes;
import com.fiberlink.maas360.android.ipc.model.v1.MaaS360DeviceSecurityInfo;
import com.fiberlink.maas360.android.ipc.model.v1.MaaS360Policy;
import com.fiberlink.maas360.android.ipc.model.v1.MaaS360SelectiveWipeStatus;
import com.fiberlink.maas360.android.ipc.model.v1.MaaS360UserInfo;
import com.fiberlink.maas360.android.ipc.util.AuthenticationStatus;
import com.fiberlink.maas360.android.ipc.util.DeactivationReason;
import com.fiberlink.maas360.android.ipc.util.SelectiveWipeReasons;
import com.fiberlink.maas360.util.Maas360Logger;
import com.fiberlink.maas360sdk.core.MaaS360SDKContextWrapper;
import com.fiberlink.maas360sdk.exception.MaaS360SDKNotActivatedException;
import com.fiberlink.maas360sdk.external.IMaaS360SDKListener;
import com.fiberlink.maas360sdk.external.MaaS360SDK;

/**
 * The SDK listener.
 * 
 * @author kramgopal
 */
public class SDKListener implements IMaaS360SDKListener
{
    private static final String loggerName = SDKListener.class.getSimpleName();
    private static String authenticationStatus;

    public SDKListener() {

    }

    @Override
    public void onActivationSuccess()
    {
        long sdkActivationTime = MainApplication.getApplication().resetAndGetTime();
        logMessage("SDK Activation time : " + sdkActivationTime + " milliseconds");
        Maas360Logger.d(loggerName, "SDK Activated successfully");
        MainApplication.dismissSDKActivationDialog(MainApplication.getApplication().getForegroundActivity());
        Intent intent = new Intent(MainApplication.getApplication().getApplicationContext(), MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        MainApplication.getApplication().getApplicationContext().startActivity(intent);
        logMessage("SDK Activated successfully");

        try {
            if (MaaS360SDKContextWrapper.getSharedInstance(true).getAutoEnforceInfo().shouldAutoEnforceSSO()) {
                MaaS360SDK.checkForSSO();
            }
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.e(loggerName, e);
        }
    }

    @Override
    public void onActivationFailed(AuthenticationStatus authStatus, String failureReason)
    {
        long sdkAuthTime = MainApplication.getApplication().resetAndGetTime();
        logMessage("SDK Auth time : " + sdkAuthTime + " milliseconds");
        Maas360Logger.d(loggerName, "SDK Activation failed");
        MainApplication.dismissSDKActivationDialog(MainApplication.getApplication().getForegroundActivity());
        Intent intent = new Intent(MainApplication.getApplication().getApplicationContext(), MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        MainApplication.getApplication().getApplicationContext().startActivity(intent);

        String reason = "";
        switch (authStatus)
        {
        case AUTHENTICATION_SUCCESSFUL:
            return;
        case AUTHENTICATION_SUCCESSFUL_KEY_EXCHANGE_NEEDED:
            return;
        case AUTHENTICATION_FAILED:
            reason = "Auth failed";
            break;
        case MAAS_NOT_ENROLLED:
            reason = "MaaS not enrolled";
            break;
        case MAAS_NOT_INSTALLED:
            reason = "MaaS not installed";
            break;
        case INVALID_SDK_VERSION:
            reason = "SDK version is invalid";
            break;
        case UNABLE_TO_CONNECT_MAAS:
            reason = "Remote Connection to MaaS failed";
            break;
        case MAAS_NOT_INITIALIZED:
            reason = "MaaS app not yet initialized";
            break;
        case MAAS_CONTAINER_BLOCKED:
            reason = "MaaS app container blocked";
            break;
        case WORKPLACE_SDK_INTEGRATION_NOT_ENABLED:
            reason = "Workplace SDK not activated";
            break;
        case POLICY_NOT_AVAILABLE:
            reason = "Policy not available";
            break;
        case UNSUPPORTED_MAAS_VERSION:
            reason = "Unsupported MaaS version";
            break;
        case SHARED_USER_NOT_SIGNED_IN:
            reason = "Shared user not signed in";
            break;
        case CONNECTION_NOT_PERMITTED:
            reason = "connection not permitted";
            break;
        case UNKNOWN_ERROR:
            reason = "unknown error";
            break;
        case MAAS_NOT_OPERATIONAL:
            reason = "MaaS Not Operational as Database not ready";
            break;
        case NEED_PERMISSION:
            reason = "App Activation failed due to non-availability of IMEI";
            break;
        case SDK_ACTIVATION_BLOCKED:
            reason = "App Activation Blocked";
            break;
        default:
            break;
        }

        if (failureReason.isEmpty()) {
            authenticationStatus = reason;
        }
        else {
            authenticationStatus = reason + " \n Reason : " + failureReason;
        }
        logMessage("SDK Activation failed; Reason :" + reason + " failureReason " + failureReason);
    }

    @Override
    public void onContextChange(MaaS360Context context)
    {
        Maas360Logger.d(loggerName, "Context changed");
        if (null != context) {
            String text = "Context: " + context.toDisplayString();
            Maas360Logger.d(loggerName, text);
            logMessage(text);
        }
        else {
            Maas360Logger.d(loggerName, " Context info is null");
            logMessage("Context info is null");
        }
    }

    @Override
    public void onDeviceSecurityInfoChange(MaaS360DeviceSecurityInfo info)
    {
        Maas360Logger.d(loggerName, "Device secutiy info changed");
        if (null != info) {
            String text = "SecurityInfo: " + info.toDisplayString();
            Maas360Logger.d(loggerName, text);
            logMessage(text);
        }
        else {
            Maas360Logger.d(loggerName, "Device security info is null");
            logMessage("Device security info is null");
        }

    }

    @Override
    public void onPolicyChange(MaaS360Policy policy)
    {
        Maas360Logger.d(loggerName, "Policy changed");
        if (null != policy) {
            String text = "Policy: " + policy.toDisplayString();
            Maas360Logger.d(loggerName, text);
            logMessage(text);
        }
        else {
            Maas360Logger.d(loggerName, "Policy is null");
            logMessage("Policy is null");
        }
//        MainActivity activity = MainApplication.getApplication().getForegroundActivity();
//
//        if (activity != null && activity.isInForeground()) {
//            activity.updatePoliciesonUI();
//        }

    }

    @Override
    public void onSelectiveWipeStatusChange(MaaS360SelectiveWipeStatus selectiveWipeStatus)
    {
        if (selectiveWipeStatus.isSelectiveWipeEnforced()) {
            Maas360Logger.d(loggerName, "Selective wiped. Reason: "
                    + selectiveWipeStatus.getSelectiveWipeReason().name());
            logMessage("Selective wipe applied. Reason: " + selectiveWipeStatus.getSelectiveWipeReason().name());
        }
        else {
            Maas360Logger.d(loggerName, "Selective wipe not applied");
            logMessage("Selective wiped not applied");
        }
    }

    @Override
    public void onUserInfoChange(MaaS360UserInfo userInfo)
    {
        Maas360Logger.d(loggerName, "User info changed");
        if (null != userInfo) {
            String text = "User Info: " + userInfo.toDisplayString();
            Maas360Logger.d(loggerName, text);
            logMessage(text);
        }
        else {
            Maas360Logger.d(loggerName, "User info is null");
            logMessage("User info is null");
        }

    }

    @Override
    public void onMaaSDeactivated(DeactivationReason reason)
    {
        Maas360Logger.d(loggerName, "MaaS removed MDM control" + reason.toString());
        logMessage("MaaS Deactivated : Reason - " + reason.toString());
    }

    @Override
    public void onEnterpriseGatewayStateUpdated(EnterpriseGatewayServiceState newState)
    {
//        MainActivity activity = MainApplication.getApplication().getForegroundActivity();
//        if (activity != null) {
//            activity.onEnterpriseGatewayStateUpdated(newState);
//        }
    }

    private void logMessage(String text)
    {
//        MainActivity activity = MainApplication.getApplication().getForegroundActivity();
//        if (activity != null && activity.isInForeground()) {
//            activity.logMessage(text);
//        }
//        else {
//            MainApplication.getApplication().appendLog(text);
//        }
    }

    @Override
    public void onDeviceIdentityAttributesChange(MaaS360DeviceIdentityAttributes attributes)
    {
        Maas360Logger.d(loggerName, "Device identity attributes changed");
        if (null != attributes) {
            String text = "Device Identity Attributes: " + attributes.toDisplayString();
            Maas360Logger.d(loggerName, text);
            logMessage(text);
        }
        else {
            Maas360Logger.d(loggerName, "Device Identity Attributes is null");
            logMessage("Device Identity Attributes is null");
        }
    }

    @Override
    public void onAppConfigUpdate(MaaS360AppConfig config)
    {
        Maas360Logger.d(loggerName, "App config updated");
        if (null != config) {
            String text = "App config: \n" + new String(config.getConfig());
            Maas360Logger.d(loggerName, text);
            logMessage(text);
        }
        else {
            Maas360Logger.d(loggerName, "App config is null");
            logMessage("App config is null");
        }
    }

    public String getAuthStatusMessage()
    {
        return authenticationStatus;
    }

    @Override
    public void onContainerLockUpdate(boolean isLocked)
    {
//        if (MainActivity.containerLockBox != null) {
//            MainActivity.containerLockBox.setText(isLocked ? MainActivity.CONTAINER_LOCKED
//                    : MainActivity.CONTAINER_UNLOCKED);
//        }

        if (isLocked) {
            logMessage("Container locked. Checking for SSO. " + new Date(System.currentTimeMillis()));
        }
        else {
            logMessage("Container unlocked. " + new Date(System.currentTimeMillis()));
        }

    }

    @Override
    public void onSelectiveWipeApplied(SelectiveWipeReasons reason)
    {
        Maas360Logger.i(loggerName, "Selective wipe applied. Reason : " + reason.toString());

    }

    @Override
    public void onOldMaaSVersion(int maasSdkVersion)
    {
        logMessage("Old maas app used: " + maasSdkVersion);

    }
}
