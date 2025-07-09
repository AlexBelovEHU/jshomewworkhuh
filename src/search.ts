import { cardsListRender } from "./renderCardsList";
import type { IProduct } from "./types";

export function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchButt = document.getElementById('search-but');

  if (!searchInput || !searchButt) return;

  searchButt.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return; 

    const stored: IProduct[] = JSON.parse(sessionStorage.getItem('products') || '[]');

    const matches = stored.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );

    const ids = matches.map(p => p.id);
    cardsListRender({ ids });
  });
}
