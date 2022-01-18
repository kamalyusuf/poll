export const sleep = (ms: number = 2500) =>
  new Promise((resolve) => setTimeout(resolve, ms));
