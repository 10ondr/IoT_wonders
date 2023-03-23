
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
  iframe?.contentWindow?.scope().chatService.sendMessage(message, 'everyone', false, 'everyone', { images: [], shared: [] }, undefined, 'default_avatar_72');
};

export const clearChat = async () => {
  const userId = iframe.contentWindow.user.userId;
  const scope = iframe.contentWindow.scope();
  scope.chatService.clearChat({ group: "everyone", personal: false, recipientId: "everyone", userId });


  // const btnEl = iframe.contentWindow.document.querySelector('chat-view#ds-chat-panel div.ds-icons.more');
  // btnEl.click();
  // await sleep(30);
  //   const liEl = iframe.contentWindow.document.querySelector('li.messages-ddmenu.clear>div');
  //   liEl.click();
  //   await sleep(30);
  //   const modalEl = iframe.contentWindow.document.querySelector('div.ds_notification_modal');
  //   const delBtnEl = modalEl.querySelector('button.ds-notification-button-important');
  //   delBtnEl.click();
  //   await sleep(300);
};

export const webrtc_getMediaServerUrl = () => {
  return iframe?.contentWindow?.mediaserversInfo?.subscribingServer?.mediaUrl;
};
