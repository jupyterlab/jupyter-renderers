#!/bin/bash
# To be executed in the examples root folder
git commit -am "Update extension template"

for directory in ./packages/*/
do
    pushd ${directory}
    copier update --trust -o inline
    git add --all .
    git commit --amend -m "Update extension template"
    popd
done

git reset HEAD~1
