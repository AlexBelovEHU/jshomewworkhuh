import { cardsListRender } from "./renderCardsList";

export const addEventListenersToDropdown = () => {
  const dropdown = document.getElementById('myDropdown');
  if (!dropdown) return;

  const buttons = dropdown.getElementsByTagName('button');
  Array.from(buttons).forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category') || '';
      cardsListRender({ category });
    });
  });
};
