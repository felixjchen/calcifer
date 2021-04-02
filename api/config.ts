export const production = process.env.PRODUCTION === "TRUE";
// Used for container routing
export const domain = production ? "project-calcifer.ml" : "markl.tk";
// in days
export const stale_buffer = 1;

console.log({ production });
