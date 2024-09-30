# TrackCyber Download Page

This project provides a dynamic download page for **TrackCyber**, a compliance tool that ensures the user's device configuration meets security standards. The page automatically detects the user's operating system (OS) and CPU architecture and provides the appropriate download link for installation.

## Features

- Detects the user's OS and CPU architecture (Intel/Apple Silicon).
- Displays specific download links and package details based on the detected platform.
- Provides separate download buttons for macOS (Intel) and macOS (Apple Silicon).
- User-friendly interface with a responsive design for mobile, tablet, and desktop devices.
- Displays a QR code for mobile devices (iOS/Android) to ease the installation process.

## Technologies Used

- **HTML/CSS**
- **JavaScript** (with asynchronous functions)
- **UAParser.js** (for user-agent detection)
- **Bootstrap** (for styling and responsiveness)

## How It Works

### Platform and CPU Detection

When the page loads, the script:

- Fetches platform data from the `data.json` file.
- Uses `UAParser.js` to detect the user's OS and CPU architecture.
- If the user's OS is macOS and their CPU architecture is unknown, the page displays buttons for both Intel and Apple Silicon versions, allowing the user to manually select the correct version.
- For other platforms (Windows, iOS, Android), the page automatically provides the correct download link.
- For iOS and Android, the page displays a QR code for easy access to the app download via mobile.

### Update UI Based on Detection

The page updates the UI elements (#platform, #package, #version) with the detected platform and available package type. It also adds click functionality to the appropriate download buttons and dynamically shows QR codes for iOS and Android users.

## How to Run

1. Clone or download the project files.
2. Ensure that `data.json` is available in the root directory, containing platform-specific download information (see format below).
3. Open `index.html` in any browser to view the page.

## QR Code Functionality

For mobile platforms (iOS and Android), the page dynamically displays a QR code to ease the installation process. Users can scan the code to be redirected to the appropriate app store for their device.

## `data.json` Structure

The `data.json` file stores the download URLs and package names for different platforms. Here's the structure:

```json
{
  "Windows": {
    "package": "TrackCyber.exe",
    "link": "https://secure.trackcyber.regverse.com/downloads/windows-installer.exe"
  },
  "macOS": {
    "Intel": {
      "package": "TrackCyber.dmg",
      "link": "https://secure.trackcyber.regverse.com/downloads/mac-x64-installer.dmg"
    },
    "AppleSilicon": {
      "package": "TrackCyber.dmg",
      "link": "https://secure.trackcyber.regverse.com/downloads/mac-arm64-installer.dmg"
    }
  },
  "iOS": {
    "package": "TrackCyber.ipa",
    "link": "https://apps.apple.com/us/app/testflight/id899247664"
  },
  "Android": {
    "package": "TrackCyber.apk",
    "link": "https://play.google.com/store/apps"
  }
}
```

## Updating the JSON

To update the download links or package names:

1. Open the `data.json` file.
2. Modify the values for the respective platforms. For example, to update the Windows download link:

```json
{
  "Windows": {
    "package": "TrackCyber_v2.exe",
    "link": "https://secure.trackcyber.regverse.com/downloads/windows-installer.exe"
  }
}
```

## Supported Platforms

- **Windows**: Provides a `.exe` installer.
- **macOS**: Separate installers for Intel and Apple Silicon architectures.
- **iOS**: Provides an `.ipa` package.
- **Android**: Provides an `.apk` package.

## Responsive Design

The page layout adapts to different screen sizes. The media queries ensure that the design looks good on:

- Desktops
- Tablets
- Mobile devices

## Scripts Breakdown

### JavaScript Flow

- **`window.onload`**: Initiates when the page loads, fetching platform data and detecting the user’s system information.
- **`fetchData()`**: Asynchronously fetches data from `data.json`.
- **`detectPlatform()`**: Detects the user’s OS and CPU using UAParser.js. If the CPU architecture isn’t available, it tries to get the data from `userAgentData`.
- **`getPlatformDetails()`**: Matches the detected OS and CPU with the appropriate platform data and returns the download link, version, and package name.
- **`normalizeOSName()` and `normalizeCPUName()`**: Normalize the OS and CPU names into standard formats for easier matching.
- **`updateUI()`**: Updates the download button and package/version information on the page. If the platform is macOS, it provides separate buttons for Intel and Apple Silicon downloads.
