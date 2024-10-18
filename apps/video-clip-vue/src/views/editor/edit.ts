import { AVCanvas } from "webav/packages/av-canvas";
import { IResolution } from "webav/packages/av-canvas/dist/types";
import { VisibleSprite, MP4Clip, ImgClip, renderTxt2ImgBitmap } from "webav/packages/av-cliper";

export enum TrackType {
  Video,
  Text,
  Audio,
  Image
}
export interface Snapshot {
  video?: VideoFrame | ImageBitmap | null;
  audio?: Float32Array[];
  state: "success" | "done";
}
export interface TimelineAction {
  id: string,
  start: number,
  end: number,
  data?: Array<Snapshot> | undefined | null
}
export interface TimelineRow {
  id: TrackType,
  actions: Array<TimelineAction>
}

function calcPlayerSize(elem: HTMLElement, radio = 16/9) {
  const width = elem.clientWidth
  const height = elem.clientHeight
  const containerRadiio = width / height
  if (containerRadiio > radio) {
    return {
      width: height * radio,
      height
    }
  } else {
    return {
      width,
      height: width / radio
    }
  }
}

export default class Editor {
  tlData: Array<TimelineRow>
  actionSpriteMap: WeakMap<TimelineAction, VisibleSprite>
  avCanvas: AVCanvas | null
  constructor() {
    this.tlData = [
      { id: TrackType.Video, actions: [] },
      { id: TrackType.Audio, actions: []},
      { id: TrackType.Text, actions: []},
      { id: TrackType.Image, actions: []}]
    this.actionSpriteMap = new WeakMap()
    this.avCanvas = null
  }
  async init(elem: HTMLCanvasElement, opt?: {
    bgColor: string;
    radio?: number;
  } & IResolution) {
    if (!elem) { return }
    const playerSize = calcPlayerSize(elem, opt?.radio || 16/9)
    const innerOpt = Object.assign({
      bgColor: '',
      width: playerSize.width,
      height: playerSize.height
    }, opt)
    this.avCanvas = new AVCanvas(elem, innerOpt)
    return this.avCanvas
  }
  async loadVideo(url: string) {
    const readable = (await fetch(url)).body
    if (!readable) { return null }
    const spr = new VisibleSprite(new MP4Clip(readable));
    await spr.ready
    await this.addSprite2Track({trackId: TrackType.Video, spr})
    this.avCanvas?.addSprite(spr)
    return spr
  }
  async loadText() {
    const spr = new VisibleSprite(new ImgClip(await renderTxt2ImgBitmap('default text', 'font-size: 14px; color: #fff;')))
    await spr.ready
    await this.addSprite2Track({trackId: TrackType.Text, spr})
    this.avCanvas?.addSprite(spr)
    return spr
  }

  async addSprite2Track({trackId, spr}: {trackId: TrackType, spr: VisibleSprite}) {
    const track = this.tlData.find(({id}) => id === trackId)
    if (!track) { return null }
    let data: Array<Snapshot> | undefined | null = null
    if (trackId === TrackType.Video) {
      data = await this.takeSnapshots(spr)
    }
    const action: TimelineAction = {
      id: Math.random().toString(),
      start: spr.time.offset,
      end: spr.time.offset + spr.time.duration,
      data
    }
    track.actions.push(action)
    return action
  }

  async takeSnapshots(spr: VisibleSprite, count: number = 20) {
    if (!spr) {
      return;
    }
    const clip = spr.getClip();
    if (!clip) {
      return;
    }
    const snapshots: Array<Snapshot> = []
    const duration = spr.time.duration;
    const sampleRate = duration / count;
    let start = 0;
    while (start < duration) {
      const snapshot = await clip.tick(start);
      if (snapshot) {
        snapshots.push(snapshot);
      }
      start += sampleRate;
    }
    return snapshots;
  }
}
