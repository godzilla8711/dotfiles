# Install fzf binary
./bin/fzf/install

# Install bat
sudo dpkg -i bin/bat_0.17.1_amd64.deb

#!/bin/bash
# Fetch all patches for the OS 
yum update -y
# Install GIT, NGINX and NODE/NPM
yum install git -y
yum install nginx -y
curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
yum install nodejs -y
# Fetch the script that will install the s/w repos 
cd /home/ec2-user
wget https://raw.githubusercontent.com/godzilla8711/akira-docs/master/init.sh 
chmod 777 /home/ec2-user/init.sh

