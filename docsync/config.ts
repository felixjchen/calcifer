export const production = process.env.PRODUCTION === "TRUE";
console.log({ production });
export const PORT = process.env.VIRTUAL_PORT || 9000;
