import { useState, useEffect } from 'react'
import ProductGallery from './components/ProductGallery'
import ProductInfo from './components/ProductInfo'
import VariantSelector from './components/VariantSelector'
import ShippingCalculator from './components/ShippingCalculator'
import AddToCartButton from './components/AddToCartButton'
import useLocalStorage from './components/hooks/useLocalStorage'
import { searchPhotos } from './api/pexels'

const App = () => {

  const [productData, setProductData] = useState({
    id: 1,
    title: 'Tênis Esportivo Premium',
    description: 'Tênis perfeito para corridas e atividades físicas, com amortecimento de alta qualidade.',
    price: 299.99,
    discountPrice: 249.99,
    stock: 15,
    rating: 4.7,
    reviews: 1289,
    images: [],
    variants: {
      size: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
      color: [
        { name: 'Preto', code: '#000000' },
        { name: 'Branco', code: '#ffffff', border: '#cccccc' },
        { name: 'Azul Marinho', code: '#1e3a8a' },
        { name: 'Vermelho', code: '#dc2626' },
      ],
    },
  })

  const [selectedVariants, setSelectedVariants] = useState({
    size: '39',
    color: 'Preto'
  })

  const [shippingInfo, setShippingInfo] = useState({
    zipCode: '',
    shippingCost: null,
    estimatedDelivery: null
  })
    
  const [loadingImages, setLoadingImages] = useState(true)
  const [selectedImage, setSelectedImage] = useLocalStorage('selectedImage', null)

  useEffect(() => {
    const loadProductImages = async () => {
      try {
        setLoadingImages(true)
        const photos = await searchPhotos('running shoes', 5)

        if (photos.length > 0) {
          setProductData(prev => ({
            ...prev,
            images: photos
          }))
          setSelectedImage(photos[0])
        } else {
          const fallback = {
            id: 1,
            url: 'https://via.placeholder.com/800x800/2563eb/ffffff?text=Tênis+Frontal',
            alt: 'Imagem do tênis'
          }
          setProductData(prev => ({
            ...prev,
            images: [fallback]
          }))
          setSelectedImage(fallback)
        }
      } catch (error) {
        console.error('Erro ao carregar imagens:', error)
        const fallback = {
          id: 1,
          url: 'https://via.placeholder.com/800x800/2563eb/ffffff?text=Tênis+Frontal',
          alt: 'Imagem do tênis'
        }
        setProductData(prev => ({
          ...prev,
          images: [fallback]
        }))
        setSelectedImage(fallback)
      } finally {
        setLoadingImages(false)
      }
    }

    loadProductImages()
  }, [])


  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {loadingImages ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Galeria de imagens */}
          <div className="md:w-2/5">
            <ProductGallery 
              images={productData.images} 
              selectedImage={selectedImage} 
              onSelectImage={setSelectedImage} 
            />
          </div>

          {/* Informações do produto */}
          <div className="md:w-3/5">
            <ProductInfo 
              title={productData.title} 
              description={productData.description} 
              price={productData.price} 
              discountPrice={productData.discountPrice} 
            />

            {/* Seletores de variantes */}
            <div className="mt-6 space-y-4">
              {Object.entries(productData.variants).map(([variantName, options]) => {
                // Se for objeto (ex: color), extrair nome para passar como value
                const parsedOptions = typeof options[0] === 'object'
                  ? options.map(opt => opt.name)
                  : options

                return (
                  <VariantSelector 
                    key={variantName}
                    name={variantName}
                    options={parsedOptions}
                    selectedValue={selectedVariants[variantName]}
                    onChange={(value) => setSelectedVariants({
                      ...selectedVariants,
                      [variantName]: value
                    })}
                  />
                )
              })}
            </div>

            {/* Calculadora de frete */}
            <div className="mt-6">
              <ShippingCalculator 
                shippingInfo={shippingInfo}
                setShippingInfo={setShippingInfo}
              />
            </div>

            {/* Botão de adicionar ao carrinho */}
            <div className="mt-6">
              <AddToCartButton 
                selectedVariants={selectedVariants}
                productId={productData.id}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App