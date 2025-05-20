import { useState } from 'react'
const AddToCartButton = ({ selectedVariants, productId }) => {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    
    setIsAdding(true)
    
    setTimeout(() => {
      // Salvar no localStorage
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
      const existingItemIndex = cartItems.findIndex(
        item => item.productId === productId && 
               item.size === selectedVariants.size && 
               item.color === selectedVariants.color
      )
      
      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += quantity
      } else {
        cartItems.push({
          productId,
          quantity,
          ...selectedVariants
        })
      }
      
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
      setIsAdding(false)
      setAdded(true)
      
      // Resetar após 3 segundos
      setTimeout(() => setAdded(false), 3000)
    }, 1000)
  }

  const allVariantsSelected = selectedVariants.size && selectedVariants.color

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center border rounded-md">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-3 py-1">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!allVariantsSelected || isAdding || added}
          className={`flex-1 py-3 px-6 rounded-md font-medium ${allVariantsSelected 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'} ${added ? 'bg-green-600 hover:bg-green-600' : ''}`}
        >
          {isAdding ? 'Adicionando...' : added ? 'Adicionado ao carrinho!' : 'Adicionar ao carrinho'}
        </button>
      </div>

      {!allVariantsSelected && (
        <p className="text-sm text-red-600">Selecione todas as opções antes de adicionar ao carrinho</p>
      )}
    </div>
  )
}

export default AddToCartButton
