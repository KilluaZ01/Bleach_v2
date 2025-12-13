/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  🤖 AutoX.js RPG/Open-World Game Bot Launcher [FIXED & STABLE]
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  ✅ Fixed Issues:
 *    - Single entry point enforcement
 *    - Safe thread management with proper cleanup
 *    - Global scope hygiene (no redeclarations)
 *    - Proper module loading pattern
 *    - UI responsiveness maintained
 *    - Cloud phone stability enhancements
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

"ui";

// ═══════════════════════════════════════════════════════════════════════
// 🎨 GLOBAL STYLING & THEME
// ═══════════════════════════════════════════════════════════════════════

const THEME = {
  bg_dark: "#0a0e27", // Deep dark blue
  bg_card: "#1a1f3a", // Card background
  accent_green: "#00ff88", // Neon green
  accent_red: "#ff3366", // Error red
  accent_yellow: "#ffcc00", // Warning yellow
  text_primary: "#e0e6ed", // Light text
  text_secondary: "#8892b0", // Dim text
  border: "#2d3561", // Border color
};

// ═══════════════════════════════════════════════════════════════════════
// 🖼️ UI LAYOUT
// ═══════════════════════════════════════════════════════════════════════

ui.statusBarColor(THEME.bg_dark);

ui.layout(
  <vertical bg="{{THEME.bg_dark}}" padding="0">
    {/* ━━━ Header Bar ━━━ */}
    <linear
      bg="{{THEME.bg_card}}"
      w="*"
      h="70"
      gravity="center_vertical"
      padding="16 0"
    >
      <text text="🤖" textSize="28sp" marginLeft="16" />
      <text
        text="AutoX Bot"
        textColor="{{THEME.accent_green}}"
        textSize="22sp"
        textStyle="bold"
        marginLeft="12"
        layout_weight="1"
      />

      {/* Status Badge */}
      <card
        cardBackgroundColor="{{THEME.bg_dark}}"
        cardCornerRadius="20dp"
        marginRight="16"
        h="40"
        w="auto"
        cardElevation="0dp"
      >
        <text
          id="statusBadge"
          text="IDLE"
          textColor="{{THEME.text_secondary}}"
          textSize="14sp"
          textStyle="bold"
          gravity="center"
          paddingLeft="16"
          paddingRight="16"
        />
      </card>
    </linear>

    {/* ━━━ Main Content ━━━ */}
    <scroll layout_weight="1">
      <vertical padding="16" space="16">
        {/* ━━━ Control Panel Card ━━━ */}
        <card
          cardBackgroundColor="{{THEME.bg_card}}"
          cardCornerRadius="12dp"
          w="*"
          cardElevation="4dp"
        >
          <vertical padding="20" space="12">
            <text
              text="🎮 Control Panel"
              textColor="{{THEME.text_primary}}"
              textSize="18sp"
              textStyle="bold"
            />

            <horizontal space="12" w="*">
              {/* Start Button */}
              <card
                id="btnStartCard"
                cardBackgroundColor="{{THEME.accent_green}}"
                cardCornerRadius="8dp"
                w="0"
                layout_weight="1"
                h="55"
                cardElevation="3dp"
              >
                <button
                  id="btnStart"
                  text="▶ START"
                  bg="{{THEME.accent_green}}"
                  textColor="#000000"
                  textSize="16sp"
                  textStyle="bold"
                  w="*"
                  h="*"
                  style="Widget.AppCompat.Button.Borderless"
                />
              </card>

              {/* Stop Button */}
              <card
                id="btnStopCard"
                cardBackgroundColor="{{THEME.accent_red}}"
                cardCornerRadius="8dp"
                w="0"
                layout_weight="1"
                h="55"
                cardElevation="3dp"
              >
                <button
                  id="btnStop"
                  text="◼ STOP"
                  bg="{{THEME.accent_red}}"
                  textColor="#ffffff"
                  textSize="16sp"
                  textStyle="bold"
                  w="*"
                  h="*"
                  style="Widget.AppCompat.Button.Borderless"
                />
              </card>
            </horizontal>
          </vertical>
        </card>

        {/* ━━━ Settings Card ━━━ */}
        <card
          cardBackgroundColor="{{THEME.bg_card}}"
          cardCornerRadius="12dp"
          w="*"
          cardElevation="4dp"
        >
          <vertical padding="20" space="10">
            <text
              text="⚙️ Bot Settings"
              textColor="{{THEME.text_primary}}"
              textSize="18sp"
              textStyle="bold"
            />

            <horizontal gravity="center_vertical">
              <checkbox
                id="chkTutorialSkip"
                text="Auto-Skip Tutorial"
                textColor="{{THEME.text_secondary}}"
                checked="true"
              />
            </horizontal>

            <horizontal gravity="center_vertical">
              <checkbox
                id="chkClaimMail"
                text="Auto-Claim Mail"
                textColor="{{THEME.text_secondary}}"
                checked="true"
              />
            </horizontal>

            <horizontal gravity="center_vertical">
              <checkbox
                id="chkClaimDaily"
                text="Auto-Claim Daily Rewards"
                textColor="{{THEME.text_secondary}}"
                checked="true"
              />
            </horizontal>

            <horizontal gravity="center_vertical">
              <checkbox
                id="chkAutoExplore"
                text="Auto-Explore (Movement)"
                textColor="{{THEME.text_secondary}}"
                checked="true"
              />
            </horizontal>

            <horizontal gravity="center_vertical">
              <checkbox
                id="chkAutoCombat"
                text="Auto-Combat"
                textColor="{{THEME.text_secondary}}"
                checked="true"
              />
            </horizontal>

            <horizontal gravity="center_vertical">
              <checkbox
                id="chkSlowMode"
                text="Slow Mode (Extra Delays)"
                textColor="{{THEME.text_secondary}}"
                checked="false"
              />
            </horizontal>

            <View
              bg="{{THEME.border}}"
              h="1"
              w="*"
              marginTop="8"
              marginBottom="8"
            />

            <horizontal gravity="center_vertical" space="8">
              <text
                text="Loop Delay (min):"
                textColor="{{THEME.text_secondary}}"
                textSize="14sp"
                layout_weight="1"
              />
              <input
                id="inputLoopDelay"
                text="3"
                textColor="{{THEME.text_primary}}"
                bg="{{THEME.bg_dark}}"
                w="60"
                gravity="center"
                inputType="number"
                hint="3"
                hintTextColor="{{THEME.text_secondary}}"
              />
            </horizontal>
          </vertical>
        </card>

        {/* ━━━ Log Display Card ━━━ */}
        <card
          cardBackgroundColor="{{THEME.bg_card}}"
          cardCornerRadius="12dp"
          w="*"
          cardElevation="4dp"
        >
          <vertical padding="20" space="12">
            <horizontal gravity="center_vertical" w="*">
              <text
                text="📜 Live Log"
                textColor="{{THEME.text_primary}}"
                textSize="18sp"
                textStyle="bold"
                layout_weight="1"
              />
              <button
                id="btnClearLog"
                text="CLEAR"
                bg="{{THEME.bg_dark}}"
                textColor="{{THEME.accent_yellow}}"
                textSize="12sp"
                style="Widget.AppCompat.Button.Borderless"
                paddingLeft="12"
                paddingRight="12"
              />
            </horizontal>

            <card
              cardBackgroundColor="{{THEME.bg_dark}}"
              cardCornerRadius="8dp"
              w="*"
              h="300"
              cardElevation="0dp"
            >
              <scroll id="logScroll" w="*" h="*">
                <text
                  id="logText"
                  text="[System] Bot ready. Press START to begin.\n"
                  textColor="{{THEME.text_secondary}}"
                  textSize="13sp"
                  padding="12"
                  typeface="monospace"
                />
              </scroll>
            </card>
          </vertical>
        </card>

        {/* ━━━ Info Card ━━━ */}
        <card
          cardBackgroundColor="{{THEME.bg_card}}"
          cardCornerRadius="12dp"
          w="*"
          cardElevation="4dp"
          marginBottom="16"
        >
          <vertical padding="20" space="8">
            <text
              text="ℹ️ Information"
              textColor="{{THEME.text_primary}}"
              textSize="18sp"
              textStyle="bold"
            />
            <text
              text="• Ensure all screenshots are in /sdcard/AutoXBot/images/"
              textColor="{{THEME.text_secondary}}"
              textSize="12sp"
            />
            <text
              text="• Grant screen capture permission when prompted"
              textColor="{{THEME.text_secondary}}"
              textSize="12sp"
            />
            <text
              text="• Enable accessibility service for best performance"
              textColor="{{THEME.text_secondary}}"
              textSize="12sp"
            />
            <text
              text="• Bot will run in background - do not close app"
              textColor="{{THEME.text_secondary}}"
              textSize="12sp"
            />
          </vertical>
        </card>
      </vertical>
    </scroll>

    {/* ━━━ Footer ━━━ */}
    <linear bg="{{THEME.bg_card}}" w="*" h="50" gravity="center">
      <text
        text="Made with ⚡ AutoX.js | Cloud Phone Optimized"
        textColor="{{THEME.text_secondary}}"
        textSize="12sp"
      />
    </linear>
  </vertical>
);

