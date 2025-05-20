import { FiZoomIn, FiImage } from 'react-icons/fi'

const ProductGallery = ({ images = [], selectedImage, onSelectImage, loading }) => {
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

  const mainImage = typeof selectedImage === 'string' 
    ? { url: selectedImage, alt: 'Imagem do produto' }
    : selectedImage || images[0];

  return (
    <div className="space-y-4">
   
      <div className="border rounded-lg overflow-hidden">
        <img
          src={mainImage?.url}
          alt={mainImage?.alt || 'Imagem do produto'}
          className="w-full h-auto object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => onSelectImage(image)}
              className={`border rounded-md overflow-hidden transition-all ${
                mainImage?.url === image.url
                  ? 'ring-2 ring-blue-500'
                  : 'hover:ring-1 hover:ring-gray-300'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || 'Miniatura'}
                className="w-full h-auto object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
export default ProductGallery
