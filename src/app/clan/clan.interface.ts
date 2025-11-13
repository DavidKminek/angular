// clan.interface.ts
export interface Clan {
  id: number;
  name: string;
  description: string;
  capacity: number;
  profileImage?: string;
  memberIds?: number[]; 
}
