/* eslint-disable no-param-reassign */
import { connect, ConnectionPool, ISqlType, PreparedStatement } from 'mssql';
import { MSSQLLogger } from './Logger';

const config = {
  server: process.env.MSSQL_IP || 'localhost',
  user: process.env.MSSQL_USER || 'sa',
  password: process.env.MSSQL_PASSWORD || '',
  database: process.env.MSSQL_DATABASE || '',
  requestTimeout: 120000,
  options: {
    encrypt: false,
    useUTC: false,
  },
};

interface MSSQLParameter {
  name: string,
  type: (() => ISqlType) | ISqlType,
  value: any
}

export class MSSQLConnection extends ConnectionPool {
  // eslint-disable-next-line no-use-before-define
  static db: MSSQLConnection;

  static async connect(): Promise<MSSQLConnection> {
    if (this.db) return this.db;

    MSSQLLogger.info('try connect to MSSQL');

    try {
      this.db = await connect(config) as MSSQLConnection;

      this.db.prepare = MSSQLConnection.prototype.prepare;

      MSSQLLogger.info('Successfully connected to MSSQL');
      return this.db;
    } catch (error) {
      MSSQLLogger.fatal('Fail to connect to MSSQL', error);
      throw error;
    }
  }

  async prepare(sql: string, parameters: MSSQLParameter[]) {
    const ps = new PreparedStatement(this);

    parameters.forEach((parameter) => {
      ps.input(parameter.name, parameter.type);
    });

    await ps.prepare(sql);
    const rows = await ps.execute(parameters.reduce((output: any, parameter) => {
      output[parameter.name] = parameter.value;
      return output;
    }, {}));
    await ps.unprepare();
    return rows;
  }
}
