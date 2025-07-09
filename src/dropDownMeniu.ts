
const hoverListener = (event) => {
  const dropdown = document.getElementById('myDropdown');
  if (dropdown) {
    dropdown.classList.add('show');
  }
}

const hoverListenerHide = (event) => {
  const dropdown = document.getElementById('myDropdown');
  if (dropdown) {
    dropdown.classList.remove('show');
  }
}

export const droppDownMenu = () => {
  const dropDown = document.getElementById('dropDown');
  
  if (dropDown) {
    dropDown.addEventListener('mouseover', hoverListener);
    dropDown.addEventListener('mouseleave', hoverListenerHide);
    console.log(dropDown); 
  }
}
