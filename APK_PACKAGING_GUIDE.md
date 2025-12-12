# 📦 AutoX.js Bot APK Packaging Guide

## Complete Step-by-Step Instructions for Cloud Phone Deployment

---

## 📋 Prerequisites

### Required Software

1. **AutoX.js App** (Latest version)

   - Download from: https://github.com/kkevsekk1/AutoX
   - OR search "AutoX.js" in app stores
   - **DO NOT** use Auto.js Pro (paid version - we use FREE version only)

2. **File Manager** (Any will work)

   - ES File Explorer
   - Solid Explorer
   - Built-in file manager

3. **Screenshot Tool** (if taking screenshots from cloud phone)
   - Built-in screenshot function
   - OR ADB over WiFi for desktop capture

---

## 🗂️ Step 1: Prepare Project Files

### 1.1 Create Folder Structure on Phone

Using your file manager, create these folders:

```
/sdcard/AutoXBot/
├── launcher.js          (from this project)
├── main.js             (from this project)
└── images/
    ├── tutorial/
    ├── rewards/
    ├── popups/
    ├── gameplay/
    └── errors/
```

### 1.2 Transfer Project Files

**Option A: Direct Transfer (Recommended)**

1. Copy `launcher.js` and `main.js` to `/sdcard/AutoXBot/`
2. Make sure both files are in the **same folder**

**Option B: Via ADB (If using PC)**

```bash
adb push launcher.js /sdcard/AutoXBot/
adb push main.js /sdcard/AutoXBot/
```

**Option C: Cloud Transfer**

1. Upload files to Google Drive / Dropbox
2. Download on cloud phone
3. Move to `/sdcard/AutoXBot/`

---

## 📸 Step 2: Capture & Import Screenshots

### 2.1 Take Game Screenshots

Refer to `SCREENSHOT_LIST.md` for complete list of required screenshots.

**Quick checklist:**

- ✅ Tutorial buttons (start, skip, confirm)
- ✅ Mail/gift icons
- ✅ Claim buttons
- ✅ Popup close buttons
- ✅ Combat UI (attack, skills)
- ✅ Error screens (network error, retry)

### 2.2 Organize Screenshots

Place screenshots in organized folders:

```
/sdcard/AutoXBot/images/
├── tutorial/
│   ├── btn_start.png
│   ├── btn_skip.png
│   └── btn_confirm.png
├── rewards/
│   ├── icon_mail.png
│   ├── btn_claim_all.png
│   └── icon_gift.png
├── popups/
│   ├── btn_close_x.png
│   └── btn_cancel.png
├── gameplay/
│   ├── btn_attack.png
│   └── joystick_base.png
└── errors/
    ├── text_network_error.png
    └── btn_retry.png
```

**💡 Tip:** Bot will search all subfolders automatically, so organization helps you manage files.

---

## 🏗️ Step 3: Test Bot Before Packaging

### 3.1 Open AutoX.js App

1. Launch AutoX.js on your device
2. Grant all permissions when prompted:
   - ✅ Storage access
   - ✅ Accessibility service
   - ✅ Display over other apps
   - ✅ Screen capture

### 3.2 Test launcher.js

1. In AutoX.js, tap **"📁 Files"** tab
2. Navigate to `/sdcard/AutoXBot/`
3. Tap on `launcher.js`
4. Tap **"▶ Run"** button

**Expected behavior:**

- Dark/green UI should appear
- Status shows "IDLE"
- Settings are visible
- No errors in console

### 3.3 Test Bot Functionality

1. In launcher UI, tap **"START"** button
2. Grant screen capture permission
3. Watch log panel for activity
4. Verify bot detects images correctly
5. Tap **"STOP"** when satisfied

**Troubleshooting:**

- ❌ "Image not found" errors → Check screenshot paths
- ❌ Screen capture fails → Restart AutoX.js and grant permission
- ❌ UI doesn't show → Check if `launcher.js` is in correct folder

---

## 📦 Step 4: Compile to APK

### 4.1 Open AutoX.js Build Menu

1. In AutoX.js app, open `launcher.js`
2. Tap the **"⋮"** (three dots) menu in top-right
3. Select **"More"** → **"Build"** or **"Package"**

**Note:** Menu location varies by AutoX.js version:

- Some versions: **"Project" → "Build APK"**
- Other versions: **"Tools" → "Package to APK"**

### 4.2 Configure Build Settings

Fill in the APK configuration form:

