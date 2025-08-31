const currentTime = new Date().toLocaleTimeString();
const iniTime = "21:28:18";

console.log("currentTime=====", currentTime);
console.log("iniTime=====", iniTime);

console.log(currentTime > iniTime);

const errorList = [
  {
    date: "2025-08-31T15:41:37.396Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T18:18:47.569Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T18:23:47.274Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T18:28:46.907Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T18:33:52.924Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T18:38:47.903Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T18:43:47.586Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T18:48:47.241Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T18:53:48.086Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T18:58:47.648Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T19:03:47.674Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T19:08:48.040Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T19:09:23.142Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T19:10:59.221Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T19:12:09.030Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
  {
    date: "2025-08-31T19:12:52.508Z",
    message:
      'Error to get Internal Forecast Data!" Error: SyntaxError: JSON Parse error: Unexpected character: F',
  },
];
console.table(JSON.stringify(errorList, null, 2));

const removeFirstElement = [1, 2, 3, 4, 5];
removeFirstElement.push(6);
console.log("Tabela completa==============", removeFirstElement);
removeFirstElement.shift();
console.log("Primeiro elemento removido==============", removeFirstElement);
