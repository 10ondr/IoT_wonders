import axios from 'axios';


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
  if (!iframe) {
    return;
  }
  message = typeof message === 'object' ? JSON.stringify({ ...message, id: getMessageId()}) : message;
  iframe.contentWindow?.scope().chatService?.sendMessage(message, 'everyone', false, 'everyone', { images: [], shared: [] }, undefined, 'default_avatar_72');
};

export const clearChat = async () => {
  const userId = iframe.contentWindow.user.userId;
  const scope = iframe.contentWindow.scope();
  scope.chatService.clearChat({ group: "everyone", personal: false, recipientId: "everyone", userId });
};

export const webrtc_getMediaServerUrl = () => {
  return iframe?.contentWindow?.mediaserversInfo?.subscribingServer?.mediaUrl;
};

export const sendRequestHTTP = async (url, method, data) => {
  try {
      return await axios[method](url, data);
  } catch (error) {
      console.log('sendRequest error: ', error);
  }
};

export const addScopeCallback = (eventName, callback) => {
  try {
    return iframe?.contentWindow?.scope()?.$on(eventName, callback);
  } catch (error) {
    return null;
  }
};

export const addReceivedMessageCallback = (callback) => {
  const decorator = (event, messageObj) => {
    if (messageObj.userId === parseInt(iframe?.contentWindow?.user?.userId)) {
      return; // Outgoing message
    }
    const newMessage = decodeURIComponent(messageObj.msg);
    callback(newMessage);
  };
  return addScopeCallback('ds-socket-chat-message', decorator);
};

export const msToDate = (milliseconds) => {
  var t = new Date(1970, 0, 1); // Epoch
  t.setTime(milliseconds)
  return t;
};

export const dateToMs = (date) => {
  return date.getTime();
};
