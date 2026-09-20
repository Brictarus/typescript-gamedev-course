import { enemyData } from '../data/enemyData.ts';
import { playerData } from '../data/playerData.ts';
import { particleData } from '../data/particleData.ts';

type ImageData = {
  image: HTMLImageElement;
  loaded: boolean;
};
export class ImageManager {
  private images: { [name: string]: ImageData };

  constructor() {
    this.images = {};
  }

  private load(name: string, path: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      this.images[name] = { image: img, loaded: false };
      img.onload = () => {
        this.images[name].loaded = true;
        resolve();
      };
      img.onerror = (e) => {
        console.warn(`Image load error: ${name} (will use fallback)`, e);
        resolve();
      };
      img.src = path;
    });
  }

  get(name: string): HTMLImageElement | null {
    return this.images[name]?.loaded ? this.images[name].image : null;
  }

  async loadAll(): Promise<void> {
    const imagesEntries = [
      ...Object.values(enemyData).flatMap((enemy) =>
        enemy.animData.sheets.map((sheet) => ({
          name: sheet,
          path: `/images/${sheet}.png`,
        })),
      ),
      ...playerData.animData.sheets.map((sheet) => ({
        name: sheet,
        path: `/images/${sheet}.png`,
      })),
      ...Object.values(particleData)
        .filter((p) => p.shape === 'image')
        .map((p) => ({
          name: p.image,
          path: `/images/${p.image}.png`,
        })),
    ];
    await Promise.all(
      imagesEntries.map(({ name, path }) =>
        this.load(name, document.baseURI + path),
      ),
    );
  }
}
