<template>
  <div id="options-app">
    <a-config-provider :auto-insert-space-in-button="false">
      <div class="container">
        <div>
          <a-space>
            <a-switch :checked="ontop" @change="onTopChange"></a-switch>
            <span class="item-text">{{ $ui.get('optionsOnTop') }}</span>
          </a-space>
        </div>
        <div>
          <a-space>
            <a-switch :checked="directSave" @change="onDirectSaveChange"></a-switch>
            <span>{{ $ui.get('optionsDirectSave') }}</span>
          </a-space>
        </div>
      </div>
    </a-config-provider>
  </div>
</template>

<script>
const config = {
  ontop: false,
  directSave: false,
};

chrome.storage.local.get(['ontop', 'directSave'], result => {
  const { ontop, directSave } = result;
  config.ontop = ontop || false;
  config.directSave = directSave || false;
});

export default {
  name: 'OptionsApp',
  data() {
    return config;
  },
  methods: {
    onTopChange(checked) {
      this.ontop = checked;
      chrome.storage.local.set({
        ontop: checked,
      });
    },
    onDirectSaveChange(checked) {
      this.directSave = checked;
      chrome.storage.local.set({
        directSave: checked,
      });
      if (checked) {
        chrome.action.setPopup({
          popup: '',
        });
      } else {
        chrome.action.setPopup({
          popup: 'popup.html',
        });
      }
    },
  },
};
</script>
