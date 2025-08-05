import { ColorBlob } from './ColorBlob.js';

export class ColorPalette {
  constructor(scene) {
    this.scene = scene;
    this.blobs = [];
    this.selectedIndex = 0;
    this.config = {
      y: 5,
      z: 0.68,
      x: -5.72,
      spacing: 1.2,
      radius: 0.5,
      rotation: 1.6,
    };
    this.colors = [
      { name: 'Red', color: '#ff0000' },
      { name: 'Green', color: '#00ff00' },
      { name: 'Blue', color: '#0000ff' },
      { name: 'Yellow', color: '#ffff00' },
      { name: 'Purple', color: '#8000ff' },
      { name: 'Black', color: '#000000' },
      { name: 'White', color: '#ffffff' },
    ];
  }

  create() {
    this.destroy();
    this.colors.forEach((entry, i) => {
      const blob = new ColorBlob(entry.color, entry.name, i, this.config);
      const localX = (i - (this.colors.length - 1) / 2) * this.config.spacing;
      const localZ = 0;
      const rotatedX =
        Math.cos(this.config.rotation) * localX - Math.sin(this.config.rotation) * localZ;
      const rotatedZ =
        Math.sin(this.config.rotation) * localX + Math.cos(this.config.rotation) * localZ;
      blob.setPosition(this.config.x + rotatedX, this.config.y, this.config.z + rotatedZ);
      blob.setSelected(i === this.selectedIndex);
      this.scene.add(blob.group);
      this.blobs.push(blob);
    });
  }

  destroy() {
    this.blobs.forEach((blob) => blob.destroy());
    this.blobs = [];
  }

  update() {
    const time = performance.now() * 0.001;
    this.blobs.forEach((blob) => blob.animate(time));
  }

  select(index) {
    if (index >= 0 && index < this.blobs.length) {
      this.blobs[this.selectedIndex].setSelected(false);
      this.selectedIndex = index;
      this.blobs[this.selectedIndex].setSelected(true);
    }
  }

  getSelectedColor() {
    return this.colors[this.selectedIndex].color;
  }

  getBlobsForRaycasting() {
    return this.blobs.map((blob) => blob.getMainSphere());
  }

  findBlobByMesh(mesh) {
    return this.blobs.find((blob) => blob.getMainSphere() === mesh);
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.create();
  }
}
