const isTunnel = process.env.EXPO_TUNNEL === "true";

export const ENV = {
  API_BASE_URL: isTunnel
    ? "https://apigateway-9n9m.onrender.com/api"
    : "http://192.168.0.100:5000/api",
} as const;

//Comp
//API_BASE_URL: "http://192.168.0.125:5000/api",
