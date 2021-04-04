export const production = process.env.PRODUCTION === "TRUE";
// Used for container routing
export const domain = process.env.VIRTUAL_HOST || "project-calcifer.ml";
// in days
export const stale_buffer = 1;

console.log({ production });
