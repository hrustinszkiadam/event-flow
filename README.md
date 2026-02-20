# Event Flow

Event Flow is a web application for managing events and their associated menus. It allows users to create, view, and manage events, as well as select menus for each event. It uses a multi-step form for event creation, providing a smooth user experience.

## Installation

> Disclaimer: The project was built with bun, but should work fine with node and npm as well. If you encounter any issues, please report them.

1. Clone the repository:

   ```bash
   git clone https://github.com/hrustinszkiadam/event-flow.git
   ```

2. Navigate to the project directory:

   ```bash
   cd event-flow
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy the example environment file **(You do not need to update it for development)**

5. Set up the database (this spins up a PostgreSQL instance in Docker, make sure you have Docker installed and running):

   ```bash
    npm run db:up
    npm run db:push
    npm run db:seed # When using bun, use db:seed-bun
   ```

   > Note: If you wish to stop the database, you can run `npm run db:down`. Be cautious as this will remove all data in the database.

6. Start the development server:

   ```bash
    npm run dev
   ```
