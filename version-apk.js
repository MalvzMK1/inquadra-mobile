const fs = require("node:fs");
const path = require("node:path");

const baseApkName = "app-release.apk";
const apkPath = path.resolve(
  __dirname,
  "android",
  "app",
  "build",
  "outputs",
  "apk",
  "release",
  baseApkName,
);

if (!fs.existsSync(apkPath)) {
  process.exit(0);
}

const appJsonPath = path.resolve(__dirname, "app.json");
const appJsonContent = JSON.parse(fs.readFileSync(appJsonPath).toString());

const lastVersion = Number(appJsonContent.expo.version.substring(0, 3));
let newVersion = String(lastVersion + 0.1);

if (!newVersion.includes(".")) {
  newVersion += ".0";
}

fs.renameSync(
  apkPath,
  apkPath.replace(baseApkName, `APP_INQUADRA_${newVersion}.apk`),
);

appJsonContent.expo.version = `${newVersion}.0`;
fs.writeFileSync(appJsonPath, JSON.stringify(appJsonContent, null, 2));
