# For Ubuntu 18.04 VM

# Install Git
# https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-18-04-quickstart
sudo apt update && sudo apt install git

# Install docker
# https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
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

# Lets Encrypt 
# https://certbot.eff.org/lets-encrypt/ubuntubionic-other
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot certonly --standalone
mkdir ~/certs
cp /etc/letsencrypt/live/project-calcifer.ml/privkey.pem ~/certs/default.key
cp /etc/letsencrypt/live/project-calcifer.ml/fullchain.pem ~/certs/default.crt

# Test cert auto renewel 
# sudo certbot renew --dry-run

# Install sysbox
# https://github.com/nestybox/sysbox
wget https://github.com/nestybox/sysbox/releases/download/v0.2.1/sysbox_0.2.1-0.ubuntu-focal_amd64.deb
sudo apt-get install ./sysbox_0.2.1-0.ubuntu-focal_amd64.deb -y
rm sysbox_0.2.1-0.ubuntu-focal_amd64.deb


# Git login and clone
git clone https://github.com/UTSCC09/project-calcifer.git
# Add nginx submodule
git submodule update --init --recursive

# Set environment variable
export CALCIFER_PRODUCTION=TRUE