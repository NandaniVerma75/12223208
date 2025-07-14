const logMiddleware = (message, data = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    message,
    data,
  };
  // Save in localStorage as log (required)
  localStorage.setItem(`log-${Date.now()}`, JSON.stringify(entry));
};

export default logMiddleware;
