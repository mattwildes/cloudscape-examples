import { StatusIndicatorProps } from "@cloudscape-design/components";

export interface NavigationPanelState {
  collapsed?: boolean;
  collapsedSections?: Record<number, boolean>;
}

export interface Item {
  itemId: string;
  name: string;
  Name: string;
  type: string;
  status: StatusIndicatorProps.Type;
  Status: string;
  details: number;
  Description: string;
  AvailabilityZone: string;
  port: string;
}

export interface Output {
  itemId: string;
  name: string;
  type: string;
  status: StatusIndicatorProps.Type;
  details: number;
  port: string;
}