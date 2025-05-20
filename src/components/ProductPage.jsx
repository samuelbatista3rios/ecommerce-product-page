/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import VariantSelector from "./VariantSelector";
import ShippingCalculator from "./ShippingCalculator";
import AddToCartButton from "./AddToCartButton";

const PRODUCT_URLS = {
  "Produto 1":
    "https://empreender.nyc3.cdn.digitaloceanspaces.com/static/teste-prod-1.json",
  "Produto 2":
    "https://empreender.nyc3.cdn.digitaloceanspaces.com/static/teste-prod-2.json",
};

const ProductPage = () => {
  const [productUrl, setProductUrl] = useState(PRODUCT_URLS["Produto 1"]);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedVariantPrice, setSelectedVariantPrice] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    cep: "",
    address: null,
    error: null,
    loading: false,
  });
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(productUrl);
      const data = res.data;

      const formattedProduct = {
        id: data.id,
        title: data.title,
        price: data.variants?.[0]?.price ?? "0.00",
        discountPrice: null,
        images: data.images?.map((img, index) => ({
          id: img.id || index, 
          url: img.src, 
          alt: data.title, 
        })) || [
          {
          
            id: 0,
            url: data.image_url, 
            alt: data.title,
          },
        ],
        variants: (data.options || []).reduce((acc, option, idx) => {
          acc[option] = data.values[idx];
          return acc;
        }, {}),
        variantsList: data.variants,
        stock: data.variants.map((variant) => {
          const variantObject = {};
          data.options.forEach((opt, idx) => {
            variantObject[opt] = variant.values[idx];
          });
          return {
            ...variantObject,
            available: variant.inventory_quantity > 0,
            variantId: variant.id,
          };
        }),
      };

      setProduct(formattedProduct);
      setSelectedImage(formattedProduct.images?.[0]);
      setSelectedVariants({});
      setSelectedVariantPrice(formattedProduct.price);
      setIsAvailable(null);
    };

    fetchProduct();
  }, [productUrl]);

  useEffect(() => {
    if (!product || !product.stock) return;

    const matched = product.stock.find((item) =>
      Object.entries(selectedVariants).every(
        ([key, value]) => item[key] === value
      )
    );

    if (
      Object.keys(selectedVariants).length ===
      Object.keys(product.variants).length
    ) {
      setIsAvailable(matched?.available ?? false);

      const matchedVariant = product.variantsList?.find(
        (v) => v.id === matched?.variantId
      );
      setSelectedVariantPrice(matchedVariant?.price ?? product.price);
    } else {
      setIsAvailable(null);
      setSelectedVariantPrice(product.price);
    }
  }, [selectedVariants, product]);

  const handleVariantChange = (key, value) => {
    setSelectedVariants((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckout = async () => {
    const matched = product.stock.find((item) =>
      Object.entries(selectedVariants).every(
        ([key, value]) => item[key] === value
      )
    );

    if (!matched) {
      alert("Selecione uma combinação válida de variantes.");
      return;
    }

    const payload = [
      {
        values: Object.values(selectedVariants),
        quantity: 1,
        product_id: product.id,
        variant_id: matched.variantId,
      },
    ];

    try {
      const res = await axios.post(
        "https://app.landingpage.com.br/api/checkoutloja/LPL2gc/5d87eb644e5631bc6a03f1e43a804e1c",
        payload
      );
      alert("Compra enviada com sucesso!");
    } catch (err) {
      alert("Erro ao enviar para o checkout.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <select
        className="mb-4 p-2 border rounded"
        value={productUrl}
        onChange={(e) => setProductUrl(e.target.value)}
      >
        {Object.entries(PRODUCT_URLS).map(([name, url]) => (
          <option key={url} value={url}>
            {name}
          </option>
        ))}
      </select>

      {!product ? (
        <p>Carregando produto...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery
            images={product.images}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
          />

          <div>
            <ProductInfo
              title={product.title}
              description=""
              price={Number(selectedVariantPrice ?? product.price)}
              discountPrice={
                product.discountPrice ? Number(product.discountPrice) : null
              }
            />

            {Object.entries(product.variants).map(([key, options]) => (
              <VariantSelector
                key={key}
                name={key}
                options={options}
                selectedValue={selectedVariants[key]}
                onChange={(value) => handleVariantChange(key, value)}
              />
            ))}

            {isAvailable !== null && (
              <p
                className={`mt-2 text-sm font-medium ${
                  isAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {isAvailable
                  ? "Disponível em estoque ✅"
                  : "Produto indisponível ❌"}
              </p>
            )}

            <AddToCartButton
              selectedVariants={selectedVariants}
              productId={product.id}
            />

            <button
              onClick={handleCheckout}
              disabled={!isAvailable}
              className="mt-4 w-full py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:bg-gray-300"
            >
              Comprar agora
            </button>

            <ShippingCalculator
              shippingInfo={shippingInfo}
              setShippingInfo={setShippingInfo}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
