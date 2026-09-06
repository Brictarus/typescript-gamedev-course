import type { GameEventEmitter } from '../core/Events.ts';

export class UIManager {
  private readonly events: GameEventEmitter;

  private readonly hudEl: HTMLElement | null;
  private readonly timerEl: HTMLElement | null;
  private readonly healthBarFillEl: HTMLElement | null;

  private readonly mainMenuEl: HTMLElement | null;
  private readonly pauseMenuEl: HTMLElement | null;
  private readonly loadingScreenEl: HTMLElement | null;

  private readonly playBtnEl: HTMLElement | null;
  private readonly resumeBtnEl: HTMLElement | null;
  private readonly quitBtnEl: HTMLElement | null;

  constructor(events: GameEventEmitter) {
    this.events = events;

    this.hudEl = document.getElementById('hud');
    this.timerEl = document.getElementById('timer');
    this.healthBarFillEl = document.getElementById('healthBarFill');
    console.log('healthBarFillEl', this.healthBarFillEl);

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
