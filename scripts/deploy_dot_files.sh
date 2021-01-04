#!/bin/bash

TIMESTAMP=$(date +%s)
BACKUP_FOLDER="$HOME/z_backup/temp"
DOTFILES_FOLDER="$HOME/dotfiles"
SOLR_ZIP_FILE=solr-8.7.0.zip
SOLR_DOWNLOAD_URL=https://mirrors.gigenet.com/apache/lucene/solr/8.7.0/solr-8.7.0.zip

echo -e "Starting deployment...\n"
mkdir -p "$BACKUP_FOLDER"

echo -n "Backing up existing dotfiles..."
cp "$HOME/.bashrc" "$BACKUP_FOLDER/bashrc_$TIMESTAMP"
cp "$HOME/.bash_profile" "$BACKUP_FOLDER/bash_profile_$TIMESTAMP"
cp "$HOME/.bashrc_local" "$BACKUP_FOLDER/bashrc_local_$TIMESTAMP"
cp "$HOME/.vimrc" "$BACKUP_FOLDER/vimrc_$TIMESTAMP"
echo "DONE"

echo -n "Copying in new dotfiles..."
cp "$DOTFILES_FOLDER/DOT_bashrc" "$HOME/.bashrc"
cp "$DOTFILES_FOLDER/DOT_bash_profile" "$HOME/.bash_profile"
cp "$DOTFILES_FOLDER/DOT_bashrc_local" "$HOME/.bashrc_local"
cp "$DOTFILES_FOLDER/DOT_vimrc" "$HOME/.vimrc"
echo "DONE"

# Install the fzf bin
echo -ne "Installing fzf bin..."
rm -rf "$HOME/bin/fzf"; 
cp -rf "$DOTFILES_FOLDER/bin/fzf" "$HOME/bin"
"$HOME/bin/fzf/install" --no-completion --no-update-rc --no-key-bindings 1> /dev/null # Suppresses stdout messages but not stderr
echo -e "DONE\n"

# Copy in the vimfiles needed by .vimrc if necessary.
read -r -p "Do you wish to copy in vimfiles [y/n]? " answer
case $answer in
  [Yy]* ) 
    echo -n "Copying vimfiles..."; 
    rm -rf "$HOME/vimfiles"; 
    cp -rf "$DOTFILES_FOLDER/vimfiles" "$HOME/vimfiles";
    sed -i "s/Normal        ctermbg=234/Normal        ctermbg=232/" "$HOME/vimfiles/bundle/spacegray/colors/spacegray.vim";
    echo "DONE";;
  * ) 
    echo "Skipped copying vimfiles";; 
esac

# Copy in the Solr files if necessary
read -r -p "Do you wish to copy in solr [y/n]? " answerSolr
case $answerSolr in
  [Yy]* ) 
    if [ ! -f "$DOTFILES_FOLDER/bin/$SOLR_ZIP_FILE" ]; then
      echo "Downloading $SOLR_ZIP_FILE..."; 
      wget "$SOLR_DOWNLOAD_URL" -P "$DOTFILES_FOLDER/bin" -O "$SOLR_ZIP_FILE"
      mv "$SOLR_ZIP_FILE" "$DOTFILES_FOLDER/bin"
      # curl -L -O -J "$SOLR_DOWNLOAD_URL"
      echo "DONE";
    fi

    rm -rf "$HOME/bin/apache-solr"; 
    echo "Extracting $SOLR_ZIP_FILE to ~/bin/apache-solr..."; 
    unzip -q "$DOTFILES_FOLDER/bin/$SOLR_ZIP_FILE" -d "$HOME/bin";
    tempSolrFolder="${SOLR_ZIP_FILE%.zip}";
    mv "$HOME/bin/$tempSolrFolder" "$HOME/bin/apache-solr";
    cp "$DOTFILES_FOLDER/bin/$SOLR_ZIP_FILE" "$HOME/bin/apache-solr";
    echo "DONE";;
  * ) 
    echo "Skipped copying solr";; 
esac

echo -e "\nSuccessfully completed deployment"