| Field             | Value                    | Notes                                            |
| ----------------- | ------------------------ | ------------------------------------------------ |
| **App Name**      | `AutoX RPG Bot`          | Displayed name on phone                          |
| **Package Name**  | `com.autox.rpgbot`       | Unique identifier (change `rpgbot` to your game) |
| **Version Name**  | `1.0.0`                  | User-facing version                              |
| **Version Code**  | `1`                      | Internal version number                          |
| **Main Script**   | `launcher.js`            | ⚠️ MUST be launcher.js, not main.js              |
| **Icon**          | (Optional)               | Use default or upload custom 512x512 PNG         |
| **ABI**           | `armeabi-v7a, arm64-v8a` | Select both for compatibility                    |
| **Include Files** | ☑️ **Check this!**       | Include `main.js` and `images/` folder           |

### 4.3 Select Additional Files

**CRITICAL:** You MUST include `main.js` and the `images/` folder:

1. When prompted "Include additional files?", tap **YES**
2. Check the following:
   - ☑️ `main.js`
   - ☑️ `images/` (entire folder)
3. Tap **"Build"** or **"Start Build"**

### 4.4 Build Process

AutoX.js will now compile your APK:

- ⏳ Build time: 1-5 minutes (depending on device)
- 📊 APK size: ~15-30 MB (includes AutoX.js runtime + your code)
- 💾 Output location: `/sdcard/AutoX/build/` or `/sdcard/Download/`

**Wait for "Build Successful" message!**

---

## 📲 Step 5: Install & Test APK

### 5.1 Install on Current Device

1. Open file manager
2. Navigate to `/sdcard/AutoX/build/` or `/sdcard/Download/`
3. Find `AutoX RPG Bot.apk` (or similar name)
4. Tap to install
5. Enable **"Install from Unknown Sources"** if prompted
6. Tap **"Install"**

### 5.2 First Launch Setup

1. Open the installed **"AutoX RPG Bot"** app
2. Grant permissions when prompted:
   - ✅ Storage access
   - ✅ Accessibility service (Settings → Accessibility → AutoX RPG Bot → Enable)
   - ✅ Display over other apps (Settings → Special Access → Display over apps → Allow)
   - ✅ Screen capture (will prompt on first START click)

### 5.3 Test on Current Device

1. Open your game in background
2. Open **AutoX RPG Bot** app
3. Configure settings
4. Tap **"START"**
5. Switch to game (bot runs in background)
6. Observe bot actions

**✅ Success indicators:**

- Bot detects UI elements
- Clicks buttons correctly
- Log shows activity
- No crashes

---

## ☁️ Step 6: Deploy to Cloud Phone

### 6.1 Transfer APK to Cloud Phone

**Method A: Cloud Storage (Recommended)**

1. Upload `AutoX RPG Bot.apk` to Google Drive / Dropbox
2. On cloud phone, download APK from cloud storage
3. Install APK

**Method B: Direct Upload (If cloud phone supports)**

1. Use cloud phone's file upload feature
2. Upload APK directly
3. Install via file manager

**Method C: HTTP Server**

1. On PC, start simple HTTP server:
   ```bash
   python -m http.server 8000
   ```
2. On cloud phone browser, visit: `http://YOUR_PC_IP:8000`
3. Download APK
4. Install

### 6.2 Install on Cloud Phone

1. Open file manager on cloud phone
2. Find downloaded APK
3. Tap to install
4. Enable **"Install from Unknown Sources"**
5. Complete installation

### 6.3 Configure Cloud Phone Settings

**Enable Accessibility (REQUIRED):**

1. Settings → Accessibility
2. Find **"AutoX RPG Bot"**
3. Toggle **ON**
4. Confirm permission

**Enable Display Over Apps (REQUIRED):**

1. Settings → Apps → Special Access
2. Tap **"Display over other apps"**
3. Find **"AutoX RPG Bot"**
4. Toggle **Allow**

**Enable Background Running:**

1. Settings → Battery
2. Battery Optimization → All Apps
3. Find **"AutoX RPG Bot"**
4. Select **"Don't optimize"**

**Disable Auto-Lock:**

1. Settings → Display
2. Sleep/Screen Timeout → **Never** (or 30 minutes)
3. This prevents cloud phone from sleeping

### 6.4 Transfer Screenshot Assets

**IMPORTANT:** Screenshots must be transferred to cloud phone!

**Option 1: Batch Transfer via ADB**

```bash
adb connect YOUR_CLOUD_PHONE_IP:5555
adb push /sdcard/AutoXBot/images/ /sdcard/AutoXBot/images/
```

**Option 2: Cloud Storage**

