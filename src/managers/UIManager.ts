import type { GameEventEmitter } from '../core/Events.ts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  private readonly mainMenuEl: HTMLElement | null;
  private readonly pauseMenuEl: HTMLElement | null;
  private readonly loadingScreenEl: HTMLElement | null;
  private readonly gameOverMenuEl: HTMLElement | null;
  private readonly missionCompleteMenuEl: HTMLElement | null;

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

    this.mainMenuEl = document.getElementById('mainMenu');
    this.pauseMenuEl = document.getElementById('pauseMenu');
    this.loadingScreenEl = document.getElementById('loadingScreen');
    this.gameOverMenuEl = document.getElementById('gameOverMenu');
    this.missionCompleteMenuEl = document.getElementById('missionCompleteMenu');

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
  }

  hideAllPanels() {
    [
      this.mainMenuEl,
      this.pauseMenuEl,
      this.loadingScreenEl,
      this.gameOverMenuEl,
      this.missionCompleteMenuEl,
    ].forEach((panel) => panel?.classList.remove('active'));
  }

  showPanel(panelId: PanelId) {
    this.hideAllPanels();
    this[`${panelId}El`]?.classList.add('active');
    document.getElementById(panelId)?.classList.add('active');
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
  }

  updateTimer(time: number) {
    if (!this.timerEl) return;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    this.timerEl.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  updateHealth(health: number, maxHealth: number) {
    if (!this.healthBarFillEl) return;
    const percentage = Math.max(0, health / maxHealth);
    this.healthBarFillEl.style.setProperty('--health-pct', `${percentage}`);
  }
}
