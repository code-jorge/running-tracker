# Running Tracker

A modern, serverless running tracker built with React and Netlify. This application allows users to set monthly running goals, log their activities, and visualize their progress with a premium, glassmorphism-inspired UI.

## Features

-   **Monthly Goals**: Set distance goals for each month.
-   **Activity Logging**: Log runs with date and distance. Dates are automatically restricted to the current month context.
-   **Progress Tracking**: Visual progress bar with pacing indicators (ahead/behind schedule).
-   **Data Consistency**: Automated backend saving with optimistic UI updates.
-   **Responsive Design**: Mobile-first, glassmorphism aesthetics with smooth animations.

## Tech Stack

-   **Frontend**: React (Vite)
-   **Styling**: CSS Modules + Global CSS Variables (Glassmorphism theme)
-   **Backend**: Netlify Functions (Serverless)
-   **Database**: Netlify Blobs

## How It Works

### Architecture
The app follows a "thick frontend, thin backend" serverless architecture:

1.  **State Management**: The `Dashboard` component manages the state for the entire month (goal + runs).
2.  **Data Storage**: Data is stored in **Netlify Blobs** as simple JSON objects, keyed by month (e.g., `MM-YYYY`).
3.  **API Layer**:
    -   `get-dashboard-data`: Fetches the full JSON blob for a requested month.
    -   `save-data`: overwrites the blob with the new state.

### Implementation Details
-   **CSS Variables**: All colors, gradients, and shadows are defined in `index.css` for easy theming.
-   **Component Structure**: UI is broken down into atomic components (`Button`, `Card`, `Input`, `Modal`) utilizing CSS Modules for scoped styling.
-   **Optimistic UI**: The interface updates immediately upon user action, syncing with the backend in the background.

## Local Development

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Netlify Setup**:
    Ensure you have the Netlify CLI installed and linked to a site with Netlify Blobs enabled.
    ```bash
    npm install -g netlify-cli
    netlify link
    ```

3.  **Run Locally**:
    ```bash
    netlify dev
    ```
    This starts the Vite dev server and the Netlify Functions server simultaneously.

## Deployment

Push to GitHub/GitLab connected to Netlify. The `netlify.toml` (if present) or default settings will handle the build:
-   **Build Command**: `npm run build`
-   **Publish Directory**: `dist`
-   **Functions Directory**: `netlify/functions`
