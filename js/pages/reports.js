import { renderEmptyState } from "../components/empty-state.js";

export const renderReports = {
  title: "Reports",
  render() {
    return `
      <div class="page-heading">
        <div>
          <p class="eyebrow">Workspace</p>
          <h1 class="page-title" id="page-title">Reports</h1>
          <p class="page-description">A clear home for future workspace summaries.</p>
        </div>
      </div>
      ${renderEmptyState({
        icon: "▥",
        title: "Reports will appear here",
        description: "There is no report data in this preview. Reporting features can be considered in a later phase.",
      })}
    `;
  },
};
