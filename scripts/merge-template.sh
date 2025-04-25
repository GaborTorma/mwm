#!/bin/bash
if [ -z "$(git status --untracked-files=no --porcelain)" ]; then 
  git fetch --all
  git merge template/main --allow-unrelated-histories
else 
  echo "Please commit your changes before merging the template"
fi

