export const production = process.env.PRODUCTION === "TRUE";
console.log({ production });

// Prod can take port from environment vars
export const PORT = process.env.PORT || 8000;

// Need cors for dev work (different ports)
export const socketio_options = production ? {} : { cors: { origin: "*" } };
export const socketio_namespace_regex = production ? /[a-zA-Z-_]+$/ : /.+$/;

// Redis settings
export const redis_host = production
  ? "project-calcifer_ssh_redis_1"
  : "0.0.0.0";
