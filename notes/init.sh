# Install GIT, NGINX and NODE/NPM

# Establish the required settings
export USER_NAME="Last, First"
export USER_EMAIL="Email"
export DB_PASS="dbpass"

if [ "$USER_NAME" == "Last, First" ] || [ "$USER_EMAIL" == "Email" ] [ "$DB_PASS" == "dbpass" ]; then
  echo
  echo "Error -- Both USER_NAME, USER_EMAIL and DB_PASS must be specified"
  echo
  exit
fi

# Clone the dotfiles repo
git clone https://github.com/godzilla8711/dotfiles.git

# Configure GIT and NPM settings.
git config --global user.name "$USER_NAME"
git config --global user.email $USER_EMAIL
git config --global color.ui true
npm config set package-lock false
cd ~

# Install and configure postgres

