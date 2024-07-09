#!/bin/bash

TIMESTAMP=$(date +%s)
BACKUP_FOLDER=$HOME/z_backup/temp
DOTFILES_FOLDER=$HOME/dotfiles
IS_COPY_BASHRC=Y

echo -e "Starting deployment...\n"
mkdir -p "$BACKUP_FOLDER"

echo -n "Copying in dotfiles..."

if [ $IS_COPY_BASHRC == 'Y' ]; then
  cp "$HOME/.bashrc" "$BACKUP_FOLDER/bashrc_$TIMESTAMP"
  cp "$DOTFILES_FOLDER/DOTS/DOT_bashrc" "$HOME/.bashrc"

  cp "$HOME/.bash_profile" "$BACKUP_FOLDER/bash_profile_$TIMESTAMP"
  cp "$DOTFILES_FOLDER/DOTS/DOT_bash_profile" "$HOME/.bash_profile"

  cp "$HOME/.bashrc_local" "$BACKUP_FOLDER/bashrc_local_$TIMESTAMP"
  cp "$DOTFILES_FOLDER/windows_only/DOT_bashrc_local" "$HOME/.bashrc_local"
fi

cp "$HOME/_vimrc" "$BACKUP_FOLDER/vimrc_$TIMESTAMP"
cp "$DOTFILES_FOLDER/windows_only/DOT_vimrc" "$HOME/_vimrc"

echo "DONE"

# Copy in the vimfiles needed by _vimrc if necessary.
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

