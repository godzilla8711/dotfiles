# git submodule deinit the_submodule
# git rm the_submodule 

# Submodules

# Create bin submodules
git submodule add https://github.com/junegunn/fzf.git ./bin/fzf

# Create vim plugin submodules
git submodule add https://github.com/ajh17/Spacegray.vim ./vimfiles/bundle/spacegray
git submodule add https://github.com/tpope/vim-surround.git ./vimfiles/bundle/surround
git submodule add https://github.com/tpope/vim-repeat.git ./vimfiles/bundle/repeat
git submodule add https://github.com/editorconfig/editorconfig-vim.git ./vimfiles/bundle/editorconfig
git submodule add https://github.com/sheerun/vim-polyglot.git ./vimfiles/bundle/polyglot # git checkout tags/v4.16.0
git submodule add https://github.com/itchyny/lightline.vim ./vimfiles/bundle/lightline
git submodule add https://github.com/itchyny/vim-gitbranch.git ./vimfiles/bundle/gitbranch
git submodule add https://github.com/junegunn/fzf.vim.git ./vimfiles/bundle/fzf
git submodule add https://github.com/preservim/nerdtree.git ./vimfiles/bundle/nerdtree
git submodule add https://github.com/dense-analysis/ale.git ./vimfiles/bundle/ale

