import { Assets, Graphics, Point, RenderTexture, Container, Sprite, BlurFilter } from 'pixi.js';
import { OperateSize, mosaicSizeMap, OperateType } from '../constants/enum';
import {v4 as uuidv4} from 'uuid';
import type EditorApp from './EditorApp';
class MosaicGraphics {
  public id: string;
  public type: OperateType;
  public path: Point[] = [];
  public sprite: Sprite | null = null;
  public size: OperateSize;
  private brushSize: number;
  private editor: EditorApp;
  public brush: Graphics;
  public brushLine: Graphics;
  private mosaicContainer: Container;
  private renderTexture: RenderTexture | null = null;
  private lastDrawnPoint: Point | null = null;
  private imageScale: number;
  constructor(editor: EditorApp, mosaicContainer: Container, mosaicSize: OperateSize, imageScale: number) {
    this.id = uuidv4();
    this.editor = editor;
    this.type = OperateType.MOSAIC;
    this.mosaicContainer = mosaicContainer;
    this.size = mosaicSize;
    this.brushSize = mosaicSizeMap[this.size];
    this.imageScale = imageScale;
    this.brush = new Graphics().circle(0, 0, this.brushSize / imageScale).fill({ color: 0xffffff });
    this.brushLine = new Graphics();
  }

  async loadMosaic(mosaicSrc: string | null){
      if(!this.editor.app || !mosaicSrc) return;
      const texture = await Assets.load(mosaicSrc);
      this.sprite = new Sprite(texture);
      const filter = new BlurFilter({
          strength: 20,      // Overall blur strength
          quality: 2,       // Blur quality (higher = better but slower)
          kernelSize: 5     // Size of blur kernel matrix
      });
      this.sprite.filters = [filter];
      this.renderTexture = RenderTexture.create({width: this.editor.app.screen.width, height: this.editor.app.screen.height});
      const renderTextureSprite = new Sprite(this.renderTexture);
      // 
      this.sprite.mask = renderTextureSprite;
      // 加入新的 sprite
      this.mosaicContainer.addChild(this.sprite);
    }
  drawMosaic(path: Point[]){
    if(path.length === 0) return;
    path.forEach((point) => {
      this.draw(point)
    })
  }
  draw(point: Point) {
    const { x, y } = point;
    this.path.push(point);
    this.brush.position.set(x, y);
    this.editor.app.renderer.render({
      container: this.brush,
      target: this.renderTexture!,
      clear: false,
    });
    if (this.lastDrawnPoint) {
      this.brushLine
        .clear()
        .moveTo(this.lastDrawnPoint.x, this.lastDrawnPoint.y)
        .lineTo(x, y)
        .stroke({ width: this.brushSize / this.imageScale * 2, color: 0xffffff });
      this.editor.app.renderer.render({
        container: this.brushLine,
        target: this.renderTexture!,
        clear: false,
      });
    }
    this.lastDrawnPoint = this.lastDrawnPoint || new Point();
    this.lastDrawnPoint.set(x, y);
  }
}

export default MosaicGraphics;
