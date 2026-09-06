type CircleCollider = {
  x: number;
  y: number;
  width: number;
  height: number;
  collisionRadius: number;
};

export class CollisionSystem {
  checkCircleCircle(a: CircleCollider, b: CircleCollider) {
    const ax = a.x + a.width / 2;
    const ay = a.y + a.height / 2;

    const bx = b.x + b.width / 2;
    const by = b.y + b.height / 2;

    const dx = ax - bx;
    const dy = ay - by;
    const distSq = dx * dx + dy * dy;
    const radSum = a.collisionRadius + b.collisionRadius;

    return distSq < radSum * radSum;
  }
}
