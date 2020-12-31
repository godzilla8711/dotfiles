#!/bin/bash

TIMESTAMP=$(date +%s)
BACKUP_FOLDER="$HOME/z_backup/temp"
DOTFILES_FOLDER="$HOME/dotfiles"

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

echo -e "\nSuccessfully completed deployment"

