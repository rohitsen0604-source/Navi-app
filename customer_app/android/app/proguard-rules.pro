# Flutter Proguard Rules for Release Builds
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep models and serialized classes
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Socket.IO / WebSockets / OkHttp
-dontwarn okio.**
-dontwarn okhttp3.**
-dontwarn io.socket.**
-keep class io.socket.** { *; }
-keep class okhttp3.** { *; }
