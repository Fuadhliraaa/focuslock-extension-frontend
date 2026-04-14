// Debug biar kita tau service worker hidup
console.log("SERVICE WORKER RUNNING");

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    blockedSites: ["youtube.com", "tiktok.com"],
    goals: {
      mainGoal: "Build SaaS 1M USD Value",
      reason: "Financial Freedom n more time with family"
    }
  });
});

// Listener setiap tab berubah / load
chrome.webNavigation.onCompleted.addListener((details) => {

  if (details.frameId !== 0) return;

  chrome.tabs.get(details.tabId, (tab) => {

    if (!tab.url) return;

    console.log("NAVIGATION:", tab.url);

    // 🛑 Proteksi infinite loop
    if (tab.url.includes("blocking.html")) {
      return;
    }

    chrome.storage.local.get(["blockedSites"], (data) => {

      const blockedSites = data.blockedSites || [];

      let override = data.override;

      const now = Date.now();
      const durationLimit = 30 * 1000;

      // ===============================
      // 🧠 HANDLE OVERRIDE
      // ===============================
      if (override?.active) {
        const duration = now - override.startTime;

        if (duration < durationLimit) {
          console.log("Override active, skip blocking");
          return;
        } else {
          console.log("Override expired");

          // ❗ FIX: update local variable juga
          override = {
            active: false,
            startTime: null
          };

          chrome.storage.local.set({ override });
        }
      }
      // ===============================

      const isBlocked = blockedSites.some(site =>
        tab.url.includes(site)
      );

      console.log("IS BLOCKED:", isBlocked);

      if (isBlocked) {
        chrome.tabs.update(details.tabId, {
          url: chrome.runtime.getURL("blocking.html")
        });
      }

    });

  });

});
