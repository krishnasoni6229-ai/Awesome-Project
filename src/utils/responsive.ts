import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const wp = (widthPercent: string | number) => {
  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent as string);
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * elemWidth) / 100);
};

const hp = (heightPercent: string | number) => {
  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent as string);
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * elemHeight) / 100);
};

export { wp, hp, SCREEN_WIDTH, SCREEN_HEIGHT };
