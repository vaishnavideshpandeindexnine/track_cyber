window.onload = async function () {
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    const uap = new UAParser(navigator.userAgent);
    const { name: osName } = uap.getOS();
    let cpuName = uap.getCPU().architecture || "unknown";

    // Check CPU architecture manually if necessary
    // if (osName === "macOS" && cpuName === "unknown") {
    //   const userAgent = navigator.userAgent;
    //   if (/Intel/.test(userAgent)) {
    //     cpuName = "amd64";
    //   } else if (/Apple/.test(userAgent)) {
    //     cpuName = "arm64";
    //   }
    // }

    const details = await navigator?.userAgentData?.getHighEntropyValues([
      "architecture",
    ]);

    console.log("Os Name", osName);
    console.log("Architecture", cpuName);

    console.log(details);
    let downloadUrl = "#";
    let platformText = "Unknown";
    let packageText = "N/A";
    let versionText = "N/A";

    switch (osName) {
      case "Windows":
        downloadUrl = data.Windows.link;
        platformText = osName;
        // platformText = details.platformText;
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
    document.querySelector("#data").textContent = JSON.stringify(
      details,
      null,
      2
    );

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
  } catch (error) {
    alert(error.message);
    alert("Error fetching data or processing user-agent:", error.toString());
  }
};
