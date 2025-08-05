import { Group, SphereGeometry, MeshStandardMaterial, Mesh, TorusGeometry } from 'three';

export class ColorBlob {
  constructor(color, name, index, config) {
    this.color = color;
    this.name = name;
    this.index = index;
    this.config = config;
    this.group = new Group();
    this.isSelected = false;
    this.createGeometry();
  }

  createGeometry() {
    // Main sphere (blob)
    const geometry = new SphereGeometry(this.config.radius, 32, 32);
    const material = new MeshStandardMaterial({
      color: this.color,
      metalness: 0.2,
      roughness: 0.5,
    });
    this.mainSphere = new Mesh(geometry, material);
    this.mainSphere.name = 'ColorBlob_' + this.name;
    this.group.add(this.mainSphere);

    // Drip (ellipsoid)
    const dripGeometry = new SphereGeometry(this.config.radius * 0.35, 24, 24);
    dripGeometry.scale(1, 1.8, 1);
    const dripMaterial = new MeshStandardMaterial({
      color: this.color,
      metalness: 0.2,
      roughness: 0.5,
    });
    this.drip = new Mesh(dripGeometry, dripMaterial);
    this.drip.position.y = -this.config.radius * 1.3;
    this.drip.name = 'Drip';
    this.group.add(this.drip);

    // Drip tip (small sphere)
    const tipGeometry = new SphereGeometry(this.config.radius * 0.18, 16, 16);
    this.tip = new Mesh(tipGeometry, dripMaterial);
    this.tip.position.y = -this.config.radius * 2.1;
    this.tip.name = 'DripTip';
    this.group.add(this.tip);

    // Overflow (torus/cap) - only visible for selected blob
    const overflowGeometry = new TorusGeometry(
      this.config.radius * 0.7,
      this.config.radius * 0.13,
      16,
      32
    );
    const overflowMaterial = new MeshStandardMaterial({
      color: this.color,
      metalness: 0.3,
      roughness: 0.3,
    });
    this.overflow = new Mesh(overflowGeometry, overflowMaterial);
    this.overflow.position.y = this.config.radius * 0.95;
    this.overflow.rotation.x = Math.PI / 2;
    this.overflow.visible = false;
    this.overflow.name = 'Overflow';
    this.group.add(this.overflow);
  }

  setPosition(x, y, z) {
    this.group.position.set(x, y, z);
  }

  setSelected(selected) {
    this.isSelected = selected;
    this.mainSphere.scale.setScalar(selected ? 1.3 : 1);
    this.mainSphere.material.emissive.set(selected ? 0x333333 : 0x000000);
    this.overflow.visible = selected;
  }

  animate(time) {
    // Animate drip (ellipsoid)
    const stretch = 1.8 + 0.2 * Math.sin(time * 2 + this.index);
    this.drip.scale.set(1, stretch, 1);

    // Animate drip tip (falling drop)
    const dropCycle = (time * 0.7 + this.index * 0.3) % 1.0;
    this.tip.position.y = -this.config.radius * 2.1 - dropCycle * this.config.radius * 1.5;

    // Animate overflow (pulse) only for selected blob
    if (this.isSelected) {
      const pulse = 1 + 0.08 * Math.sin(time * 3);
      this.overflow.scale.setScalar(pulse);
    } else {
      this.overflow.scale.setScalar(1);
    }
  }

  getMainSphere() {
    return this.mainSphere;
  }

  destroy() {
    this.group.removeFromParent();
  }
}
