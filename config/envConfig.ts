const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") || "https://positive-sounds-shorts-offerings.trycloudflare.com";

export const imgUrl = backendUrl;
export const url = `${backendUrl}/api/v1/`;
export const getBaseUrl = () => url;
