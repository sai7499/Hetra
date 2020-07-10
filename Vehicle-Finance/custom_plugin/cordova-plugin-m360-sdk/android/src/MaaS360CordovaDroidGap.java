package com.fiberlink.maas360sdk.cordova;

import java.util.ArrayList;
import java.util.List;

import org.apache.cordova.CordovaActivity;

import com.fiberlink.maas360.android.dlpsdk.CopyPasteRestrictionChecker;
import com.fiberlink.maas360.android.dlpsdk.MaaS360DLPSDK;
import com.fiberlink.maas360.android.dlpsdk.MaaS360DLPSDKUtils;
import com.fiberlink.maas360.android.dlpsdk.MaaS360SecureApplication;
import com.fiberlink.maas360.android.dlpsdk.MaaS360SystemServiceUtils;
import com.fiberlink.maas360.util.Maas360Logger;
import com.fiberlink.maas360sdk.core.MaaS360SDKContextWrapper;
import com.fiberlink.maas360sdk.exception.MaaS360SDKNotActivatedException;

import android.app.Activity;
import android.app.Fragment;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.os.Bundle;
import android.view.WindowManager.LayoutParams;

/**
 * CordovaDroidGap extension with auto-enforcement capabilities.
 * 
 * @author sbaral
 */
public class MaaS360CordovaDroidGap extends CordovaActivity
{
    /**
     * Logger.
     */
    private static final String loggerName = MaaS360CordovaDroidGap.class.getSimpleName();

