/**
 * author: chenguzhen87
 * 视频剪辑时间线
 */

export interface TimelineCursorOptions {
  mode?: string,
  el: null | HTMLCanvasElement,
  canvasWidth?: number,
  canvasHeight?: number,
  minimumScale?: number,
  minimumScaleTime?: number,
  minimumScalesInLongScale?: number,
  lineWidth?: number,
  miniLineHeigh?: number,
  longLineHeight?: number,
  lineColor?: string,
  textColor?: string,
  longLineColor?: string,
  offestLeft?: number,
}

interface DrawLineOptions {
  beginX: number,
  beginY: number,
  endX: number,
  endY: number,
  lineColor: string,
  lineWidth: number
}

/**
* 画线
*/
function drawLine(ctx: CanvasRenderingContext2D, options: DrawLineOptions) {
  const { beginX, beginY, endX, endY, lineColor, lineWidth } = options;
  ctx.beginPath();
  ctx.moveTo(beginX, beginY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

/**
* 秒转成hh:mm:ss
* @param {number} value
*/
function formatSeconds(value: number) {
  const result = Math.floor(value);
  const hh =
      Math.floor(result / 3600) < 10
          ? "0" + Math.floor(result / 3600)
          : Math.floor(result / 3600);
  const mm =
      Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
  const ss =
      Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);
  return `${hh}:${mm}:${ss}`;
}

export default class TimelineCursor {
  config: Required<TimelineCursorOptions>
  ctx: CanvasRenderingContext2D | null
  constructor(config: TimelineCursorOptions) {
    this.config = Object.assign({}, {
      mode: "top",    // top 表示从顶部向下画线，bottom,表示从底部向上画线
      canvasWidth: 400, // canvas长度
      canvasHeight: 32, // canvas高度
      minimumScale: 8, // 一个小刻度长度(单位px)
      minimumScaleTime: 1, // 一个小刻度代表时间（单位秒）
      minimumScalesInLongScale: 10, // 一个长刻度中有几个最少刻度
      lineWidth: 1, // 刻度线宽
      miniLineHeigh: 6,
      longLineHeight: 12,
      offestLeft: 0, // 起始刻度线偏移距离（距离左边）
      lineColor: "#666", // 最小刻度线颜色
      longLineColor: "#000",// 最长刻度线颜色
      textColor: "#fff"
    }, config);

    if (!(this.config.el instanceof HTMLCanvasElement)) {
        throw new Error('[TimelineCursor] element should be an instance of HTMLCanvasElement');
    }
    if (this.config.canvasWidth) {
    this.config.el.width = this.config.canvasWidth;
    }
    if (this.config.canvasHeight) {
    this.config.el.height = this.config.canvasHeight;
    }
    this.ctx = this.config.el.getContext("2d");
    this.renderTimeLine();
    this.calc();
  }

  /**
  * 渲染时间线
  */
  renderTimeLine() {
    const ctx = this.ctx;
    if (!ctx) {
      return
    }
    const {
        canvasWidth,
        canvasHeight,
        lineColor,
        longLineColor,
        lineWidth,
        minimumScale,
        minimumScaleTime,
        minimumScalesInLongScale,
        offestLeft,
        miniLineHeigh,
        longLineHeight,
        textColor,
    } = this.config;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = textColor;
    ctx.font = "10px Actor";
    for (let i = 0; i < canvasWidth; i += minimumScale) {
        if (i % (minimumScale * minimumScalesInLongScale) == 0) {
            drawLine(ctx, {
                beginX: i + offestLeft,
                beginY: 0,
                endX: i + offestLeft,
                endY: longLineHeight,
                lineColor: longLineColor,
                lineWidth
            });
            const showTime = (i / minimumScale) * minimumScaleTime;
            ctx.fillText(formatSeconds(showTime), i + offestLeft, 24);
        } else {
            drawLine(ctx, {
                beginX: i + offestLeft,
                beginY: 0,
                endX: i + offestLeft,
                endY: miniLineHeigh,
                lineColor,
                lineWidth
            });
        }
    }
  };
  /**
  * 计算刻度数、总时长、px与s关系
  */
  calc () {
    const { canvasWidth, minimumScale, minimumScaleTime } = this.config;
    const ticks = Math.floor(canvasWidth / minimumScale); // 总刻度数
    const duration = ticks * minimumScaleTime; // 时间线表示总时长
    const scale = minimumScaleTime / minimumScale; // 1px 表示时间
    return { ticks: ticks, duration: duration, scale: scale };
  };
}
