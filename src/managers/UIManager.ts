import type { Game } from '../core/Game.ts';

export class UIManager {
  private game: Game;
  private timerEl: HTMLElement | null;
  private mainMenuEl: HTMLElement | null;
  private pauseMenuEl: HTMLElement | null;
  private loadingScreenEl: HTMLElement | null;

  constructor(game: Game) {
    this.game = game;
    this.timerEl = document.getElementById('timer');
    this.mainMenuEl = document.getElementById('mainMenu');
    this.pauseMenuEl = document.getElementById('pauseMenu');
    this.loadingScreenEl = document.getElementById('loadingScreen');
    this.setupEventListeners();
  }

  private setupEventListeners() {
    document.getElementById('playBtn')?.addEventListener('click', () => {
      this.game.startGame();
    });
    document.getElementById('resumeBtn')?.addEventListener('click', () => {
      this.game.resume();
    });
    document.getElementById('quitBtn')?.addEventListener('click', () => {
      this.game.returnToMenu();
    });
    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('mouseenter', () =>
        this.game.audioManager.play('button_hover'),
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
