import { Logger } from 'tslog';

export const MainLogger: Logger = new Logger({ name: 'MainLogger' });

export const MSSQLLogger: Logger = new Logger({ name: 'HttpLogger' });

export const FileLogger: Logger = new Logger({ name: 'FileLogger' });
