import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as CiIcons from "react-icons/ci";
import * as SiIcons from "react-icons/si";
import * as TbIcons from "react-icons/tb";
import * as RiIcons from "react-icons/ri";
import * as DiIcons from "react-icons/di";
import * as GrIcons from "react-icons/gr";
import * as BsIcons from "react-icons/bs";
import * as RxIcons from "react-icons/rx";
import type { IconType } from "react-icons";

type IconPack = Record<string, IconType>;
const iconPacks: Record<
  "Fa" | "Ai" | "Ci" | "Si" | "Tb" | "Ri" | "Di" | "Gr" | "Bs" | "Rx",
  IconPack
> = {
  Fa: FaIcons,
  Ai: AiIcons,
  Ci: CiIcons,
  Si: SiIcons,
  Tb: TbIcons,
  Ri: RiIcons,
  Di: DiIcons,
  Gr: GrIcons,
  Bs: BsIcons,
  Rx: RxIcons,
};

type DynamicIconProps = {
  iconName: string;
  size?: number;
  color?: string;
};

export const DynamicIcon = ({
  iconName,
  size = 20,
  color = "currentColor",
}: DynamicIconProps) => {
  const prefix = iconName.slice(0, 2) as keyof typeof iconPacks;
  const pack = iconPacks[prefix];

  if (!pack) return null;

  const Icon = pack[iconName as keyof typeof pack];
  if (!Icon) return null;

  return <Icon size={size} color={color} />;
};
