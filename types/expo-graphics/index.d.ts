declare module 'expo-graphics' {
  export interface ContextCreateProps {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    scale: number;
  }
  export interface ExpoGraphicsViewProps {
    onContextCreate: (props: ContextCreateProps) => any;
    onRender: (delta: number) => any;
  }
  export const View: React.FunctionComponent<ExpoGraphicsViewProps>;
}
