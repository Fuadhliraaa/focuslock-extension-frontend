import { isOverrideActive } from "./core/override.js";
import { getData } from "./core/storage.js";
import { trackBehavior } from "./core/behavior.js";

let isRedirecting = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    blockedSites: ["youtube.com", "tiktok.com"]
  });
});

async function handleBlockingLogic(tabId, url) {
  if (!url || url.includes("blocking.html") || isRedirecting) return;

  const isActive = await isOverrideActive();

  chrome.storage.local.get(
    ["blockedSites", "overrideTabId"],
    async (storageData) => {

      const blockedSites = storageData.blockedSites || [];
      const overrideTabId = storageData.overrideTabId;

      const data = await getData();
      const allowedUrl = data.override.allowedUrl;

      const isBlocked = blockedSites.some((site) =>
        url.includes(site)
      );

      // 🧠 override only for same tab + same context
      if (isActive && tabId === overrideTabId) {
        if (allowedUrl && url.includes(allowedUrl)) {
          return;
        }
      }

      if (!isBlocked) return;

      // 🔥 behavior tracking (modular now)
      await trackBehavior();

      // 🚫 redirect
      isRedirecting = true;

      chrome.storage.local.set({ lastBlockedUrl: url });

      chrome.tabs.update(tabId, {
        url: chrome.runtime.getURL("blocking.html")
      });

      setTimeout(() => {
        isRedirecting = false;
      }, 500);
    }
  );
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  handleBlockingLogic(tabId, tab.url);
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.frameId !== 0) return;

  chrome.tabs.get(details.tabId, (tab) => {
    if (tab?.url) handleBlockingLogic(details.tabId, tab.url);
  });
});