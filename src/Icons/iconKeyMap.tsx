import type { IconType } from "./Icon";

import { Download } from "./Download";
import { Offline } from "./Offline";
import { Warning } from "./Warning";
import { Loading } from "./Loading";

// icon keys are mapped to load states and default messages
export const iconKeys = {
  Error: "Error",
  Initial: "Initial",
  Load: "Load",
  Loaded: "Loaded",
  Loading: "Loading",
  NoIcon: "NoIcon",
  Offline: "Offline",
};

export type IconKeys = keyof typeof iconKeys;

// consumers can override the expected icons
export const iconMap = {
  [iconKeys.Error]: Warning,
  [iconKeys.Initial]: null,
  [iconKeys.Load]: Download,
  [iconKeys.Loaded]: null,
  [iconKeys.Loading]: Loading,
  [iconKeys.NoIcon]: null,
  [iconKeys.Offline]: Offline,
};

export type IconMap = Partial<Record<IconKeys, IconType>>;
