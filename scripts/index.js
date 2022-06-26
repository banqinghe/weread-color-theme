const buttons = document.querySelectorAll(".button-list > li > button");

for (const button of buttons) {
  const color = button.dataset.color;
  if (color) {
    button.style.background = color;
  }
}

function setPageBackgroundColor() {
  const changeBackground = (color) => {
    document.querySelector(".app_content").style.background = color;
    document.querySelector(".readerTopBar").style.background = color;
    document.body.style.background = color;

    let controlButtonColor = color ? "#0000" : "";
    for (const item of document.querySelectorAll(
      ".readerControls_item, .readerControls_fontSize"
    )) {
      item.style.background = controlButtonColor;
    }
  };

  chrome.storage.sync.get("color", ({ color }) => {
    if (window.location.hostname !== "weread.qq.com") {
      return;
    }
    changeBackground(color === "ban" ? "" : color);
  });
}

const buttonList = document.querySelector(".button-list");
buttonList.addEventListener("click", async (e) => {
  const button = e.target;
  console.log("click", button);
  if (button.tagName !== "BUTTON") {
    return;
  }
  const color = button.dataset.color || "ban";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.storage.sync.set({ color });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});
