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

  // Use userAgentData if available for more reliable platform detection
  if (navigator.userAgentData) {
    const details = await navigator.userAgentData.getHighEntropyValues([
      "architecture",
      "platform",
    ]);
    osName = details?.platform || osName;
    cpuName = details?.architecture || cpuName;
  } else {
    // Fallback for browsers that do not support userAgentData (e.g., Safari)
    osName = osName.toLowerCase();

    if (osName === "macos") {
      if (navigator.userAgent.toLowerCase().includes("arm")) {
        cpuName = "arm64"; // Apple Silicon
      } else {
        cpuName = "amd64"; // Intel
      }
    }
  }

  return { osName: osName.toLowerCase(), cpuName: cpuName.toLowerCase() };
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
      platformText = osName;
      break;
    case "macos":
      if (cpuName === "amd64") {
        ({ link: downloadUrl, package: packageText } = data.macOS.Intel);
        platformText = "macOS (Intel)";
      } else if (cpuName === "arm64") {
        ({ link: downloadUrl, package: packageText } = data.macOS.AppleSilicon);
        platformText = "macOS (Apple Silicon)";
      }
      break;
    case "ios":
      ({ link: downloadUrl, package: packageText } = data.iOS);
      platformText = osName;
      break;
    case "android":
      ({ link: downloadUrl, package: packageText } = data.Android);
      platformText = osName;
      break;
    default:
      platformText = "N/A";
  }

  return { platformText, packageText, downloadUrl };
}

function normalizeOSName(osName) {
  if (osName.includes("mac") || osName.includes("macintosh")) return "macOS";
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

  document.querySelector("#platform").textContent = platformText || "N/A";
  document.querySelector("#package").textContent = packageText || "N/A";

  if (osName === "macos" && (cpuName === "unknown" || cpuName === "N/A")) {
    macDownloadButtons.style.display = "block";
    defaultDownloadButton.style.display = "none";

    intelButton?.addEventListener("click", function () {
      window.location.href = data.macOS.Intel.link;
    });

    appleSiliconButton?.addEventListener("click", function () {
      window.location.href = data.macOS.AppleSilicon.link;
    });
  } else {
    macDownloadButtons.style.display = "none";

    defaultDownloadButton.addEventListener("click", function () {
      if (downloadUrl !== "#") {
        window.location.href = downloadUrl;
      } else {
        alert("Download URL not available.");
      }
    });
  }
}
