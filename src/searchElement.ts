export const searchInput = (): HTMLElement => {
    const wrapper = document.createElement('div')
    wrapper.className = 'w-full max-w-sm min-w-[200px]'
  
    const relative = document.createElement('div')
    relative.className = 'relative'
  
    const input = document.createElement('input')
    input.type = 'search'
    input.placeholder = 'Search...'
    input.className = 'w-full bg-transparent placeholder:text-white text-slate-700 text-sm border border-slate-100  pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border hover:border shadow-sm '
    input.id = 'search-input'

    const button = document.createElement('button')
    button.type = 'button'
    button.className ='absolute shadow-none top-1 right-1 flex items-center  bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-none focus:bg-slate-700  shadow-none focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
    button.innerText = 'Search'
    button.id = 'search-but'
  
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('fill', 'currentColor')
    svg.setAttribute('class', 'w-4 h-4 mr-2')
  
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('fill-rule', 'evenodd')
    path.setAttribute('clip-rule', 'evenodd')
    path.setAttribute(
      'd',
      'M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z'
    )
  
    svg.appendChild(path)
    button.prepend(svg)
  
    relative.appendChild(input)
    relative.appendChild(button)
    wrapper.appendChild(relative)
  
    return wrapper
  }
  