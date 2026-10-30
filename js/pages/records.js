import { renderEmptyState } from "../components/empty-state.js";

export const renderRecords = {
  title: "Records",
  render() {
    return `
      <div class="page-heading">
        <div>
          <p class="eyebrow">Workspace</p>
          <h1 class="page-title" id="page-title">Records</h1>
          <p class="page-description">A place for your workspace records and reference material.</p>
        </div>
      </div>
      ${renderEmptyState({
        icon: "▤",
        title: "No records to show yet",
        description: "Records are not connected in this initial application shell. This section is ready for a future phase.",
      })}
    `;
  },
};
