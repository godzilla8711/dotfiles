" Following 2 lines needed to support vim versions prior to 8.0
set nocompatible
filetype plugin indent on

" <---------------------- Windows-only START
" source $VIMRUNTIME/mswin.vim
" behave mswin
" runtime! mswin.vim
" unmap <C-F>
"
" set termguicolors
" set guifont=consolas:h11
" <---------------------- Windows-only END

" <---------------------- Linux-only START
" Enable/disable "set paste" when copying in text, preserving original indentation
set paste
let &t_SI .= "\<Esc>[?2004h"
let &t_EI .= "\<Esc>[?2004l"

inoremap <special> <expr> <Esc>[200~ XTermPasteBegin()

function! XTermPasteBegin()
  set pastetoggle=<Esc>[201~
  set paste
  return ""
endfunction
" <---------------------- Linux-only END

set history=100
set ruler
set nohlsearch  "don't highlight search results" home directory.

" tabs and indenting
set tabstop=2
set shiftwidth=2
set autoindent
set expandtab

" Enable automatic file extension detection.
syntax enable

" Disable creation of a .swp file and ~ backup file
set noswapfile
set nobackup

" Some good key mappings
let mapleader = ","
nnoremap L $
nnoremap H 0

" Load plug-ins by copying from github each plugin into your ~/vimfiles/bundle
" folder for windows or your ~/.vim/bundle folder for unix. Then update the
" runpath to include each plugin.

" Surround plugin
set runtimepath+=~/vimfiles/bundle/surround
set runtimepath+=~/vimfiles/bundle/repeat

" FZF plugin
"   Run:    git clone --depth 1 https://github.com/junegunn/fzf.git /home/tony/dotfiles/bin/fzf
"   Run:    /home/tony/dotfiles/bin/fzf/install
"   Update: .vimrc: nnoremap <C-p> :<C-u>FZF<CR>
"   Run:    git clone https://github.com/junegunn/fzf.vim.git ~/vimfiles/bundle/fzf
set runtimepath+=/home/tony/dotfiles/bin/fzf
set runtimepath+=~/vimfiles/bundle/fzf
nnoremap <C-p> :<C-u>FZF<CR>

" Color scheme plugin
" <---------------------- Linux-only START
" Change first occurrence of this in vimfiles/bundle/spacegray/colors/spacegray.vim
" from "ctermbg=234" to "ctermbg=232"
" <---------------------- Linux-only END
set runtimepath+=~/vimfiles/bundle/spacegray
colorscheme spacegray

" Language pack plugin
let g:polyglot_disabled = ['markdown']
set runtimepath+=~/vimfiles/bundle/polyglot
" set runtimepath+=~/vimfiles/bundle/javascript
" set runtimepath+=~/vimfiles/bundle/json
" set runtimepath+=~/vimfiles/bundle/jsx

" Misc plugins
set runtimepath+=~/vimfiles/bundle/editorconfig

" NERDTree Settings
set runtimepath+=~/vimfiles/bundle/nerdtree
map <C-n> :NERDTreeToggle<CR>
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif
" let NERDTreeIgnore=['node_modules$[[dir]]', '.git$[[dir]]']
" let NERDTreeIgnore=['.git$[[dir]]']
" let g:jsx_ext_required = 0
" autocmd vimenter * NERDTree

" ALE settings for linting
set runtimepath+=~/vimfiles/bundle/ale
map <C-l> :ALELint<CR>
let g:ale_sign_column_always = 0
let g:ale_lint_on_save = 1
let g:ale_lint_on_enter = 1
let g:ale_lint_on_file_type_changed = 1
let g:ale_lint_on_text_changed = 'always'
" let g:ale_lint_on_text_changed = 'never'
" let g:ale_lint_on_save = 0
" let g:ale_lint_on_enter = 0
" let g:ale_lint_on_file_type_changed = 0
" let b:ale_linters = ['eslint']
"" let g:ale_lint_delay = 200
"" let g:ale_history_enabled = 0

" Lightline status bar plugin
set runtimepath+=~/vimfiles/bundle/lightline
set runtimepath+=~/vimfiles/bundle/gitbranch
set laststatus=2
set noshowmode
let g:unite_force_overwrite_statusline = 0
let g:vimfiler_force_overwrite_statusline = 0
let g:lightline = {
  \ 'colorscheme': 'wombat',
  \ 'active': {
  \   'left': [ [ 'mode' ], 
  \             [ 'gitbranch', 'filename', 'modified' ] ],
  \   'right': [ [ 'lineinfo' ],
  \              [ 'percent' ],
  \              [ 'filetype' ] ]
  \ },
  \ 'component_function': {
  \   'gitbranch': 'FugitiveHead'
  \ },
  \ }

" Syntastic settings for linting
" set runtimepath+=~/vimfiles/bundle/syntastic
" map <C-l> :SyntasticCheck<CR>
" let g:syntastic_javascript_checkers = ['eslint']
" let g:syntastic_check_on_open = 0
" let g:syntastic_check_on_wq = 0

" ---------------------------
" Archive START
" colorscheme tony
" set guifont=courier:h11
" winpos 105 136
" set lines=31
" set columns=95
" Archive END
" ---------------------------

