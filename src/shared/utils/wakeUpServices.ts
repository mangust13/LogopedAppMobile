// src/shared/utils/wakeUpServices.ts
export const wakeUpServices = async () => {
  const services = [
    "https://apigateway-9n9m.onrender.com",
    "https://userservice-m0q5.onrender.com/health",
    "https://progressservice.onrender.com/health",
  ];

  await Promise.allSettled(
    services.map((url) => fetch(url, { method: "GET" }).catch(() => {})),
  );
};
