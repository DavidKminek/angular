export interface Clan {
  id: number;
  name: string;
  description: string;
  capacity: number;     // max number of members
  image?: string;
  memberIds: number[];  // ids of players (integrované vzťahy pomocou id)
}
