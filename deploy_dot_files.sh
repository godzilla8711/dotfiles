
TIMESTAMP=$(date +%s)
BACKUP_FOLDER="$HOME/z_backup/temp"
DOTFILES_FOLDER="$HOME/dotfiles"

mkdir -p "$BACKUP_FOLDER"

cp "$HOME/.bashrc" "$BACKUP_FOLDER/bashrc_$TIMESTAMP"
cp "$HOME/.bash_profile" "$BACKUP_FOLDER/bash_profile_$TIMESTAMP"
cp "$HOME/.bashrc_local" "$BACKUP_FOLDER/bashrc_local_$TIMESTAMP"
cp "$HOME/.vimrc" "$BACKUP_FOLDER/vimrc_$TIMESTAMP"

cp "$DOTFILES_FOLDER/DOT_bashrc" "$HOME/.bashrc"
cp "$DOTFILES_FOLDER/DOT_bash_profile" "$HOME/.bash_profile"
cp "$DOTFILES_FOLDER/DOT_bashrc_local" "$HOME/.bashrc_local"
cp "$DOTFILES_FOLDER/DOT_vimrc" "$HOME/.vimrc"

