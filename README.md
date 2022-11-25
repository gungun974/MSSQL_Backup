# MSSQL_Backup

## About

`mssql_backup` is a tiny docker image I made to automatically back up my production MSSQL Server machine.

Feel free to use or fork this project.

## Build

### Source

1. Install `nodejs` & `yarn`.
2. Clone this project.
3. Run `yarn` to install dependencies.
4. Run `yarn dev` to start the program.
5. Run `yarn build` to build for prod.

### Docker image

To build the docker image simply edit & use `build_and_publish.sh` or use `docker build . -t mssql_backup`.

## Usage

### From Source

You need symlink `data` folder with `/mnt/backup`

Run `node main.ts` to start cron services.

Run `node cli` to access the CLI to manual backup your database.

*You need to specify [environments variables](#Environments variables) to connect to your database.*

### From Docker

You need mount `/app/data` folder with `/mnt/backup`.

Simply use `docker run gungun974/mssql_backup` with right [environments variables](#Environments variables).

For to access the CLI use `docker exec -it mssql_backup_container node cli`.

### Environments variables

| Variables      | Default Value | Description                             |
|----------------|---------------|-----------------------------------------|
| DAILY_CRON     | 2 4 * * *     | Run daily backup at 04:02               |
| WEEKLY_CRON    | 4 4 * * 0     | Run weekly backup at 04:04              |
| MONTHLY_CRON   | 6 4 1 * *     | Run monthly backup at 04:06             |
| YEARLY_CRON    | 8 4 1 1 *     | Run yearly backup at 04:08              |
| MSSQL_IP       | localhost     | Ip address of MSSQL Database            |
| MSSQL_USER     | sa            | User used for backup MSSQL Database     |
| MSSQL_PASSWORD |               | Password used for backup MSSQL Database |
| MSSQL_DATABASE |               | Database need to been backup            |
| FOLDER_NAME    |               | Use to separate multiple database       |

