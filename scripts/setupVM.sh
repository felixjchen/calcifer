# For GCP Compute Engine, Ubuntu 18.04 VM

# Install Git
# https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-18-04-quickstart
sudo apt update && sudo apt install git

# Install docker
# https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04
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

# Install sysbox
# https://github.com/nestybox/sysbox
wget https://github.com/nestybox/sysbox/releases/download/v0.2.1/sysbox_0.2.1-0.ubuntu-focal_amd64.deb
sudo apt-get install ./sysbox_0.2.1-0.ubuntu-focal_amd64.deb -y
rm sysbox_0.2.1-0.ubuntu-focal_amd64.deb

# Clone repo 
git clone https://github.com/felixjchen/calcifer

# Set environment variable
export CALCIFER_PRODUCTION=TRUE