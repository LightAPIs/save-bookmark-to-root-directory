function init() {
  chrome.storage.local.get(['directSave'], res => {
    const { directSave = false } = res;
    if (directSave) {
      chrome.action.setPopup({
        popup: '',
      });
    }
  });
}

init();

chrome.runtime.onStartup.addListener(() => {
  init();
});

chrome.action.onClicked.addListener(async () => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (tabs.length > 0 && tabs[0].url) {
    const tab = tabs[0];
    const { ontop = false } = await chrome.storage.local.get(['ontop']);
    const bookmarks = await chrome.bookmarks.search({
      url: tab.url,
    });
    if (bookmarks.length > 0) {
      // move bookmark to root
      const { id } = bookmarks[0];
      chrome.bookmarks.move(id, {
        parentId: '1',
        index: ontop ? 0 : null,
      });
    } else {
      // create new bookmark
      chrome.bookmarks.create({
        parentId: '1',
        title: tab.title,
        url: tab.url,
        index: ontop ? 0 : null,
      });
    }
  }
});
