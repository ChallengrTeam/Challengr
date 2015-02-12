#!/usr/bin/env bash

echo "Provisioning the VM."
echo "Installing cURL..."
apt-get -y install curl > /dev/null

echo "Installing Meteor..."
curl --silent https://install.meteor.com/ | sh > /dev/null 2>&1

echo "Setting up file structure and mounting /home/vagrant to /vagrant (project location)..."
mkdir -p ~/.meteor/local
mkdir -p /vagrant/.meteor/local
echo "sudo mount --bind /home/vagrant/.meteor/local/ /vagrant/.meteor/local/" >> ~/.bashrc && source ~/.bashrc
#sudo mount --bind ~/.meteor/local/ /vagrant/.meteor/local/

if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi

echo "Provisioning complete."
echo "cd /vagrant; meteor should start the app on http://localhost:4567/"

# echo "RUN THESE COMMANDS BEFORE STARTING since it isn't working from this script for some reason"
# echo "mkdir -p ~/.meteor/local"
# echo "sudo mount --bind /home/vagrant/.meteor/local/ /vagrant/.meteor/local/" >> ~/.bashrc && source ~/.bashrc
# echo "sudo mount --bind ~/.meteor/local/ /vagrant/.meteor/local/"
