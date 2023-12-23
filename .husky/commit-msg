#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

LC_ALL=C
bold=$(tput bold)
normal=$(tput sgr0)

echo "${bold}Running commitlint${normal}"

cd "$(dirname "$0")/.." && npx --no -- commitlint --edit $1
