import type { GameEventEmitter } from '../core/Events.ts';

export class UIManager {
  private readonly events: GameEventEmitter;

  private hudEl: HTMLElement | null;
  private timerEl: HTMLElement | null;
  private healthBarFillEl: HTMLElement | null;

  private mainMenuEl: HTMLElement | null;
  private pauseMenuEl: HTMLElement | null;
  private loadingScreenEl: HTMLElement | null;

  private playBtnEl: HTMLElement | null;
  private resumeBtnEl: HTMLElement | null;
  private quitBtnEl: HTMLElement | null;

  constructor(events: GameEventEmitter) {
    this.events = events;

    this.hudEl = document.getElementById('hud');
    this.timerEl = document.getElementById('timer');
    this.healthBarFillEl = document.getElementById('healthBarFill');

    this.mainMenuEl = document.getElementById('mainMenu');
    this.pauseMenuEl = document.getElementById('pauseMenu');
    this.loadingScreenEl = document.getElementById('loadingScreen');

    this.playBtnEl = document.getElementById('playBtn');
    this.resumeBtnEl = document.getElementById('resumeBtn');
    this.quitBtnEl = document.getElementById('quitBtn');

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.playBtnEl?.addEventListener('click', () => {
      this.events.emit('game:start', undefined);
    });
    this.resumeBtnEl?.addEventListener('click', () => {
      this.events.emit('game:resume', undefined);
    });
    this.quitBtnEl?.addEventListener('click', () => {
      this.events.emit('game:returnToMenu', undefined);
    });
    [this.playBtnEl, this.resumeBtnEl, this.quitBtnEl].forEach((button) => {
      button?.addEventListener('mouseenter', () =>
        this.events.emit('sound', 'button_hover'),
      );
    });
  }

  hideAllPanels() {
    [this.mainMenuEl, this.pauseMenuEl, this.loadingScreenEl].forEach((panel) =>
      panel?.classList.remove('active'),
    );
  }

  showPanel(panelId: 'mainMenu' | 'pauseMenu' | 'loadingScreen') {
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
}
