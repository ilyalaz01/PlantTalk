# PlantTalk

PlantTalk is an innovative web application that bridges the gap between plants and their caretakers through technology. The core idea is to create a system that monitors plant health via sensors and presents this information in an intuitive, engaging way that even technologically inexperienced users can understand and act upon.

## Features

- **Interactive Plant Avatar**: An animated plant that visually reflects its health status
- **Conversational Interface**: Chat with your plant to learn about its needs and care tips
- **Real-time Sensor Data**: Monitor soil moisture, temperature, humidity, and light levels
- **Plant Profile**: Track your plant's growth journey with photos and care history
- **Interactive Simulator**: Experiment with different environmental conditions to see how they affect plant health

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/planttalk.git
   cd planttalk
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Header.js
│   │   └── Navigation.js
│   ├── dashboard/
│   │   ├── ActionButton.js
│   │   ├── PlantAvatar.js
│   │   ├── SensorGauge.js
│   │   ├── SpeechBubble.js
│   │   ├── StreakCalendar.js
│   │   └── WeatherWidget.js
│   ├── chat/
│   │   ├── ChatBubble.js
│   │   ├── ChatInput.js
│   │   └── SuggestedQuestions.js
│   ├── profile/
│   │   ├── CareHistory.js
│   │   ├── CareSchedule.js
│   │   ├── PhotoGallery.js
│   │   └── PlantInfo.js
│   └── simulator/
│       ├── InteractiveControls.js
│       └── SimulationDisplay.js
├── contexts/
│   ├── PlantContext.js
│   ├── SensorContext.js
│   └── UserContext.js
├── hooks/
│   ├── useEcologicalModel.js
│   ├── useSensorData.js
│   └── useWeatherData.js
├── pages/
│   ├── Dashboard.js
│   ├── ChatPage.js
│   ├── ProfilePage.js
│   └── SimulatorPage.js
├── services/
│   ├── api.js
│   ├── sensorService.js
│   └── weatherService.js
├── styles/
│   ├── GlobalStyles.js
│   └── theme.js
├── utils/
│   ├── dateUtils.js
│   └── formatUtils.js
├── App.js
└── index.js
```

## Main Components

### Dashboard

The Dashboard is the main screen of the application, featuring:

- **Plant Avatar**: A visual representation of your plant that changes based on its health status
- **Speech Bubble**: Where your plant "talks" to you about its needs
- **Sensor Gauges**: Visual representations of soil moisture, temperature, humidity, and light
- **Action Button**: Large, clear call-to-action button for the most pressing plant need
- **Streak Calendar**: Track your plant care consistency
- **Weather Widget**: Shows local weather and how it impacts your plant

### Chat Interface

The Chat page allows users to:

- Ask their plant questions in natural language
- Get context-aware responses based on current sensor readings
- Choose from suggested questions for easier interaction
- Learn about plant care in a conversational format

### Plant Profile

The Profile page provides:

- Basic plant information (species, age, status)
- Visual graphs of care history and sensor readings
- Photo gallery to track plant growth over time
- Care schedule and requirements

### Simulator

The Simulator page lets users:

- Experiment with different environmental parameters
- See real-time feedback on how changes affect plant health
- Learn about plant science through interactive exploration
- Test preset scenarios like drought, cold, and heat stress

## Design Philosophy

PlantTalk follows these design principles:

- **Apple-Inspired Minimalism**: Clean, uncluttered interface with ample white space
- **Nature-Based Color Palette**: Predominantly green to reflect the plant theme
- **Accessibility First**: Large text, high contrast, and simplified interactions
- **Emotional Design**: Character animation and conversational interface
- **Progressive Disclosure**: Complex information hidden behind simple visualizations

## Dependencies

- React
- React Router
- Styled Components
- Recharts (for data visualization)
- Date-fns (for date handling)

## Implementing Sensor Integration

To connect real sensors to this application:

1. Configure your sensors to send data to your backend server
2. Update the `sensorService.js` file with your actual API endpoints
3. Make sure the sensor data format matches the expected format in the app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Plant care information from [source]
- Weather data from [source]
- Icon designs by [source]
