import { ImageSourcePropType } from "react-native/Libraries/Image/Image";

export type RegisterFlow = "normal" | "establishment";

export type UserTypeCardType = {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  pageNavigation: string;
  flow: RegisterFlow;
};