    /**
     * {@inheritDoc}
     */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        try {
            if (MaaS360SDKContextWrapper.getSharedInstance(true).getAutoEnforceInfo()
                    .shouldAutoEnforceRestrictScreenshot()) {
                enforceRestrictScreenshot();
            }
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.d(loggerName, e);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void onResume()
    {
        super.onResume();

        try {
            if (MaaS360SDKContextWrapper.getSharedInstance(false).getAutoEnforceInfo().shouldAutoEnforceSSO()) {
                MaaS360SDKContextWrapper.getSharedInstance(false).checkForSSO(false, true);
            }

            if (MaaS360SDKContextWrapper.getSharedInstance(false).getAutoEnforceInfo()
                    .shouldAutoEnforceRestrictScreenshot()) {
                enforceRestrictScreenshot();
            }
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.e(loggerName, "onResume : ", e.getMessage());
        }
    }

    @Override
    public void onUserInteraction()
    {
        super.onUserInteraction();

        try {
            if (MaaS360SDKContextWrapper.getSharedInstance(false).getAutoEnforceInfo().shouldAutoEnforceSSO()) {
                MaaS360SDKContextWrapper.getSharedInstance(false).checkForSSO(false, true);
            }
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.e(loggerName, "onUserInteraction : ", e.getMessage());
        }
    }

    /**
     * Enforce restrict screenshot.
     */
    private void enforceRestrictScreenshot()
    {
        if (MaaS360DLPSDK.getInstance() != null && MaaS360DLPSDK.getInstance().isRestrictScreenshot()) {
            getWindow().setFlags(LayoutParams.FLAG_SECURE, LayoutParams.FLAG_SECURE);
        }
        else {
            getWindow().clearFlags(LayoutParams.FLAG_SECURE);
        }
    }

    /**
     * @return True if we should auto enforce copy paste restriction, false
     *         otherwise.
     */
    private boolean shouldAutoEnforceCopyPasteRestriction()
    {
        try {
            return MaaS360SDKContextWrapper.getSharedInstance(true).getAutoEnforceInfo()
                    .shouldAutoEnforceRestrictCopyPaste();
        }
        catch (MaaS360SDKNotActivatedException e) {
            Maas360Logger.d(loggerName, e);
            return false;
        }
    }

    @Override
    public Object getSystemService(String name)
    {
        Maas360Logger.i(loggerName, "Call to getSystemService() ", name);

        if (!shouldAutoEnforceCopyPasteRestriction()) {
            Maas360Logger.d(loggerName, "Auto enforce mode disabled. Returning super call");
            return super.getSystemService(name);
        }

        try {
            // handle copy paste restriction.
            Object clipboardoObj = MaaS360SystemServiceUtils.handleCopyPasteRestriction(getApplicationContext(),
                    super.getSystemService(name), CopyPasteRestrictionChecker.getInstance(), name);

            if (null != clipboardoObj) {
                return clipboardoObj;
            }
            else {
                Object object = super.getSystemService(name);
                return object;
            }
        }
        catch (Exception e) {
            Maas360Logger.e(loggerName, e, "Exception in getSystemService()");
            return super.getSystemService(name);
        }
        catch (Error e) {
            Maas360Logger.e(loggerName, e, "Error in getSystemService()");
            return super.getSystemService(name);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void startActivities(Intent[] intents)
    {

        MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
        if (application == null) {
            Maas360Logger.d(TAG, "SecureApplication instance is null");
            super.startActivities(intents);
            return;
        }

        List<Intent> newIntents = new ArrayList<Intent>();

        for (Intent intent : intents) {
            Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
            if (newIntent != null) {
                newIntents.add(newIntent);
            }
        }

        if (newIntents.isEmpty()) {
            MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
        else {
            try {
                super.startActivities(newIntents.toArray(new Intent[] {}));
            }
            catch (ActivityNotFoundException e) {
                MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
            }
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void startActivities(Intent[] intents, Bundle options)
    {

        MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
        if (application == null) {
            Maas360Logger.d(TAG, "SecureApplication instance is null");
            super.startActivities(intents, options);
            return;
        }

        List<Intent> newIntents = new ArrayList<Intent>();

        for (Intent intent : intents) {
            Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
            if (newIntent != null) {
                newIntents.add(newIntent);
            }
        }

        if (newIntents.isEmpty()) {
            MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
        else {
            try {
                super.startActivities(newIntents.toArray(new Intent[] {}), options);
            }
            catch (ActivityNotFoundException e) {
                MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
            }
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void startActivity(Intent intent)
    {

        MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
        if (application == null) {
            Maas360Logger.d(TAG, "SecureApplication instance is null");
            super.startActivity(intent);
            return;
        }

        Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
        if (newIntent == null) {
            MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
        else {
            try {
                super.startActivity(newIntent);
            }
            catch (ActivityNotFoundException e) {
                MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
            }
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void startActivity(Intent intent, Bundle options)
    {

        MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
        if (application == null) {
            Maas360Logger.d(TAG, "SecureApplication instance is null");
            super.startActivity(intent, options);
            return;
        }

        Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
        if (newIntent == null) {
            MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
        else {
            try {
                super.startActivity(newIntent, options);
            }
            catch (ActivityNotFoundException e) {
                MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
            }
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void startActivityForResult(Intent intent, int requestCode)
    {

        MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
        if (application == null) {
            Maas360Logger.d(TAG, "SecureApplication instance is null");
            super.startActivityForResult(intent, requestCode);
            return;
        }

        Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
        if (newIntent == null) {
            MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
        else {
            try {
                super.startActivityForResult(newIntent, requestCode);
            }
            catch (ActivityNotFoundException e) {
                MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
            }
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void startActivityForResult(Intent intent, int requestCode, Bundle options)
    {

        MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
        if (application == null) {
            Maas360Logger.d(TAG, "SecureApplication instance is null");
            super.startActivityForResult(intent, requestCode, options);
            return;
        }

        Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
        if (newIntent == null) {
            MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
        else {
            try {
                super.startActivityForResult(newIntent, requestCode, options);
            }
            catch (ActivityNotFoundException e) {
                MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
            }
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void startActivityFromChild(Activity child, Intent intent, int requestCode)
    {

        MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
        if (application == null) {
            Maas360Logger.d(TAG, "SecureApplication instance is null");
            super.startActivityFromChild(child, intent, requestCode);
            return;
        }

        Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
        if (newIntent == null) {
            MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
        else {
            try {
                super.startActivityFromChild(child, newIntent, requestCode);
            }
            catch (ActivityNotFoundException e) {
                MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
            }
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void startActivityFromChild(Activity child, Intent intent, int requestCode, Bundle options)
    {

        MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
        if (application == null) {
            Maas360Logger.d(TAG, "SecureApplication instance is null");
            super.startActivityFromChild(child, intent, requestCode, options);
            return;
        }

        Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
        if (newIntent == null) {
            MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
        else {
            try {
                super.startActivityFromChild(child, newIntent, requestCode, options);
            }
            catch (ActivityNotFoundException e) {
                MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
            }
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void startActivityFromFragment(Fragment fragment, Intent intent, int requestCode)
    {

        MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
        if (application == null) {
            Maas360Logger.d(TAG, "SecureApplication instance is null");
            super.startActivityFromFragment(fragment, intent, requestCode);
            return;
        }

        Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
        if (newIntent == null) {
            MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
        else {
            try {
                super.startActivityFromFragment(fragment, newIntent, requestCode);
            }
            catch (ActivityNotFoundException e) {
                MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
            }
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void startActivityFromFragment(Fragment fragment, Intent intent, int requestCode, Bundle options)
    {

        MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
        if (application == null) {
            Maas360Logger.d(TAG, "SecureApplication instance is null");
            super.startActivityFromFragment(fragment, intent, requestCode, options);
            return;
        }

        Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
        if (newIntent == null) {
            MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
        else {
            try {
                super.startActivityFromFragment(fragment, newIntent, requestCode, options);
            }
            catch (ActivityNotFoundException e) {
                MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
            }
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean startActivityIfNeeded(Intent intent, int requestCode)
    {

        MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
        if (application == null) {
            Maas360Logger.d(TAG, "SecureApplication instance is null");
            return super.startActivityIfNeeded(intent, requestCode);
        }

        Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
        if (newIntent == null) {
            MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
            return false;
        }
        else {
            try {
                return super.startActivityIfNeeded(newIntent, requestCode);
            }
            catch (ActivityNotFoundException e) {
                MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
                return false;
            }
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean startActivityIfNeeded(Intent intent, int requestCode, Bundle options)
    {

        MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
        if (application == null) {
            Maas360Logger.d(TAG, "SecureApplication instance is null");
            return super.startActivityIfNeeded(intent, requestCode, options);
        }

        Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
        if (newIntent == null) {
            MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
            return false;
        }
        else {
            try {
                return super.startActivityIfNeeded(newIntent, requestCode, options);
            }
            catch (ActivityNotFoundException e) {
                MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
                return false;
            }
        }
    }
}
