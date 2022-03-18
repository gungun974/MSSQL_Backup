import { program } from 'commander';
import { keepLastFile, makeNewBackup } from './core';

program
  .name('mssql-backup')
  .description('CLI to backup mssql server')
  .version('1.0.0');

program
  .command('makeDailyBackup')
  .description('show all users')
  .option('--clean', 'Clean older files')
  .action(async (options) => {
    await makeNewBackup('day');
    if (options.clean) {
      await keepLastFile('day', 30);
    }
  });

program
  .command('makeMonthlyBackup')
  .description('show all users')
  .option('--clean', 'Clean older files')
  .action(async (options) => {
    await makeNewBackup('month');
    if (options.clean) {
      await keepLastFile('month', 12);
    }
  });
program
  .command('makeYearlyBackup')
  .description('show all users')
  .action(async () => {
    await makeNewBackup('year');
  });

program.parse(process.argv);
