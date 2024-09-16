window.onload = async function () {
  const response = await fetch("data.json");
  const data = await response.json();
  const uap = new UAParser();
  const { name: osName } = uap.getOS();
  const cpuName = uap.getCPU().architecture;

  let downloadUrl = "#";
  let platformText = "Unknown";
  let packageText = "N/A";
  let versionText = "N/A";

  switch (osName) {
    case "Windows":
      downloadUrl = data.Windows.link;
      platformText = osName;
      packageText = data.Windows.package;
      versionText = data.Windows.version;
      break;
    case "macOS":
      if (cpuName === "amd64") {
        downloadUrl = data.macOS.Intel.link;
        platformText = `macOS (Intel)`;
        packageText = data.macOS.Intel.package;
        versionText = data.macOS.Intel.version;
      } else if (cpuName === "arm64") {
        downloadUrl = data.macOS.AppleSilicon.link;
        platformText = `macOS (Apple Silicon)`;
        packageText = data.macOS.AppleSilicon.package;
        versionText = data.macOS.AppleSilicon.version;
      }
      break;
    case "iOS":
      downloadUrl = data.iOS.link;
      platformText = osName;
      packageText = data.iOS.package;
      versionText = data.platforms.iOS.version;
      break;
    case "Android":
      downloadUrl = data.Android.link;
      platformText = osName;
      packageText = data.Android.package;
      versionText = data.Android.version;
      break;
    default:
      downloadUrl = "#";
  }

  document.querySelector("#version").textContent = versionText || "N/A";
  document.querySelector("#platform").textContent = platformText;
  document.querySelector("#package").textContent = packageText;

  document
    .querySelector(".downloadButton")
    .addEventListener("click", function () {
      if (downloadUrl !== "#") {
        window.location.href = downloadUrl;
      } else {
        alert("Download URL not available.");
      }
    });
};
