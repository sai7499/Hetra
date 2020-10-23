package com.vehicle.finance;

import android.content.Context;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import java.io.File;
import java.util.Arrays;
import java.util.List;


public class RootUtil {
    public enum DetectionMethod {
        INSTALLED_FILES, INSTALLED_PACKAGES, CYANOGEN_SETTINGS, BINARY, PERMISSIONS
    }

    public static boolean isDeviceRooted(final Context context, DetectionMethod... methods) {
        boolean rooted = false;
        int i = 0;

        while (!rooted && i < methods.length) {
            switch (methods[i]) {
                case INSTALLED_FILES:
                    rooted = checkInstalledFiles();
                    break;
                case INSTALLED_PACKAGES:
                    rooted = checkInstalledPackages(context);
                    break;
                case CYANOGEN_SETTINGS:
                    rooted = checkCyanogenSettings(context);
                    break;
                case BINARY:
                    rooted = checkBinaries();
                    break;
                case PERMISSIONS:
                    rooted = checkPermissions();
                    break;
            }

            i++;
        }

        return rooted;
    }

    /**
     * Checks whether the Superuser.apk is present in the system applications
     *
     * @return true if the Superuser.apk is present in the system applications
     */
    private static boolean checkInstalledFiles() {
        // /system/app/Superuser.apk || /system/app/Superuser/Superuser.apk
        final List<String> possiblePaths = Arrays.asList(
                "/system/app",
                "/system/app/Superuser"
        );

        for (String path : possiblePaths) {
            final File suapk = new File(path, "Superuser.apk");

            if (suapk.exists()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks for installed packages which are known to be present on rooted devices
     *
     * @param context Used for accessing the package manager
     * @return true if any of the blacklisted packages are installed on the device
     */
    private static boolean checkInstalledPackages(final Context context) {
        final List<String> blacklistedPackages = Arrays.asList(
                "com.noshufou.android.su",
                "com.thirdparty.superuser",
                "eu.chainfire.supersu",
                "com.koushikdutta.superuser",
                "com.zachspong.temprootremovejb",
                "com.ramdroid.appquarantine"
        );

        final List<String> rootOnlyApplications = Arrays.asList(
                "eu.chainfire.stickmount",
                "eu.chainfire.mobileodin.pro",
                "eu.chainfire.liveboot",
                "eu.chainfire.pryfi",
                "eu.chainfire.adbd",
                "eu.chainfire.recently",
                "eu.chainfire.flash",
                "eu.chainfire.stickmount.pro",
                "eu.chainfire.triangleaway",
                "org.adblockplus.android"
        );

        final PackageManager pm = context.getPackageManager();
        final List<PackageInfo> installedPackages = pm.getInstalledPackages(0);

        int rootOnlyAppCount = 0;

        for (PackageInfo packageInfo : installedPackages) {
            final String packageName = packageInfo.packageName;

            if (blacklistedPackages.contains(packageName)) {  // check for blacklisted packages
                return true;
            }

            if (rootOnlyApplications.contains(packageName)) {
                rootOnlyAppCount += 1;
            }
        }

        return rootOnlyAppCount > 2;
    }

    /**
     * Check whether the cyanogen superuser activity is present in the settings
     *
     * @param context Used for accessing the package manager
     * @return true if the cyanogen superuser activity is present on the device
     */
    private static boolean checkCyanogenSettings(Context context) {
        final String settingPackageName = "com.android.settings";
        final String cyanogenSuActivity = "cyanogenmod.Superuser";

        final PackageManager pm = context.getPackageManager();
        try {
            final PackageInfo settingsPackage = pm.getPackageInfo(settingPackageName, PackageManager.GET_ACTIVITIES);
            final ActivityInfo[] settingsActivities = settingsPackage.activities;

            for (ActivityInfo activityInfo : settingsActivities) {
                final String activityName = activityInfo.name;

                if (activityName.equalsIgnoreCase(settingPackageName + "." + cyanogenSuActivity)) {
                    return true;
                }
            }

        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

        return false;
    }

    /**
     * Check whether the su binary is present on the device
     *
     * @return true if the su binary is present on the device
     */
    private static boolean checkBinaries() {
        final List<String> possibleSuLocations = Arrays.asList(
                "/system/bin/su",
                "/system/xbin/su",
                "/sbin/su",
                "/system/su",
                "/system/bin/.ext/.su",
                "/system/usr/we-need-root/su-backup",
                "/system/xbin/mu"
        );

        for (String suLocation : possibleSuLocations) {
            final File suBinary = new File(suLocation);

            if (suBinary.exists()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks whether any of the system directories are writable or the /data directory is readable.
     * This test will usually result in a false negative on rooted devices.
     *
     * @return true if any system directory is writable
     */
    private static boolean checkPermissions() {
        final List<String> directoriesToCheck = Arrays.asList(
                "/data",
                "/",
                "/system",
                "/system/bin",
                "/system/sbin",
                "/system/xbin",
                "/vendor/bin",
                "/sys",
                "/sbin",
                "/etc",
                "/proc",
                "/dev"
        );

        for (String dirName : directoriesToCheck) {
            final File dir = new File(dirName);

            if (dir.exists() && dir.canWrite() || (dirName.equals("/data") && dir.canRead())) {
                return true;
            }
        }

        return false;
    }
}
