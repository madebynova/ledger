export const renderDashboard = {
  title: "Dashboard",
  render() {
    return `
      <section class="dashboard-intro" aria-labelledby="page-title">
        <div class="page-heading">
          <div>
            <p class="eyebrow">Workspace overview</p>
            <h1 class="page-title" id="page-title">Good morning, Alex</h1>
            <p class="page-description">A clear view of your workspace, all in one place.</p>
          </div>
          <span class="subtle-label"><span class="status-dot" aria-hidden="true"></span> Sample workspace</span>
        </div>
      </section>

      <section class="dashboard-grid" aria-label="Sample workspace summary">
        <article class="panel stat-card">
          <div class="stat-topline"><span class="stat-label">Workspace setup</span><span class="stat-icon" aria-hidden="true">◈</span></div>
          <div class="stat-value">68%</div>
          <p class="stat-note">Sample content · preview only</p>
        </article>
        <article class="panel stat-card">
          <div class="stat-topline"><span class="stat-label">Team members</span><span class="stat-icon" aria-hidden="true">◉</span></div>
          <div class="stat-value">04</div>
          <p class="stat-note">Sample content · preview only</p>
        </article>
        <article class="panel stat-card">
          <div class="stat-topline"><span class="stat-label">Organized items</span><span class="stat-icon" aria-hidden="true">▤</span></div>
          <div class="stat-value">12</div>
          <p class="stat-note">Sample content · preview only</p>
        </article>
        <article class="panel stat-card">
          <div class="stat-topline"><span class="stat-label">Available reports</span><span class="stat-icon" aria-hidden="true">▥</span></div>
          <div class="stat-value">03</div>
          <p class="stat-note">Sample content · preview only</p>
        </article>
      </section>

      <section class="dashboard-lower" aria-label="Workspace preview">
        <article class="panel activity-panel">
          <div class="panel-heading">
            <div>
              <h2 class="panel-title">Recent activity</h2>
              <p class="panel-caption">A sample of what’s happening in your workspace</p>
            </div>
            <span class="subtle-label">Preview</span>
          </div>
          <ul class="activity-list">
            <li class="activity-item">
              <span class="activity-marker" aria-hidden="true">✓</span>
              <div class="activity-copy"><p class="activity-title">Workspace profile reviewed</p><p class="activity-detail">Today · Organization</p></div>
            </li>
            <li class="activity-item">
              <span class="activity-marker" aria-hidden="true">＋</span>
              <div class="activity-copy"><p class="activity-title">A new team member was added</p><p class="activity-detail">Yesterday · Team</p></div>
            </li>
            <li class="activity-item">
              <span class="activity-marker" aria-hidden="true">▤</span>
              <div class="activity-copy"><p class="activity-title">Workspace records were organized</p><p class="activity-detail">Oct 24 · Records</p></div>
            </li>
          </ul>
        </article>

        <article class="panel readiness-panel">
          <p class="eyebrow">Getting started</p>
          <h2 class="panel-title">Your workspace is taking shape</h2>
          <p class="panel-caption">This dashboard uses illustrative sample content. Your workspace is not connected to saved data yet.</p>
          <div class="readiness-meter" role="progressbar" aria-label="Sample workspace setup" aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
            <div class="readiness-meter-fill"></div>
          </div>
          <div class="readiness-foot"><span>Sample setup</span><strong>68%</strong></div>
        </article>
      </section>
    `;
  },
};
