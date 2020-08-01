package com.fiberlink.maas360sdk.cordova;

import com.fiberlink.maas360sdk.external.IMaaS360SDKPolicyAutoEnforceInfo;

/**
 * Created by dheerajdoodhya on 3/5/18.
 */

public class IMaaS360SDKPolicyAutoEnforceInfoFactory implements IMaaS360SDKPolicyAutoEnforceInfo
{
    boolean shouldEnforceCopyPasteRestriction;
    boolean shouldEnforceSSORestriction;
    boolean shouldEnforceScreenshotRestriction;
    boolean shouldEnforceWipeRestriction;
    boolean shouldEnforceGatewayRestriction;
    boolean shouldAutoEnforceRestrictExport;
    boolean shouldAutoEnforceRestrictRootedDevice;
    boolean shouldAutoEnforceRestrictImport;
    boolean shouldAutoEnforceRestrictPrint;
    boolean shouldAutoEnforceRestrictShare;

    public IMaaS360SDKPolicyAutoEnforceInfoFactory(boolean shouldEnforceCopyPasteRestriction,
        boolean shouldEnforceSSORestriction,
        boolean shouldEnforceScreenshotRestriction,
        boolean shouldEnforceWipeRestriction,
        boolean shouldEnforceGatewayRestriction,
        boolean shouldAutoEnforceRestrictExport,
        boolean shouldAutoEnforceRestrictRootedDevice,
        boolean shouldAutoEnforceRestrictImport,
        boolean shouldAutoEnforceRestrictPrint,
        boolean shouldAutoEnforceRestrictShare)
    {
        this.shouldEnforceCopyPasteRestriction = shouldEnforceCopyPasteRestriction;
        this.shouldEnforceSSORestriction = shouldEnforceSSORestriction;
        this.shouldEnforceScreenshotRestriction = shouldEnforceScreenshotRestriction;
        this.shouldEnforceWipeRestriction = shouldEnforceWipeRestriction;
        this.shouldEnforceGatewayRestriction = shouldEnforceGatewayRestriction;
        this.shouldAutoEnforceRestrictExport = shouldAutoEnforceRestrictExport;
        this.shouldAutoEnforceRestrictRootedDevice = shouldAutoEnforceRestrictRootedDevice;
        this.shouldAutoEnforceRestrictImport = shouldAutoEnforceRestrictImport;
        this.shouldAutoEnforceRestrictPrint = shouldAutoEnforceRestrictPrint;
        this.shouldAutoEnforceRestrictShare = shouldAutoEnforceRestrictShare;

    }

    @Override
    public boolean shouldAutoEnforceSelectiveWipe()
    {
        return shouldEnforceWipeRestriction;
    }

    @Override
    public boolean shouldAutoEnforceRestrictScreenshot()
    {
        return shouldEnforceScreenshotRestriction;
    }

    @Override
    public boolean shouldAutoEnforceRestrictCopyPaste()
    {
        return shouldEnforceCopyPasteRestriction;
    }

    @Override
    public boolean shouldAutoEnforceEnterpriseGateway()
    {
        return shouldEnforceGatewayRestriction;
    }

    @Override
    public boolean shouldAutoEnforceSSO()
    {
        return shouldEnforceSSORestriction;
    }

    @Override
    public boolean shouldAutoEnforceRestrictExport()
    {
        return shouldAutoEnforceRestrictExport;
    }

    @Override
    public boolean shouldAutoEnforceRootedDeviceRestriction()
    {
        return shouldAutoEnforceRestrictRootedDevice;
    }

    @Override
    public boolean shouldAutoEnforceRestrictImport()
    {
        return shouldAutoEnforceRestrictImport;
    }

    @Override
    public boolean shouldAutoEnforceRestrictPrint()
    {
        return shouldAutoEnforceRestrictPrint;
    }

    @Override
    public boolean shouldAutoEnforceRestrictShare()
    {
        return shouldAutoEnforceRestrictShare;
    }
}
