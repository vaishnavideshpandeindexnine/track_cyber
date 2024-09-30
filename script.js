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

  console.log("Detected OS:", osName);
  console.log("Detected CPU:", cpuName);

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
    case "Windows":
      ({ link: downloadUrl, package: packageText } = data.Windows);
      platformText = osName;
      break;
    case "macOS":
      if (cpuName === "amd64") {
        ({ link: downloadUrl, package: packageText } = data.macOS.Intel);
        platformText = "macOS (Intel)";
      } else if (cpuName === "arm64") {
        ({ link: downloadUrl, package: packageText } = data.macOS.AppleSilicon);
        platformText = "macOS (Apple Silicon)";
      }
      break;
    case "iOS":
      ({ link: downloadUrl, package: packageText } = data.iOS);
      platformText = osName;
      break;
    case "Android":
      ({ link: downloadUrl, package: packageText } = data.Android);
      platformText = osName;
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

  // Set QR code section for iOS and Android
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

  // Handle macOS download buttons
  const uap = new UAParser(navigator.userAgent);
  const isSafari = uap.getBrowser().name === "Safari";

  if (
    osName.includes("mac") &&
    (cpuName === "unknown" || cpuName === "N/A" || isSafari)
  ) {
    macDownloadButtons.style.display = "block";
    defaultDownloadButton.style.display = "none";
    platformText = "mac OS";

    // Add event listeners for Intel and Apple Silicon buttons
    intelButton?.addEventListener("click", function () {
      console.log("clicked Intel");

      window.location.href = data.macOS.Intel.link;
    });

    appleSiliconButton?.addEventListener("click", function () {
      window.location.href = data.macOS.AppleSilicon.link;
    });
  } else {
    macDownloadButtons.style.display = "none";
    defaultDownloadButton.style.display = "block";

    // Add event listener for the default download button
    defaultDownloadButton.addEventListener("click", function () {
      if (downloadUrl !== "#") {
        window.location.href = downloadUrl;
      } else {
        alert("Download URL not available.");
      }
    });
  }
  // Update platform and package texts
  document.querySelector("#platform").textContent = platformText || "N/A";
  document.querySelector("#package").textContent = packageText || "N/A";
}
