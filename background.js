function addLink(url) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const title = tabs[0].title;
    const newLink = { title, url };

    chrome.storage.sync.get("links", ({ links }) => {
      if (links) {
        links.push(newLink);
        chrome.storage.sync.set({ links });
        chrome.runtime.sendMessage({ type: "updateLinks", links });
      } else {
        chrome.storage.sync.set({ links: [newLink] });
        chrome.runtime.sendMessage({ type: "updateLinks", links: [newLink] });
      }
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "addLink") {
    addLink(message.url);
  }
  else if (message.type === "updateLinks") {
    chrome.storage.sync.get("links", ({ links }) => {
    if (links) {
      chrome.storage.sync.set({ links });
      chrome.runtime.sendMessage({ type: "updateLinks", links });
    }
  });
  }
});
