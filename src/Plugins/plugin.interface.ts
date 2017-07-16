export interface Plugin {
  command: string;
  description: string;
  fetchInProgress?: boolean;

  exec(bot: any, msg: any);
}
