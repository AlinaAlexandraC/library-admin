let handler = null;

export const setSessionExpiredHandler = (cb) => {
  handler = cb;
};

export const callSessionExpiredHandler = () => {
  if (handler) {
    handler();
  }
};