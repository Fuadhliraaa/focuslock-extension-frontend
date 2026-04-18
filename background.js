const DURATION_LIMIT = 30 * 1000;

let isRedirecting = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    blockedSites: ["youtube.com", "tiktok.com"],
    goals: {
      mainGoal: "Build SaaS 1M USD Value",
      reason: "Financial Freedom n more time with family"
    },
    overrideUsage: {
      count: 0,
      lastResetDate: new Date().toISOString().split("T")[0]
    },
    override: {
      active: false,
      startTime: null
    }
  });
});

function handleBlockingLogic(tabId, url) {
  if (!url || url.includes("blocking.html") || isRedirecting) return;

  chrome.storage.local.get(["blockedSites", "override"], (data) => {
    const blockedSites = data.blockedSites || [];
    let override = data.override;

    const now = Date.now();
    let isOverrideActive = false;

    if (override && override.active && override.startTime) {
      const duration = now - override.startTime;

      if (duration < DURATION_LIMIT) {
        isOverrideActive = true;
      } else {
        override = { active: false, startTime: null };
        chrome.storage.local.set({ override });
      }
    }

    if (isOverrideActive) return;

    const isBlocked = blockedSites.some(site => url.includes(site));

    if (isBlocked) {
      isRedirecting = true;

      chrome.storage.local.set({ lastBlockedUrl: url });

      chrome.tabs.update(tabId, {
        url: chrome.runtime.getURL("blocking.html")
      });

      setTimeout(() => {
        isRedirecting = false;
      }, 500);
    }
  });
}

chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId !== 0) return;

  chrome.tabs.get(details.tabId, (tab) => {
    if (tab?.url) handleBlockingLogic(details.tabId, tab.url);
  });
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.frameId !== 0) return;

  chrome.tabs.get(details.tabId, (tab) => {
    if (tab?.url) handleBlockingLogic(details.tabId, tab.url);
  });
});