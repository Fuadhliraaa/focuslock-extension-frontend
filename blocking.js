document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // 🧠 LOAD GOALS
  // ===============================
  chrome.storage.local.get(["goals"], (data) => {
    const goal = data.goals?.mainGoal || "No goal set";
    const reason = data.goals?.reason || "No reason set";

    document.getElementById("goal").textContent = goal;
    document.getElementById("reason").textContent = reason;
  });

  const overrideBtn = document.getElementById("overrideBtn");

  overrideBtn.addEventListener("click", () => {

    const today = new Date().toISOString().split("T")[0];

    chrome.storage.local.get(["overrideUsage"], (data) => {

      let usage = data.overrideUsage || {
        count: 0,
        lastResetDate: today
      };

      // Reset kalau hari baru
      if (usage.lastResetDate !== today) {
        usage.count = 0;
        usage.lastResetDate = today;
      }

      // Limit tercapai
      if (usage.count >= 3) {
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

      usage.count += 1;

      const now = Date.now();

      chrome.storage.local.set({
        override: {
          active: true,
          startTime: now
        },
        overrideUsage: usage
      }, () => {

        chrome.storage.local.get(["lastBlockedUrl"], (data) => {
          const targetUrl = data.lastBlockedUrl || "https://youtube.com";
          window.location.href = targetUrl;
        });

      });

    });

  });

});