import { Player } from '../players/player.interface';

export interface Clan {
  id: number;
  name: string;
  description: string;
  capacity: number;
  profileImage?: string;
  members?: Player[];
}
