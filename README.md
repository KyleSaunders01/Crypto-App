# Cryptocurrency Dashboard

This project is a scalable, real-time cryptocurrency dashboard built using React, Redux Toolkit, Ant Design, and Chart.js. It fetches cryptocurrency data from the [Coingecko API](https://www.coingecko.com/en/api) and provides a dynamic interface for tracking prices, historical data, and statistics of various cryptocurrencies.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [API Usage](#api-usage)
- [Design Patterns](#design-patterns)
- [Scalability](#scalability)
- [Hosting](#hosting)

## Features

- Fetches real-time cryptocurrency data from the Coingecko API.
- Interactive charts displaying historical price data using `Chart.js`.
- Infinite scroll to browse cryptocurrencies.
- Dynamic currency selection.
- Responsive design with skeleton loaders and error handling.
- React Router for smooth client-side routing.
- Lazy-loaded components for performance optimization.

## Demo

You can check out the live version of the project here:

[**Live Demo**](https://kylesaunders01.github.io/Crypto-App/)

## Technologies

This project is built with the following technologies:

- **React**: For building the UI.
- **Redux Toolkit**: For state management and API interactions.
- **Ant Design**: For UI components and layout.
- **Chart.js**: For displaying cryptocurrency data in chart format.
- **Vite**: For fast development and bundling.
- **Coingecko API**: The external API providing cryptocurrency data.
- **GitHub Pages**: Used to host the application.

## Project Structure

The project follows a component-based architecture, leveraging Redux for state management and React Router for navigation.

- `src/components/`: Contains all the UI components like `CryptoCard`, `CryptoDetails`, `CryptoInfo`, and loaders.
- `src/services/cryptoApi.ts`: Handles all API requests to the Coingecko API using `createApi` from Redux Toolkit.
- `src/app/store.ts`: Configures the Redux store and integrates the API.
- `src/pages/`: Houses the main pages, such as `CryptoDetails` and `Exchanges`.
- As Cryptocurrencies was used across the application I felt it was more appropriate to keep it in components

## Installation

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v14+ recommended)
- **npm** or **yarn**

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kylesaunders01/Portfolio-Website.git
   cd Portfolio-Website
   ```
    

2. **Install dependencies:**
    ```bash
   npm install
   ```
   
3. **Start the development server:**
    
    ```bash
   npm run dev
   ```
4. **Build the project for production:**
    ```bash
   npm run build
   ```
   
5. **Serve the production build locally:**

   ```bash
   npm run preview
   ```

## API Usage

This project uses the [Coingecko API](https://www.coingecko.com/en/api) to fetch real-time cryptocurrency data.

### Key API Endpoints

- `/coins/markets`: Fetches market data for various cryptocurrencies.
- `/coins/{id}/market_chart`: Fetches historical price data for a specific cryptocurrency.

### Example API Request

```ts
useLazyGetCryptosQuery({
  currency: selectedCurrency,
  page: currentPage,
  perPage: 50,
});
```

## Design Patterns

This project leverages several design patterns to ensure scalability and maintainability:

- **Component-Based Architecture**: The UI is divided into reusable components, such as `CryptoCard`, `CryptoDetails`, and `SkeletonLoader`.
- **Redux for State Management**: Manages global state and API data, ensuring predictable state transitions and separation of concerns.
- **Lazy Loading**: Optimizes performance by lazy-loading components such as `CryptoDetails` and `CryptoInfo`.
- **Error Handling**: Gracefully manages network errors, providing a smooth user experience.

## Scalability

The project is designed for scalability through the following approaches:

- **Modular Components**: Reusable and decoupled components for easy maintenance and scalability.
- **Centralized API Layer**: API calls are managed centrally using Redux Toolkit’s `createApi` feature, allowing for easy extension.
- **Infinite Scroll**: Efficiently handles large datasets by fetching more items as the user scrolls.
- **State Management**: Redux Toolkit ensures scalable state management for growing application complexity.
- **Lazy Loading**: Improves performance and prepares the app for feature expansion.

## Hosting

The application is hosted on **GitHub Pages**, with an automated deployment process powered by GitHub Actions. Every time changes are pushed to the `main` branch, the project is automatically built and deployed to GitHub Pages, eliminating the need for manual deployment steps.

### How It's Hosted

- **GitHub Pages**: The project is hosted on GitHub Pages, a service that allows you to serve static sites directly from your repository.
- **Automated Deployment**: The deployment process is automated through a GitHub Actions workflow, which listens for changes on the `main` branch. Whenever changes are detected, the workflow:
   1. Checks out the latest code.
   2. Installs dependencies.
   3. Builds the project using **Vite**.
   4. Deploys the compiled files to the `gh-pages` branch, which GitHub Pages uses to serve the live site.

### What You Need to Know

- **Branch Setup**: The `gh-pages` branch is automatically updated with the latest build, and this is where GitHub Pages serves the site from.
- **No Manual Deploy**: You do not need to run any manual commands like `npm run deploy`. Everything is handled by the workflow once changes are pushed to the `main` branch.

### How to Access the Hosted Version

After every successful push to `main`, the site is live at: https://kylesaunders01.github.io/Crypto-App/


