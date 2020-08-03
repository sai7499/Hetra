package com.vehicle.finance;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import com.fiberlink.maas360.android.dlpsdk.MaaS360SecureApplication;
import com.fiberlink.maas360sdk.external.IMaaS360SDKListener;

import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Environment;
import android.util.Log;

/**
 * Application subclass
 * 
 * @author dsunder
 */
public class MainApplication extends MaaS360SecureApplication
{
    /**
     * Singleton application instance.
     */
    private static MainApplication mApplication;

    /**
     * Shared preferences.
     */
    private SharedPreferences mPrefs;

    /**
     * The SDK listener instance.
     */
    private final IMaaS360SDKListener mListener = new SDKListener();

    /**
     * Foreground activity.
     */
    private MainActivity mForegroundActivity;

    private long timer;

    private static ProgressDialog mProgressDialog;

    public static final String DATABASE_NAME = "TestDB.db";

    public static final String NOTIFICATION_CHANNEL_ID = "APP_SDK_CHANNEL";

//    private Dao dao;
//
//    private MaaS360SQLiteOpenHelper dbHelper;

    /**
     * {@inheritDoc}
     */
    @Override
    public void onCreate()
    {
        super.onCreate();
        mApplication = this;
        mPrefs = getSharedPreferences("myAppPreferences", Context.MODE_PRIVATE);
        try {

            File newFile = new File(Environment.getExternalStorageDirectory().getAbsolutePath(), "TestFile.txt");
            if (!newFile.exists()) {
                newFile.createNewFile();
                newFile.setWritable(true);

                FileWriter fw = new FileWriter(newFile);
                fw.write("Hello World");
                fw.close();
            }
        }
        catch (IOException e) {
            Log.e("testapp", "io exception");
        }

        createNotificationChannel();
    }

    private void createNotificationChannel()
    {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            NotificationChannel notificationChannel =
                new NotificationChannel(NOTIFICATION_CHANNEL_ID, "App sdk channel",
                    NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(notificationChannel);
        }
    }

    public synchronized void saveLog(String message)
    {
        mPrefs.edit().putString("SavedLog", message).commit();
    }

    public synchronized String readLog()
    {
        return mPrefs.getString("SavedLog", "");
    }

    public synchronized void appendLog(String message)
    {
        String value = readLog();
        saveLog(value + message + "\n\n");
    }

    /**
     * @return SDK Listener instance.
     */
    public IMaaS360SDKListener getSDKListener()
    {
        return mListener;
    }

    /**
     * Set the foreground activity.
     */
    public synchronized void setForegroundActivity(MainActivity activity)
    {
        mForegroundActivity = activity;
    }

    /**
     * @return Foreground activity.
     */
    public synchronized MainActivity getForegroundActivity()
    {
        return mForegroundActivity;
    }

    /**
     * @return Shared singleton instance of the application.
     */
    public static MainApplication getApplication()
    {
        return mApplication;
    }

    public static void showSDKActivatingDialog(Activity mActivity)
    {
        mProgressDialog = new ProgressDialog(mActivity);
        mProgressDialog.setTitle("MaaS360SDK activation");
        mProgressDialog.setMessage("Activating...");
        mProgressDialog.setCancelable(false);
        mProgressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        mProgressDialog.show();
    }

    public static void dismissSDKActivationDialog(Activity mActivity)
    {
        if (null != mProgressDialog) {
            mProgressDialog.dismiss();
        }
    }

    public void startTimer()
    {
        timer = System.currentTimeMillis();
    }

    public long resetAndGetTime()
    {
        long timeDiff = System.currentTimeMillis() - timer;
        timer = 0;
        return timeDiff;
    }

    /**
     * Gets dao instance. Creates database if not already created.
     * 
     * @return
     */
//    public Dao getDao()
//    {
//        if (dbHelper == null) {
//            dbHelper = new SDKDatabaseHelper(mApplication, DATABASE_NAME, null, 1, "key");
//        }
//        if (dao == null) {
//            dao = new Dao(dbHelper);
//        }
//
//        return dao;
//    }
}
