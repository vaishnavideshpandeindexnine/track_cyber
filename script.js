async function detectPlatform() {
  let osName = "unknown";
  let cpuName = "unknown";

  // Use the more reliable User-Agent Data API
  if (navigator?.userAgentData) {
    const details = await navigator.userAgentData.getHighEntropyValues([
      "architecture",
      "platform",
    ]);
    osName = details?.platform || "unknown";
    cpuName = details?.architecture || "unknown";
    console.log("High Entropy Data:", osName, cpuName);
  } else {
    // Fallback for older browsers using UAParser
    const uap = new UAParser(navigator.userAgent);
    osName = uap.getOS().name || "unknown";
    cpuName = uap.getCPU().architecture || "unknown";
    console.log("Fallback (UAParser):", osName, cpuName);

    // Detect Apple Silicon on macOS using platform hints
    if (navigator.userAgent.toLowerCase().includes("macintosh")) {
      osName = "macOS"; // Explicitly set macOS
      console.log("Detected macOS");

      // Check for Apple Silicon (ARM) or Intel based on platform and touch support
      if (navigator.maxTouchPoints > 0) {
        cpuName = "arm64"; // Likely Apple Silicon with touch support
        console.log("Detected Apple Silicon (arm64)");
      } else {
        cpuName = "amd64"; // Intel (MacIntel without touch support)
        console.log("Detected Intel (amd64)");
      }
    }
  }

  return { osName: osName.toLowerCase(), cpuName: cpuName.toLowerCase() };
}
