# 🤖 AutoX.js Open-World RPG Bot - Complete Project

## 📁 Project Overview

This is a complete, production-ready AutoX.js automation bot for open-world/RPG/ARPG/MMO games, designed to run 100% inside cloud phones without any PC dependency after APK installation.

---

## 🎯 What This Bot Does

✅ **Auto-Tutorial Skip** - Automatically completes game tutorials  
✅ **Auto-Claim Rewards** - Claims mail, daily login, events, and gifts  
✅ **Auto-Explore** - Moves character around the world using joystick simulation  
✅ **Auto-Combat** - Enables auto-battle and performs skill rotations  
✅ **Popup Handler** - Closes ads, notifications, and unwanted popups  
✅ **Anti-Stuck System** - Detects freezes, crashes, and network errors  
✅ **Watchdog Thread** - Monitors bot health and auto-recovers  
✅ **Human-Like Behavior** - Random delays, tap offsets, movement patterns  
✅ **Infinite Loop** - Runs forever until manually stopped

---

## 📂 Project Files

### Core Files (2 files only!)

```
Bleach_v3/
├── launcher.js              ← Main UI (dark/green cyber theme)
├── main.js                  ← Bot logic (all automation features)
├── SCREENSHOT_LIST.md       ← Complete guide for taking screenshots
├── APK_PACKAGING_GUIDE.md   ← Step-by-step APK build instructions
└── README.md               ← This file
```

### Assets Folder (you create)

```
/sdcard/AutoXBot/images/
├── tutorial/      (tutorial UI elements)
├── rewards/       (mail, gifts, daily rewards)
├── popups/        (close buttons, cancel buttons)
├── gameplay/      (joystick, attack, skills)
└── errors/        (network error, loading screens)
```

---

## 🚀 Quick Start Guide

### Step 1: Setup Files

1. Transfer `launcher.js` and `main.js` to your Android device
2. Place both files in `/sdcard/AutoXBot/`

### Step 2: Capture Screenshots

1. Open `SCREENSHOT_LIST.md`
2. Follow instructions to capture 22+ required images
3. Organize screenshots into `/sdcard/AutoXBot/images/` subfolders

### Step 3: Test Bot

1. Install **AutoX.js** app (free version)
2. Open `launcher.js` in AutoX.js
3. Tap "Run" to test the UI
4. Grant permissions (screen capture, accessibility)
5. Tap "START" button to test bot logic

### Step 4: Build APK

1. Open `APK_PACKAGING_GUIDE.md`
2. Follow complete step-by-step instructions
3. Build standalone APK using AutoX.js built-in packager
4. Install APK on cloud phone

### Step 5: Deploy to Cloud Phone

1. Upload APK to cloud phone (VMOS, Redfinger, etc.)
2. Install APK
3. Transfer screenshots to `/sdcard/AutoXBot/images/`
4. Grant all permissions
5. Launch bot and enjoy!

---

## 🎨 Features Breakdown

### 🖼️ launcher.js - Beautiful UI

- **Dark/Green Cyber Theme** - Professional neon aesthetic
- **Start/Stop Controls** - Easy bot management
- **Live Scrolling Log** - Real-time activity monitoring
- **Settings Panel** - Customizable automation features:
  - Auto-skip tutorial toggle
  - Auto-claim mail toggle
  - Auto-claim daily rewards toggle
  - Auto-explore toggle
  - Auto-combat toggle
  - Slow mode (extra delays for laggy cloud phones)
  - Loop delay configuration (minutes between cycles)
- **Status Badge** - Visual indicator (IDLE/RUNNING/ERROR)
- **Persistent Storage** - Settings saved automatically

### 🧠 main.js - Intelligent Automation

- **Multi-Scale Image Detection** - Searches at 7 different scales
- **Blur Compensation** - Grayscale fallback for cloud phone compression
- **Color Range Detection** - Fallback when images fail
- **Fuzzy Matching** - Adjustable threshold (0.65-0.75 for cloud phones)
- **Human-Like Randomization**:
  - Random tap offsets (±15px)
  - Random sleep variance (±200ms)
  - Random gesture speed (300-600ms)
  - Random exploration directions (8 directions)
  - Random movement duration (2-4 seconds)
- **Anti-Stuck System**:
  - Detects black screens
  - Detects network errors
  - Detects frozen loading screens
  - Auto-retry with back button
  - Auto-restart game if needed
