# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
    . /etc/bashrc
fi

# Uncomment the following line if you don't like systemctl's auto-paging feature:
# export SYSTEMD_PAGER=

# User specific aliases and functions

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Set terminal prompt 
PS1="(bastion) \w \[$(tput bold)\]\[\033[38;5;204m\]@\[$(tput sgr0)\] \A\[$(tput sgr0)\] \[$(tput bold)\]\[\033[38;5;204m\]λ\[$(tput sgr0)\] "
export PS1

# Git autocomplete
if [ -f ~/.git-completion.bash ]; then
    . ~/.git-completion.bash
fi

# Helpful aliases
alias cls="clear"
alias cp="cp -iv"
alias mv="mv -iv"