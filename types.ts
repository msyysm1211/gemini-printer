export interface CardData {
  id: string;
  text: string;
  timestamp: string;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
}

export interface GenerateResponse {
  text: string;
}
