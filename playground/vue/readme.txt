Alpine container with vue, node, npm, vim, git and curl. Port 80 on your playground is reverse proxied from https://{id}.project-calcifer.ml, see the share tab.

WARNING: Given the edit link, anyone can see this environment, please do not put any credentials on this service. 


Try:
vue create hello-world
cd hello-world
echo "module.exports = {devServer: {disableHostCheck: true}}" > vue.config.js
npm run serve -- --port 80