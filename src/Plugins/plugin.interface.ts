export interface Plugin {
  command: string;
  fetchInProgress?: boolean;

  exec();
}
