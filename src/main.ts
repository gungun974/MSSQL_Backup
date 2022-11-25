import cron from 'node-cron';
import { MainLogger } from './Logger';
import { keepLastFile, makeNewBackup } from './core';

const dailyCron = process.env.DAILY_CRON || '4 2 * * *';
const weeklyCron = process.env.WEEKLY_CRON || '4 4 * * 0';
const monthlyCron = process.env.MONTHLY_CRON || '6 4 1 * *';
const yearlyCron = process.env.YEARLY_CRON || '8 4 1 1 *';


cron.schedule(dailyCron, async () => {
  MainLogger.info('Execute', dailyCron);
  await makeNewBackup('day');
  await keepLastFile('day', 7);
});

cron.schedule(dailyCron, async () => {
  MainLogger.info('Execute', weeklyCron);
  await makeNewBackup('weekly');
  await keepLastFile('weekly', 4);
});

cron.schedule(monthlyCron, async () => {
  MainLogger.info('Execute', monthlyCron);
  await makeNewBackup('month');
  await keepLastFile('month', 12);
});

cron.schedule(yearlyCron, async () => {
  MainLogger.info('Execute', yearlyCron);
  await makeNewBackup('year');
});

