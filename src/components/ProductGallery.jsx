import { FiZoomIn, FiImage } from 'react-icons/fi'
const ProductGallery = ({ images, selectedImage, onSelectImage, loading }) => {
    if (loading) {
        return (
          <div className="space-y-4">
            <div className="border rounded-lg bg-gray-100 aspect-square flex items-center justify-center">
              <FiImage className="w-12 h-12 text-gray-300 animate-pulse" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-md animate-pulse"></div>
              ))}
            </div>
          </div>
        )
      }
   
    return (
      <div className="space-y-4">
        {/* Imagem principal */}
        <div className="border rounded-lg overflow-hidden">
          <img 
            src={selectedImage.url} 
            alt={selectedImage.alt} 
            className="w-full h-auto object-cover"
          />
        </div>
  
        {/* Miniaturas */}
        <div className="grid grid-cols-4 gap-2">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => onSelectImage(image)}
              className={`border rounded-md overflow-hidden transition-all ${selectedImage.id === image.id ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'}`}
            >
              <img 
                src={image.url} 
                alt={image.alt} 
                className="w-full h-auto object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    )
  }
  
  export default ProductGallery