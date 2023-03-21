
let iframe = null;

export const sleep = (milis) => {
  return new Promise(resolve => setTimeout(resolve, milis));
}

export const setIframeRef = (ref) => {
  iframe = ref;
};

export const getMessageId = () => {
  return Math.floor(Math.random() * 1000000);
};

export const sendMessage = (message) => {
  message = typeof message === 'object' ? JSON.stringify({ ...message, id: getMessageId()}) : message;
  const inputEl = iframe.contentWindow.document.querySelector('textarea.chatInput');
  if (inputEl) {
    inputEl.value = message;
    inputEl.dispatchEvent(new Event('change')); // Needed for the angular textarea to register the change 
    inputEl.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 13 })); // Simulate 'Enter' key
    return true;
  }
  return false;
};

// export const clearChatOneByOne = async () => {
//   let msgEl = null;
//   do {
//     msgEl = iframe.contentWindow.document.querySelector('message-view.chatMessage');
//     if (!msgEl) {
//       break;
//     }
//     const btnEl = msgEl.querySelector('div.ds-icons.more');
//     btnEl.click();
//     await sleep(30);
//     const liEl = iframe.contentWindow.document.querySelector('li.selected-chat-message-ddmenu.delete>div');
//     liEl.click();
//     await sleep(30);
//     const modalEl = iframe.contentWindow.document.querySelector('div.ds_notification_modal');
//     const delBtnEl = modalEl.querySelector('button.ds-notification-button-important');
//     delBtnEl.click();
//     await sleep(300);
//   } while (msgEl);
// };

export const clearChat = async () => {
  const btnEl = iframe.contentWindow.document.querySelector('chat-view#ds-chat-panel div.ds-icons.more');
  btnEl.click();
  await sleep(30);
    const liEl = iframe.contentWindow.document.querySelector('li.messages-ddmenu.clear>div');
    liEl.click();
    await sleep(30);
    const modalEl = iframe.contentWindow.document.querySelector('div.ds_notification_modal');
    const delBtnEl = modalEl.querySelector('button.ds-notification-button-important');
    delBtnEl.click();
    await sleep(300);
};

export const webrtc_getMediaServerUrl = () => {
  return iframe?.contentWindow?.mediaserversInfo?.subscribingServer?.mediaUrl;
};
