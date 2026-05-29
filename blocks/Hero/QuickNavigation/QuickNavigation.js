/**
 * QuickNavigation - Frontend dropdown navigation
 */
document.addEventListener("DOMContentLoaded", () => {
  // Handle random selection on page load
  document.querySelectorAll('select[data-random-select="true"]').forEach((select) => {
    const options = select.querySelectorAll('option[value]:not([value=""])');
    if (options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      select.selectedIndex = randomIndex;
    }
  });

  // Handle button click to navigate
  document.querySelectorAll(".quick-navigation-submit").forEach((button) => {
    const selectId = button.dataset.selectId;
    const select = document.getElementById(selectId);

    if (select) {
      button.addEventListener("click", () => {
        const url = select.value;
        if (url) {
          window.location.href = url;
        }
      });
    }
  });
});
