import {getCategories} from './utils.ts'
import {cardsListRender} from './renderCardsList.ts'
import { searchInput } from './searchElement.ts'
import { aboutUs } from './aboutUs.ts'

const app = document.getElementById('app')

const renderDropDown = () =>{
    const myDropdown = document.getElementById('myDropdown')
    const categories = getCategories()
    console.log(categories)
    myDropdown.innerHTML = categories.reduce((acc, curr) => acc += `<button class="cut" data-category="${curr}">${curr}</button>`, '' )
    console.log()
}

export const renderPage = () => {
    app.innerHTML = 
    `<header id="header" class="header flex lg:items-center lg:justify-between">
        <div class="logo-container flex lg:items-center gap-4">
          <a href="" class="logo">
       <svg xmlns="http://www.w3.org/2000/svg" width="103" height="103" viewBox="0 0 103 103" fill="none">
          <rect width="103" height="103" fill="#AFDDFF"/>
          <path d="M15 65.5L49 0H76V103H34.5L15 65.5Z" fill="#FFA8A8"/>
          <path d="M42 65.5L76 0H103V103H61.5L42 65.5Z" fill="#FFDBDB" fill-opacity="0.933333"/>
          <rect y="46" width="103" height="33" fill="#8D9AAD"/>
          <circle cx="22" cy="56" r="3" fill="black"/>
          <rect x="39" y="66" width="19" height="19" fill="#ABB9CE"/>
          </svg>
          </a>
          <a href="" class="logo-text">Titeel</a>
          <div class="dropdown" id="dropDown">
            <button type="button" class="inline-flex w-full justify-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-white ring-1 ring-gray-300 ring-inset" id="menu-button" aria-expanded="true border-none" aria-haspopup="true">
              Categores
              <svg class="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
              </svg>
            </button>
            <div id="myDropdown" class="dropdown-content"></div>
          </div>
        </div>
        <svg width="24px" height="24px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 1H15V10H4.60087L4.17982 12H12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16C10.8954 16 10 15.1046 10 14H6C6 15.1046 5.10457 16 4 16C2.89543 16 2 15.1046 2 14V12.6459L2.98262 7.97846L2.15287 3H0V1Z" fill="#ffff"/>
        </svg>
    </header>`
  
    renderDropDown()
    cardsListRender()
    aboutUs()
  
    const logoContainer = document.querySelector('.logo-container')
    const dropDown = document.getElementById('dropDown')
    const header = document.getElementById('header')

      const aboutUsElement = aboutUs()

      if (header) {

          header.insertAdjacentElement('afterend', aboutUsElement)
      }
  
    if (logoContainer && dropDown) {
      logoContainer.insertBefore(searchInput(), dropDown)
    }
  }
  

