# 📸 Required Screenshots for AutoX.js Bot

## 🎯 Screenshot Specifications

**Recommended Resolution:** 720x1280 (720p) - Most compatible with cloud phones  
**Format:** PNG (with transparency where possible)  
**Save Location:** `/sdcard/AutoXBot/images/`  
**Color Space:** RGB

---

## 📋 Complete Asset List

### 🎮 Tutorial & Initial Screens

#### 1. `btn_start.png`

**Purpose:** Main tutorial/game start button  
**Description:** Usually a large green/blue button with "START" or "开始" text  
**Variants Needed:**

- `btn_start.png` (normal quality)
- `btn_start_blur.png` (slightly blurred for cloud phone compression)
- `btn_start_dim.png` (50% opacity for dimmed states)

**How to capture:**

1. Launch game fresh
2. Wait for first tutorial screen
3. Screenshot just the button area (or full screen, bot will find it)

---

#### 2. `btn_skip.png`

**Purpose:** Skip button during cutscenes/tutorials  
**Description:** Usually top-right corner, text like "SKIP" or "跳过"  
**Variants:** Standard (normal, blur, dim)

**Common locations:** Top-right, bottom-right corners

---

#### 3. `btn_confirm.png` / `btn_ok.png`

**Purpose:** Generic confirmation buttons  
**Description:** Blue/green buttons with "OK", "确定", "CONFIRM"  
**Variants:** Standard (normal, blur, dim)

**Note:** Capture multiple if game has different OK button styles

---

### 📬 Daily Rewards & Claims

#### 4. `icon_mail.png`

**Purpose:** Mail/inbox icon on main UI  
**Description:** Envelope icon, usually has red notification dot  
**Variants:**

- `icon_mail.png` (no notification)
- `icon_mail_notify.png` (with red dot)
- Both with blur/dim variants

**Location:** Usually top-left or bottom-right toolbar

---

#### 5. `btn_claim_all.png`

**Purpose:** "Claim All" button inside mail screen  
**Description:** Large button, often gold/orange with "CLAIM ALL" or "一键领取"  
**Variants:** Standard (normal, blur, dim)

---

#### 6. `icon_gift.png` / `icon_event.png`

**Purpose:** Daily login rewards, event center icons  
**Description:** Gift box or star icon with notification badge  
**Variants:** With and without notification badge, plus blur/dim

---

#### 7. `btn_claim.png`

**Purpose:** Single claim button (not "claim all")  
**Description:** Smaller than claim_all, text "CLAIM" or "领取"  
**Variants:** Standard (normal, blur, dim)

---

### ❌ Popup & Ad Handling

#### 8. `btn_close_x.png`

**Purpose:** Generic X close button for popups  
**Description:** Small X icon, usually white or gray in circle  
**Variants:**

- `btn_close_x.png` (white)
- `btn_close_x_dark.png` (dark/gray)
- Both with blur variants

**Size:** Capture at least 50x50 pixel area around X

---

#### 9. `popup_background.png`

**Purpose:** Detect popup overlay (darkened background)  
**Description:** Semi-transparent dark overlay when popup appears  
**Variants:** Just normal and blur

**Tip:** Capture center of screen when popup is visible

---

#### 10. `btn_cancel.png`

**Purpose:** Cancel/close buttons at popup bottom  
**Description:** Gray or red button with "CANCEL", "取消", "CLOSE"  
**Variants:** Standard (normal, blur, dim)

---

### 🎮 Gameplay Elements

#### 11. `joystick_base.png`

**Purpose:** Virtual joystick on screen  
**Description:** Circular base of movement joystick (usually bottom-left)  
**Variants:** Normal and blur only

**Note:** If joystick is invisible until touch, capture when it appears

---

#### 12. `btn_attack.png`

**Purpose:** Main attack button  
**Description:** Large circular button, usually red, bottom-right  
**Variants:** Standard (normal, blur, dim)

---

#### 13. `btn_skill_1.png`, `btn_skill_2.png`, `btn_skill_3.png`

**Purpose:** Skill buttons for combat  
**Description:** Smaller circular buttons near attack button  
**Variants:** Normal and blur for each

---

#### 14. `icon_auto_battle.png`

**Purpose:** Auto-combat toggle button  
**Description:** "AUTO" text or circular arrow icon  
**Variants:**

- `icon_auto_battle_off.png` (grayed out)
- `icon_auto_battle_on.png` (highlighted)
- Both with blur variants

---

### 🚨 Error & Recovery Screens

