#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

LC_ALL=C
bold=$(tput bold)
normal=$(tput sgr0)
RED='\033[0;31m'
YLW='\033[0;33m'
NC='\033[0m' # No Color

local_branch_name="$(git rev-parse --abbrev-ref HEAD)"

valid_branch_regex='^(develop|feature|chore|fix|test|lib|docs|perf|release|hotfix)\/[a-z0-9._-]+$'

message="\nerror: Branch names in this project must adhere to this contract: ${bold}$valid_branch_regex.${normal} \n\nRename your branch and try again. \n"

if [[ ! $local_branch_name =~ $valid_branch_regex ]]; then
  echo "${RED}$message"
  exit 1
fi

exit 0
