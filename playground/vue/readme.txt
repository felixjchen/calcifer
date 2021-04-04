This playground has node, vue, vim, git and curl. 

Port 80 on your playground is reverse proxied from https://{id}.project-calcifer.ml, this link can be found in the share tab.

NOTE: Given this current url, anyone can see this environment. Therefore please do not put any credentials on this service. 

Try:
vue create hello-world
cd hello-world
echo "module.exports = {devServer: {disableHostCheck: true}}" > vue.config.js
npm run serve -- --port 80