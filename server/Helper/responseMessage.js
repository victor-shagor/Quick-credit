const Message = {
  errorMessage(status, message) {
    return ({
      status,
      error: message,
    });
  },
  message(status, message) {
    return ({
      status,
      data: message,
    });
  },

};
export default Message;
