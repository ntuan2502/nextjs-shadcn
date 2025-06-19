import { SVGProps } from "react";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  fill?: string;
  size?: number;
  height?: number;
  width?: number;
}
