export function renderEmptyState({ icon, title, description }) {
  return `
    <section class="panel empty-state" aria-labelledby="empty-state-title">
      <div class="empty-state-icon" aria-hidden="true">${icon}</div>
      <h2 class="empty-state-title" id="empty-state-title">${title}</h2>
      <p class="empty-state-description">${description}</p>
    </section>
  `;
}
