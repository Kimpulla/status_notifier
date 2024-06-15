# Status Notifier App

Status Monitor App is a React Native application built with Expo that displays a status circle in the center of the screen, with notifications for status changes.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/Kimpulla/status_notifier.git
    cd status_notifier
    ```

2. **Install Expo CLI:**

    ```sh
    npm install -g expo-cli
    ```

3. **Install dependencies:**

    ```sh
    npm install
    ```

4. **Install Expo Go on your mobile device:**

    - [Expo Go for Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Configuration

To run the app, you need to update the API endpoint from `localhost` to your computer's local IP address.

1. **Find your local IP address:**

    - On **Windows**, open Command Prompt and run:
      ```sh
      ipconfig
      ```
      Look for the `IPv4 Address` under your active network connection.

    - On **macOS/Linux**, open Terminal and run:
      ```sh
      ifconfig
      ```
      Look for the IP address under your active network connection (usually something like `192.168.x.x`).

2. **Update the IP address in the app:**

    Open `App.js` and replace `http://localhost:8080/status` with `http://<your-ip-address>:8080/status`.

### Running the Application

1. **Start the Expo development server:**

    ```sh
    npx expo start
    ```

    This will open a new tab in your browser with the Expo developer tools.

2. **Run the app on your device:**

    - Open the Expo Go app on your mobile device.
    - Scan the QR code displayed in the Expo developer tools in your browser.

### API Setup

This application requires an API to fetch the status information. The API should be running on your local machine.

1. **Clone the API repository:**

    ```sh
    git clone https://github.com/Kimpulla/status_api.git
    cd status_api
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Start the API server:**

    ```sh
    node .
    ```

The API server should now be running on `http://<your-ip-address>:8080/status`. Ensure this matches the IP address configured in the `App.js` file of your React Native project.

## Built With

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
