import {getProducts} from './productsApi.ts'


export const getCategories = () => {
    const rawData = sessionStorage.getItem('products')
    let data
    if(!rawData){
        data = getProducts()
    } else{
        data = JSON.parse(rawData)
    }
    return Array.from(new Set(data.map(product=> product.category)))
    
    
}