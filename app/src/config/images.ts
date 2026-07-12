const publicImage = (fileName: string) => `/images/${fileName}`;

export const contentImageMap: Record<string, string> = {
  "hawk-watch.webp": publicImage("hawk-watch.webp"),
  "meshtastic-powered.png": publicImage("meshtastic-powered.png"),
  "tbeam.jpg": publicImage("tbeam.jpg"),
};

export const sharedHeroImage = contentImageMap["hawk-watch.webp"];

export const dashboardImagePaths = {
  malla: publicImage("malla-dash.png"),
  meshMonitor: publicImage("meshmonitor-dash.png"),
  meshView: publicImage("meshview-dash.png"),
  backbone: publicImage("susmesh-dash.jpg"),
};

export const discordLogoImage = publicImage("discord.png");
export const svmeshLogoImage = "/svmesh.png";
