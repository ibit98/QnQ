cd qnq-backend/
git init
git add .
git commit -am "deploy"
git push --force https://git.heroku.com/qnq-backend.git master
rm -rf .git
cd ..

