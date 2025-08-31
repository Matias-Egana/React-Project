import{ useState,useEffect} from 'react'
import Guitar from "./components/Guitar";
import Header from "./components/Header"
import Footer from "./Footer";
import { db } from './data/db';
import{ useCart } from './hooks/useCart'
function App() {

  useCart()

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart) 
  const [lastAddedProduct, setLastAddedProduct] = useState(null);
  const MAX_ITEM = 10
  const MIN_ITEM = 1

  useEffect(()=>{
    localStorage.setItem('cart',JSON.stringify(cart))
  }, [cart])

  function addToCart(item){

    const itemExists = cart.findIndex((guitar)=> guitar.id === item.id )
    console.log(itemExists)
    if(itemExists>=0){
      if(cart[itemExists].quantity >= MAX_ITEM) return
      const updateCart =  [...cart]
      updateCart[itemExists].quantity++
      setCart(updateCart)
      console.log('Existe')
    }else{
      item.quantity = 1
      console.log('No Existe...Agregando')
      setCart([...cart,item])
    }
    setLastAddedProduct(item);
    setTimeout(() => setLastAddedProduct(null), 3000);
    
  }
  
  function removeFromCart(id){
    setCart(prevCart=> prevCart.filter(guitar => guitar.id !== id))
  }

  function clearCart(id){
    setCart([])
  }

  function increaseQuantity(id){
    const updateCart = cart.map(item=>{
      if(item.id === id && item.quantity < MAX_ITEM ){
        return{
          ...item,
          quantity: item.quantity + 1
      }
      }
      return item
    })
    setCart(updateCart)
  }

  function decreaseQuantity(id){
    const updateCart = cart.map(item=>{
      if(item.id === id && item.quantity > MIN_ITEM){
        return{
          ...item,
          quantity: item.quantity - 1
      }
      }
      return item
    })
    setCart(updateCart)
  }

  return (
    <>
    <Header
      cart={cart}
      removeFromCart={removeFromCart}
      increaseQuantity={increaseQuantity}
      decreaseQuantity={decreaseQuantity}
      clearCart={clearCart}
      lastAddedProduct={lastAddedProduct}
    />
    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
            {data.map((guitar) => (
              <Guitar
              key={guitar.id}
                guitar={guitar}
                setCart={setCart}
                addToCart={addToCart}
              />
              )
            )}
        
        </div>
    </main>
    <Footer/>
    </>
  )
}

export default App