// ═══════════════════════════════════════════════════════════════════════
// 💾 STORAGE & SETTINGS
// ═══════════════════════════════════════════════════════════════════════

const storage = storages.create("autox_bot_config");

// Load saved settings on startup
function loadSettings() {
  ui.chkTutorialSkip.checked = storage.get("tutorialSkip", true);
  ui.chkClaimMail.checked = storage.get("claimMail", true);
  ui.chkClaimDaily.checked = storage.get("claimDaily", true);
  ui.chkAutoExplore.checked = storage.get("autoExplore", true);
  ui.chkAutoCombat.checked = storage.get("autoCombat", true);
  ui.chkSlowMode.checked = storage.get("slowMode", false);
  ui.inputLoopDelay.setText(storage.get("loopDelay", "3").toString());
}

// Save settings on change
function saveSettings() {
  storage.put("tutorialSkip", ui.chkTutorialSkip.checked);
  storage.put("claimMail", ui.chkClaimMail.checked);
  storage.put("claimDaily", ui.chkClaimDaily.checked);
  storage.put("autoExplore", ui.chkAutoExplore.checked);
  storage.put("autoCombat", ui.chkAutoCombat.checked);
  storage.put("slowMode", ui.chkSlowMode.checked);
  storage.put("loopDelay", ui.inputLoopDelay.text());
  logInfo("Settings saved");
}

