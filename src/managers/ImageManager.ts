type ImageData = {
  image: HTMLImageElement;
  loaded: boolean;
};
export class ImageManager {
  private images: { [name: string]: ImageData };

  constructor() {
    this.images = {};
  }

  load(name: string, path: string) {
    const img = new Image();
    this.images[name] = { image: img, loaded: false };
    img.onload = () => {
      this.images[name].loaded = true;
    };
    img.onerror = (e) => {
      console.warn(`Image load error: ${name} (will use fallback)`, e);
    };
    img.src = path;
  }

  get(name: string): HTMLImageElement | null {
    return this.images[name]?.loaded ? this.images[name].image : null;
  }

  loadAll() {
    this.load('player', '/images/player.png');
  }
}
