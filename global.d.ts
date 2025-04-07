declare module 'expo-screen-orientation' {
  export enum Orientation {
    PORTRAIT_UP,
    PORTRAIT_DOWN,
    LANDSCAPE_LEFT,
    LANDSCAPE_RIGHT,
  }

  export interface OrientationInfo {
    orientation: Orientation;
  }

  export function getOrientationAsync(): Promise<Orientation>;
  export function addOrientationChangeListener(
    listener: (event: { orientationInfo: OrientationInfo }) => void
  ): { remove: () => void };
  export function removeOrientationChangeListener(
    subscription: { remove: () => void }
  ): void;
}