// Initialize settings
loadSettings();

// Auto-save settings on checkbox change
ui.chkTutorialSkip.on("check", saveSettings);
ui.chkClaimMail.on("check", saveSettings);
ui.chkClaimDaily.on("check", saveSettings);
ui.chkAutoExplore.on("check", saveSettings);
ui.chkAutoCombat.on("check", saveSettings);
ui.chkSlowMode.on("check", saveSettings);
ui.inputLoopDelay.on("text_changed", saveSettings);

// ═══════════════════════════════════════════════════════════════════════
// 📝 LOGGING SYSTEM (Thread-safe)
// ═══════════════════════════════════════════════════════════════════════

function getTimestamp() {
  const now = new Date();
  return now.toTimeString().substring(0, 8); // HH:MM:SS
}

function logInfo(msg) {
  const timestamp = getTimestamp();
  ui.run(() => {
    ui.logText.append(`[${timestamp}] [INFO] ${msg}\n`);
    ui.logScroll.fullScroll(android.widget.ScrollView.FOCUS_DOWN);
  });
  console.log(`[INFO] ${msg}`);
}

function logSuccess(msg) {
  const timestamp = getTimestamp();
  ui.run(() => {
    ui.logText.append(`[${timestamp}] [✓] ${msg}\n`);
    ui.logScroll.fullScroll(android.widget.ScrollView.FOCUS_DOWN);
  });
  console.log(`[SUCCESS] ${msg}`);
}

function logError(msg) {
  const timestamp = getTimestamp();
  ui.run(() => {
    ui.logText.append(`[${timestamp}] [✗ ERROR] ${msg}\n`);
    ui.logScroll.fullScroll(android.widget.ScrollView.FOCUS_DOWN);
  });
  console.error(`[ERROR] ${msg}`);
}

function logWarning(msg) {
  const timestamp = getTimestamp();
  ui.run(() => {
    ui.logText.append(`[${timestamp}] [⚠] ${msg}\n`);
    ui.logScroll.fullScroll(android.widget.ScrollView.FOCUS_DOWN);
  });
  console.warn(`[WARNING] ${msg}`);
}

// Clear log button
ui.btnClearLog.on("click", () => {
  ui.logText.setText("[System] Log cleared.\n");
});

// ═══════════════════════════════════════════════════════════════════════
// 🎮 BOT CONTROL - START/STOP (FIXED: Proper thread management)
// ═══════════════════════════════════════════════════════════════════════

let botThread = null;
let isRunning = false;

