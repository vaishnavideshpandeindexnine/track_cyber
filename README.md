# TrackCyber Download Page

This project provides a dynamic download page for **TrackCyber**, a compliance tool that ensures the user's device configuration meets security standards. The page automatically detects the user's operating system (OS) and CPU architecture and provides the appropriate download link for installation.

## Features

- Detects the user's OS and CPU architecture (Intel/Apple Silicon).
- Displays specific download links and package details based on the detected platform.
- Provides separate download buttons for macOS (Intel) and macOS (Apple Silicon).
- User-friendly interface with a responsive design for mobile, tablet, and desktop devices.

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

### Update UI Based on Detection

The page updates the UI elements (`#platform`, `#package`, `#version`) with the detected platform, available package type, and version number. It also adds click functionality to the appropriate download buttons.

## How to Run

1. Clone or download the project files.
2. Ensure that `data.json` is available in the root directory, containing platform-specific download information (see format below).
3. Open `index.html` in any browser to view the page.

## `data.json` Structure

The `data.json` file stores the download URLs, version information, and package names for different platforms. Here's the structure:

```json
{
  "Windows": {
    "package": "TrackCyber.exe",
    "link": "https://www.track_cyber.com/windows.exe/",
    "version": "v1.1.0"
  },
  "macOS": {
    "Intel": {
      "package": "TrackCyber.dmg",
      "link": "https://www.track_cyber.com/mac_intel.dmg/",
      "version": "v2.0.6"
    },
    "AppleSilicon": {
      "package": "TrackCyber.dmg",
      "link": "https://www.track_cyber.com/mac_apple.dmg/",
      "version": "v5.0.0"
    }
  },
  "iOS": {
    "package": "TrackCyber.ipa",
    "link": "https://www.track_cyber.com/ios.ipa/",
    "version": "v1.9.0"
  },
  "Android": {
    "package": "TrackCyber.apk",
    "link": "https://www.track_cyber.com/android.apk/",
    "version": "v9.0.0"
  }
}
```

## Updating the JSON

To update the download links, package names, or versions:

1. Open the `data.json` file.
2. Modify the values for the respective platforms. For example, to update the Windows download link:

```json
{
  "Windows": {
    "package": "TrackCyber_v2.exe",
    "link": "https://www.track_cyber.com/windows_v2.exe/",
    "version": "v2.0.0"
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
