#!/bin/bash
docker run --name videomysql \
	-v $HOME/buscador-videos/db_data:/var/lib/mysql \
	-e MYSQL_ROOT_PASSWORD=videopass \
	-e MYSQL_DATABASE=videosdb \
	-e MYSQL_USER=vudeouser \
	-e MYSQL_PASSWORD=videopass \
	-p 3306:3306 \
	-d mysql:5.7;
