# For Ubuntu 20.04 VM 

# Install docker
# https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04
sudo apt update
yes Y | sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
apt-cache policy docker-ce
yes Y | sudo apt install docker-ce
sudo chmod 666 /var/run/docker.sock

# Install docker compose
# https://docs.docker.com/compose/install/
sudo curl -L "https://github.com/docker/compose/releases/download/1.28.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose


# Install sysbox
# https://github.com/nestybox/sysbox
wget https://github.com/nestybox/sysbox/releases/download/v0.3.0/sysbox-ce_0.3.0-0.ubuntu-focal_amd64.deb
sudo apt-get install ./sysbox-ce_0.3.0-0.ubuntu-focal_amd64.deb -y
rm sysbox-ce_0.3.0-0.ubuntu-focal_amd64.deb 

# Install Certbot
# https://certbot.eff.org/lets-encrypt/ubuntufocal-nginx
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
# Get star cert
# https://marcincuber.medium.com/lets-encrypt-generating-wildcard-ssl-certificate-using-certbot-ae1c9484c101
# https://www.digitalocean.com/community/tutorials/how-to-acquire-a-let-s-encrypt-certificate-using-dns-validation-with-acme-dns-certbot-on-ubuntu-18-04
# https://en.wikipedia.org/wiki/Wildcard_certificate
# NOTE THE "NAKED" base domain for SAN cert
certbot certonly --manual \
  --preferred-challenges=dns \
  --email felixchen1998@gmail.com \
  --server https://acme-v02.api.letsencrypt.org/directory \
  --agree-tos \
  -d *.project-calcifer.ml \
  -d project-calcifer.ml

# copy certs, to where docker volume will be mounted
mkdir ~/certs 
ln /etc/letsencrypt/archive/project-calcifer.ml/cert1.pem ~/certs/project-calcifer.ml.key 
ln /etc/letsencrypt/archive/project-calcifer.ml/fullchain1.pem  ~/certs/project-calcifer.ml.crt

# Git login and clone
cd ~
git clone https://github.com/felixjchen/calcifer.git
# Add nginx submodule
cd project-calcifer
git submodule update --init --recursive
