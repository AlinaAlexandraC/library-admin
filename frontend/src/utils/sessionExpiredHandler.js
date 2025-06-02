let handler = null;

export const setSessionExpiredHandler = (cb) => {
  handler = cb;
  console.log('Session expired handler set:', !!cb);
};

export const callSessionExpiredHandler = () => {
  console.log("🚨 callSessionExpiredHandler triggered");
  if (handler) {
    console.log("✅ Handler exists, calling...");
    handler();
  } else {
    console.log("❌ No handler set yet.");
  }
};