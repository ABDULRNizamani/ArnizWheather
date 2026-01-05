
      const elements = {
             // Search & Location
             citySearch: document.getElementById('citySearch'),
             getLocationBtn: document.getElementById('getLocation'),
             searchContainer: document.getElementById('searchContainer'),
             
             // Toggles
             unitToggle: document.getElementById('unitToggle'),
             themeToggle: document.getElementById('themeToggle'),
             hamburger: document.getElementById('hamburger'),
             
             // Current Weather
             locationName: document.getElementById('locationName'),
             currentDateTime: document.getElementById('currentDateTime'),
             currentTemp: document.getElementById('currentTemp'),
             weatherCondition: document.getElementById('weatherCondition'),
             currentWeatherIcon: document.getElementById('currentWeatherIcon'),
             feelsLike: document.getElementById('feelsLike'),
             tempHigh: document.getElementById('tempHigh'),
             tempLow: document.getElementById('tempLow'),
             
             // Hourly & Weekly Forecasts
             hourlyForecast: document.getElementById('hourlyForecast'),
             weeklyForecast: document.getElementById('weeklyForecast'),
             
             // Weather Details
             humidity: document.getElementById('humidity'),
             humidityText: document.getElementById('humidityText'),
             windSpeed: document.getElementById('windSpeed'),
             windDirection: document.getElementById('windDirection'),
             uvIndex: document.getElementById('uvIndex'),
             uvText: document.getElementById('uvText'),
             pressure: document.getElementById('pressure'),
             pressureText: document.getElementById('pressureText'),
             visibility: document.getElementById('visibility'),
             visibilityText: document.getElementById('visibilityText'),
             sunrise: document.getElementById('sunrise'),
             sunset: document.getElementById('sunset'),
             moonPhase: document.getElementById('moonPhase'),
             moonPhaseText: document.getElementById('moonPhaseText'),
             precipitation: document.getElementById('precipitation'),
             precipAmount: document.getElementById('precipAmount'),
             airQuality: document.getElementById('airQuality'),
             aqiText: document.getElementById('aqiText'),
             
             // Alerts
             alertsSection: document.getElementById('alertsSection'),
             alertsContainer: document.getElementById('alertsContainer'),
             
             // Map
             weatherMap: document.getElementById('weatherMap'),
             mapZoomIn: document.getElementById('mapZoomIn'),
             mapZoomOut: document.getElementById('mapZoomOut'),
             mapLayerToggle: document.getElementById('mapLayerToggle'),
             
             // Footer Links
             aboutLink: document.getElementById('aboutLink'),
             contactLink: document.getElementById('contactLink'),
             privacyLink: document.getElementById('privacyLink'),
             termsLink: document.getElementById('termsLink')
         };
 
         // State management object
         const appState = {
             currentUnit: 'celsius',
             currentTheme: 'light',
             currentLocation: null,
             weatherData: null,
             forecastData: null
         };
 
 
 
         const apiKey = "96cb902527be49ed8cc145139251510";
 
         elements.citySearch.addEventListener("keypress", function(e){
             console.log("keyPressed", e.key)
          if(e.key == "Enter"){
              const city = e.target.value.trim();
 
              if (city){
                  getWeather(city)
                 }
             }
         })
 
 
 
 // Default city
 const DEFAULT_CITY = 'London';
 
 // Fetch weather for default city on page load
 window.addEventListener('DOMContentLoaded', () => {
     getWeather(DEFAULT_CITY);
 });
 
 async function getWeather(city) {
     const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes&alerts=yes`;
     
     try {
         const response = await fetch(url);
         
         if (!response.ok) {
             const errorData = await response.json();
             console.error('API Error:', errorData);
             
             return;
         }
         
         const data = await response.json();
         console.log(data);
         updateUI(data);
         
     } catch (error) {
         console.error('Error fetching weather:', error);
        
     }
 }
 
 
 
 
     function updateUI(data) {
       // Location
      elements.locationName.textContent = data.location.name;
      elements.currentDateTime.textContent = data.location.localtime;
     
      console.log('Forecast days received:', data.forecast.forecastday.length);
      // Current Weather
      elements.currentTemp.textContent = `${Math.round(data.current.temp_c)}°`;
      elements.weatherCondition.textContent = data.current.condition.text;
      elements.feelsLike.textContent = `${Math.round(data.current.feelslike_c)}°`;
     
      // Today's high/low
      elements.tempHigh.textContent = `${Math.round(data.forecast.forecastday[0].day.maxtemp_c)}°`;
      elements.tempLow.textContent = `${Math.round(data.forecast.forecastday[0].day.mintemp_c)}°`;
     
      // Details
      elements.humidity.textContent = `${data.current.humidity}%`;
      elements.windSpeed.textContent = `${data.current.wind_kph} km/h`;
      elements.windDirection.textContent = `From ${data.current.wind_dir}`;
      elements.uvIndex.textContent = data.current.uv;
      elements.visibility.textContent = `${data.current.vis_km} km`;
      elements.pressure.textContent = `${data.current.pressure_mb} hPa`;
      elements.precipitation.textContent = `${data.forecast.forecastday[0].day.daily_chance_of_rain}%`
      elements.precipAmount.textContent = `${data.current.precip_mm}mm`
     
      // Sunrise/Sunset
      elements.sunrise.textContent = data.forecast.forecastday[0].astro.sunrise;
      elements.sunset.textContent = data.forecast.forecastday[0].astro.sunset;
      elements.moonPhase.textContent = data.forecast.forecastday[0].astro.moon_phase;
     
      // Update hourly and daily forecasts (you'll need loops for these)
      updateHourlyForecast(data.forecast.forecastday, data.location.localtime);
      updateWeeklyForecast(data.forecast.forecastday);
     }
 
    
 function formatTime(timeStr) {
     
     
     const timePart = timeStr.split(' ')[1];  
     let hour = parseInt(timePart.split(':')[0]); 
     const minute = timePart.split(':')[1];
 
     let period = hour >= 12 ? "PM" : "AM";
 
     if (hour === 0) {
         hour = 12;
     } else if (hour > 12) {
         hour = hour - 12;
     }
 
     return `${hour}:${minute} ${period}`;
 }
 
 function updateHourlyForecast(forecastData, localtime) {
     elements.hourlyForecast.innerHTML = "";
     
     // Find current hour
     const currentHour = parseInt(localtime.split(' ')[1].split(':')[0]);
     
     const todayHours = forecastData[0].hour;  
     const tomorrowHours = forecastData[1].hour;
     
     // Find current hour index
     const currentHourIndex = todayHours.findIndex(hour => {
         const hourTime = parseInt(hour.time.split(' ')[1].split(':')[0]);
         return hourTime === currentHour;
     });
     
     // Get next 24 hours starting from current hour
     const remainingToday = todayHours.slice(currentHourIndex);
     const hoursNeeded = 24 - remainingToday.length;
     const fromTomorrow = tomorrowHours.slice(0, hoursNeeded);
     const next24Hours = [...remainingToday, ...fromTomorrow];
     
     // Show only first 12 hours (or change to 24 if you want)
     next24Hours.slice(0, 12).forEach(element => {
         let ho = document.createElement("div");
         ho.className = "hourly-item";
 
         let time = document.createElement("div");
         time.className = "hourly-time";
         time.textContent = formatTime(element.time); 
 
         let ic = document.createElement("img");
         ic.className = "hourly-icon";
         ic.src = element.condition.icon;
         ic.alt = element.condition.text;
 
         let tmp = document.createElement("div");
         tmp.className = "hourly-temp";
         tmp.textContent = `${Math.round(element.temp_c)}°`;
 
         let prep = document.createElement("div");
         prep.className = "hourly-precip";
         prep.textContent = `${element.chance_of_rain}%`;
 
         ho.appendChild(time);
         ho.appendChild(ic);
         ho.appendChild(tmp);
         ho.appendChild(prep);
 
         elements.hourlyForecast.appendChild(ho);
     });
 }
 
 function updateWeeklyForecast(forecastday) {
     elements.weeklyForecast.innerHTML = "";
 
     forecastday.forEach(day => {
         const dateObj = new Date(day.date);
         const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
         const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
 
         let d = document.createElement("div");
         d.className = "daily-item";
 
         let dn = document.createElement("div");
         dn.className = "day-name";
         dn.textContent = dayName;
 
         let dd = document.createElement("div");
         dd.className = "day-date";
         dd.textContent = formattedDate;
 
         let ic = document.createElement("img");
         ic.className = "day-icon";
         ic.src = day.day.condition.icon;
         ic.alt = day.day.condition.text;
 
         let dt = document.createElement("div");
         dt.className = "day-temps";
 
         let temph = document.createElement("span");
         temph.className = "temp-high";
         temph.textContent = `${Math.round(day.day.maxtemp_c)}°`;
 
         let tempL = document.createElement("span");
         tempL.className = "temp-low";
         tempL.textContent = `${Math.round(day.day.mintemp_c)}°`;
 
         let rc = document.createElement("div");
         rc.className = "day-summary";
         rc.textContent = `Chance of rain ${day.day.daily_chance_of_rain}%`;
 
         dt.appendChild(temph);
         dt.appendChild(tempL);
 
         d.appendChild(dn);
         d.appendChild(dd);
         d.appendChild(ic);
         d.appendChild(dt);
         d.appendChild(rc);
 
         elements.weeklyForecast.appendChild(d);
        });
    }
 
 elements.themeToggle.addEventListener("click", function(){
     // Check current theme
     const currentTheme = document.body.getAttribute('data-theme');
     
     // Toggle between light and dark
     if (currentTheme === 'dark') {
         document.body.setAttribute('data-theme', 'light');
         elements.themeToggle.textContent = '🌙 Dark';  // Show what clicking will do
     } else {
         document.body.setAttribute('data-theme', 'dark');
         elements.themeToggle.textContent = '☀️ Light';
     }
    });