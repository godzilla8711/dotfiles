#!/bin/bash

DOTFILES_FOLDER="$HOME/dotfiles"
SOLR_ZIP_FILE=solr-8.8.1.zip
NEOVIM_FILE=nvim.appimage
SOLR_DOWNLOAD_URL=https://mirrors.gigenet.com/apache/lucene/solr/8.8.1/solr-8.8.1.zip

rm -rf dotfiles_new; 
rm -rf dotfiles_new.zip; 

# Clone repo recursively
echo -e "\nCloning dotfiles repo recursively...\n";
git clone https://github.com/godzilla8711/dotfiles.git --recursive dotfiles_new;

# Copy in the Solr files if necessary
if [ -f "$DOTFILES_FOLDER/bin/$SOLR_ZIP_FILE" ]; then
  echo -e -n "\nCopying in existing $SOLR_ZIP_FILE...";
  cp "$DOTFILES_FOLDER/bin/$SOLR_ZIP_FILE" "dotfiles_new/bin";
  echo "DONE";
else
  echo -e -n "\nDownloading $SOLR_ZIP_FILE..."; 
  wget "$SOLR_DOWNLOAD_URL" -O "$SOLR_ZIP_FILE";
  mv "$SOLR_ZIP_FILE" "dotfiles_new/bin";
  echo "DONE";
fi

# Copy in the Neovim file if necessary
if [ -f "$DOTFILES_FOLDER/bin/$NEOVIM_FILE" ]; then
  echo -e -n "\nCopying in existing $NEOVIM_FILE...";
  mkdir "dotfiles_new/bin/neovim";
  cp "$DOTFILES_FOLDER/bin/$NEOVIM_FILE" "dotfiles_new/bin/neovim";
  chmod 764 "dotfiles_new/bin/neovim/$NEOVIM_FILE";
  echo "DONE";
fi

# Create the zip file
echo -e -n "\nZipping files to dotfiles_new.zip..."; 
zip -r -q dotfiles_new.zip dotfiles_new;
rm -rf dotfiles_new; 
echo "DONE";

echo -e "\nSuccessfully completed"

