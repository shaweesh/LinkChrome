// Get the current list of links from the storage when the popup is opened
chrome.storage.sync.get("links", (data) => {
  if (data.links) {
    showLoadingMessage();
    setTimeout(() => {
      createLinksList(data.links);
    }, 1000); // Simulating a delay for loading
  }
});
document.addEventListener('DOMContentLoaded', function() {
  const addLinkButton = document.getElementById('addLink');
  addLinkButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const url = tabs[0].url;
      chrome.runtime.sendMessage({ type: "addLink", url: url });
    });
  });
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "createLinksList" || message.type === "updateLinks") {
    showLoadingMessage();
    setTimeout(() => {
      // Handle the "createLinksList" and "updateLinks" messages here
      createLinksList(message.links);
    }, 1000); // Simulating a delay for loading
  }
});
function createLinksList(links) {
    debugger;
  const linksList = document.getElementById("linksList");
  linksList.innerHTML = "";
  links.forEach((link) => {
    const listItem = createListItem(link);
    linksList.appendChild(listItem);
  });
}

function createListItem(link) {
  const listItem = document.createElement("li");
  const titleSpan = document.createElement("span");
  titleSpan.textContent = link.title;
  listItem.appendChild(titleSpan);

  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("actions");

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    const newTitle = prompt("Enter a new display name for the link");
    if (newTitle) {
      link.title = newTitle;
      chrome.storage.sync.get("links", ({ links }) => {
        const updatedLinks = links.map((l) => (l.url === link.url ? link : l));
        chrome.storage.sync.set({ links: updatedLinks });
        titleSpan.textContent = newTitle;
      });
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    chrome.storage.sync.get("links", ({ links }) => {
      const updatedLinks = links.filter((l) => l.url !== link.url);
      chrome.storage.sync.set({ links: updatedLinks });
      chrome.runtime.sendMessage({ type: "updateLinks", links: updatedLinks });
    });
  });

  actionsDiv.appendChild(editButton);
  actionsDiv.appendChild(deleteButton);

  listItem.appendChild(actionsDiv);

  listItem.addEventListener("dblclick", () => {
    chrome.tabs.create({ url: link.url });
  });

  return listItem;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "createLinksList") {
    createLinksList(message.links);
  }
});
// Show a loading message or spinner
function showLoadingMessage() {
  try{
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Loading...";
  document.body.appendChild(loadingMessage);
  setTimeout(() => {
    loadingMessage.remove();
  }, 1000); // Simulating a delay for loading
} catch(e){
  //TODO
}
}