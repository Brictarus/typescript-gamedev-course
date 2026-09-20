import type { GameEventEmitter } from '../core/Events.ts';
import { missionData } from '../data/missionData.ts';

const panelsIds = [
  'mainMenu',
  'pauseMenu',
  'loadingScreen',
  'gameOverMenu',
  'missionCompleteMenu',
] as const;

type PanelId = (typeof panelsIds)[number];

export class UIManager {
  private readonly events: GameEventEmitter;

  private readonly hudEl: HTMLElement | null;
  private readonly timerEl: HTMLElement | null;
  private readonly healthBarFillEl: HTMLElement | null;
  private readonly missionBriefingEl: HTMLElement | null;
  private readonly killCounterEl: HTMLElement | null;

  private readonly panels: Map<PanelId, HTMLElement | null>;

  private readonly buttonActions: { [key: string]: () => void } = {
    start: () => this.events.emit('game:start', undefined),
    resume: () => this.events.emit('game:resume', undefined),
    returnToMenu: () => this.events.emit('game:returnToMenu', undefined),
  };

  constructor(events: GameEventEmitter) {
    this.events = events;

    this.hudEl = document.getElementById('hud');
    this.timerEl = document.getElementById('timer');
    this.healthBarFillEl = document.getElementById('healthBarFill');
    this.missionBriefingEl = document.getElementById('missionBriefing');
    this.killCounterEl = document.getElementById('killCounter');

    this.panels = new Map<PanelId, HTMLElement | null>(
      panelsIds.map((panelId) => [panelId, document.getElementById(panelId)]),
    );

    this.setupEventListeners();
  }

  private setupEventListeners() {
    for (const action in this.buttonActions) {
      document
        .querySelectorAll(`[data-action="${action}"]`)
        .forEach((button) =>
          button.addEventListener('click', this.buttonActions[action]),
        );
    }

    document.querySelectorAll(`[data-action]`).forEach((button) => {
      button.addEventListener('mouseenter', () =>
        this.events.emit('sound', 'button_hover'),
      );
    });

    this.events.on('enemy:killCount', (count) => this.updateKillCounter(count));
  }

  hideAllPanels() {
    this.panels.forEach((panel) => panel?.classList.remove('active'));
  }

  showPanel(panelId: PanelId) {
    this.hideAllPanels();
    const panel = this.panels.get(panelId);
    if (!panel) {
      console.warn(`[UIManager] Unknown panel "${panelId}"`);
      return;
    }
    panel.classList.add('active');
  }

  showHud() {
    if (this.hudEl) {
      this.hudEl.style.display = 'block';
    }
  }

  hideHud() {
    if (this.hudEl) {
      this.hudEl.style.display = 'none';
    }
    this.hideMissionBriefing();
  }

  updateTimer(time: number) {
    if (!this.timerEl) return;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    this.timerEl.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  updateHealth(health: number, maxHealth: number) {
    if (!this.healthBarFillEl) return;
    const percentage = Math.min(1, Math.max(0, health / maxHealth));
    this.healthBarFillEl.style.setProperty('--health-pct', `${percentage}`);
  }

  showMissionBriefing() {
    if (!this.missionBriefingEl) return;

    this.missionBriefingEl.textContent = this.buildMissionBriefingText();
    this.missionBriefingEl.classList.add('visible');
  }

  hideMissionBriefing() {
    this.missionBriefingEl?.classList.remove('visible');
  }

  private buildMissionBriefingText() {
    return `Destroy ${missionData.killCount} enemies or survive ${missionData.surviveTime} seconds`;
  }

  updateKillCounter(count: number) {
    if (!this.killCounterEl) return;
    this.killCounterEl.textContent = `${count} / ${missionData.killCount}`;
  }
}
