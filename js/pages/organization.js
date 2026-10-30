import { renderEmptyState } from "../components/empty-state.js";

export const renderOrganization = {
  title: "Organization",
  render() {
    return `
      <div class="page-heading">
        <div>
          <p class="eyebrow">Workspace</p>
          <h1 class="page-title" id="page-title">Organization</h1>
          <p class="page-description">An overview of your organization and the people in it.</p>
        </div>
      </div>
      ${renderEmptyState({
        icon: "⌂",
        title: "Your organization details will appear here",
        description: "Organization profiles and team information are not set up in this preview.",
      })}
    `;
  },
};