1. Zip the `images/` folder on original device
2. Upload to cloud storage
3. Download on cloud phone
4. Extract to `/sdcard/AutoXBot/images/`

**Option 3: Take Fresh Screenshots on Cloud Phone**

1. Launch game on cloud phone
2. Take all required screenshots (see `SCREENSHOT_LIST.md`)
3. Organize into `/sdcard/AutoXBot/images/` with subfolders

### 6.5 Launch Bot on Cloud Phone

1. Open your game
2. Let it load to main menu
3. Open **AutoX RPG Bot** app
4. Grant screen capture permission
5. Configure settings (if needed)
6. Tap **"START"**
7. Minimize app (bot runs in background)

**The bot will now run autonomously on the cloud phone!**

---

## 🎮 Step 7: Game-Specific Configuration

### 7.1 Find Your Game's Package Name

You need the game's package name to restart it when stuck.

**Method 1: Via AutoX.js Console**

1. Open AutoX.js app
2. Tap **"Console"** tab
3. Run this code:
   ```javascript
   auto.waitFor();
   sleep(5000); // Switch to game now
   var currentApp = currentPackage();
   toast("Package: " + currentApp);
   console.log("Package: " + currentApp);
   ```
4. Copy the package name (e.g., `com.example.game`)

**Method 2: Via Play Store**

1. Open Google Play Store
2. Search for your game
3. Open game page
4. Look at URL: `https://play.google.com/store/apps/details?id=com.example.game`
5. The `id=` part is the package name

### 7.2 Update main.js with Package Name

Edit line in `main.js` (around line 700):

```javascript
// Find this line:
function restartGame(packageName = "com.your.game.package") {

// Replace with your game's package:
function restartGame(packageName = "com.example.actualgame") {
```

**💡 Tip:** Rebuild APK after this change.

### 7.3 Adjust Detection Thresholds

If bot can't find images on cloud phone due to compression:

Edit `main.js` around line 50:

```javascript
const DEFAULT_CONFIG = {
  // ... other settings ...
  imageThreshold: 0.75, // ← Lower to 0.65 if images not detected
  imageSimilarity: 0.7, // ← Lower to 0.6 for more fuzzy matching
  // ...
};
```

**Lower values = more lenient detection (but more false positives)**

---

## 🔧 Step 8: Advanced Optimization

### 8.1 Reduce APK Size

If APK is too large (>30 MB):

