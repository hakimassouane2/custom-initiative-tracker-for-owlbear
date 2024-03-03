export enum InitiativeItemType {
  PC = "PC",
  FRIENDLY = "FRIENDLY",
  ENEMMY = "ENNEMY",
  NEUTRAL = "NEUTRAL",
}

export interface InitiativeItem {
  count: string;
  name: string;
  id: string;
  active: boolean;
  visible: boolean;
  visibleRealName: boolean;
  type: InitiativeItemType;
}
