import type { Game } from '../core/Game.ts';

export class UIManager {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
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
    document
      .querySelectorAll('.ui-panel')
      .forEach((panel) => panel.classList.remove('active'));
  }

  showPanel(panelId: string) {
    this.hideAllPanels();
    document.getElementById(panelId)?.classList.add('active');
  }

  showTimer() {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
      timerElement.style.display = 'block';
    }
  }

  hideTimer() {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
      timerElement.style.display = 'none';
    }
  }

  updateTimer(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const timerElement = document.getElementById('timer');
    if (timerElement) {
      timerElement.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
    }
  }
}
