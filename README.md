# Happy Eat API

This is the backend API for Happy Eat, a project developed by Rémi WEIL and Théo. Happy Eat aims to streamline the process of deciding where to eat for Neopixl employees by providing an unlimited polling system.

## Features

- **Unlimited Polling**: All Neopixl employees can vote to eat every day without limitations.
- **OAuth2.0 Integration**: OAuth2.0 authentication is implemented to secure user information.
- **Real-time Updates**: The API utilizes sockets to provide real-time updates on polling results.
- **Swagger Documentation**: The API is documented using Swagger for easy understanding and integration.

## Technologies Used

- **Node.js**: The backend is built using Node.js for its efficiency and scalability.
- **Express.js**: Express.js is used as the web application framework to handle HTTP requests.
- **Socket.IO**: Socket.IO is employed for real-time communication between the server and clients.
- **OAuth2.0**: OAuth2.0 protocol is implemented for secure authentication.
- **Swagger**: Swagger is used for API documentation, making it easy for developers to understand and integrate with the API.

## Installation

To install and run the API locally, follow these steps:

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Start the server using `npm run dev`.

## API Documentation

The API endpoints and usage are thoroughly documented using Swagger at "api_base_url/docs"

## Usage

To use the API in your application, follow the guidelines provided in the Swagger documentation. Ensure that you have proper authentication credentials and handle real-time updates using sockets.

## Credits

- Rémi WEIL: API Development
- Théo: Frontend Development

---

For more details about the frontend development by Théo, you can refer to the project description [here](https://theosementaportfolio.framer.website/happyEatProductPage).
