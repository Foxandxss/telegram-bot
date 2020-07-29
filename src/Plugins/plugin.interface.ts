export interface Plugin {
  command: string;
  description: string;
  fetchInProgress?: boolean;
  extraMsg?: string;

  exec(bot: any, msg: any);
}
