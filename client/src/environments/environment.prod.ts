const domain = window.location.origin;
const host = window.location.host;
export const environment = {
  production: true,
  domain,
  api_url: `${domain}/api`,
  docsync_http_url: `${domain}/docsync`,
  docsync_ws_url: `ws://${host}/docsync/`,
  ssh_url: domain,
  path: '/ssh/socket.io',
  default_parameters: {
    host: '.',
    username: 'root',
    password: 'playgroundpwWXuHbdwcwEVmyhnJVpYt',
  },
};