1. Remove unused screenshots from `images/` folder
2. Keep only "normal" variants, skip blur/dim versions
3. Compress PNG files:
   - Use tools like TinyPNG (https://tinypng.com)
   - Or compress on-device with image editor
4. Rebuild APK

### 8.2 Add Floating Widget (Optional)

Edit `launcher.js` to add floating start/stop button:

```javascript
// Add after line 390 (before main startup code):

// Create floating window
var window = floaty.window(
  <button id="floatBtn" text="▶" textColor="#00ff88" bg="#1a1f3a" />
);
window.setPosition(device.width - 100, device.height / 2);

window.floatBtn.on("click", () => {
  if (isRunning) {
    ui.btnStop.click();
  } else {
    ui.btnStart.click();
  }
});
```

This adds a floating button for quick control without opening UI.

### 8.3 Auto-Start on Boot (Advanced)

Edit `launcher.js` to auto-start bot when cloud phone reboots:

```javascript
// Add at end of file:
events.observeBroadcast("android.intent.action.BOOT_COMPLETED");
events.on("boot_completed", function () {
  sleep(30000); // Wait 30s for system to stabilize
  launchApp("com.example.yourgame"); // Launch game
  sleep(15000); // Wait for game to load
  ui.btnStart.click(); // Auto-start bot
});
```

**Note:** Requires system-level permissions (root or system app).

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### ❌ APK Build Fails

**Error:** "Build failed" or "Invalid main script"

**Solution:**

1. Ensure `launcher.js` is selected as main script (NOT `main.js`)
2. Check both files have no syntax errors
3. Make sure files are in same folder
4. Try clearing AutoX.js app cache and rebuilding

---

#### ❌ Screen Capture Permission Denied

**Error:** "Screen capture not available" in logs

**Solution:**

1. Uninstall APK
2. Reinstall APK
3. On first "START" click, grant permission
4. If still fails, go to Settings → Apps → AutoX RPG Bot → Permissions → Allow all

---

#### ❌ Images Not Found

**Error:** "Image not found: btn_start.png" in logs

**Solution:**

1. Verify images are in `/sdcard/AutoXBot/images/`
2. Check filenames match exactly (case-sensitive!)
3. Ensure images are PNG format (not JPG)
4. Try taking new screenshots at 720p resolution
5. Test individual image detection with AutoX.js console:
   ```javascript
   var img = images.read("/sdcard/AutoXBot/images/tutorial/btn_start.png");
   if (img) {
     toast("Image loaded!");
     img.recycle();
   } else {
     toast("Image NOT found!");
   }
   ```

---

#### ❌ Bot Doesn't Click Correctly

**Error:** Bot detects images but clicks wrong locations

**Solution:**

1. Check game resolution matches bot resolution (720x1280)
2. If game is different resolution, edit `main.js` line 10:
   ```javascript
   setScreenMetrics(YOUR_WIDTH, YOUR_HEIGHT);
   ```
3. Take new screenshots at correct resolution
4. Adjust detection threshold (lower value = more lenient)

---

#### ❌ Bot Stops After Few Minutes

**Error:** Bot runs then suddenly stops

**Solution:**

1. Disable battery optimization (see Step 6.3)
2. Disable cloud phone auto-sleep
3. Check if cloud phone killed background process
4. Add persistent notification (keeps app alive):
   ```javascript
   // Add to main.js after line 50:
   var notification = new android.app.Notification.Builder(context)
     .setContentTitle("AutoX Bot Running")
     .setContentText("Bot is active")
     .setSmallIcon(android.R.drawable.ic_menu_compass)
     .build();
   ```

---

#### ❌ Game Restarts Don't Work

**Error:** `restartGame()` doesn't relaunch game

**Solution:**

1. Verify package name is correct (see Step 7.1)
2. Replace `launchApp()` with `app.launch()`:
   ```javascript
   app.launch(packageName);
   ```
3. Or use intent-based launch:
   ```javascript
   var intent = context
     .getPackageManager()
     .getLaunchIntentForPackage(packageName);
   if (intent) {
     context.startActivity(intent);
   }
   ```

---

#### ❌ Cloud Phone Lag/Stutter

**Error:** Bot runs slowly or skips frames

**Solution:**

1. Enable **Slow Mode** in bot settings
2. Increase loop delay to 5-10 minutes
3. Lower image detection quality (increase threshold)
4. Reduce number of screenshots (keep only essential ones)
5. Use lower cloud phone graphics settings
6. Upgrade cloud phone plan (more CPU/RAM)

---

## 📊 Performance Tips

### For Best Results on Cloud Phones:

1. **Use 720p resolution** for both screenshots and cloud phone
2. **Enable blur variants** for screenshots (helps with compression)
3. **Lower detection thresholds** to 0.65-0.70 for lenient matching
4. **Increase delays** by 50% compared to physical devices
5. **Disable game graphics** (lowest quality) to reduce lag
6. **Use dedicated cloud phone** (not shared CPU instances)
7. **Monitor during first hour** to catch any detection issues

---

## 🚀 Final Checklist

Before deploying to cloud phone, verify:

- ✅ APK builds successfully
- ✅ All screenshots in correct folders
- ✅ Bot detects images on test device
- ✅ Start/Stop buttons work
- ✅ Settings save correctly
- ✅ Game package name is correct in code
- ✅ Accessibility & overlay permissions granted
- ✅ Battery optimization disabled
- ✅ Cloud phone resolution matches screenshots
- ✅ Bot runs for at least 30 minutes without crashing

---

## 📞 Support & Updates

### If You Need Help:

1. Check AutoX.js documentation: https://github.com/kkevsekk1/AutoX
2. Review `SCREENSHOT_LIST.md` for image requirements
3. Test bot on physical device first before cloud deployment
4. Use AutoX.js console to debug image detection issues
5. Check cloud phone logs: Settings → Developer Options → Bug Report

### Updating the Bot:

1. Edit `launcher.js` or `main.js`
2. Save changes
3. Open AutoX.js app
4. Rebuild APK (Step 4)
5. Uninstall old APK
6. Install new APK
7. Redeploy to cloud phones

---

## 🎉 You're Done!

Your AutoX.js bot is now:

- ✅ Compiled into standalone APK
- ✅ Running 100% on cloud phone
- ✅ No PC required
- ✅ Fully autonomous

**Enjoy your automated gaming!** 🎮⚡

---

## 📄 License & Credits

This project uses:

- **AutoX.js** - Free open-source automation framework
- No paid plugins or Pro features
- 100% community-driven

**Attribution:** If you share this bot, please credit AutoX.js project.

---

**Last Updated:** December 2025  
**Compatible with:** AutoX.js v6.x and newer  
**Tested on:** VMOS Pro, Redfinger Cloud Phone, Android 7.0+
