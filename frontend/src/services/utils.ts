export const proxyUrl = () => {
  const envmode = process.env.NODE_ENV;
  if (envmode == "development") {
    // console.log(process.env.REACT_APP_PROXY_URI_DEV); //undefined
    return process.env.REACT_VITE_PROXY_URI_DEV;
  } else {
    return window.location.origin;
  }
};
