import { createConnection, getConnection } from 'typeorm';

const connection = {
  async create() {
    await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: process.env.DB_SSL_CERT
        ? {
            rejectUnauthorized: true,
            ca: process.env.DB_SSL_CERT,
          }
        : false,
      entities: ['src/modules/**/*.entity.{ts,js}'],
      migrations: ['src/migrations/*.{ts,js}'],
    });
  },

  async close() {
    await getConnection().close();
  },

  async clear() {
    const dbConnection = getConnection();
    const entities = dbConnection.entityMetadatas;

    entities.forEach(async entity => {
      const repository = dbConnection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
  },

  async insert(entity: any, values: any[]) {
    const dbConnection = getConnection();
    await dbConnection
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values(values)
      .execute();
  },

  async update(objects: { entity: any; values: object; condition: object }) {
    const { condition, entity, values } = objects;
    const dbConnection = getConnection();
    const db = dbConnection.createQueryBuilder().update(entity).set(values);

    Object.entries(condition).forEach(([key, value]) => {
      db.andWhere(`${key} = :${key}`, { [key]: value });
    });

    await db.execute();
  },
};
export default connection;
