This is your playground environment, it comes with Docker. Port 80 on your playground is reverse proxied here: https://project-calcifer.ml/{host_id}. 

Anyone can see it with it's URL, therefore please do not put any credentials on this service. 

Try:
docker run -d -p 80:80 nginx
