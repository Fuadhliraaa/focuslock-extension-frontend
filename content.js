(async function () {

  function updateTitle(seconds) {
    document.title = `⏱ ${seconds}s | FocusLock`;
  }

  function resetTitle() {
    document.title = "YouTube";
  }

  function tick(data) {
    if (!data.override?.active || !data.override.startTime) {
      resetTitle();
      return;
    }

    const remaining =
      30 - Math.floor((Date.now() - data.override.startTime) / 1000);

    if (remaining > 0) {
      updateTitle(remaining);
    } else {
      resetTitle();
    }
  }

  setInterval(() => {
    chrome.storage.local.get(["focusLock"], (res) => {
      const data = res.focusLock;
      if (!data) return;

      tick(data);
    });
  }, 1000);

})();