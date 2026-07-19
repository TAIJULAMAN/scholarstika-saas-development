const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") || "http://localhost:5004";
export const imgUrl = backendUrl;
export const url = `${backendUrl}/api/v1/`;
export const getBaseUrl = () => url;
