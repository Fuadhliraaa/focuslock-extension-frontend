// ===============================
// 🔥 INIT
// ===============================
console.log("SERVICE WORKER RUNNING");

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    blockedSites: ["youtube.com", "tiktok.com"],
    goals: {
      mainGoal: "Build SaaS 1M USD Value",
      reason: "Financial Freedom n more time with family"
    },
    overrideUsage: {
      count: 1,
      lastResetDate: "2026-04-18"
    },
    override: {
      active: false,
      startTime: null
    }
  });
});

let isRedirecting = false;

// ===============================
// 🧠 CORE LOGIC (REUSABLE)
// ===============================
function handleBlockingLogic(tabId, url) {

  if (!url) return;

  // 🛑 Skip halaman sendiri
  if (url.includes("blocking.html")) return;

  // 🛑 Prevent spam redirect
  if (isRedirecting) {
    console.log("SKIP: redirect in progress");
    return;
  }

  chrome.storage.local.get(["blockedSites", "override"], (data) => {

    const blockedSites = data.blockedSites || [];
    let override = data.override;

    const now = Date.now();
    const durationLimit = 30 * 1000;

    console.log("URL:", url);
    console.log("OVERRIDE DATA:", override);

    // ===============================
    // 🧠 HANDLE OVERRIDE (CLEAN)
    // ===============================
    let isOverrideActive = false;

    if (override && override.active && override.startTime) {
      const duration = now - override.startTime;

      console.log("Duration:", duration);

      if (duration < durationLimit) {
        isOverrideActive = true;
      } else {
        console.log("Override expired → reset");

        override = { active: false, startTime: null };
        chrome.storage.local.set({ override });

        isOverrideActive = false;
      }
    }

    if (isOverrideActive) {
      console.log("ALLOW: override active");
      return;
    }
    // ===============================

    const isBlocked = blockedSites.some(site =>
      url.includes(site)
    );

    console.log("IS BLOCKED:", isBlocked);

    if (isBlocked) {
      console.log("REDIRECTING TO BLOCK PAGE");

      isRedirecting = true;

      chrome.storage.local.set({
        lastBlockedUrl: url
      });

      chrome.tabs.update(tabId, {
        url: chrome.runtime.getURL("blocking.html")
      });

      setTimeout(() => {
        isRedirecting = false;
      }, 500);
    }

  });
}

// ===============================
// 🌐 FULL NAVIGATION (REFRESH / OPEN)
// ===============================
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId !== 0) return;

  chrome.tabs.get(details.tabId, (tab) => {
    if (!tab.url) return;

    console.log("FULL NAV:", tab.url);
    handleBlockingLogic(details.tabId, tab.url);
  });
});

// ===============================
// ⚡ SPA NAVIGATION (YouTube, dll)
// ===============================
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.frameId !== 0) return;

  chrome.tabs.get(details.tabId, (tab) => {
    if (!tab.url) return;

    console.log("SPA NAV:", tab.url);
    handleBlockingLogic(details.tabId, tab.url);
  });
});