import type { Game } from '../core/Game.ts';

export class UIManager {
  private game: Game;
  private timerEl: HTMLElement | null;
  private mainMenuEl: HTMLElement | null;
  private pauseMenuEl: HTMLElement | null;
  private loadingScreenEl: HTMLElement | null;

  private playBtnEl: HTMLElement | null;
  private resumeBtnEl: HTMLElement | null;
  private quitBtnEl: HTMLElement | null;

  constructor(game: Game) {
    this.game = game;
    this.timerEl = document.getElementById('timer');
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
      this.game.startGame();
    });
    this.resumeBtnEl?.addEventListener('click', () => {
      this.game.resume();
    });
    this.quitBtnEl?.addEventListener('click', () => {
      this.game.returnToMenu();
    });
    [this.playBtnEl, this.resumeBtnEl, this.quitBtnEl].forEach((button) => {
      button?.addEventListener('mouseenter', () =>
        this.game.playSound('button_hover'),
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

  showTimer() {
    if (this.timerEl) {
      this.timerEl.style.display = 'block';
    }
  }

  hideTimer() {
    if (this.timerEl) {
      this.timerEl.style.display = 'none';
    }
  }

  updateTimer(time: number) {
    if (!this.timerEl) return;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    this.timerEl.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
  }
}
