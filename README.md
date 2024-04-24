# NoteOnline
Course project for Secure Programming

## Installation

### Prerequisites
The following technologies need to be installed:
- Java JDK17 (or higher)
- Maven
- Node.js (Tested with version 20)
- PostgreSQL
- [Optional] Visual Studio Code

Clone the git repository, or download source as zip and extract to your desired location. The application is divided into frontend and backend. Instructions for setting up both are below.
### Frontend
1. Locate to installation directory `../frontend/`
2. Run `npm install` to install necessary dependencies to the project
3. In `.evn` file, change the parameter `REACT_APP_API_ADDRESS` to match the address of your backend. Provided value is the default local address for the backend.
4. Frontend can be run with command `npm start`

### Database
1. If you do not have PostgreSQL installed, follow the instructions [here](https://www.postgresql.org/)
2. Once installed, it is recommended to create a new user and a new database for the application. You can do so by first connecting as the superuser `psql -U postgres`. Once connected, create a new user with the command `CREATE USER <YOUR_USERNAME> WITH PASSWORD '<YOUR_PASSWORD>';`. Then create a new database with command `CREATE DATABASE <YOUR_DATABASE_NAME> OWNER <YOUR_USERNAME>;`.

### Backend
1. Open file `application.properties` located in `/src/main/resources/`. Configure the following parameters with the values from previously created database.
2. - `spring.datasource.url` => Set to `jdbc:postgresql://<DB_ADDRESS>/<DB_NAME>`. By default, PostgreSQL address is `localhost:5432`. Set `<DB_NAME>` to match the database name you previously created.
   - `spring.datasource.username` => Set to the username you previously set for the new database user.
   - `spring.datasource.password` => Set to the password you gave for the new database user
   - `noteonline.app.jwtCookieName` => Set to the cookie name that will contain the JWT token on the client
   - `noteonline.app.jwtSecret` => Set to a secret value that will be used to sign JWT tokens (random and 64 bytes)
   - `noteonline.app.jwtExpirationMs` => Set to how long (in ms) you want the JWT tokens to be valid
3. Navigate to `JwtUtils.java` located in `main/java/fi/tuni/sepro/noteonline/config/`. Assign your own values for `jwtCookieName`, `jwtSecret` and `jwtExpirationMs`.
4. Navigate to `SecurityConfig.java` located in `main/java/fi/tuni/sepro/noteonline/config/`. Assign your frontend address for `CORS_ORIGIN`. Provided value is the default local address for the frontend.
5. Once configured, the backend can be started from the terminal/cmd with command `mvnw spring-boot:run`.  
