import { PlayerService } from './players.service';
import { Quest } from './player.interface';
import { QuestsService } from '../quests/quest.service';

export class PlayerDetail {
  constructor(
    private playerService: PlayerService,
    private questsService: QuestsService
  ) {}

  showPlayer(playerId: number) {
    const player = this.playerService.getPlayerById(playerId);
    if (!player) return;

    (document.getElementById('player-name') as HTMLElement).innerText =
      `${player.nickname} (Level: ${player.level})`;

    const questList = document.getElementById('quest-list')!;
    questList.innerHTML = '';
    if (player.quests) {
      player.quests.forEach((q: Quest) => {
        const li = document.createElement('li');
        li.innerText = q.title;

        const btn = document.createElement('button');
        btn.innerText = 'Remove';
        btn.onclick = () => {
          this.playerService.removeQuest(player.id, q.id);
          this.showPlayer(player.id);
        };

        li.appendChild(btn);
        questList.appendChild(li);
      });
    }

    const questSelect = document.getElementById('all-quests') as HTMLSelectElement;
    questSelect.innerHTML = '';
    this.questsService.quests().forEach((q: Quest) => {
      const option = document.createElement('option');
      option.value = q.id.toString();
      option.innerText = q.title;
      questSelect.appendChild(option);
    });

    const addBtn = document.getElementById('add-quest-btn')!;
    addBtn.onclick = () => {
      const selectedId = Number(questSelect.value);
      const quest = this.questsService.getQuestById(selectedId);
      if (quest) {
        this.playerService.addQuest(player.id, quest);
        this.showPlayer(player.id);
      }
    };
  }
}
