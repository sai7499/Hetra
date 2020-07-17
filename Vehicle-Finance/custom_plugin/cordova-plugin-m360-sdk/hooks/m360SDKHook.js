var fs = require('fs'),
    path = require('path'),
    plist, xcode;

module.exports = function (ctx) {
    //console.log("Hook type:", ctx.hook, "Cmd Line:", ctx.cmdLine, "Platforms:", ctx.opts.cordova.platforms);

    var currentPlatforms = ctx.opts.cordova.platforms;
    if (currentPlatforms.indexOf('ios') >= 0) {
        if (ctx.hook === 'before_plugin_install') {
            checkForNodeModules();
            checkProjectStatus(ctx);
        } else if (ctx.hook === 'after_plugin_install' ||
            ctx.hook === 'before_plugin_uninstall' ||
            isPrepareCmd(ctx))  {
            printIntegrationInstructions(ctx);
            initNodeModules();
            handleProjectChanges(ctx);
        }
        /*else {
            console.log("Nothing to do as hook called for ", ctx.hook);
        }*/
    } else if (currentPlatforms.indexOf('android') >= 0) {
        if (ctx.hook === 'after_plugin_install') {
            printIntegrationInstructions(ctx);
        }
        /*else {
            console.log("Nothing to do as hook called for ", ctx.hook);
        }*/
    }

    return;
};

function checkForNodeModules() {
    initNodeModules();
    var errorModules = [];
    if (!plist) {
        errorModules.push('plist');
    }

    if (!xcode) {
        errorModules.push('xcode');
    }

    var err;
    if (errorModules.length == 1) {
        err = Error('Retry adding plugin after installation of missing module by' +
            "\nexecuting command: 'npm install " + errorModules[0] + "'");
    } else if (errorModules.length > 1) {
        err = Error('Retry adding plugin after installation of missing modules by' +
            "\nexecuting command: 'npm install " + errorModules.join(' ') + "'");
    }

    if (err) {
        err.code = 'MODULE_NOT_FOUND';
        throw err;
    }
}

function initNodeModules() {
    plist = safeRequire('plist');
    xcode = safeRequire('xcode');
}

function safeRequire(moduleName) {
    var module;
    try {
        var modulePath = require.resolve(moduleName);
        module = require(moduleName);
    }
    catch (e) {
        console.error('Cannot find module (' + moduleName + ')');
    }

    return module;
}

function checkProjectStatus(ctx) {
    var projectReady = false;
    var projectRoot = path.resolve(ctx.opts.projectRoot);
    var platformPath = path.join(projectRoot, 'platforms', 'ios');
    var projectName = fs.readdirSync(platformPath).filter(function (e) {
        return e.match(/\.xcodeproj$/i);
    })[0];

    var projectPath = path.join(platformPath, projectName, 'project.pbxproj');

    // console.log("Project path: ", projectPath);
    var xcodeProj = xcode.project(projectPath);
    var projHash = xcodeProj.parseSync();
    if (!projHash) {
        var err = Error("Failed to parse '" + projectName + "'");
        err.code = 'CORRUPTED_PROJECT';
        throw err;
    }
}

function isPrepareCmd(ctx) {
    if (ctx.hook === 'after_prepare') {
        var cmdLine = ctx.cmdLine.trim().replace(/ +/g, ' ').toLowerCase();
        return (-1 != cmdLine.indexOf('cordova prepare ios'));
    }

    return false;
}

