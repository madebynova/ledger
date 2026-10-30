import { renderEmptyState } from "../components/empty-state.js";

export const renderSettings = {
  title: "Settings",
  render() {
    return `
      <div class="page-heading">
        <div>
          <p class="eyebrow">Preferences</p>
          <h1 class="page-title" id="page-title">Settings</h1>
          <p class="page-description">Workspace preferences and configuration.</p>
        </div>
      </div>
      ${renderEmptyState({
        icon: "⚙",
        title: "Settings are not configured",
        description: "This preview contains the settings section layout only. No preferences are stored or changed.",
      })}
    `;
  },
};
