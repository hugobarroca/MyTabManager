import { url } from "inspector";
import { Session } from "./types";

const myOneTabKey = "myOneTabKey";

chrome.storage.local.get([myOneTabKey], function (result) {
  console.log("Chrome storage returned: ");
  console.log(JSON.stringify(result));
  let sessions: Session[] = result[myOneTabKey];
  let sessionsContainer = document.getElementById("sessions-container");

  if (sessionsContainer !== null && sessions !== undefined) {
    console.log("Sessions container div not found.");
    sessions.sort((s) => new Date(s.datetime).getUTCMilliseconds());
    sessions.reverse();
    sessions.forEach((session) => {
      let sessionHeader = document.createElement("h3");
      sessionHeader.textContent = session.datetime;
      sessionsContainer.appendChild(sessionHeader);
      session.urls.forEach((url) => {
        let div = document.createElement("div");
        let anchor = document.createElement("a");
        anchor.textContent = url;
        anchor.setAttribute("href", url);
        div.appendChild(anchor);
        sessionsContainer.appendChild(div);
      });
    });
  }
});

document.getElementById("clear-button")?.addEventListener("click", function () {
  console.log("Clear button was pressed.");
  chrome.storage.local.clear();
  chrome.tabs.getCurrent().then((t) => {
    if (t?.id !== undefined) {
      chrome.tabs.reload(t.id);
    }
  });
});

export {};
