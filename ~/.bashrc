# NVM Configuration
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Automatically use project's Node.js version if .nvmrc exists
cdnvm() {
    command cd "$@" || return $?
    nvm_path=$(nvm_find_up .nvmrc | tr -d '\n')

    if [[ $nvm_path != "" ]]; then
        nvm use
    elif [[ $(nvm version) != $(nvm version default) ]]; then
        nvm use default
    fi
}
alias cd='cdnvm'

cd . 