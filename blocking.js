console.log("BLOCKING JS LOADED");

chrome.storage.local.get(["goals"], (data) => {

  const goal = data.goals?.mainGoal || "No goal set";
  const reason = data.goals?.reason || "No reason set";

  document.getElementById("goal").textContent = goal;
  document.getElementById("reason").textContent = reason;

});

// Handle override button
document.getElementById("overrideBtn").addEventListener("click", () => {

  const now = Date.now();

  chrome.storage.local.set({
    override: {
      active: true,
      startTime: now
    }
  }, () => {
    console.log("Override activated");
    setTimeout(() => {
      window.history.back();
    }, 100);
  });

});

document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("overrideBtn");

  btn.addEventListener("click", () => {

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    console.log("Today's date:", today);

    chrome.storage.local.get(["overrideUsage"], (data) => {

      let usage = data.overrideUsage || {
        count: 0,
        lastResetDate: today
      };

      // 🔄 Reset kalau hari baru
      if (usage.lastResetDate !== today) {
        usage.count = 0;
        usage.lastResetDate = today;
      }

      // ❌ Kalau sudah 3x
      if (usage.count >= 3) {

        console.log("Override limit reached - force disable");

        chrome.storage.local.set({
          override: {
            active: false,
            startTime: null
          }
        }, () => {
          alert("Override limit reached today!");
        });

        return;
      }

      // ✅ Tambah usage
      usage.count += 1;

      const now = Date.now();

      chrome.storage.local.set({
        override: {
          active: true,
          startTime: now
        },
        overrideUsage: usage
      }, () => {

        console.log("Override used:", usage.count);

        chrome.storage.local.get(["lastBlockedUrl"], (data) => {
          const targetUrl = data.lastBlockedUrl || "https://youtube.com";
          window.location.href = targetUrl;
        });

      });

    });

  });

});

document.getElementById("resetBtn").addEventListener("click", () => {

  const today = new Date().toISOString().split("T")[0];

  chrome.storage.local.set({
    overrideUsage: {
      count: 0,
      lastResetDate: today
    },
    override: {
      active: false,
      startTime: null
    }
  }, () => {
    alert("Reset berhasil!");
  });

});