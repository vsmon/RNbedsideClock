//import {TOKEN_OPENWEATHER} from "./tokens";

const TOKEN_OPENWEATHER = process.env.TOKEN_OPENWEATHER


export default async function getForecast(){
    try {
        const URL:string = `https://api.openweathermap.org/data/3.0/onecall?lat=-23.521221&lon=-47.436546&units=metric&lang=pt_br&exclude=minutely&appid=${TOKEN_OPENWEATHER}`

        const resp = await fetch(URL)
        const json = await resp.json()

        return json
    } catch (error) {
        console.log('Error to get forecast data!', error)
    }
}