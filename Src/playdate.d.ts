// Provides a WIP implementation of the Playdate API

declare function print(this: void, key: any, value?: any): void;
declare function require(this: void, source: string): void;

// Worth noting: The `this: void` is essentially the difference between
// a `x:y` call and a `x.y` in the transpiled output

declare const playdate: {
  leftButtonDown: (this: void) => void;
  rightButtonDown: (this: void) => void;
  upButtonDown: (this: void) => void;
  downButtonDown: (this: void) => void;
  AButtonDown: (this: void) => void;
  BButtonDown: (this: void) => void;

  leftButtonUp: (this: void) => void;
  rightButtonUp: (this: void) => void;
  upButtonUp: (this: void) => void;
  downButtonUp: (this: void) => void;
  AButtonUp: (this: void) => void;
  BButtonUp: (this: void) => void;

  update: (this: void) => void;

  buttonIsPressed: Function;
  buttonJustPressed: Function;
  cranked: Function;
  display: {
    getHeight: (this: void) => number;
    getWidth: (this: void) => number;
    getSize: (this: void) => number;
    getRect: (this: void) => number;
    setScale: (this: void, scale: number) => void
  };

  drawFPS: Function;
  easingFunctions: any;
  file: any;
  geometry: any;
  getCrankChange: Function;
  getCurrentTimeMilliseconds: Function;
  getSecondsSinceEpoch: Function;

  kButtonA: number;
  kButtonDown: number;
  kButtonLeft: number;
  kButtonRight: number;
  kButtonUp: number;

  pathfinder: any;
  readAccelerometer: Function;
  sound: any;
  startAccelerometer: Function;
  stop: Function;
  timer: any;
  ui: any;
  wait: Function;

  graphics: {
    animation: any;
    animator: any;
    drawArc: (this: void) => void;
    drawCircleAtPoint: (this: void) => void;
    drawCircleInRect: (this: void) => void;
    drawEllipseInRect: (this: void) => void;
    drawLine: (this: void) => void;
    drawLocalizedTextAligned: (this: void) => void;
    drawLocalizedTextInRect: (this: void) => void;
    drawPolygon: (this: void) => void;
    drawQRCode: (this: void) => void;
    drawRect: (this: void, x:number, y:number, width: number, height: number) => void;
    drawSineWave: Function;
    drawText: (this: void) => void;
    drawTextAligned: (this: void) => void;
    drawTextInRect: (this: void) => void;
    fillCircleAtPoint: (this: void) => void;
    fillCircleInRect: (this: void) => void;
    fillEllipseInRect: (this: void) => void;
    fillRect: (this: void, x:number, y:number, width: number, height: number) => void;
    fillRoundRect: (this: void) => void;
    fillTriangle: (this: void) => void;
    font: any;
    getClipRect: (this: void) => void;
    getFont: (this: void) => void;
    getImageDrawMode: (this: void) => void;
    getLocalizedText: (this: void) => void;
    getTextSize: (this: void) => void;
    getTextSizeForMaxWidth: (this: void) => void;
    image: any;
    imagetable: any;
    kColorBlack: any;
    kColorClear: any;
    kColorWhite: any;
    kDrawModeCopy: any;
    kDrawModeNXOR: any;
    nineSlice: any;
    popContext: (this: void) => void;
    pushContext: (this: void) => void;
    setClipRect: (this: void) => void;
    setColor: (this: void, color: number) => void;
    setFont: (this: void) => void;
    setFontTracking: (this: void) => void;
    setImageDrawMode: (this: void, ) => void;
    setPattern: (this: void, arr:number[]) => void;
    sprite: any;
    tilemap: any;
  };
};

