## Run PostgreSQL on Docker
`docker run --name todoist -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres`
### Run test Database
`docker run --name test_todoist -p 5435:5432 -e POSTGRES_PASSWORD=postgres -d postgres`