import { ReactNode } from "react";

export type ContentWidth = "full" | "boxed";

export type ThemeColor =
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "info"
  | "success";

export type BlankLayoutProps = {
  children: ReactNode;
};