// Update status badge (thread-safe)
function updateStatus(status) {
  ui.run(() => {
    ui.statusBadge.setText(status);
    if (status === "RUNNING") {
      ui.statusBadge.setTextColor(colors.parseColor(THEME.accent_green));
    } else if (status === "ERROR") {
      ui.statusBadge.setTextColor(colors.parseColor(THEME.accent_red));
    } else if (status === "STOPPING") {
      ui.statusBadge.setTextColor(colors.parseColor(THEME.accent_yellow));
    } else {
      ui.statusBadge.setTextColor(colors.parseColor(THEME.text_secondary));
    }
  });
}

// START Button Click
ui.btnStart.on("click", () => {
  if (isRunning) {
    logWarning("Bot is already running!");
    return;
  }

  logInfo("Starting bot...");
  updateStatus("RUNNING");
  isRunning = true;

  // Clear stop flag
  storage.put("shouldStop", false);

  // Get current settings
  const config = {
    tutorialSkip: ui.chkTutorialSkip.checked,
    claimMail: ui.chkClaimMail.checked,
    claimDaily: ui.chkClaimDaily.checked,
    autoExplore: ui.chkAutoExplore.checked,
    autoCombat: ui.chkAutoCombat.checked,
    slowMode: ui.chkSlowMode.checked,
    loopDelay: parseInt(ui.inputLoopDelay.text()) || 3,
  };

  // Create logger object that will be passed to main.js
  const logger = {
    info: logInfo,
    success: logSuccess,
    error: logError,
    warning: logWarning,
  };

  // FIXED: Run bot in separate thread with proper error handling
  botThread = threads.start(function () {
    try {
      // CRITICAL FIX: Load main.js as a module, don't execute it
      const botModule = require("./main_FIXED.js");
      logError("Bot crashed: " + e.message);
      logError("Stack: " + e.stack);
      updateStatus("ERROR");
      isRunning = false;
    }
  });

  logSuccess("Bot started successfully!");
});

// STOP Button Click (FIXED: Proper cleanup)
ui.btnStop.on("click", () => {
  if (!isRunning) {
    logWarning("Bot is not running!");
    return;
  }

  logInfo("Stopping bot...");
  updateStatus("STOPPING");

  // CRITICAL FIX: Signal bot to stop gracefully
  storage.put("shouldStop", true);

  // Force stop thread after 5 seconds if still running
  setTimeout(() => {
    if (botThread && botThread.isAlive()) {
      botThread.interrupt();
      logWarning("Bot force stopped (thread interrupted)");
    }
    isRunning = false;
    updateStatus("IDLE");
    storage.put("shouldStop", false);
    logSuccess("Bot stopped successfully");
  }, 5000);
});

// ═══════════════════════════════════════════════════════════════════════
// 🛡️ PERMISSION CHECKS
// ═══════════════════════════════════════════════════════════════════════

// Request screen capture permission on startup
threads.start(function () {
  sleep(1000); // Wait for UI to load

  // Check if accessibility service is enabled
  if (!auto.service) {
    logWarning("Accessibility service NOT enabled!");
    logWarning("Please enable it manually in Settings → Accessibility");
  } else {
    logSuccess("Accessibility service enabled ✓");
  }

  // Request screen capture
  if (!images.requestScreenCapture()) {
    logError("Screen capture permission denied!");
    dialogs.alert(
      "Permission Required",
      "Screen capture permission is required for the bot to work. Please grant it in the next prompt."
    );
    images.requestScreenCapture(true); // Force request
  } else {
    logSuccess("Screen capture permission granted ✓");
  }
});

// ═══════════════════════════════════════════════════════════════════════
// 🚪 EXIT HANDLING
// ═══════════════════════════════════════════════════════════════════════

events.on("exit", function () {
  if (botThread && botThread.isAlive()) {
    storage.put("shouldStop", true);
    botThread.interrupt();
  }
  logInfo("App closed");
});

// Back button override - show exit confirmation
ui.emitter.on("back_pressed", (e) => {
  e.consumed = true; // Prevent default back action
  dialogs
    .confirm("Exit", "Are you sure you want to exit? The bot will stop.")
    .then((ok) => {
      if (ok) {
        if (botThread) {
          storage.put("shouldStop", true);
          botThread.interrupt();
        }
        ui.finish();
      }
    });
});

// ═══════════════════════════════════════════════════════════════════════
// 🎯 STARTUP MESSAGE
// ═══════════════════════════════════════════════════════════════════════

logInfo("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
logInfo("🤖 AutoX Bot Launcher v2.0 (FIXED)");
logInfo("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
logInfo("Launcher UI loaded successfully");
logInfo("Ensure images are in: /sdcard/AutoXBot/images/");
logInfo("Configure settings and press START to begin");
