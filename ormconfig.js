require('dotenv')
  .config({ path: __dirname + `/.env.stage.${process.env.STAGE}`})

const dbConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: process.env.DB_SYNCHRONIZE,
  entities: ['**/*.entity.js'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.STAGE) {
  case 'dev':
    Object.assign(dbConfig, {
      // entities: ['**/*.entity.js'],
      migrationsRun: false,
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      // entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'prod':
    break;
  default:
    throw new Error('unknown environment');
}

module.exports = dbConfig;