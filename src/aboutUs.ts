
export const aboutUs = (): HTMLElement =>{

const aboutCont = document.createElement('div')
aboutCont.className = 'about-cont m-6  p-2 border-3 border-solid lg:justify-between gap-y-10'

const aboutTextCont = document.createElement('div')
aboutTextCont.className = 'about-text-cont ml-3'

const aboutImage = document.createElement('img')
aboutImage.className = 'about-img'
aboutImage.src = './assets/Pride_Hero.png'

aboutImage.alt = 'A brief description of the image';

const aboutH = document.createElement('h1')
aboutH.className = 'about-h'
aboutH.textContent = 'About Us'
const aboutText = document.createElement('p')
aboutText.className = 'about-p'
aboutText.textContent = 'At Titeel, we offer a diverse range of clothing, electronics, and jewelry, designed for everyone. We are committed to being an inclusive and friendly brand, ensuring that all our customers feel welcome, valued, and represented. With great products and exceptional service, shopping with us is a joyful, empowering experience for all.'

aboutTextCont.appendChild(aboutH)
aboutTextCont.appendChild(aboutText)
aboutCont.appendChild(aboutImage)
aboutCont.appendChild(aboutTextCont)

return  aboutCont 
}