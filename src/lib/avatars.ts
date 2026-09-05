/**
 * Auswahl an Avataren.
 *
 * Bewusst eine feste Liste statt freier Emoji-Eingabe: so bleibt die Darstellung
 * überall gleich groß, und im Avatarfeld landet garantiert kein beliebiger Text.
 * Liegt in `lib`, damit sowohl die Profilseite als auch die API sie kennen,
 * ohne dass die Route React mitziehen muss.
 */
export const AVATARS = [
  "🚀", "🐍", "🦊", "🐙", "🦉", "🐢", "🦋", "🐝",
  "🌵", "🍀", "🔥", "⚡", "🌙", "⭐", "🎧", "🎲",
  "🧩", "🛠️", "📡", "🧭", "🎯", "🧪", "🪐", "🍄",
];

export const DEFAULT_AVATAR = AVATARS[0];
