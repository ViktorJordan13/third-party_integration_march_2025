// Ovoj fajl e servis za biznis logikata

const config = require('../config');

const CACHE = {};
// skopje: {
//    timestamp: 123456789.0} -> ke obratime vnimanie sto ke se sluci so timestamp na tret povik
//   data: {...} -> ovde ke ja cuvame celata data od OpenWeatherMap
// }

const getCityWeather = async (city) => {
    // ke vidime sto ke se sluci na vtoriot povik so ist grad - primer Skopje
    let now = new Date().getTime() / 1000; // sekundi 
    //ova e sekogas razlicno vreme od koga sme ja povikale funkcijata, tocnoto vreme vo koe funkcijata
    // bila povikana

    console.log("CACHE", CACHE);

    //CACHE[city].timepstamp -> vremeto koga sme go pobarale toj resurs t.e. toj grad vo slucajov
    //config.getSection("weather").cache_exp -> 60 sekundi

    //Primer
    //20:30 pravime povik so grad Skopje, ova vreme ke ni bide zapisano vo CACHE[city].timestamp, vo sekundi
    //CACHE[city].timestamp - staroto vreme ili vremeto koga prviot povik bil napraven za ovoj grad
    //confing.getSection("weather").cache_exp - kolku vreme vo idnina ke ni vazi cahce-ot
    //20:31 -> ova ni e vtor povik, gradot Skopje ke postoi veke
    //20:32 -> ova ni e tret povik, tuka ovoj uslov nema da vazi i ke ni prodolzi so izvrusuvanje kodot
    //podolu vo fetch funkcijata za da povika podatoci za gradot Skopje koi ke ni bidat ponovi.

    if(
        CACHE[city] && 
        now < CACHE[city].timestamp + config.getSection("weather").cache_expiry
    ){
        console.log("Data is from the cache");
        return CACHE[city];
    }

    //HARDCODED -> https://api.openweathermap.org/data/2.5/weather?q={ImeNaGradot}&units=metric&appid=63ff6c719581618dc79c14c2a85bf27e
    //Dynamical approach
    const URL = `${
        config.getSection("weather").API_URL
    }/weather?q=${city}&units=metric&appId=${
        config.getSection("weather").api_key
    }`;

    try{
        const res = await fetch(URL); 
        const data = await res.json();

        CACHE[city] = {
            timestamp: new Date().getTime() / 1000,
            data: data
        }
    }
    catch(err){
        throw err;
    }
}

const getFiveDaysForecastForCity = async (lat, lon) => {
    const URL = `${
        config.getSection("weather").API_URL
    }/forecast?lat=${lat}&lon=${lon}&appid=${
        config.getSection("weather").api_key
    }`;

    try{
        const res = await fetch(URL);
        const data = await res.json();

        console.log("city forecast data", data.city);

    }catch(err){
        throw err;
    }
}

module.exports = {
    getCityWeather,
    getFiveDaysForecastForCity,
}