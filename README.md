# LMS Project for B-JET

This project is a Learning Management System (LMS) that consists of both frontend and backend services. The backend is built with Node.js, Express, and MongoDB, while the frontend is built with React. This guide will help you set up and run the project locally using Docker.

## Prerequisites

Ensure you have the following installed on your machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/bjet-lms.git
   cd bjet-lms
   ```

2. **Create environment variable files:**

   Create a `.env` file in the `backend` directory.

## Running the Project

To start both the backend and frontend services, use Docker Compose.

1. **Build and start the services:**

   ```sh
   docker-compose up --build
   ```

   This command will build the Docker images for both frontend and backend and start the services.

2. **Access the services:**

   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8080`