#### 15. `text_network_error.png`

**Purpose:** Detect network error popups  
**Description:** Screenshot area with "Network Error", "连接失败", "Connection Lost"  
**Variants:** Normal and blur

**Tip:** Capture just the text area (100-200px wide)

---

#### 16. `btn_retry.png` / `btn_reconnect.png`

**Purpose:** Retry/reconnect buttons on error screens  
**Description:** Blue/green button with "RETRY", "重试", "RECONNECT"  
**Variants:** Standard (normal, blur, dim)

---

#### 17. `loading_icon.png`

**Purpose:** Detect stuck loading screens  
**Description:** Spinning circle/wheel or "Loading..." text  
**Variants:** Normal and blur

---

#### 18. `black_screen.png`

**Purpose:** Detect black/frozen screens  
**Description:** Pure black 100x100 pixel area  
**Variants:** Just one pure black image

**Note:** Bot will use this to detect crashes

---

### 🏆 Game-Specific Elements

#### 19. `menu_icon.png`

**Purpose:** Main menu button (hamburger or gear icon)  
**Description:** Three lines or gear icon, usually top-left/right  
**Variants:** Normal and blur

---

#### 20. `btn_back.png`

**Purpose:** Back button in menus  
**Description:** Left arrow or "BACK" text  
**Variants:** Standard (normal, blur, dim)

---

#### 21. `icon_quest.png`

**Purpose:** Quest/mission tracker icon  
**Description:** Exclamation mark or scroll icon  
**Variants:** With/without notification + blur

---

#### 22. `btn_collect_resources.png`

**Purpose:** Collect resources button (mines, farms, etc.)  
**Description:** Hand icon or "COLLECT" text  
**Variants:** Standard (normal, blur, dim)

---

## 🎨 Cloud Phone Optimization Tips

### Blur Variant Creation

1. Open original image in any editor (Paint.NET, GIMP, Photoshop)
2. Apply Gaussian Blur: 1-2 pixel radius
3. Reduce quality: Save as PNG with 85% quality
4. Name with `_blur` suffix

### Dim Variant Creation

1. Open original image
2. Reduce brightness by 30%
3. Reduce opacity/alpha to 50% if has transparency
4. Name with `_dim` suffix

### Half-Opacity Variant (Optional)

1. Open original image
2. Set overall opacity to 50%
3. Name with `_half` suffix

---

## 📁 Final File Structure

```
/sdcard/AutoXBot/images/
├── tutorial/
│   ├── btn_start.png
│   ├── btn_start_blur.png
│   ├── btn_start_dim.png
│   ├── btn_skip.png
│   ├── btn_skip_blur.png
│   └── ...
├── rewards/
│   ├── icon_mail.png
│   ├── icon_mail_blur.png
│   ├── icon_mail_notify.png
│   ├── btn_claim_all.png
│   └── ...
├── popups/
│   ├── btn_close_x.png
│   ├── btn_close_x_blur.png
│   ├── btn_close_x_dark.png
│   └── ...
├── gameplay/
│   ├── joystick_base.png
│   ├── btn_attack.png
│   ├── btn_skill_1.png
│   └── ...
└── errors/
    ├── text_network_error.png
    ├── btn_retry.png
    ├── loading_icon.png
    └── black_screen.png
```

---

## 🚀 Quick Capture Workflow

1. **Install ADB Screenshot Tool** or use cloud phone built-in screenshot
2. **Launch game** and navigate to each screen
3. **Take screenshots** of UI elements at 720p resolution
4. **Crop images** to just the button/icon area (recommend 100-200px around element)
5. **Create variants** using blur/dim techniques above
6. **Transfer to** `/sdcard/AutoXBot/images/` on cloud phone
7. **Organize** into subfolders as shown above

---

## ⚠️ Important Notes

- **Always capture at same resolution** you'll run bot (720p recommended)
- **Crop tightly** around elements - smaller images = faster detection
- **Test on cloud phone first** - compression may require different thresholds
- **Create variants gradually** - start with normal versions, add blur/dim if detection fails
- **Name consistently** - bot code uses exact filenames

---

## 📊 Total Images Estimate

- **Minimum:** 22 base images × 2 variants (normal + blur) = **44 images**
- **Recommended:** 22 base × 3 variants (normal + blur + dim) = **66 images**
- **Maximum (thorough):** ~30 unique elements × 3 variants = **90 images**

Start with normal variants first, test the bot, then add blur/dim variants where detection fails.