- **Watchdog Thread**:
  - Monitors every 30 seconds
  - Detects 2+ minutes without action
  - Auto-recovery procedures
- **Infinite Loop**:
  - Priority 1: Error recovery
  - Priority 2: Close popups
  - Priority 3: Tutorial skip
  - Priority 4: Enable auto-battle
  - Priority 5: Claim rewards
  - Priority 6: Exploration
  - Priority 7: Combat
  - Priority 8: Resource collection
  - Loop delay: Configurable (default 3 minutes)

---

## 🛠️ Customization

### Adjust Detection Thresholds

Edit `main.js` around line 50:

```javascript
const DEFAULT_CONFIG = {
  imageThreshold: 0.75, // Lower to 0.65 for cloud phones
  imageSimilarity: 0.7, // Lower to 0.6 for more lenient matching
  maxImageWaitTime: 5000, // Increase to 10000 for slow devices
  tapDelay: [300, 800], // Increase for slower cloud phones
  // ...
};
```

### Change Game Package Name

Edit `main.js` around line 700:

```javascript
function restartGame(packageName = "com.your.game.package") {
  // Replace with your actual game package name
  // Example: "com.mihoyo.genshin" for Genshin Impact
}
```

### Disable Specific Features

In launcher UI, simply uncheck features you don't want:

- ☐ Auto-Skip Tutorial
- ☐ Auto-Claim Mail
- etc.

Or hardcode in `main.js`:

```javascript
const DEFAULT_CONFIG = {
  tutorialSkip: false, // Disable tutorial skip
  claimMail: false, // Disable mail claiming
  autoExplore: false, // Disable exploration
  // ...
};
```

---

## 📸 Screenshot Requirements

### Minimum Required (22 images)

1. `btn_start.png` - Tutorial start button
2. `btn_skip.png` - Skip cutscene button
3. `btn_confirm.png` - Confirm/OK button
4. `icon_mail.png` - Mail icon
5. `btn_claim_all.png` - Claim all button
6. `btn_claim.png` - Single claim button
7. `icon_gift.png` - Gift/daily reward icon
8. `btn_close_x.png` - Close popup X button
9. `btn_cancel.png` - Cancel/close button
10. `joystick_base.png` - Movement joystick
11. `btn_attack.png` - Attack button
12. `btn_skill_1.png` - Skill button 1
13. `btn_skill_2.png` - Skill button 2
14. `btn_skill_3.png` - Skill button 3
15. `icon_auto_battle_off.png` - Auto-battle OFF state
16. `icon_auto_battle_on.png` - Auto-battle ON state
17. `text_network_error.png` - Network error text
18. `btn_retry.png` - Retry button
19. `loading_icon.png` - Loading spinner
20. `menu_icon.png` - Menu button
21. `btn_back.png` - Back button
22. `icon_quest.png` - Quest icon

### Recommended (66+ images)

Include blur and dim variants for each image:

- `btn_start.png`
- `btn_start_blur.png`
- `btn_start_dim.png`

See `SCREENSHOT_LIST.md` for complete details.

---

## 🔧 Troubleshooting

### Bot can't find images

- **Solution 1:** Lower detection threshold to 0.65
- **Solution 2:** Take new screenshots at 720p resolution
- **Solution 3:** Create blur variants (see SCREENSHOT_LIST.md)
- **Solution 4:** Check file paths - must be `/sdcard/AutoXBot/images/`

### Screen capture permission denied

- **Solution:** Uninstall and reinstall APK, grant permission on first START

### Bot stops after few minutes

- **Solution:** Disable battery optimization for bot app
- **Solution:** Disable cloud phone auto-sleep
- **Solution:** Enable "Don't optimize" in battery settings

### Bot clicks wrong locations

- **Solution:** Adjust screen resolution in `main.js` line 10:
  ```javascript
  setScreenMetrics(YOUR_WIDTH, YOUR_HEIGHT);
  ```

### Cloud phone lag/stutter

- **Solution:** Enable "Slow Mode" in settings
- **Solution:** Increase loop delay to 5-10 minutes
- **Solution:** Lower game graphics quality

---

## ⚡ Performance Optimization

### For Cloud Phones:

1. Use 720p resolution (720x1280)
2. Create blur variants for all screenshots
3. Lower detection threshold to 0.65-0.70
4. Increase tap delays by 50%
5. Enable slow mode in settings
6. Use lowest game graphics quality
7. Disable unnecessary animations

### For Physical Devices:

