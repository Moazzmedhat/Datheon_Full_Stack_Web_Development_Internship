# Datheon Full Stack Web Development Internship 🚀

Welcome to the central repository for the **Datheon Full Stack Web Development Internship**. This repository houses all project tasks assigned throughout the internship, demonstrating progressive mastery in frontend architecture, modern frameworks, state management, API integration, and clean engineering principles.

---

## 📑 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Repository Structure](#-repository-structure)
- [Projects Breakdown](#-projects-breakdown)
  - [Task 1: Modern Interactive Developer Portfolio](#task-1-modern-interactive-developer-portfolio)
  - [Task 2: TaskBoard – Productivity Tracker & Task Manager](#task-2-taskboard--productivity-tracker--task-manager)
  - [Task 3: WeatherPulse – Real-Time Weather Dashboard](#task-3-weatherpulse--real-time-weather-dashboard)
  - [Task 4: ShopWave – Modern Vanilla E-Commerce Storefront](#task-4-shopwave--modern-vanilla-e-commerce-storefront)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Intern Information](#-intern-information)

---

## 🏛 Overview & Architecture

Each project within this repository tackles a specific domain and architectural challenge:

| Task | Project Name | Live Demo | Focus / Pattern | Primary Tech Stack |
| :--- | :--- | :--- | :--- | :--- |
| **Task 1** | **Developer Portfolio** | [Live Demo ↗](https://portflio-seven-nu.vercel.app/) | Responsive UI, Micro-interactions, Design Systems | React 19, Tailwind CSS, GSAP, Vite |
| **Task 2** | **TaskBoard** | [Live Demo ↗](https://task-manager-xi-six-42.vercel.app/) | Clean Architecture, Domain-Driven Design (DDD), TDD | React 19, TypeScript, Vitest, RTL, Vite |
| **Task 3** | **WeatherPulse** | [Live Demo ↗](https://datheon-full-stack-web-development-psi.vercel.app/) | Asynchronous API Telemetry, State Caching | React 19, OpenWeather API, Lucide, Vite |
| **Task 4** | **ShopWave** | [Live Demo ↗](https://datheonfullstackwebdevelopmentinter-nu.vercel.app/) | Native Web Standards, Vanilla State Management | HTML5 Semantic, CSS3, Vanilla ES Modules |

---

## 📁 Repository Structure

```
Datheon_Full_Stack_Web_Development_Internship/
├── task1/                  # Personal Portfolio Web Application
│   ├── public/             # Static assets, images, and CV
│   ├── src/                # React components, theme context, GSAP animations
│   ├── tailwind.config.js  # Tailwind styling definitions
│   └── package.json
│
├── task2/                  # TaskBoard - Productivity Tracker
│   ├── src/
│   │   ├── application/    # Application use cases & services
│   │   ├── domain/         # Core business models, entities & value objects
│   │   ├── infrastructure/ # Persistence & browser storage adapters
│   │   ├── components/     # Accessible UI components & modals
│   │   └── __tests__/      # Vitest unit & integration test suites
│   ├── tsconfig.json       # Strict TypeScript configuration
│   └── package.json
│
├── task3/                  # WeatherPulse - Weather & Forecast Dashboard
│   ├── src/
│   │   ├── components/     # Telemetry grids, forecast cards, charts, modals
│   │   └── services/       # OpenWeatherMap API integration client
│   └── package.json
│
├── task4/                  # ShopWave - Modern E-Commerce Storefront
│   ├── css/                # Vanilla CSS styling & design tokens
│   ├── js/                 # Modular ES6 architecture (api, state, storage, ui)
│   ├── index.html          # Main storefront interface
│   └── tests.html          # In-browser unit test suite
│
└── README.md               # Repository documentation
```

---

## 🛠 Projects Breakdown

### Task 1: Modern Interactive Developer Portfolio
> **Directory**: [`task1/`](./task1)  
> **Live Demo**: [https://portflio-seven-nu.vercel.app/](https://portflio-seven-nu.vercel.app/)  
> **Tech**: React 19, Vite, Tailwind CSS, GSAP, Lucide Icons

An interactive portfolio designed to highlight engineering projects, work history, technical proficiencies, and contact information.

- **Key Highlights**:
  - **Dynamic GSAP Animations**: Smooth entrance reveals, interactive hover physics, and background effects.
  - **Comprehensive Projects Showcase**: Interactive cards detailing live URLs, GitHub repositories, and tech stacks for production projects (Kickzone, Momento, Onat Bakery, Wafrly, Zowar).
  - **Dark / Light Theme Toggle**: Persistent theme switching supported through React Context.
  - **Responsive Design**: Designed from mobile-first to high-resolution desktop viewports.

---

### Task 2: TaskBoard – Productivity Tracker & Task Manager
> **Directory**: [`task2/`](./task2)  
> **Live Demo**: [https://task-manager-xi-six-42.vercel.app/](https://task-manager-xi-six-42.vercel.app/)  
> **Tech**: React 19, TypeScript, Vite, Vitest, React Testing Library

A feature-rich, accessible task manager designed using **Clean Architecture** and **Domain-Driven Design (DDD)** principles with **zero third-party UI or state dependencies**.

- **Key Highlights**:
  - **Multi-Tier Priority System**: Assign and filter by priorities (`Urgent`, `High`, `Medium`, `Low`) with visual indicators.
  - **Smart Multi-Mode Sorting**: Sort by Smart Priority, Due Dates, Priority Tiers, Creation Timestamps, or Alphabetical.
  - **Productivity Analytics & Workload Insights**: Dedicated modal analyzing total tasks, completion rates, overdue work, and overall workload health score.
  - **Strict Type Safety & Robust Testing**: Built entirely in strict TypeScript and validated by automated Vitest & RTL test suites.

---

### Task 3: WeatherPulse – Real-Time Weather Dashboard
> **Directory**: [`task3/`](./task3)  
> **Live Demo**: [https://datheon-full-stack-web-development-psi.vercel.app/](https://datheon-full-stack-web-development-psi.vercel.app/)  
> **Tech**: React 19, Vite, Lucide React, OpenWeatherMap API

A real-time meteorological dashboard providing current weather conditions, multi-day forecasting, and telemetry analytics for cities worldwide.

- **Key Highlights**:
  - **Real-Time Weather Telemetry**: Tracks temperature, "feels like", humidity, wind speed, atmospheric pressure, and visibility.
  - **5-Day Visual Forecast**: Granular day-by-day weather breakdown and temperature trends.
  - **Search & History Caching**: Instant city search with persistent recent-query chips stored in `localStorage`.
  - **Unit Conversion**: One-click switching between Metric (°C) and Imperial (°F) measurement standards.
  - **Configurable API Integration**: Client-side modal allowing users to securely provide and persist their own OpenWeatherMap API key.

---

### Task 4: ShopWave – Modern Vanilla E-Commerce Storefront
> **Directory**: [`task4/`](./task4)  
> **Live Demo**: [https://datheonfullstackwebdevelopmentinter-nu.vercel.app/](https://datheonfullstackwebdevelopmentinter-nu.vercel.app/)  
> **Tech**: Vanilla HTML5, CSS3, ES6 Modules (Zero frameworks, zero dependencies)

A fast, lightweight, and dependency-free storefront showcasing the power of pure web standards, modern DOM APIs, and modular JavaScript.

- **Key Highlights**:
  - **Modular Architecture**: Clean separation into `api.js`, `state.js`, `storage.js`, and `ui/` components using native ES Modules.
  - **Storefront Features**: Product catalog browsing, real-time search, category filtering, price sorting, and dynamic product modal views.
  - **Persistent Shopping Cart**: Real-time cart calculations, item counter badges, quantity modifications, and `localStorage` persistence.
  - **In-Browser Test Runner**: Includes an integrated `tests.html` test suite to verify core business logic and state transitions in any browser.

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `yarn`

### Running Individual Projects

#### 🔹 Task 1 (Portfolio)
```bash
cd task1
npm install
npm run dev
```

#### 🔹 Task 2 (TaskBoard)
```bash
cd task2
npm install
npm run dev

# Run test suite
npm run test
```

#### 🔹 Task 3 (WeatherPulse)
```bash
cd task3
npm install
npm run dev
```

#### 🔹 Task 4 (ShopWave)
Task 4 requires no build tools. Serve using any local HTTP static server:
```bash
cd task4

# Option 1: Python
python -m http.server 3000

# Option 2: Node.js (npx)
npx serve .
```

---

## 👨‍💻 Intern Information

- **Intern**: Moaz Medhat
- **Program**: Datheon Full Stack Web Development Internship
- **GitHub**: [@Moazzmedhat](https://github.com/Moazzmedhat)
