const domain = window.location.origin;
export const environment = {
  production: true,
  ssh_url: domain,
  api_url: `${domain}/api`,
  path: '/ssh/socket.io',
  default_parameters: {
    host: '.',
    username: 'root',
    password: 'playgroundpwWXuHbdwcwEVmyhnJVpYt',
  },
};
