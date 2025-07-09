import './style.css';
import { getProducts } from './productsApi';
import { droppDownMenu } from './dropDownMeniu';
import { renderPage } from './render';
import { addEventListenersToDropdown } from './filter';
import { initSearch } from './search';


const initializePage = async () => {
  await getProducts();
  renderPage();
  droppDownMenu();
  addEventListenersToDropdown();
  initSearch();
  
};

initializePage();
