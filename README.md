# Simple user-servive

> This project uses Node 18.

Steps to run this project:
1. Clone this Repo
2. `cd ${ROOT_FOLDER_OF_THIS_PROJECT}`
3. Make sure Mongodb and Kafka is up and running
4. set the env vars 
5. Run `npm i` command
6. Run `npm start` command

Or run this service using docker-compose
make sure `DB_HOST` env var points to `mongo_db` docker service name
```bash
cd ${ROOT_FOLDER_OF_THIS_PROJECT}
docker-compose up -d
```
To tun typeorm-cli
`npm run typeorm -- {any typeorm command}`