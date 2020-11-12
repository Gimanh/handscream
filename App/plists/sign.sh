#!/bin/bash

CURRENT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

COMPANY_DEVELOPER_ID="XXXXX XXXXX (XXXXXXX)"

# Name of your app.
APP="TaskView"
# The path of your app to sign.
APP_PATH="$CURRENT_PATH/../build/mas/$APP.app"
# The path to the location you want to put the signed package.
RESULT_PATH="$CURRENT_PATH/../build/mas/$APP-Publish-Ready.pkg"
# The name of certificates you requested.
APP_KEY="3rd Party Mac Developer Application: $COMPANY_DEVELOPER_ID"
INSTALLER_KEY="3rd Party Mac Developer Installer: $COMPANY_DEVELOPER_ID"
# The path of your plist files.
CHILD_PLIST="child.plist"
PARENT_PLIST="parent.plist"
LOGINHELPER_PLIST="loginhelper.plist"

FRAMEWORKS_PATH="$APP_PATH/Contents/Frameworks"

codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Electron Framework"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libnode.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/Contents/MacOS/$APP Helper"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/"
codesign -s "$APP_KEY" -f --entitlements "$LOGINHELPER_PLIST" "$APP_PATH/Contents/Library/LoginItems/$APP Login Helper.app/Contents/MacOS/$APP Login Helper"
codesign -s "$APP_KEY" -f --entitlements "$LOGINHELPER_PLIST" "$APP_PATH/Contents/Library/LoginItems/$APP Login Helper.app/"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$APP_PATH/Contents/MacOS/$APP"
codesign -s "$APP_KEY" -f --entitlements "$PARENT_PLIST" "$APP_PATH"

productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"