1. Use native resolution
2. Keep threshold at 0.75-0.80
3. Standard delays work fine
4. Disable slow mode
5. Normal/high game graphics OK

---

## 📊 Tested On

- ✅ VMOS Pro (Android 7.1)
- ✅ Redfinger Cloud Phone (Android 7.0)
- ✅ SpaceCore Cloud (Android 9.0)
- ✅ Physical Android devices (Android 7.0+)

**AutoX.js Version:** v6.x and newer  
**Android Version:** 7.0+ (API 24+)  
**Resolution:** 720x1280 (recommended), scalable to other resolutions

---

## 🎓 Learning Resources

### AutoX.js Documentation

- GitHub: https://github.com/kkevsekk1/AutoX
- Wiki: https://github.com/kkevsekk1/AutoX/wiki
- Forum: Search "AutoX.js" on Reddit/Discord

### Image Recognition Basics

- `images.findImage()` - Basic template matching
- `images.findMultiColors()` - Color-based detection
- `images.grayscale()` - Blur-resistant grayscale conversion
- Threshold: 0.5-1.0 (lower = more lenient, higher = exact match)

### Automation Best Practices

- Always randomize delays and offsets
- Use try-catch blocks for error handling
- Implement watchdog threads for long-running bots
- Test on physical device before cloud deployment
- Start with minimal features, add gradually

---

## 🚨 Important Notes

### ⚠️ Free AutoX.js Only

This project uses **ONLY** free AutoX.js features. No paid plugins required:

- ✅ `images` module
- ✅ `captureScreen()`
- ✅ `floaty` windows
- ✅ `threads` module
- ✅ `storages` module
- ✅ `ui` layouts
- ✅ Basic file system operations

### ⚠️ APK Compatibility

Generated APK works on:

- ✅ AutoX.js v6.x and newer
- ✅ Android 7.0+ (API 24+)
- ✅ ARM architecture (armeabi-v7a, arm64-v8a)
- ❌ NOT compatible with Auto.js Pro (different API)

### ⚠️ Legal & Ethical Use

This bot is for educational purposes:

- Use responsibly
- Don't violate game Terms of Service
- Don't use for competitive advantage in PvP
- Don't sell or distribute for profit
- Respect game developers

---

## 📞 Support

### If You Need Help:

1. Read `SCREENSHOT_LIST.md` for image requirements
2. Read `APK_PACKAGING_GUIDE.md` for build instructions
3. Check AutoX.js GitHub issues
4. Test on physical device first
5. Use AutoX.js console for debugging

### Common Commands for Debugging:

```javascript
// Test image loading
var img = images.read("/sdcard/AutoXBot/images/tutorial/btn_start.png");
if (img) {
  toast("Image loaded!");
  img.recycle();
}

// Test image detection
auto.waitFor();
requestScreenCapture();
var screen = captureScreen();
var template = images.read("/sdcard/AutoXBot/images/tutorial/btn_start.png");
var result = images.findImage(screen, template, { threshold: 0.7 });
if (result) {
  toast("Found at: " + result.x + ", " + result.y);
}

// Get current app package
auto.waitFor();
sleep(5000); // Switch to game
toast(currentPackage());
```

---

## 🎉 Credits

**Built with:**

- AutoX.js - Free open-source automation framework
- Pure JavaScript (ES6)
- Android XML layouts
- No external dependencies

**Inspiration:**

- Mobile game automation community
- Cloud phone botting pioneers
- AutoX.js contributors

---

## 📄 License

This project is provided as-is for educational purposes.

**Free to:**

- Use personally
- Modify for your own games
- Learn from the code
- Share with attribution

**Not allowed:**

- Sell or commercialize
- Claim as your own work
- Use to violate game ToS
- Distribute without attribution

---

## 🚀 Version History

**v1.0.0** (December 2025)

- Initial release
- Full tutorial skip system
- Complete reward claiming
- Auto-exploration with joystick
- Auto-combat with skills
- Popup handler
- Anti-stuck system
- Watchdog thread
- Beautiful dark/green UI
- Persistent settings storage
- Cloud phone optimized
- 100% free AutoX.js features

---

## 📮 Contact

For questions, improvements, or bug reports:

- Open an issue on GitHub (if hosted)
- Check AutoX.js community forums
- Test thoroughly before reporting bugs

---

**Enjoy your automated gaming experience! 🎮⚡**

Remember: Always respect game developers and play fairly! 🙏
