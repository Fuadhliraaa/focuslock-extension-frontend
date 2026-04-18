const STORAGE_KEY = "focusLock";

const DEFAULT_DATA = {
  version: "1.5",

  override: {
    usedToday: 0,
    maxPerDay: 3,
    lastResetDate: "",
    active: false,
    startTime: null
  },

  streak: {
    current: 0,
    lastActiveDate: "",
    lastBreakDate: ""
  },

  behavior: {
    lastBlockedTimestamp: 0,
    rapidReturnCount: 0
  },

  settings: {
    autoKick: false
  }
};

export async function getData() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const data = result[STORAGE_KEY];

      if (!data || typeof data !== "object") {
        chrome.storage.local.set({ [STORAGE_KEY]: DEFAULT_DATA });
        resolve(DEFAULT_DATA);
      } else {
        resolve({ ...DEFAULT_DATA, ...data }); // shallow merge dulu cukup
      }
    });
  });
}

export async function setData(data) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: data }, resolve);
  });
}

export async function updateData(updater) {
  const data = await getData();
  const updated = updater(data);
  await setData(updated);
}