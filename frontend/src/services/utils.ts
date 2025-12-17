export const proxyUrl = () => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_PROXY_URI_DEV;
  } else {
    return window.location.origin;
  }
};
