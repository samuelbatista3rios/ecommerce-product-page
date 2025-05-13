/* eslint-disable no-unused-vars */
import { useState } from 'react'
import axios from 'axios'

const ShippingCalculator = ({ shippingInfo, setShippingInfo }) => {
  const [cepInput, setCepInput] = useState(shippingInfo.cep || '')

  const handleCepSubmit = async (e) => {
    e.preventDefault()
    
    // Validação básica do CEP
    const cleanedCep = cepInput.replace(/\D/g, '')
    if (cleanedCep.length !== 8) {
      setShippingInfo({
        ...shippingInfo,
        error: 'CEP inválido. Digite um CEP com 8 dígitos.',
        address: null
      })
      return
    }

    try {
      setShippingInfo({
        ...shippingInfo,
        loading: true,
        error: null
      })

      const response = await axios.get(`https://viacep.com.br/ws/${cleanedCep}/json/`)
      
      if (response.data.erro) {
        setShippingInfo({
          ...shippingInfo,
          error: 'CEP não encontrado.',
          address: null,
          loading: false
        })
      } else {
        setShippingInfo({
          cep: cleanedCep,
          address: response.data,
          error: null,
          loading: false
        })
      }
    } catch (error) {
      setShippingInfo({
        ...shippingInfo,
        error: 'Erro ao consultar o CEP. Tente novamente.',
        address: null,
        loading: false
      })
    }
  }

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-sm font-medium text-gray-900 mb-2">Calcular frete</h3>
      
      <form onSubmit={handleCepSubmit} className="flex gap-2">
        <input
          type="text"
          value={cepInput}
          onChange={(e) => setCepInput(e.target.value)}
          placeholder="Digite seu CEP"
          className="flex-1 min-w-0 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <button
          type="submit"
          disabled={shippingInfo.loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {shippingInfo.loading ? 'Consultando...' : 'Calcular'}
        </button>
      </form>

      {shippingInfo.error && (
        <p className="mt-2 text-sm text-red-600">{shippingInfo.error}</p>
      )}

      {shippingInfo.address && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm font-medium text-gray-900">Frete para:</p>
          <p className="text-sm text-gray-600">
            {shippingInfo.address.logradouro}, {shippingInfo.address.bairro}<br />
            {shippingInfo.address.localidade} - {shippingInfo.address.uf}<br />
            CEP: {shippingInfo.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}
          </p>
          <p className="mt-2 text-sm font-medium text-green-600">
            Frete grátis para esta região (chega em 5 dias úteis)
          </p>
        </div>
      )}
    </div>
  )
}

export default ShippingCalculator