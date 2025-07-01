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

export type ErrorList = {
  date: Date;
  message: String;
};

export type StoredData =
  | { settings: Settings; error?: never; errorList?: never }
  | { settings?: never; error?: Error; errorList?: never }
  | { errorList: ErrorList[]; error?: never; settings?: never };

//  export type StoredData = Settings;
