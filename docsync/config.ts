export const production = process.env.PRODUCTION === "TRUE";
console.log({ production });
export const PORT = process.env.PORT || 9000;
