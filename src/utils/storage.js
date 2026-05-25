export const PROVIDERS = {
  anthropic: { name: "Anthropic (Claude)", icon: "🟣", placeholder: "sk-ant-api03-...", url: "console.anthropic.com" },
  gemini: { name: "Google Gemini", icon: "🔵", placeholder: "AIzaSy...", url: "aistudio.google.com/apikey" },
};

export function getApiKey() {
  return localStorage.getItem("utbkpro_api_key") || "";
}
export function setApiKeyStorage(key) {
  localStorage.setItem("utbkpro_api_key", key);
}
export function getProvider() {
  return localStorage.getItem("utbkpro_provider") || "gemini";
}
export function setProviderStorage(p) {
  localStorage.setItem("utbkpro_provider", p);
}
