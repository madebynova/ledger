const routeNames = ["dashboard", "organization", "records", "reports", "settings"];

export function createRouter(pages, onRouteChange) {
  function renderCurrentRoute() {
    const requestedRoute = window.location.hash.slice(1);
    const route = routeNames.includes(requestedRoute) ? requestedRoute : "dashboard";

    if (requestedRoute !== route) {
      window.history.replaceState(null, "", `#${route}`);
    }

    for (const link of document.querySelectorAll("[data-route]")) {
      if (!(link instanceof HTMLAnchorElement)) {
        continue;
      }

      if (link.dataset.route === route) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    }

    onRouteChange(pages[route]);
  }

  window.addEventListener("hashchange", renderCurrentRoute);
  renderCurrentRoute();
}
