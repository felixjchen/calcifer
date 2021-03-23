const domain = window.location.origin;
export const environment = {
  production: true,
  domain,
  ssh_url: domain,
  api_url: `${domain}/api`,
  path: '/socket.io',
  default_parameters: {
    host: '.',
    username: 'root',
    password: 'playgroundpwWXuHbdwcwEVmyhnJVpYt',
  },
};
