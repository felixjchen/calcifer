certbot certonly --manual --preferred-challenges=dns --email felixchen1998@gmail.com --server https://acme-v02.api.letsencrypt.org/directory --agree-tos -d *.project-calcifer.ml -d project-calcifer.ml
ln /etc/letsencrypt/live/project-calcifer.ml/privkey.pem ~/certs/project-calcifer.ml.key 
ln /etc/letsencrypt/live/project-calcifer.ml/fullchain.pem ~/certs/project-calcifer.ml.crt
