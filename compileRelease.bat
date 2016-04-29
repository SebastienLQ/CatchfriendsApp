call cordova build --release android
call cd platforms\android\build\outputs\apk
call jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore catchfriends-release.keystore android-release-unsigned.apk catchfriends
call del CatchFriendsRelease.apk
call D:\Programmes\Android\android-sdk\build-tools\22.0.1\zipalign.exe -v 4 android-release-unsigned.apk CatchFriendsRelease.apk
pause