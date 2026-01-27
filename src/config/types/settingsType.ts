export interface ISettings {
  id: string;
  showTotalVotes: boolean;
  updatedAt: string;
}

export interface SettingsUpdatePayload {
  showTotalVotes?: boolean;
}
