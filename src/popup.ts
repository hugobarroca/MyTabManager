import { Session } from "./types";

const myOneTabKey = "myOneTabKey";

let currentSession: Session[] = [];
function getTabs(): void {
  chrome.storage.local.get([myOneTabKey], function (result) {
    currentSession = result.key;
  });
}

function setTabs(tabs: Session) {
  chrome.storage.local.get([myOneTabKey], function (result) {
    let sessions: Session[] = result[myOneTabKey] || [];
    sessions.push(tabs);
    chrome.storage.local.set({ [myOneTabKey]: sessions }, function () {});
  });
}

document.getElementById("getTabs")?.addEventListener("click", function () {
  let urls: string[] = [];
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      console.log("Tab ID: " + tab.id);
      console.log("Tab Title: " + tab.title);
      console.log("Tab URL: " + tab.url);
      if (tab.url !== undefined) {
        urls.push(tab.url);
      }
    });
  });
  const currentDate = new Date();
  const dateString = currentDate.toString();
  let currentSession = { datetime: dateString, urls: urls };
  setTabs(currentSession);
  chrome.tabs.query({}, function (tabs) {
    chrome.tabs.create({ url: chrome.runtime.getURL("page.html") });
    tabs.forEach(function (tab) {
      if (tab.id !== undefined) {
        chrome.tabs.remove(tab.id);
      }
    });
  });
});

document.getElementById("getSessions")?.addEventListener("click", function () {
  getTabs();
});

document
  .getElementById("getSessionsPage")
  ?.addEventListener("click", function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("page.html") });
  });

chrome.storage.local.set({ key: "" }, function () {
  console.log("Data is stored locally.");
});
export {};
