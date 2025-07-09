import { IProduct } from "./types"


export const getProducts = async (): Promise<IProduct[]> => {
    const res =  await fetch('https://fakestoreapi.com/products')

    const data: IProduct[] = await res.json()
    sessionStorage.setItem('products', JSON.stringify(data))
    return data
}