function handleProjectChanges(ctx) {
    var projectReady = false;
    var projectRoot = path.resolve(ctx.opts.projectRoot);
    var platformPath = path.join(projectRoot, 'platforms', 'ios');
    var projectName = fs.readdirSync(platformPath).filter(function (e) {
        return e.match(/\.xcodeproj$/i);
    })[0];

    var projectPath = path.join(platformPath, projectName, 'project.pbxproj');

    // console.log("Project path: ", projectPath);
    var xcodeProj = xcode.project(projectPath);
    xcodeProj.parse(function (err) {
        if (err) {
            throw new Error('Failed to parse ' + projectPath + ': ' + JSON.stringify(err));
        }

        if (ctx.hook === 'after_plugin_install' || isPrepareCmd(ctx)) {
            console.log('\nIntegration Status of MaaS360 Workplace SDK for iOS:');
            console.log('-----------------------------------------------------');
        }

        var intStatus = { areInfoPlistsUpdated: false,
            areEntitlementPlistsUpdated: false,
            isBuildConfigFileUpdated: false,
            areBuildSettingsUpdated: false, };
        var processedInfoPlists = [];
        var processedEntitlements = [];

        var configs = xcodeProj.pbxXCBuildConfigurationSection();
        for (var configName in configs) {
            var config = configs[configName];

            if (config.name) {
                var infoPlist = xcodeProj.getBuildProperty('INFOPLIST_FILE', config.name);
                if (infoPlist) {
                    infoPlist = infoPlist.replace(/"/g, '');

                    var infoPlistPath = path.join(platformPath, infoPlist);
                    if (-1 === processedInfoPlists.indexOf(infoPlistPath)) {
                        if (ctx.hook === 'after_plugin_install' || isPrepareCmd(ctx)) {
                            if (updateInfoPlist(infoPlistPath)) {
                                // console.log("- Updated 'LSApplicationQueriesSchemes' and 'URL Types' with " + '\n' + "  MaaS360 SDK identifiers in ", infoPlist);
                                intStatus.areInfoPlistsUpdated = true;
                            }
                        } else if (ctx.hook === 'before_plugin_uninstall') {
                            revertInfoPlist(infoPlistPath);
                        }

                        processedInfoPlists.push(infoPlistPath);
                        // console.log("processedInfoPlists: ", processedInfoPlists);
                    }
                }

                var entitlementPlist = xcodeProj.getBuildProperty('CODE_SIGN_ENTITLEMENTS', config.name);
                if (entitlementPlist) {
                    entitlementPlist = entitlementPlist.replace(/"/g, '');

                    var entitlementPlistPath = path.join(platformPath, entitlementPlist);
                    if (-1 === processedEntitlements.indexOf(entitlementPlistPath)) {
                        if (updateEntitlementPlist(entitlementPlistPath, ctx)) {
                            if (!intStatus.areEntitlementPlistsUpdated &&
                                (ctx.hook === 'after_plugin_install' || isPrepareCmd(ctx))) {
                                intStatus.areEntitlementPlistsUpdated = true;
                            }
                        }

                        processedEntitlements.push(entitlementPlistPath);
                    }
                }
            }
        }

        if (ctx.hook === 'after_plugin_install' || isPrepareCmd(ctx)) {
            var xcconfigPath = getPath(platformPath, 'build.xcconfig');
            // console.log("Build configuration file: ", xcconfigPath);
            if (!updateOtherLinkerFlagsInXCConfig(xcconfigPath)) {
                updateOtherLinkerFlags(xcodeProj, projectPath);
                intStatus.areBuildSettingsUpdated = true;
            } else {
                intStatus.isBuildConfigFileUpdated = true;
            }
        }

        if (ctx.hook === 'after_plugin_install' || isPrepareCmd(ctx)) {
            printIntegrationStatuses(ctx, intStatus);
            printAdditionalIntegrationInstructions(ctx, processedEntitlements.length == 0, projectName);
            console.log('\nDone.');
        }
    });
}

function printIntegrationStatuses(ctx, intStatus) {
    if (intStatus.areInfoPlistsUpdated) {
        console.log('- Whitelisting MaaS360 app schemes: Done');
        console.log('- Adding URL scheme for communication with MaaS360 app: Done');
    } else {
        console.log('- Whitelisted MaaS360 app schemes: Yes');
        console.log('- Added URL scheme for communication with MaaS360 app: Yes');
    }

    if (intStatus.isBuildConfigFileUpdated) {
        if (ctx.hook === 'after_plugin_install') {
            console.log('- Updating other linker flags in build configuration file: Done');
        } else {
            console.log('- Updated other linker flags in build configuration file: Yes');
        }
    } else if (intStatus.areBuildSettingsUpdated) {
        if (ctx.hook === 'after_plugin_install') {
            console.log('- Updating other linker flags in project build settings: Done');
        } else {
            console.log('- Updated other linker flags in project build settings: Yes');
        }
    }

    if (intStatus.areEntitlementPlistsUpdated) {
        console.log('- Updated keychain access groups: Yes');
    }
}

function printIntegrationInstructions(ctx) {
    if (ctx.hook !== 'after_plugin_install') {
        return;
    }

    var header = 'Please follow below mentioned instructions to complete the integration of MaaS360 Workplace SDK' + '\n';
    var underliner = '-----------------------------------------------------------------------------------------------';
    var initM360SDKInstruction = '- Initialize MaaS360 Workplace SDK.' +  '\n\n' + '   On receiving device ready event as part of app initialize call below function (defined in m360sdk.js):' + '\n' + '     initMaaS360SDK(developerKey, licenseKey, sdkEventHandler)' + '\n\n' + '     - developerKey: key specific to your company' + '\n' + '     - licenseKey: key specific to this app' + '\n' + '     - sdkEventHandler: an object containing implementation to handle MaaS360 Workplace SDK events (Optional)' + '\n' + '   Note: Include js/m360sdk.js in required html page(s)';
    console.log('\n' + header + underliner + '\n\n' + initM360SDKInstruction);
}

function printAdditionalIntegrationInstructions(ctx, isKeyChainSharingNotEnabled, projectName) {
    var header = 'Please follow these additional required instructions for integration of MaaS360 Workplace SDK for iOS:' + '\n';
    var underliner = '------------------------------------------------------------------------------------------------------' + '\n';
    var openURLInstruction = '1. Handle open URL requests from MaaS360 app.' + '\n\n' + '   Add/edit the following method in all the classes implementing UIApplication delegate (example: AppDelegate.m)' + '\n' + '   as below:' + '\n' + '   - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url ' + '\n' + '           sourceApplication:(NSString *)sourceApplication annotation:(id)annotation' + '\n' + '   {' + '\n' + '      M360SDKConfig *config = [[M360SDKConfig alloc] init];' + '\n' + '      config.developerID = @"DDDDDDDDD";      // Replace "DDDDDDDDD" with actual developer ID' + '\n' + '      config.licenseKey = @"LLL-LLLLLL-LLL";  // Replace "LLL-LLLLLL-LLL" with actual license key' + '\n' + '' + '\n' + '      BOOL isURLProcessed = NO;' + '\n' + '      NSError *error;' + '\n' + '      if ([MaaS360SDK canInitWithSDKConfig:config error:&error]) {' + '\n' + '         isURLProcessed = [[MaaS360SDK shared] handleURLResponse:url' + '\n' + '                                               sourceApplication:sourceApplication annotations:annotation];' + '\n' + '      }' + '\n' + '' + '\n' + '      if (!isURLProcessed) {' + '\n' + '         //if bRet is NO, handle the URL Response, if Yes handled by the SDK.' + '\n' + '      }' + '\n' + '      return YES;' + '\n' + '   }' + '\n' + '   Note: Use "#import <MaaS360SDKFramework/MaaS360SDKFramework.h>" to remove MaaS360 SDK related "use of undeclared identifier" errors.' + '\n';
    var verifyOpenURLChangesInstructions = '1. Make sure that code to handle open URL requests from MaaS360 app is completed in all the classes ' + '\n' + 'implementing UIApplication delegate. If not completed, please refer to step 4 of "MaaS360SDK Cordova plugin Integration" documentation.' + '\n';
    var enableAppGroupsInstruction = '2. Enable App Groups enable and select an app group for allowing MaaS360 SDK to share its data across apps. Also seed the app group to MaaS360 SDK by adding a new property to Info.plist using "maas360AppGroupIdentifier" as key and selected app group identifier as the value. Please refer to step 4 of "MaaS360 SDK Cordova Plugin Integration" documentation for more information.' + '\n';
    var verifyAppGroupsInstruction = '2. Verify that App Groups are enabled and an app group has been seeded to MaaS360 SDK to share its data across apps. Please refer to step 4 of "MaaS360 SDK Cordova Plugin Integration" documentation for steps to seed an app group identifier to MaaS360 SDK.' + '\n';
    var enableKeychainInstruction = '3. Keychain sharing capability to be enabled and "com.fiberlink.authServices" group to be added to the same.' + '\n' + '\n' + '   Please execute the following steps and re-prepare the iOS environment:' + '\n' + '   - Open the project located at ' + path.join('platforms', 'ios', projectName) + ' in Xcode' + '\n' + '   - For each target of ' + projectName.substring(0, projectName.indexOf('.xcodeproj')) + ' enable Keychain sharing under Capabilites tab' + '\n' + '   - Prepare the project for iOS environment by executing "cordova prepare ios" command' + '\n' + '\n' + 'Note: If a new target is added, make sure that above instructions are followed.';

    var instructions = [header + underliner];
    if (ctx.hook === 'after_plugin_install') {
        instructions.push(openURLInstruction);
        instructions.push(enableAppGroupsInstruction);
    } else {
        instructions.push(verifyOpenURLChangesInstructions);
        instructions.push(verifyAppGroupsInstruction);
    }

    if (isKeyChainSharingNotEnabled) {
        instructions.push(enableKeychainInstruction);
    }

    console.log('\n' + instructions.join('\n'));
}

function updateOtherLinkerFlagsInXCConfig(path) {
    var REGEX = /OTHER_LDFLAGS = (.+)/;
    var M360SDK_FLGS = ['-ObjC', '-lstdc++', '-all_load'];

    var fileContent = fs.readFileSync(path, 'utf8');
    if (fileContent.match(REGEX)) {
        var replaceFlags = false;
        var flags = fileContent.match(REGEX)[1].trim().replace(/ +/g, ' ');
        // console.log("Original flags: ", flags);
        flags = flags.split(' ');
        M360SDK_FLGS.forEach(function (item, index) {
            var idx = flags.indexOf(item);
            if (-1 !== idx) {
                flags.splice(idx, 1);
            } else {
                replaceFlags = true;
            }
        });

        if (replaceFlags) {
            flags = flags.concat(M360SDK_FLGS).join(' ');
            // console.log("Replacement flags: ", flags);
            fileContent = fileContent.replace(REGEX, 'OTHER_LDFLAGS = ' + flags);
            fs.writeFileSync(path, fileContent);
            //console.log("Updating OTHER_LDFLAGS")
            //console.log('- Build configuration other linker flags are updated to include ["-ObjC", "-all_load", "-lstdc++"]');
        }
        /*else {
            console.log('- Build configuration other linker flags are up-to-date');
        }*/

        return true;
    }

    return false;
}

function getPath(dir, filename) {
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var path = dir + '/' + files[i];
        if (fs.statSync(path).isDirectory()) {
            path = getPath(path, filename);
            if (path)
                return path;
        } else if (filename === files[i]) {
            return path;
        }
    }

    return null;
}

function unquote(str) {
    if (str) return str.replace(/^"(.*)"$/, '$1');
}

function printOtherLinkerFlags(xcodeProj) {
    var configurations = xcodeProj.pbxXCBuildConfigurationSection(),
        OTHER_LDFLAGS = 'OTHER_LDFLAGS',
        config, buildSettings;

    for (config in configurations) {
        buildSettings = configurations[config].buildSettings;

        if (!buildSettings || unquote(buildSettings['PRODUCT_NAME']) != xcodeProj.productName) {
            continue;
        }

        console.log('Other Linker Flags of ', xcodeProj.productName, ': ', buildSettings[OTHER_LDFLAGS]);
    }
}

function updateOtherLinkerFlags(xcodeProj, projectPath) {
    // printOtherLinkerFlags(xcodeProj);
    xcodeProj.removeFromOtherLinkerFlags('-Obj-C');
    xcodeProj.removeFromOtherLinkerFlags('-ObjC');
    xcodeProj.removeFromOtherLinkerFlags('-all_load');
    xcodeProj.removeFromOtherLinkerFlags('-lstdc++');

    // printOtherLinkerFlags(xcodeProj);
    xcodeProj.addToOtherLinkerFlags('"-ObjC"');
    xcodeProj.addToOtherLinkerFlags('"-all_load"');
    xcodeProj.addToOtherLinkerFlags('"-lstdc++"');

    fs.writeFileSync(projectPath, xcodeProj.writeSync());
    //console.log('- Project other linker flags are updated with ["-ObjC", "-all_load", "-lstdc++"]');
}

function updateEntitlementPlist(entitlementPlistPath, ctx) {
    var entitlementPlist = fs.readFileSync(entitlementPlistPath, 'utf8');
    // console.log("Existing entitlements: ", entitlementPlist);

    var plistInfo = plist.parse(entitlementPlist);
    var keyChainAccessGroups = plistInfo['keychain-access-groups'];

    var entitlementsUpdated = false;
    var maas360KeyChainGroup = '$(AppIdentifierPrefix)com.fiberlink.authServices';
    var idx = keyChainAccessGroups.indexOf(maas360KeyChainGroup);
    if (ctx.hook === 'after_plugin_install' || isPrepareCmd(ctx)) {
        if (-1 === idx) {
            keyChainAccessGroups.push(maas360KeyChainGroup);
            entitlementsUpdated = true;
        }
    } else if (ctx.hook === 'before_plugin_uninstall') {
        if (-1 !== idx) {
            keyChainAccessGroups.splice(idx, 1);
            entitlementsUpdated = true;
        }
    }

    if (entitlementsUpdated) {
        plistInfo['keychain-access-groups'] = keyChainAccessGroups;

        var updatedPlist = plist.build(plistInfo);
        fs.writeFileSync(entitlementPlistPath, updatedPlist, 'utf8');
        // console.log("Updated entitlements: ", updatedPlist);
        // if (ctx.hook === 'after_plugin_install' || isPrepareCmd(ctx)) {
        //     console.log("- Updated entitlements key-access-groups with MaaS360 group");
        // }
    }

    return entitlementsUpdated;
}

function revertInfoPlist(infoPlistPath) {
    var infoPlist = fs.readFileSync(infoPlistPath, 'utf8');
    // console.log("Existing Info.plist: ", infoPlist);

    var plistInfoUpdated = false;
    var plistInfo = plist.parse(infoPlist);

    // remove maas360AuthIdentifier
    var bundleUrlTypes = plistInfo['CFBundleURLTypes'];
    if (bundleUrlTypes) {
        var idx = findIndexOfMaaS360AuthId(bundleUrlTypes);
        if (-1 != idx) {
            bundleUrlTypes.splice(idx, 1);
        }

        if (bundleUrlTypes.length == 0) {
            delete plistInfo['CFBundleURLTypes'];
        } else {
            plistInfo['CFBundleURLTypes'] = bundleUrlTypes;
        }

        plistInfoUpdated = true;
    }

    var maas360AppQueriesSchemes = ['maas360', 'maas360auth', 'maas360v3', 'maas360v4'];
    var appQueriesSchemes = plistInfo['LSApplicationQueriesSchemes'];
    if (appQueriesSchemes) {
        maas360AppQueriesSchemes.forEach(function (item, index) {
            var idx = appQueriesSchemes.indexOf(item);
            if (-1 != idx) {
                appQueriesSchemes.splice(idx, 1);
            }
        });

        if (appQueriesSchemes.length == 0) {
            delete plistInfo['LSApplicationQueriesSchemes'];
        } else {
            plistInfo['LSApplicationQueriesSchemes'] = appQueriesSchemes;
        }

        plistInfoUpdated = true;
    }

    if (plistInfoUpdated) {
        var updatedPlist = plist.build(plistInfo);
        fs.writeFileSync(infoPlistPath, updatedPlist, 'utf8');
        // console.log("Updated Info.plist: ", updatedPlist);
    }
}

function updateInfoPlist(infoPlistPath) {
    var infoPlist = fs.readFileSync(infoPlistPath, 'utf8');
    // console.log("Existing Info.plist: ", infoPlist);

    var plistInfoUpdated = false;
    var plistInfo = plist.parse(infoPlist);
    var bundleId = plistInfo['CFBundleIdentifier'];

    var bundleUrlTypes = plistInfo['CFBundleURLTypes'];
    if (!bundleUrlTypes) {
        bundleUrlTypes = [];
    }

    var maas360AuthIdType = getMaaS360AuthIdType(bundleId);
    var maas360AuthIdIdx = findIndexOfMaaS360AuthId(bundleUrlTypes);
    if (-1 === maas360AuthIdIdx) {
        bundleUrlTypes.unshift(maas360AuthIdType);
        plistInfo['CFBundleURLTypes'] = bundleUrlTypes;
        plistInfoUpdated = true;
    } else if (!areEqualMaaS360AuthIdTypes(maas360AuthIdType, bundleUrlTypes[maas360AuthIdIdx])) {
        bundleUrlTypes[maas360AuthIdIdx] = maas360AuthIdType;
        plistInfo['CFBundleURLTypes'] = bundleUrlTypes;
        plistInfoUpdated = true;
    }

    var maas360AppQueriesSchemes = ['maas360', 'maas360auth', 'maas360v3', 'maas360v4'];
    var appQueriesSchemes = plistInfo['LSApplicationQueriesSchemes'];
    if (!appQueriesSchemes) {
        appQueriesSchemes = [];
        plistInfoUpdated = true;
    } else {
        maas360AppQueriesSchemes.forEach(function (item, index) {
            var idx = appQueriesSchemes.indexOf(item);
            if (-1 !== idx) {
                appQueriesSchemes.splice(idx, 1);
            } else {
                plistInfoUpdated = true;
            }
        });
    }

    plistInfo['LSApplicationQueriesSchemes'] = appQueriesSchemes.concat(maas360AppQueriesSchemes);

    if (plistInfoUpdated) {
        var updatedPlist = plist.build(plistInfo);
        fs.writeFileSync(infoPlistPath, updatedPlist, 'utf8');
        // console.log("Updated Info.plist: ", updatedPlist);
    }

    return plistInfoUpdated;
}

function areEqualMaaS360AuthIdTypes(authIdType1, authIdType2) {
    if (authIdType1['CFBundleTypeRole'] !== authIdType2['CFBundleTypeRole']) return false;
    if (authIdType1['CFBundleURLName'] !== authIdType2['CFBundleURLName']) return false;
    if (authIdType1['CFBundleURLSchemes'] !== authIdType2['CFBundleURLSchemes']) return false;

    return true;
}

function findIndexOfMaaS360AuthId(bundleUrlTypes) {
    function isPresent(type) {
        return type['CFBundleURLName'] === 'maas360AuthIdentifier';
    }

    return bundleUrlTypes.findIndex(isPresent);
}

function getMaaS360AuthIdType(bundleId) {
    var maas360AuthIdType = {};

    maas360AuthIdType['CFBundleTypeRole'] = 'Editor';
    maas360AuthIdType['CFBundleURLName'] = 'maas360AuthIdentifier';
    maas360AuthIdType['CFBundleURLSchemes'] = ['maas360client.'.concat(bundleId)];

    return maas360AuthIdType;
}
