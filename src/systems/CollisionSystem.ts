type CircleCollider = {
  collisionRadius: number;
  centerX(): number;
  centerY(): number;
};

export class CollisionSystem {
  checkCircleCircle(a: CircleCollider, b: CircleCollider) {
    const ax = a.centerX();
    const ay = a.centerY();

    const bx = b.centerX();
    const by = b.centerY();

    const dx = ax - bx;
    const dy = ay - by;
    const distSq = dx * dx + dy * dy;
    const radSum = a.collisionRadius + b.collisionRadius;

    return distSq < radSum * radSum;
  }
}
