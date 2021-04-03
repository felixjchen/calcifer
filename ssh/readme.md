The ssh service is responsible for how clients will interact with their playgrounds. It serves as an adapter from socket.io to SSH or SFTP.

- requries redis for development
  `docker run -it -p 6379:6379 redis`

- original vanilla js code from this thread
  https://stackoverflow.com/a/66163844/5482077

- Used promise wrapped ssh2
  https://www.npmjs.com/package/ssh2-promise
