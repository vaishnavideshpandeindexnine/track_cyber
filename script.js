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

  // Show QR section for iOS and Android
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

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // Display both buttons for macOS when using Safari
  if (osName === "macos") {
    macDownloadButtons.style.display = "block";
    intelButton.style.display = "block"; // Show Intel button
    appleSiliconButton.style.display = "block"; // Show Apple Silicon button

    intelButton.addEventListener("click", function () {
      window.location.href = data.macOS.Intel.link;
    });

    appleSiliconButton.addEventListener("click", function () {
      window.location.href = data.macOS.AppleSilicon.link;
    });
  } else {
    macDownloadButtons.style.display = "none";
    defaultDownloadButton.style.display = "block"; // Show default button if not macOS

    defaultDownloadButton.addEventListener("click", function () {
      if (downloadUrl !== "#") {
        window.location.href = downloadUrl;
      } else {
        alert("Download URL not available.");
      }
    });
  }
}
