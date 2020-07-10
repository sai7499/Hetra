package com.fiberlink.maas360sdk.cordova;

import org.json.JSONException;

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
 * SDK listener.
 * 
 * @author sbaral
 */
public class MaaS360CordovaSDKListener implements IMaaS360SDKListener
{
    /**
     * Log tag.
     */
    private static final String TAG = MaaS360CordovaSDKListener.class.getSimpleName();

    /**
     * SDK instance.
     */
    private final MaaS360CordovaSDK mSDK;

    /**
     * Authentication Status
     */
    AuthenticationStatus mAuthStatus = null;

    /**
     * Auth Failure reason.
     */
    String mFailureReason = null;

    /**
     * Constructor.
     */
    public MaaS360CordovaSDKListener(MaaS360CordovaSDK sdk)
    {
        mSDK = sdk;
    }

    @Override
    public void onActivationSuccess()
    {
        try {
            if (MaaS360SDKContextWrapper.getSharedInstance(true).getAutoEnforceInfo().shouldAutoEnforceSSO()) {
                MaaS360SDK.checkForSSO();
            }
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.e(TAG, e);
        }

        try {
            mSDK.handleSDKActivationSuccess();
            if (MaaS360SDKContextWrapper.getSharedInstance(false).getAutoEnforceInfo().shouldAutoEnforceSSO()) {
                MaaS360SDK.checkForSSO();
            }
        }
        catch (JSONException e) {
            Maas360Logger.e(TAG, e);
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.e(TAG, e);
        }
    }

    @Override
    public void onActivationFailed(AuthenticationStatus authStatus, String failureReason)
    {
        mAuthStatus = authStatus;
        mFailureReason = failureReason;

        try {
            mSDK.handleSDKActivationFailed(authStatus, failureReason);
        }
        catch (JSONException e) {
            Maas360Logger.e(TAG, e);
        }
    }

    @Override
    public void onContextChange(MaaS360Context context)
    {

    }

    @Override
    public void onDeviceSecurityInfoChange(MaaS360DeviceSecurityInfo info)
    {
        try {
            mSDK.handleDeviceSecurityInfoChange();
        }
        catch (JSONException e) {
            Maas360Logger.e(TAG, e.getMessage());
        }
    }

    @Override
    public void onPolicyChange(MaaS360Policy policy)
    {
        try {
            mSDK.handlePolicyInfoChange();
        }
        catch (JSONException e) {
            Maas360Logger.e(TAG, e.getMessage());
        }

    }

    @Override
    public void onSelectiveWipeStatusChange(MaaS360SelectiveWipeStatus selectiveWipeStatus)
    {
        if (selectiveWipeStatus == null) {
            Maas360Logger.w(TAG, "Selective wipe status is null");
            return;
        }
        try {
            mSDK.handleSelectiveWipeStatusChange(null);
        }
        catch (JSONException e) {
            Maas360Logger.e(TAG, e.getMessage());
        }
    }

    @Override
    public void onUserInfoChange(MaaS360UserInfo userInfo)
    {
        try {
            mSDK.handleUserInfoChange();
        }
        catch (JSONException e) {
            Maas360Logger.e(TAG, e.getMessage());
        }

    }

    @Override
    public void onDeviceIdentityAttributesChange(MaaS360DeviceIdentityAttributes attributes)
    {
        try {
            mSDK.handleDeviceIdentityAttributesChange();
        }
        catch (JSONException e) {
            Maas360Logger.e(TAG, e.getMessage());
        }
    }

    @Override
    public void onAppConfigUpdate(MaaS360AppConfig config)
    {
        try {
            mSDK.handleAppConfigUpdate();
        }
        catch (JSONException e) {
            Maas360Logger.e(TAG, e.getMessage());
        }

    }

    @Override
    public void onMaaSDeactivated(DeactivationReason deactivationReason)
    {
        if (deactivationReason == DeactivationReason.CONTAINER_BLOCKED) {
            mAuthStatus = AuthenticationStatus.MAAS_CONTAINER_BLOCKED;
        }
        else {
            mAuthStatus = AuthenticationStatus.MAAS_NOT_ENROLLED;
        }

        try {
            mSDK.handleSelectiveWipeStatusChange(deactivationReason);
        }
        catch (JSONException e) {
            Maas360Logger.e(TAG, e);
        }
    }

    @Override
    public void onEnterpriseGatewayStateUpdated(EnterpriseGatewayServiceState newState)
    {
        try {
            if (newState == EnterpriseGatewayServiceState.STATE_CONNECTING) {
                return;
            }
            else if (newState == EnterpriseGatewayServiceState.STATE_CONNECTED) {
                mSDK.handleEnterpriseGatewayConnectSuccess();
            }
            else if (newState == EnterpriseGatewayServiceState.STATE_DISCONNECTED) {
                mSDK.handleEnterpriseGatewayDisconnected();
            }
            else {
                mSDK.handleEnterpriseGatewayConnectFail(newState.name());
            }
        }
        catch (JSONException e) {
            Maas360Logger.e(TAG, e);
        }
    }

    @Override
    public void onContainerLockUpdate(boolean isLocked)
    {
        try {
            mSDK.handleContainerLockUpdate(isLocked);
        }
        catch (JSONException e) {
            Maas360Logger.e(TAG, e);
        }
    }

    @Override
    public void onSelectiveWipeApplied(SelectiveWipeReasons reason)
    {
        Maas360Logger.i(TAG, "Selective wipe applied. Reason : ", reason.toString());
    }

    @Override
    public void onOldMaaSVersion(int maasSdkVersion)
    {
        Maas360Logger.i(TAG, "Old MaaS version used : " + maasSdkVersion);

    }
}
