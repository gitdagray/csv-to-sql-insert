#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

LC_ALL=C
bold=$(tput bold)
normal=$(tput sgr0)

echo "${bold}Running lint-staged${normal}"

# Disable concurent to run `check-types` after ESLint in lint-staged
cd "$(dirname "$0")/.." && npx lint-staged --concurrent false
