export interface LineMessage {
  type: string;
  text: string;
}

export interface LinePushBody {
  to: string;
  messages: LineMessage[];
}
