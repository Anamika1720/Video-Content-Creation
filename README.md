# Video Content Creation Platform

A modern web application for creators to generate AI-powered video ideas, built with React, Tailwind CSS, and integrated with OpenAI’s LLaMA-3 model via Groq API.

## Live Demo

Vercel : https://video-content-creation.vercel.app

## GitHub Repository

Source code :https://github.com/Anamika1720/Video-Content-Creation

## Features

**Video Idea Generator**

- Generate short, creative video content ideas using the Groq LLaMA-3 model.
- Choose tone (Informative, Humorous, Inspirational) to customize content.
- Set video duration using minutes and seconds inputs.
- Preview ideas before proceeding to publish.

**Social Media Publisher**

Upload and publish your video content directly to:

- YouTube Shorts (with full metadata: title, description, tags)
- Securely authenticate with Google to publish on YouTube.
- Add title, description, and tags for better visibility.
- Video preview and manual file upload before publishing.

**Modular UI Components**

- Floating labels for input fields for a modern, user-friendly experience.
- Reusable input and select components using Tailwind CSS.
- Error handling and loading states for better UX feedback.

**Environment Configuration**

- Uses environment variable VITE_GROQ_API_KEY to securely access Groq API.
- Supports integration with Google's OAuth2 for uploading videos.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Anamika1720/Video-Content-Creation.git

```

### 2. Navigate into the project directory

```bash
cd Video-Content-Creation
```

### 3.Install Dependencies

Navigate to the project directory and install the required dependencies:

```bash
npm install
```

### 4.Run the Development Version

To start the development server and test the development version of the application, use:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified in your configuration).

## Technologies Used

React

Material-U

Tailwind CSS

Vercel (for deployment)
