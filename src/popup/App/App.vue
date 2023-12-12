<template>
  <div id="popup-app">
    <a-config-provider :auto-insert-space-in-button="false">
      <div class="container">
        <a-space direction="vertical" style="width: 100%">
          <div class="heading">
            {{ heading }}
          </div>
          <a-row type="flex" class="aligh-items-center">
            <a-col flex="80px" class="label">
              {{ $ui.get('popupName') }}
            </a-col>
            <a-col flex="auto">
              <a-input v-model="name"></a-input>
            </a-col>
          </a-row>
          <a-row type="flex" class="aligh-items-center">
            <a-col flex="80px" class="label">
              {{ $ui.get('popupUrl') }}
            </a-col>
            <a-col flex="auto">
              <a-input v-model="url"></a-input>
            </a-col>
          </a-row>
          <a-row class="aligh-items-center">
            <a-switch :checked="ontop" class="item-switch" @change="onChange"></a-switch>
            <span class="item-text">
              {{ $ui.get('popupOnTop') }}
            </span>
          </a-row>
          <a-row class="aligh-items-center">
            <div class="tips">
              {{ tip }}
            </div>
          </a-row>
          <a-row class="footer">
            <a-col :span="4" :offset="16" class="center-button">
              <a-button type="primary" @click="saveBookmark">
                {{ $ui.get('popupSave') }}
              </a-button>
            </a-col>
            <a-col :span="4" class="center-button">
              <a-button type="danger" @click="removeBookmark">
                {{ $ui.get('popupRemove') }}
              </a-button>
            </a-col>
          </a-row>
        </a-space>
      </div>
    </a-config-provider>
  </div>
</template>

<script>
const dataInfo = {
  name: '',
  url: '',
  originalUrl: '',
  id: null,
  ontop: false,
  existed: false,
};

chrome.storage.local.get(['ontop'], result => {
  const { ontop } = result;
  dataInfo.ontop = ontop || false;

  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    tabs => {
      if (!chrome.runtime.lastError && tabs.length > 0 && tabs[0].url) {
        const url = tabs[0].url;
        Object.assign(dataInfo, {
          name: tabs[0].title,
          url,
          originalUrl: url,
        });

        chrome.bookmarks.search(
          {
            url,
          },
          res => {
            if (!chrome.runtime.lastError && res.length > 0) {
              const { id, title } = res[0];
              Object.assign(dataInfo, {
                id,
                name: title,
                existed: true,
              });
            } else {
              // 不存在该书签，直接创建
              chrome.bookmarks.create(
                {
                  parentId: '1',
                  title: dataInfo.name,
                  url: dataInfo.url,
                  index: dataInfo.ontop ? 0 : null,
                },
                newBookmark => {
                  dataInfo.id = newBookmark.id;
                }
              );
            }
          }
        );
      }
    }
  );
});

export default {
  name: 'PopupApp',
  data() {
    return dataInfo;
  },
  computed: {
    heading() {
      if (this.existed) {
        return this.$ui.get('popupModify');
      } else {
        return this.$ui.get('popupAdded');
      }
    },
    tip() {
      if (this.existed) {
        return this.$ui.get('popupMove');
      } else {
        return this.$ui.get('popupAlready');
      }
    },
  },
  methods: {
    onChange(checked) {
      this.ontop = checked;
      chrome.storage.local.set({
        ontop: checked,
      });
    },
    saveBookmark() {
      chrome.bookmarks.update(
        this.id,
        {
          title: this.name,
          url: this.url || this.originalUrl,
        },
        res => {
          if (!chrome.runtime.lastError && res) {
            chrome.bookmarks.move(
              res.id,
              {
                parentId: '1',
                index: this.ontop ? 0 : null,
              },
              newBookmark => {
                if (!chrome.runtime.lastError && newBookmark) {
                  window.close();
                } else {
                  this.$message.error(this.$ui.get('popupErrorMove'), 2);
                }
              }
            );
          } else {
            this.$message.error(this.$ui.get('popupErrorUpdate'), 2);
          }
        }
      );
    },
    removeBookmark() {
      const { id } = this;
      id && chrome.bookmarks.remove(id);
      window.close();
    },
  },
};
</script>

<style lang="less">
#popup-app {
  overflow: hidden;
  width: 500px;
  height: 250px;

  .container {
    margin: 10px;
  }
  .heading {
    font-size: 1.2rem;
    font-weight: bold;
    padding: 5px 0px 0px 10px;
  }
  .aligh-items-center {
    align-items: center;
  }
  .label {
    padding-left: 15px;
  }
  .footer {
    margin-top: 5px;
  }
  .center-button {
    text-align: center;
  }
  .tips {
    margin-left: 80px;
    color: #999999;
  }
  .item-switch {
    margin-left: 15px;
  }
  .item-text {
    margin-left: 20px;
  }
}

.dark() {
  background-color: @general-background-color-dark;
  .heading {
    color: @logo-text-color-dark;
  }
  .original-title {
    color: @select-selection-color-dark;
  }
  .ant-dark();
}

@media (prefers-color-scheme: dark) {
  #popup-app {
    .dark();
  }
}
</style>
