import { createRouter } from "./router.js";
import { store } from "./data/store.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderOrganization } from "./pages/organization.js";
import { renderRecords } from "./pages/records.js";
import { renderReports } from "./pages/reports.js";
import { renderSettings } from "./pages/settings.js";

const pages = {
  dashboard: renderDashboard,
  organization: renderOrganization,
  records: renderRecords,
  reports: renderReports,
  settings: renderSettings,
};

const pageContent = document.querySelector("#page-content");
const breadcrumbCurrent = document.querySelector("#breadcrumb-current");

if (!(pageContent instanceof HTMLElement) || !(breadcrumbCurrent instanceof HTMLElement)) {
  throw new Error("The application shell is missing its page content or breadcrumb element.");
}

try {
  await store.initialize();
} catch (error) {
  console.error("LEDGER could not initialize its local data store.", error);
}

createRouter(pages, (page) => {
  pageContent.innerHTML = page.render();
  breadcrumbCurrent.textContent = page.title;
  document.title = `${page.title} — LEDGER`;
});
