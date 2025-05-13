const ProductInfo = ({ title, description, price, discountPrice }) => {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        
        <div className="mt-4">
          {discountPrice ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">R$ {discountPrice.toFixed(2)}</span>
              <span className="text-lg text-gray-500 line-through">R$ {price.toFixed(2)}</span>
              <span className="text-sm font-medium bg-red-100 text-red-800 px-2 py-1 rounded">
                {Math.round((1 - discountPrice / price) * 100)}% OFF
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-gray-900">R$ {price.toFixed(2)}</span>
          )}
        </div>
  
        <p className="mt-4 text-gray-600">{description}</p>
  
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            4.8 (256 avaliações)
          </span>
          <span>•</span>
          <span>1.234 vendidos</span>
        </div>
      </div>
    )
  }
  
  export default ProductInfo