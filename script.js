class TimeThemeManager {
    constructor() {
        this.timeElement = document.getElementById('currentTime');
        this.body = document.body;
        this.latitude = null;
        this.longitude = null;
        this.weatherData = null;
        // Replace with your OpenWeatherMap API key
        this.WEATHER_API_KEY = 'YOUR_API_KEY_HERE';
        
        // Set default to night mode
        this.body.classList.add('period-night');
        this.initialize();
    }

    async initialize() {
        try {
            console.log('Requesting geolocation...');
            const position = await this.getCurrentPosition();
            console.log('Got location:', position.coords);
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            
            // Get initial weather data
            await this.updateWeather();
            
            // Update weather every 5 minutes
            setInterval(() => this.updateWeather(), 300000);
            
            this.updateTimeAndTheme();
        } catch (error) {
            console.warn('Could not get location:', error);
            this.fallbackToLocalTime();
        }

        // Update every second
        setInterval(() => {
            if (this.latitude && this.longitude) {
                this.updateTimeAndTheme();
            } else {
                this.fallbackToLocalTime();
            }
        }, 1000);
        
        this.createStars();
    }

    async updateWeather() {
        try {
            console.log('Fetching weather data...');
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&appid=${this.WEATHER_API_KEY}&units=metric`
            );
            this.weatherData = await response.json();
            console.log('Weather data:', this.weatherData);
            this.updateWeatherEffects();
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    }

    updateWeatherEffects() {
        if (!this.weatherData) return;

        const container = document.querySelector('.animation-container');
        // Clear existing weather effects
        const weatherEffects = container.querySelectorAll('.rain-drop, .snow-flake, .lightning, .fog, .mist, .haze');
        weatherEffects.forEach(effect => effect.remove());

        // Remove all weather classes
        const weatherClasses = ['clear', 'cloudy', 'rain', 'snow', 'storm', 'fog', 'mist', 'haze', 'drizzle', 'heavy-rain'];
        weatherClasses.forEach(cls => this.body.classList.remove(`weather-${cls}`));

        // Add appropriate weather class and effects
        const weatherId = this.weatherData.weather[0].id;
        const temp = this.weatherData.main.temp;
        console.log('Weather ID:', weatherId, 'Description:', this.weatherData.weather[0].description, 'Temp:', temp);

        // Group 2xx: Thunderstorm
        if (weatherId >= 200 && weatherId < 300) {
            this.body.classList.add('weather-storm');
            if (weatherId >= 210 && weatherId < 220) {
                // Heavy thunderstorm
                this.createLightning(true); // More frequent lightning
            } else {
                this.createLightning(false);
            }
            this.createRain(weatherId >= 202 ? 'heavy' : 'normal');
        }
        // Group 3xx: Drizzle
        else if (weatherId >= 300 && weatherId < 400) {
            this.body.classList.add('weather-drizzle');
            this.createRain('drizzle');
            if (temp < 5) this.createFog(); // Cold drizzle with fog
        }
        // Group 5xx: Rain
        else if (weatherId >= 500 && weatherId < 600) {
            if (weatherId >= 502) {
                this.body.classList.add('weather-heavy-rain');
                this.createRain('heavy');
            } else {
                this.body.classList.add('weather-rain');
                this.createRain('normal');
            }
            if (weatherId === 511 && temp <= 0) {
                // Freezing rain
                this.createFreezingRain();
            }
        }
        // Group 6xx: Snow
        else if (weatherId >= 600 && weatherId < 700) {
            this.body.classList.add('weather-snow');
            if (weatherId === 602) {
                this.createSnow('heavy');
            } else if (weatherId === 611 || weatherId === 612 || weatherId === 613) {
                this.createSleet(); // Mix of snow and rain
            } else {
                this.createSnow('normal');
            }
        }
        // Group 7xx: Atmosphere
        else if (weatherId >= 700 && weatherId < 800) {
            if (weatherId === 701) {
                this.body.classList.add('weather-mist');
                this.createMist();
            } else if (weatherId === 741) {
                this.body.classList.add('weather-fog');
                this.createFog();
            } else if (weatherId === 721) {
                this.body.classList.add('weather-haze');
                this.createHaze();
            }
        }
        // Group 800: Clear
        else if (weatherId === 800) {
            this.body.classList.add('weather-clear');
        }
        // Group 80x: Clouds
        else if (weatherId > 800) {
            this.body.classList.add('weather-cloudy');
            this.createClouds(weatherId === 804 ? 'overcast' : 'scattered');
        }
    }

    createRain(intensity = 'normal') {
        const container = document.querySelector('.animation-container');
        const count = intensity === 'heavy' ? 200 : 
                     intensity === 'drizzle' ? 50 : 100;
        
        for (let i = 0; i < count; i++) {
            const drop = document.createElement('div');
            drop.className = `rain-drop ${intensity}`;
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDuration = intensity === 'drizzle' ? 
                `${1 + Math.random()}s` : 
                `${0.5 + Math.random()}s`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(drop);
        }
    }

    createSnow(intensity = 'normal') {
        const container = document.querySelector('.animation-container');
        const count = intensity === 'heavy' ? 100 : 50;
        
        for (let i = 0; i < count; i++) {
            const flake = document.createElement('div');
            flake.className = `snow-flake ${intensity}`;
            flake.style.left = `${Math.random() * 100}%`;
            flake.style.animationDuration = `${3 + Math.random() * 4}s`;
            flake.style.animationDelay = `${Math.random() * 2}s`;
            flake.style.opacity = intensity === 'heavy' ? '0.9' : '0.7';
            container.appendChild(flake);
        }
    }

    createSleet() {
        this.createSnow('light');
        this.createRain('drizzle');
    }

    createFreezingRain() {
        this.createRain('normal');
        this.createFog(); // Add foggy effect for freezing rain
    }

    createMist() {
        const container = document.querySelector('.animation-container');
        for (let i = 0; i < 5; i++) {
            const mist = document.createElement('div');
            mist.className = 'mist-layer';
            mist.style.top = `${i * 20}%`;
            mist.style.animationDelay = `${i * 0.5}s`;
            container.appendChild(mist);
        }
    }

    createFog() {
        const container = document.querySelector('.animation-container');
        for (let i = 0; i < 3; i++) {
            const fog = document.createElement('div');
            fog.className = 'fog-layer';
            fog.style.top = `${i * 33}%`;
            fog.style.animationDelay = `${i * 1.5}s`;
            container.appendChild(fog);
        }
    }

    createHaze() {
        const container = document.querySelector('.animation-container');
        const haze = document.createElement('div');
        haze.className = 'haze-layer';
        container.appendChild(haze);
    }

    createLightning(intense = false) {
        const container = document.querySelector('.animation-container');
        const flash = () => {
            const lightning = document.createElement('div');
            lightning.className = 'lightning';
            container.appendChild(lightning);
            
            setTimeout(() => lightning.remove(), 150);
            
            // Random interval for next lightning
            setTimeout(flash, intense ? 1000 + Math.random() * 2000 : 3000 + Math.random() * 5000);
        };
        
        flash();
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const stars = document.querySelector('.stars');
        const clouds = document.querySelector('.clouds');
        
        if (stars) stars.style.transform = `translateY(${scrolled * 0.3}px)`;
        if (clouds) clouds.style.transform = `translateY(${scrolled * 0.2}px)`;
    }

    calculateLightConditions(date) {
        if (!this.latitude || !this.longitude) {
            return { isDaytime: false };
        }

        try {
            const times = SunCalc.getTimes(date, this.latitude, this.longitude);
            const sunPosition = SunCalc.getPosition(date, this.latitude, this.longitude);
            const moonPosition = SunCalc.getMoonPosition(date, this.latitude, this.longitude);
            const moonIllumination = SunCalc.getMoonIllumination(date);
            
            const altitudeDegrees = sunPosition.altitude * (180 / Math.PI);
            const currentTime = date.getTime();

            // Enhanced period detection with moon phase
            const isDawn = currentTime >= times.dawn.getTime() && currentTime < times.sunrise.getTime();
            const isSunrise = currentTime >= times.sunrise.getTime() && currentTime < times.sunriseEnd.getTime();
            const isDay = currentTime >= times.sunriseEnd.getTime() && currentTime < times.sunsetStart.getTime();
            const isSunset = currentTime >= times.sunsetStart.getTime() && currentTime < times.sunset.getTime();
            const isDusk = currentTime >= times.sunset.getTime() && currentTime < times.dusk.getTime();
            const isNight = currentTime >= times.dusk.getTime() || currentTime < times.dawn.getTime();

            // Consider moon phase for night brightness
            const moonBrightness = moonIllumination.fraction * Math.sin(moonPosition.altitude);
            const isActuallyDark = altitudeDegrees < -6 && moonBrightness < 0.3;

            return {
                isDaytime: !isActuallyDark && (isDawn || isSunrise || isDay || isSunset || isDusk),
                period: isNight ? 'night' : 
                        isDusk ? 'dusk' :
                        isSunset ? 'sunset' :
                        isDay ? 'day' :
                        isSunrise ? 'sunrise' :
                        isDawn ? 'dawn' : 'night',
                moonPhase: moonIllumination.phase,
                moonBrightness
            };
        } catch (error) {
            console.error('Error calculating light conditions:', error);
            return { isDaytime: false, period: 'night' };
        }
    }

    fallbackToLocalTime() {
        const now = new Date();
        const hour = now.getHours();
        
        // Update time display
        this.timeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        // Simple fallback based on hour
        const period = 
            hour >= 22 || hour < 4 ? 'night' :
            hour >= 4 && hour < 6 ? 'dawn' :
            hour >= 6 && hour < 8 ? 'sunrise' :
            hour >= 8 && hour < 16 ? 'day' :
            hour >= 16 && hour < 18 ? 'sunset' :
            hour >= 18 && hour < 22 ? 'dusk' : 'night';

        // Update body class for specific periods
        ['night', 'dawn', 'sunrise', 'day', 'sunset', 'dusk'].forEach(p => {
            this.body.classList.remove(`period-${p}`);
        });
        this.body.classList.add(`period-${period}`);
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
    }

    updateTimeAndTheme() {
        const now = new Date();
        
        // Update time display
        this.timeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        // Get precise light conditions
        const { isDaytime, period } = this.calculateLightConditions(now);

        // Update theme based on actual light conditions
        if (isDaytime) {
            this.body.classList.remove('night-mode');
            this.body.classList.add('day-mode');
        } else {
            this.body.classList.remove('day-mode');
            this.body.classList.add('night-mode');
        }

        // Update body class for specific periods
        ['night', 'dawn', 'sunrise', 'day', 'sunset', 'dusk'].forEach(p => {
            this.body.classList.remove(`period-${p}`);
        });
        this.body.classList.add(`period-${period}`);
    }

    createStars() {
        const starsContainer = document.querySelector('.stars');
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            starsContainer.appendChild(star);
        }
    }

    createClouds(type = 'scattered') {
        const cloudsContainer = document.querySelector('.clouds');
        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement('div');
            cloud.className = `cloud ${type}`;
            cloud.style.top = `${Math.random() * 50}%`;
            cloud.style.width = `${80 + Math.random() * 40}px`;
            cloud.style.height = `${30 + Math.random() * 20}px`;
            cloud.style.animationDuration = `${15 + Math.random() * 10}s`;
            cloud.style.animationDelay = `${-Math.random() * 15}s`;
            cloudsContainer.appendChild(cloud);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimeThemeManager();
}); 