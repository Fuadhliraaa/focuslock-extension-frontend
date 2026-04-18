import { isOverrideActive } from "./core/override.js";

let isRedirecting = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    blockedSites: ["youtube.com", "tiktok.com"],
    goals: {
      mainGoal: "Build SaaS 1M USD Value",
      reason: "Financial Freedom n more time with family"
    }
  });
});

async function handleBlockingLogic(tabId, url) {
  if (!url || url.includes("blocking.html") || isRedirecting) return;

  const isActive = await isOverrideActive();
  if (isActive) return;

  chrome.storage.local.get(["blockedSites"], (data) => {
    const blockedSites = data.blockedSites || [];

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