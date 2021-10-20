


#!/bin/bash

set -e

GH_TOKEN=${{secrets.GH_TOKEN}}
NPM_USER=${{secrets.NPM_USER}}
NPM_EMAIL=${{secrets.NPM_EMAIL}}

echo "${NPM_EMAIL}"

cd docs-dist
touch .nojekyll

git init
git add .
git config user.name "${NPM_USER}"
git config user.email "${npmEmail}"
git commit -m "docs(docs): update gh-pages"
git push --force --quiet "https://${GH_TOKEN}@github.com/RootLinkFE/components-docs-site" master:gh-pages

sleep 2

echo "Docs deployed!!";
