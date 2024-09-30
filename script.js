window.onload = async function () {
  try {
    const data = await fetchData("data.json");
    const { osName, cpuName } = await detectPlatform();
    const { platformText, packageText, downloadUrl } = getPlatformDetails(
      osName,
      cpuName,
      data
    );
    updateUI(platformText, packageText, downloadUrl, osName, cpuName, data);
  } catch (error) {
    alert("Error fetching data or processing user-agent: " + error.message);
  }
};

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

async function detectPlatform() {
  const uap = new UAParser(navigator.userAgent);
  let osName = uap.getOS().name || "unknown";
  let cpuName = uap.getCPU().architecture || "unknown";

  if (cpuName === "unknown" && navigator?.userAgentData) {
    const details = await navigator.userAgentData.getHighEntropyValues([
      "architecture",
      "platform",
    ]);
    osName = details?.platform || osName;
    cpuName = details?.architecture || cpuName;
  }

  return {
    osName: osName.toLowerCase(),
    cpuName: cpuName.toLowerCase(),
  };
}

function getPlatformDetails(osName, cpuName, data) {
  let platformText = "Unknown";
  let packageText = "N/A";
  let downloadUrl = "#";

  osName = normalizeOSName(osName);
  cpuName = normalizeCPUName(cpuName);

  switch (osName) {
    case "windows":
      ({ link: downloadUrl, package: packageText } = data.Windows);
      platformText = osName.charAt(0).toUpperCase() + osName.slice(1);
      break;
    case "macos":
      ({ link: downloadUrl, package: packageText } =
        cpuName === "amd64" ? data.macOS.Intel : data.macOS.AppleSilicon);
      platformText = `macOS (${
        cpuName === "amd64" ? "Intel" : "Apple Silicon"
      })`;
      break;
    case "ios":
      ({ link: downloadUrl, package: packageText } = data.iOS);
      platformText = osName.charAt(0).toUpperCase() + osName.slice(1);
      break;
    case "android":
      ({ link: downloadUrl, package: packageText } = data.Android);
      platformText = osName.charAt(0).toUpperCase() + osName.slice(1);
      break;
    default:
      platformText = "N/A";
  }

  return { platformText, packageText, downloadUrl };
}

function normalizeOSName(osName) {
  if (osName.includes("mac")) return "macOS";
  if (osName.includes("windows")) return "Windows";
  if (osName.includes("ios")) return "iOS";
  if (osName.includes("android")) return "Android";
  return "N/A";
}

function normalizeCPUName(cpuName) {
  if (cpuName.includes("arm")) return "arm64";
  if (cpuName.includes("x86") || cpuName.includes("amd64")) return "amd64";
  return "N/A";
}

function updateUI(
  platformText,
  packageText,
  downloadUrl,
  osName,
  cpuName,
  data
) {
  const macDownloadButtons = document.getElementById("mac-download-buttons");
  const intelButton = document.querySelector(".downloadIntelButton");
  const appleSiliconButton = document.querySelector(
    ".downloadAppleSiliconButton"
  );
  const defaultDownloadButton = document.querySelector(".downloadButton");
  const qrSection = document.getElementById("qr-section");
  const qrTitle = document.getElementById("qr-title");
  const qrSubtitle = document.getElementById("qr-subtitle");
  const qrImage = document.getElementById("qr-image");

  // Set QR section based on OS
  setQRSection(osName, qrTitle, qrSubtitle, qrImage, qrSection);

  // Update platform and package text
  document.querySelector("#platform").textContent = platformText || "N/A";
  document.querySelector("#package").textContent = packageText || "N/A";

  const browserName = new UAParser(navigator.userAgent).getBrowser().name;

  if (isMacOSWithUnknownCPU(osName, cpuName, browserName)) {
    showMacDownloadButtons(
      macDownloadButtons,
      defaultDownloadButton,
      intelButton,
      appleSiliconButton,
      data
    );
  } else {
    hideMacDownloadButtons(
      macDownloadButtons,
      defaultDownloadButton,
      downloadUrl
    );
  }
}

function setQRSection(osName, qrTitle, qrSubtitle, qrImage, qrSection) {
  if (osName === "ios") {
    qrTitle.textContent = "Want to protect your iOS device with TrackCyber?";
    qrSubtitle.textContent = "Scan the QR code below for iOS:";
    qrImage.src = "assets/TestFlight QR.svg";
    qrSection.style.display = "block";
  } else if (osName === "android") {
    qrTitle.textContent =
      "Want to protect your Android device with TrackCyber?";
    qrSubtitle.textContent = "Scan the QR code below for Android:";
    qrImage.src = "assets/Play store QR.svg";
    qrSection.style.display = "block";
  } else {
    qrSection.style.display = "none";
  }
}

function isMacOSWithUnknownCPU(osName, cpuName, browserName) {
  return (
    (osName === "macos" && (cpuName === "unknown" || cpuName === "N/A")) ||
    browserName === "Safari"
  );
}

function showMacDownloadButtons(
  macDownloadButtons,
  defaultDownloadButton,
  intelButton,
  appleSiliconButton,
  data
) {
  macDownloadButtons.style.display = "block";
  defaultDownloadButton.style.display = "none";

  intelButton?.addEventListener("click", function () {
    window.location.href = data.macOS.Intel.link;
  });

  appleSiliconButton?.addEventListener("click", function () {
    window.location.href = data.macOS.AppleSilicon.link;
  });
}

function hideMacDownloadButtons(
  macDownloadButtons,
  defaultDownloadButton,
  downloadUrl
) {
  macDownloadButtons.style.display = "none";
  defaultDownloadButton.style.display = "block";

  defaultDownloadButton.addEventListener("click", function () {
    if (downloadUrl !== "#") {
      window.location.href = downloadUrl;
    } else {
      alert("Download URL not available.");
    }
  });
}
