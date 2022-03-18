import { format } from 'date-fns';
import { TYPES } from 'mssql';
import { readdir, unlink } from 'fs/promises';
import { each } from 'async-parallel';
import { MSSQLConnection } from './MSSQLConnection';
import { FileLogger, MSSQLLogger } from './Logger';

export const makeNewBackup = async (folder: string) => {
  const db = await MSSQLConnection.connect();

  const date = format(new Date(), 'yyyy-MM-dd');

  MSSQLLogger.info('Try backup');
  try {
    await db.prepare('BACKUP DATABASE @database TO DISK = @path WITH NOFORMAT, NOINIT, NAME = \'@database\', SKIP, NOREWIND, NOUNLOAD, STATS = 10', [
      {
        name: 'database',
        type: TYPES.VarChar,
        value: process.env.MSSQL_DATABASE || '',
      },
      {
        name: 'path',
        type: TYPES.VarChar,
        value: `/mnt/backup/${process.env.FOLDER_NAME}/${folder}/${date}.bak`,
      },
    ]);
  } catch (e) {
    MSSQLLogger.error(e);
    throw e;
  }
  MSSQLLogger.info('Finish');
};

export const keepLastFile = async (folder: string, count: number) => {
  const path = `./data/${process.env.FOLDER_NAME}/${folder}`;
  const files = (await readdir(path, {
    withFileTypes: true,
  }))
    .filter(file => file.isFile())
    .map(file => file.name)
    .sort((a, b) => a < b ? 1 : -1)
    .slice(count);

  FileLogger.info('Deletes files : ', files.map((file) => `${path}/${file}`));

  await each(files, async (file) => {
    await unlink(`${path}/${file}`);
  });
};
