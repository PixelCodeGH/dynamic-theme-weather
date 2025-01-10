# Dynamic Day/Night Theme with Weather Effects

A beautiful, responsive web application that automatically changes themes based on your local time and weather conditions. The app features smooth transitions between day and night modes, along with realistic weather animations.

![Preview](preview.gif) *(You'll need to add your own preview gif)*

## 🌟 Features

### Time-Based Theme Switching
- Automatic theme changes based on actual sunrise/sunset times
- Smooth transitions between periods:
  - Night (Dark theme with stars)
  - Dawn (Gradual transition with fog effects)
  - Sunrise (Beautiful orange/pink gradients)
  - Day (Bright, clear sky)
  - Sunset (Warm evening colors)
  - Dusk (Deepening blues)

### Real-Time Weather Effects
- Dynamic weather animations based on current conditions:
  - ⛈️ Thunderstorms with lightning
  - 🌧️ Rain (light, normal, and heavy)
  - 🌨️ Snow and sleet
  - 🌫️ Fog and mist
  - ⛅ Cloud variations
  - 🌤️ Clear sky effects

### Advanced Features
- Geolocation-based time and weather
- Moon phase calculations
- Parallax effects
- Responsive design
- Accessibility features
- System dark mode support

## 🚀 Live Demo
[View Live Demo](https://dynamic-theme-weather.netlify.app/)

## 💻 Installation

1. Clone the repository:
```bash
git clone https://github.com/PixelCodeGH/dynamic-theme-weather.git
```

2. Navigate to the project directory:
```bash
cd dynamic-theme-weather
```

3. Open `script.js` and replace the OpenWeatherMap API key:
```javascript
this.WEATHER_API_KEY = 'your-api-key-here';
```

4. Open `index.html` in your browser or serve it using a local server.

## 📋 Requirements

- Modern web browser with JavaScript enabled
- OpenWeatherMap API key (free tier works fine)
- Geolocation permissions (for accurate sunrise/sunset times)

## 🔧 Configuration

### API Key
Get your free API key from [OpenWeatherMap](https://openweathermap.org/api):
1. Sign up for a free account
2. Navigate to API keys section
3. Copy your API key
4. Replace the placeholder in `script.js`

### Customization
You can customize the appearance by modifying the CSS variables in `styles.css`:
```css
:root {
    --day-bg: #87CEEB;
    --night-bg: #1a1a2e;
    /* ... other variables ... */
}
```

## 🎨 Features in Detail

### Time Periods
- **Night Mode**: Dark background with twinkling stars
- **Dawn**: Gradual transition with subtle fog effects
- **Sunrise**: Warm colors with rising sun animation
- **Day**: Bright sky with floating clouds
- **Sunset**: Beautiful gradient transition
- **Dusk**: Deepening colors with early stars

### Weather Effects
- **Thunderstorm**: Lightning flashes and heavy rain
- **Rain**: Multiple intensities with realistic animation
- **Snow**: Gentle falling snowflakes
- **Sleet**: Mixed rain and snow effects
- **Fog/Mist**: Atmospheric haze effects
- **Clouds**: Various cloud coverage types

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Sun/Moon calculations by [SunCalc](https://github.com/mourner/suncalc)
- Inspired by various day/night cycle implementations

---
Made with ❤️ by [PixelCode] 
