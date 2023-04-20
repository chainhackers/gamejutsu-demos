#!/usr/bin/zsh
source ~/.zshrc

set -eux
cd /home/gamejutsu/dev/actionsBuilds/gamejutsu-frontend-build-$1
pm2 delete gamejutsu-dev
pm2 start --name gamejutsu-dev "npx serve -p 3355 ."
