const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") || "https://fisheries-half-nodes-concepts.trycloudflare.com";
export const imgUrl = backendUrl;
export const url = `${backendUrl}/api/v1/`;
export const getBaseUrl = () => url;
