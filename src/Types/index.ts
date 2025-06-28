/* export interface storedData {
  settings?: {
    iniTime: string;
    endTime: string;
    color: string;
  };
  Error?: string;
} */
export interface Color {
  dayColor: string;
  nightColor: string;
}

export interface Settings {
  iniTime: string;
  endTime: string;
  color: Color;
  brightness: number;
  error?: Error;
}

export interface Error {
  message: string;
}

export type StoredData =
  | { settings: Settings; error?: never }
  | { settings?: never; error?: Error };

//  export type StoredData = Settings;
