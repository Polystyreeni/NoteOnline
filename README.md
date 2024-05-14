# NoteOnline
Course project for Secure Programming

## Installation

### Prerequisites
The following technologies need to be installed:
- Java JDK17 (Tested with [OpenJDK 17](https://openjdk.org/projects/jdk/17/))
- [Maven](https://maven.apache.org/)
- [Node.js](https://nodejs.org/en) (Tested with version 20)
- [PostgreSQL](https://www.postgresql.org/)
- [OpenSSL](https://www.openssl.org/) or equivalent for creating certificates (if using HTTPs)
- [Optional] Visual Studio Code

Clone the git repository, or download source as zip and extract to your desired location. The application is divided into frontend and backend. Instructions for setting up both are below.
### Frontend
1. Locate to installation directory `../frontend/`.
2. Open terminal/cmd/powershell/other in this directory.
3. Run command `npm install` to install necessary dependencies to the project.
4. In `.evn` file, change the parameter `REACT_APP_API_ADDRESS` to match the address of your backend. Provided value is the default local address for the backend.
5. Generate a server certificate, signed by a trusted CA (for testing purposes, a self-signed certificate is sufficient). See section **Enabling HTTPs**.
6. Frontend can be run with command `npm start`. Once compiled, a new browser window should open.

### Database
1. If you do not have PostgreSQL installed, follow the instructions [here](https://www.postgresql.org/download/)
2. Once installed, it is recommended to create a new user and a new database for the application. You can do so by first connecting as the superuser `psql -U postgres`. Once connected, create a new user with the command `CREATE USER <YOUR_USERNAME> WITH PASSWORD '<YOUR_PASSWORD>';`. Then create a new database with command `CREATE DATABASE <YOUR_DATABASE_NAME> OWNER <YOUR_USERNAME>;`.

### Backend
1. If you're using HTTPs (default), see section **Enabling HTTPs** before going further!
2. Configure the backend static config to match your environment. See section **Backend configuration** below.
3. Navigate to `SecurityConfig.java` located in `main/java/fi/tuni/sepro/noteonline/config/`. Assign your frontend address to `CORS_ORIGIN`. Provided value is the default local address for the frontend.
4. Once configured, the backend can be started from the terminal/cmd with command `mvnw spring-boot:run`.

### Backend configuration
Open file `application.properties` located in `/src/main/resources/`. Add your own values to the mandatory settings, edit the optional settings to your liking.

**Mandatory configuration**
- `spring.datasource.url` => Set to `jdbc:postgresql://<DB_ADDRESS>/<DB_NAME>`. By default, PostgreSQL address is `localhost:5432`. Set `<DB_NAME>` to match the database name you previously created.
- `spring.datasource.username` => Set to the username you previously set for the new database user.
- `spring.datasource.password` => Set to the password you gave for the new database user.
- `noteonline.app.jwtCookieName` => Set to the cookie name that will contain the JWT token on the client.
- `noteonline.app.jwtSecret` => Set to a secret value that will be used to sign JWT tokens (random and 64 bytes).
- `noteonline.app.jwtExpirationMs` => Set to how long (in ms) you want the JWT tokens to be valid.
- `server.port` => Port the server runs on.
- `server.ssl.keystore` => SSL keystore file name.
- `server.ssl.key-store-password` => Password set to the SSL keystore.
- `server.ssl.keyStoreType` => Store type set to SSL keystore.
- `server.ssl.keyAlias` => Alias name set to SSL keystore.
- `server.ssl.enabled` => Use HTTPs for data transferring.

**Optional configuration**
- `noteonline.app.accountLockMin` => Number of failed login attempts allowed, before "soft" penalty time is activated.
- `noteonline.app.accountLockMax` => Number of failed login attempts allowed, before "hard" penalty time is activated.
- `noteonline.app.accountLockMinPenalty` => "soft" penalty time in ms, login requets for the same email are not accepted until this time has passed.
- `noteonline.app.accountLockMaxPenalty` => "hard" penalty time in ms, login requests for the same email are not accepted until this time has passed.
- `noteonline.app.maxNotesPerUser` => The number of notes allowed per user. Make sure to change this also on frontend in the `.env` file!

### Enabling HTTPs
By default, the application uses HTTPs for communication. To create self-signed certificates for frontend and backend, follow these steps. If you want to disable the use of HTTPs, see **Disabling HTTPs**.

**Certificates for frontend**
1. Create a certificate and a key. A valid OpenSSL command for this is `openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365` (will create a valid certificate for one year)
2. A password is requested, **this is mandatory!**
3. Further information is asked, these can be filled optionally.
4. Insert both generated files (key.pem, cert.pem) in directory `frontend/cert`. Create this directory if it doesn't exist.
5. Open file `.env` and make sure these lines are included: `HTTPS=true`, `SSL_CERT_FILE="./cert/cert.pem"`, `SSL_KEY_FILE="./cert/key.pem"`
6. When starting the development server, the browser will warn about an untrusted certificate. Create an exception for the certificate to access the page.
7. The frontend is now using HTTPs for data transfers.

**Certificates for backend**
1. A key generation tool `keytool` comes with most main JDK distributions (OpenJDK included). Open the command prompt/terminal and type the following command: `keytool -genkey -alias <alias> -storetype PKCS12 -keyalg RSA -keysize 2048 -keystore keystore.p12 -validity 365`, replacing `<alias>` with a desired name for the certificate (for example: "springboot"). (If you understand these commands, you can change other parameters as well).
2. Password is required, **remember this because it's needed later!**
3. Further information is asked. Same as in frontend, these are optional.
4. The result should be a file called `keystore.p12` located in the directory you ran the generation command from.
5. Move the `keystore.p12` file to `backend/src/main/resources/keystore` (create this directory if it doesn't exist)
6. Modify `application.properties` located in `src/main/resources` server properties to match the certificate you just created. 
7. When starting the server, you can verify the use of HTTPs by seeing if this line is shown: `o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port 8080 (https) with context path ''`
8. (Optionally you can verify this by opening your browser and navigating to `https://localhost:8080`. If you use a self-signed certificate, you should see a warning about an untrusted site, similar to the frontend).

Make sure both frontend and backend addresses use https in their urls:
- On frontend, in the `.evn` file, make sure that `REACT_APP_API_ADDRESS` starts with `https://`. 
- On backend, make sure frontend CORS origin (in `src/main/java/fi/tuni/sepro/noteonline/config/SecurityConfig.java`) starts with `https://`.

If you get CORS errors on the frontend, you have most likely not configured the urls correctly. 


### Disabling HTTPs
By default, the application uses HTTPs. If there are issues with creating certificates, or signing tools like OpenSSL are not available, the application can be reverted to use HTTP instead. Follow these steps to achieve this.

**Disabling HTTPS on frontend**
1. Remove the following lines from the `.env` file: `HTTPS=true`, `SSL_CERT_FILE="./cert/cert.pem"`, `SSL_KEY_FILE="./cert/key.pem"`
2. Make sure `REACT_APP_API_ADDRESS` in the `.env` file is of format `http://...`

**Disabling HTTPS on backend**
1. Open `application.properties`. 
2. Set `server.ssl.enabled` to false
3. Comment out all lines starting with `server.ssl`, if you're not generating certificates.
4. Make sure `CORS_ORIGIN` in `SecurityConfig.java` is of format `http://...`. 


## Troubleshooting
Some common issues that may be encountered with the installation/running the application.

### CORS errors when creating requests on the frontend
Most likely API address on the frontend or CORS origin on the backend is wrong. If using HTTPs, make sure both API address on the frontend and CORS origin on the backend start with `https:`.
You can verify correctness of addresses by using your browser: by default, frontend is accessible at `https://localhost:3000`, backend is accessible at `https://localhost:8080/api`. Both should be accessible from the browser (although backend won't show any content).

### Vulnerabilities reported on installing frontend
You can run `npm audit -fix` for non-breaking changes. If breaking changes are related to create-react-app build tool, no need to worry. While they are red and scary, these are not an issue for your production environment. See [here](https://github.com/facebook/create-react-app/issues/11174) for more info.

### Requests on the frontend keep hanging indefinitely
If you're running the server on Windows cmd, the server may become unresponsive (currently unknown reason, may be caused by cmd itself). Refreshing cmd by pressing up-arrow will re-invoke cmd. 

### All POST/PUT requests respond with error code 400
This is a bug with the CSRF token system (see project report). Refreshing the page will generate a new CSRF token and requests should be successful after that.

### Can another database solution be used instead of PostgreSQL?
Technically any SQL database that can be included in Spring Boot is usable (H2, MySQL). However, it is up to you to figure out how to configure the application properties to use such databases. 


