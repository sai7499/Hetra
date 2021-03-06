package com.vehicle.finance;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Fragment;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.WindowManager;
import android.widget.Toast;

import com.fiberlink.maas360.android.dlpsdk.CopyPasteRestrictionChecker;
import com.fiberlink.maas360.android.dlpsdk.MaaS360DLPSDK;
import com.fiberlink.maas360.android.dlpsdk.MaaS360DLPSDKUtils;
import com.fiberlink.maas360.android.dlpsdk.MaaS360SecureApplication;
import com.fiberlink.maas360.android.dlpsdk.MaaS360SystemServiceUtils;
import com.fiberlink.maas360.util.Maas360Logger;
import com.fiberlink.maas360sdk.core.MaaS360SDKContextWrapper;
import com.fiberlink.maas360sdk.exception.MaaS360SDKInitializationException;
import com.fiberlink.maas360sdk.exception.MaaS360SDKNotActivatedException;


import com.fiberlink.maas360sdk.external.IMaaS360SDKListener;
import com.fiberlink.maas360sdk.external.MaaS360SDK;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {
  public static String TAG = "CordovaActivity";


  private String loggerName = "Maas360";


  private final IMaaS360SDKListener mListener = new SDKListener();

  private String developerId = "40026336";

  private String licenseKey = "7669E-A668C-99CJ8-B9EJJ-JJJJJ-J3C42";

  private boolean isMaas360Enable = false;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);


    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{

      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      final boolean shouldEnforceCopyPasteRestriction = true;
      final boolean shouldEnforceSSORestriction = true;
      final boolean shouldEnforceScreenshotRestriction = true;
      final boolean shouldEnforceWipeRestriction = true;
      final boolean shouldEnforceGatewayRestriction = true;
      final boolean shouldAutoEnforceRestrictExport = true;
      final boolean shouldAutoEnforceRestrictRootedDevice = true;
      final boolean shouldAutoEnforceRestrictImport = true;
      final boolean shouldAutoEnforceRestrictPrint = true;
      final boolean shouldAutoEnforceRestrictShare = true;
//      final String enableAnalytics = true;

      if(isMaas360Enable) {
        try {
          MaaS360SDK
                  .initSDK(getApplication(), developerId, licenseKey, mListener,
                          new com.fiberlink.maas360sdk.cordova.IMaaS360SDKPolicyAutoEnforceInfoFactory(
                                  shouldEnforceCopyPasteRestriction, shouldEnforceSSORestriction,
                                  shouldEnforceScreenshotRestriction, shouldEnforceWipeRestriction,
                                  shouldEnforceGatewayRestriction, shouldAutoEnforceRestrictExport,
                                  shouldAutoEnforceRestrictRootedDevice, shouldAutoEnforceRestrictImport,
                                  shouldAutoEnforceRestrictPrint, shouldAutoEnforceRestrictShare));
        }
        catch (MaaS360SDKInitializationException e) {
          Maas360Logger.e(TAG, e);

        }

        try {
          if (MaaS360SDKContextWrapper.getSharedInstance(true).getAutoEnforceInfo()
                  .shouldAutoEnforceRestrictScreenshot()) {
            enforceRestrictScreenshot();
          }
        } catch (MaaS360SDKNotActivatedException e) {
          Maas360Logger.d(loggerName, e);
        }
      }

      checkTamperedApk();

      if(RootUtil.isDeviceRooted(MainActivity.this)){
        System.out.println("Rooted");
        showAlertDialog("Rooted Device Alert", "This App cannot run either on Rooted device or Emulator");
      }else {
        System.out.println("Not rooted");
      }

    }});

  }

  public void showAlertDialog(String title, String message){
    AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(MainActivity.this);
    alertDialogBuilder.setTitle(title);
    alertDialogBuilder.setCancelable(false);

    alertDialogBuilder.setMessage(message);
    alertDialogBuilder.setPositiveButton("Okay",
      new DialogInterface.OnClickListener() {
        @Override
        public void onClick(DialogInterface arg0, int arg1) {
          Intent homeIntent = new Intent(Intent.ACTION_MAIN);
          homeIntent.addCategory( Intent.CATEGORY_HOME );
          homeIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
          startActivity(homeIntent);
        }
      });
    AlertDialog alertDialog = alertDialogBuilder.create();
    alertDialog.show();

  }

  public  void checkTamperedApk() {
//    // Keep dexCrc in resources (strings.xml) or in JNI code. Don't hardcode it in java classes, because it's changes checksum.
    TamperingProtection protection = new TamperingProtection(this);
    String packageName = this.getResources().getString(R.string.package_name);
    protection.setAcceptedPackageNames(packageName); // your package name

    if (BuildConfig.DEBUG) {
      String dexCrcStr = this.getResources().getString(R.string.debugDexCrc);
      long dexCrc = Long.parseLong(dexCrcStr);
      protection.setAcceptedDexCrcs(dexCrc);

      // do something for a debug build
      String debugKey = this.getResources().getString(R.string.debugKey);
      protection.setAcceptedSignatures(debugKey);
      protection.setAcceptStartInDebugMode(true);
      protection.setAcceptStartOnEmulator(false);

    }else {
      String dexCrcStr = this.getResources().getString(R.string.releaseDexCrc);
      long dexCrc = Long.parseLong(dexCrcStr);
      protection.setAcceptedDexCrcs(dexCrc);

      String releaseKey = this.getResources().getString(R.string.releaseKey);
      protection.setAcceptedSignatures(releaseKey);
      protection.setAcceptStartInDebugMode(false);
      protection.setAcceptStartOnEmulator(false);

    }

    JSONObject obj = protection.validateAll();// <- bool is valid or tampered.
    boolean isValid = false;
    String exception = null;
    try {
      isValid = (boolean) obj.get("isValid");
    } catch (JSONException e) {
      e.printStackTrace();
    }

    if(isValid){

    }else {

      try {
        exception = (String) obj.get("exception");
      } catch (JSONException e) {
        e.printStackTrace();
      }

      showAlertDialog("Alert", "This application got tampered, so it cannot able to proceed"+"\n"+ exception);
    }

  }


  /**
   * {@inheritDoc}
   */
  @Override
  public void onResume() {
    super.onResume();

    checkTamperedApk();

    if(RootUtil.isDeviceRooted(MainActivity.this)){
      System.out.println("Rooted");
      showAlertDialog("Rooted Device Alert", "This App cannot run either on Rooted device or Emulator");
    }else {
      System.out.println("Not rooted");
    }

    if(isMaas360Enable) {
      try {
        if (MaaS360SDKContextWrapper.getSharedInstance(false).getAutoEnforceInfo().shouldAutoEnforceSSO()) {
          MaaS360SDKContextWrapper.getSharedInstance(false).checkForSSO(false, true);
        }

        if (MaaS360SDKContextWrapper.getSharedInstance(false).getAutoEnforceInfo()
                .shouldAutoEnforceRestrictScreenshot()) {
          enforceRestrictScreenshot();
        }
      } catch (MaaS360SDKNotActivatedException e) {
        Maas360Logger.e(loggerName, "onResume : ", e.getMessage());
      }
    }
  }

  @Override
  public void onUserInteraction() {
    super.onUserInteraction();

    if(isMaas360Enable) {
      try {
        if (MaaS360SDKContextWrapper.getSharedInstance(false).getAutoEnforceInfo().shouldAutoEnforceSSO()) {
          MaaS360SDKContextWrapper.getSharedInstance(false).checkForSSO(false, true);
        }
      } catch (MaaS360SDKNotActivatedException e) {
        Maas360Logger.e(loggerName, "onUserInteraction : ", e.getMessage());
      }
    }
  }

  /**
   * Enforce restrict screenshot.
   */
  private void enforceRestrictScreenshot() {
    if (MaaS360DLPSDK.getInstance() != null && MaaS360DLPSDK.getInstance().isRestrictScreenshot()) {
      getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);
    } else {
      getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
    }
  }

  /**
   * @return True if we should auto enforce copy paste restriction, false
   * otherwise.
   */
  private boolean shouldAutoEnforceCopyPasteRestriction() {
    try {
      return MaaS360SDKContextWrapper.getSharedInstance(true).getAutoEnforceInfo()
              .shouldAutoEnforceRestrictCopyPaste();
    } catch (MaaS360SDKNotActivatedException e) {
      Maas360Logger.d(loggerName, e);
      return false;
    }
  }

  @Override
  public Object getSystemService(String name) {
    if(isMaas360Enable) {

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
        } else {
          Object object = super.getSystemService(name);
          return object;
        }
      } catch (Exception e) {
        Maas360Logger.e(loggerName, e, "Exception in getSystemService()");
        return super.getSystemService(name);
      } catch (Error e) {
        Maas360Logger.e(loggerName, e, "Error in getSystemService()");
        return super.getSystemService(name);
      }
    }else{
      Object object = super.getSystemService(name);
      return object;
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void startActivities(Intent[] intents) {

    if(isMaas360Enable) {

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
      } else {
        try {
          super.startActivities(newIntents.toArray(new Intent[]{}));
        } catch (ActivityNotFoundException e) {
          MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
      }
    }else {
      super.startActivities(intents);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void startActivities(Intent[] intents, Bundle options) {

    if(isMaas360Enable) {

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
      } else {
        try {
          super.startActivities(newIntents.toArray(new Intent[]{}), options);
        } catch (ActivityNotFoundException e) {
          MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
      }

    }else {
      super.startActivities(intents, options);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void startActivity(Intent intent) {

    if(isMaas360Enable) {

      MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
      if (application == null) {
        Maas360Logger.d(TAG, "SecureApplication instance is null");
        super.startActivity(intent);
        return;
      }

      Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
      if (newIntent == null) {
        MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
      } else {
        try {
          super.startActivity(newIntent);
        } catch (ActivityNotFoundException e) {
          MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
      }
    }else {
      super.startActivity(intent);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void startActivity(Intent intent, Bundle options) {

    if(isMaas360Enable) {
      MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
      if (application == null) {
        Maas360Logger.d(TAG, "SecureApplication instance is null");
        super.startActivity(intent, options);
        return;
      }

      Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
      if (newIntent == null) {
        MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
      } else {
        try {
          super.startActivity(newIntent, options);
        } catch (ActivityNotFoundException e) {
          MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
      }
    }else {
      super.startActivity(intent, options);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void startActivityForResult(Intent intent, int requestCode) {

    if(isMaas360Enable) {

      MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
      if (application == null) {
        Maas360Logger.d(TAG, "SecureApplication instance is null");
        super.startActivityForResult(intent, requestCode);
        return;
      }

      Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
      if (newIntent == null) {
        MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
      } else {
        try {
          super.startActivityForResult(newIntent, requestCode);
        } catch (ActivityNotFoundException e) {
          MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
      }
    }else {
      super.startActivityForResult(intent, requestCode);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void startActivityForResult(Intent intent, int requestCode, Bundle options) {

    if(isMaas360Enable) {
      MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
      if (application == null) {
        Maas360Logger.d(TAG, "SecureApplication instance is null");
        super.startActivityForResult(intent, requestCode, options);
        return;
      }

      Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
      if (newIntent == null) {
        MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
      } else {
        try {
          super.startActivityForResult(newIntent, requestCode, options);
        } catch (ActivityNotFoundException e) {
          MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
      }
    }else {
      super.startActivityForResult(intent, requestCode, options);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void startActivityFromChild(Activity child, Intent intent, int requestCode) {

    if(isMaas360Enable) {
      MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
      if (application == null) {
        Maas360Logger.d(TAG, "SecureApplication instance is null");
        super.startActivityFromChild(child, intent, requestCode);
        return;
      }

      Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
      if (newIntent == null) {
        MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
      } else {
        try {
          super.startActivityFromChild(child, newIntent, requestCode);
        } catch (ActivityNotFoundException e) {
          MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
      }
    }else {
      super.startActivityFromChild(child, intent, requestCode);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void startActivityFromChild(Activity child, Intent intent, int requestCode, Bundle options) {

    if(isMaas360Enable) {

      MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
      if (application == null) {
        Maas360Logger.d(TAG, "SecureApplication instance is null");
        super.startActivityFromChild(child, intent, requestCode, options);
        return;
      }

      Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
      if (newIntent == null) {
        MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
      } else {
        try {
          super.startActivityFromChild(child, newIntent, requestCode, options);
        } catch (ActivityNotFoundException e) {
          MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
      }

    }else {
      super.startActivityFromChild(child, intent, requestCode, options);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void startActivityFromFragment(Fragment fragment, Intent intent, int requestCode) {

    if(isMaas360Enable) {
      MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
      if (application == null) {
        Maas360Logger.d(TAG, "SecureApplication instance is null");
        super.startActivityFromFragment(fragment, intent, requestCode);
        return;
      }

      Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
      if (newIntent == null) {
        MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
      } else {
        try {
          super.startActivityFromFragment(fragment, newIntent, requestCode);
        } catch (ActivityNotFoundException e) {
          MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
      }
    }else {
      super.startActivityFromFragment(fragment, intent, requestCode);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void startActivityFromFragment(Fragment fragment, Intent intent, int requestCode, Bundle options) {
    if(isMaas360Enable) {

      MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
      if (application == null) {
        Maas360Logger.d(TAG, "SecureApplication instance is null");
        super.startActivityFromFragment(fragment, intent, requestCode, options);
        return;
      }

      Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
      if (newIntent == null) {
        MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
      } else {
        try {
          super.startActivityFromFragment(fragment, newIntent, requestCode, options);
        } catch (ActivityNotFoundException e) {
          MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        }
      }
    }else {
      super.startActivityFromFragment(fragment, intent, requestCode, options);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public boolean startActivityIfNeeded(Intent intent, int requestCode) {
    if(isMaas360Enable) {

      MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
      if (application == null) {
        Maas360Logger.d(TAG, "SecureApplication instance is null");
        return super.startActivityIfNeeded(intent, requestCode);
      }

      Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
      if (newIntent == null) {
        MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        return false;
      } else {
        try {
          return super.startActivityIfNeeded(newIntent, requestCode);
        } catch (ActivityNotFoundException e) {
          MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
          return false;
        }
      }
    }else{
      return super.startActivityIfNeeded(intent, requestCode);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public boolean startActivityIfNeeded(Intent intent, int requestCode, Bundle options) {
    if(isMaas360Enable) {
      MaaS360SecureApplication application = MaaS360SecureApplication.getApplication();
      if (application == null) {
        Maas360Logger.d(TAG, "SecureApplication instance is null");
        return super.startActivityIfNeeded(intent, requestCode, options);
      }

      Intent newIntent = MaaS360DLPSDKUtils.processIntent(this, intent);
      if (newIntent == null) {
        MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
        return false;
      } else {
        try {
          return super.startActivityIfNeeded(newIntent, requestCode, options);
        } catch (ActivityNotFoundException e) {
          MaaS360DLPSDKUtils.handleNoAppFoundForIntent(this);
          return false;
        }
      }
    }else {
      return super.startActivityIfNeeded(intent, requestCode, options);
    }
  }
}
