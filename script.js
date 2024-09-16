window.onload = async function () {
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    const uap = new UAParser(navigator.userAgent);
    let osName = uap.getOS().name || "unknown";
    let cpuName = uap.getCPU().architecture || "unknown";

    if (osName === "unknown" || cpuName === "unknown") {
      const details = await navigator?.userAgentData?.getHighEntropyValues([
        "architecture",
        "platform",
      ]);

      osName = details.platform || osName;
      cpuName = details.architecture || cpuName;
    }

    osName = osName.toLowerCase();
    cpuName = cpuName.toLowerCase();

    let downloadUrl = "#";
    let platformText = "Unknown";
    let packageText = "N/A";
    let versionText = "N/A";

    if (osName.includes("mac")) {
      osName = "macOS";
    } else if (osName.includes("windows")) {
      osName = "Windows";
    } else if (osName.includes("ios")) {
      osName = "iOS";
    } else if (osName.includes("android")) {
      osName = "Android";
    } else {
      osName = "N/A";
    }

    if (cpuName.includes("arm")) {
      cpuName = "arm64";
    } else if (cpuName.includes("x86") || cpuName.includes("amd64")) {
      cpuName = "amd64";
    } else {
      cpuName = "N/A";
    }

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
        versionText = data.iOS.version;
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
    document.querySelector("#platform").textContent = platformText || "N/A";
    document.querySelector("#package").textContent = packageText || "N/A";

    document
      .querySelector(".downloadButton")
      .addEventListener("click", function () {
        if (downloadUrl !== "#") {
          window.location.href = downloadUrl;
        } else {
          alert("Download URL not available.");
        }
      });
  } catch (error) {
    alert("Error fetching data or processing user-agent: " + error.message);
  }
};
