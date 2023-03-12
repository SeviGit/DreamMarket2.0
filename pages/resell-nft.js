import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import Loader from '../components/Loader'
import Web3Modal from 'web3modal'
import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const router = useRouter()
  const [loadingState, setLoadingState] = useState('loaded')
  const { id, tokenURI } = router.query
  const { image, price } = formInput

  useEffect(() => {
    fetchNFT()
  }, [id])

  async function fetchNFT() {
    if (!tokenURI) return
    const meta = await axios.get(tokenURI)
    updateFormInput(state => ({ ...state, image: meta.data.image }))
  }

  async function listNFTForSale() {
    if (!price) return
    setLoadingState('not-loaded') 
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()

    listingPrice = listingPrice.toString()
    let transaction = await contract.resellToken(id, priceFormatted, { value: listingPrice })
    await transaction.wait()
    setLoadingState('loaded') 
    router.push('/')
  }

  return (
    <div className="flex justify-center py-28 min-h-screen bg-zinc-900">
      <div className="w-1/2 flex flex-col pb-12 justify-center items-center">
        <div className="items-center">
           {
          image && (
            <img className="rounded mt-4" width="350" src={image} />
          )
        }
        </div>
       
        <div className='flex items-end w-full border-b border-cyan-400 p-0 hover:border-cyan-100 mb-10'>
        <input
          placeholder="Asset Price in Eth"
          className="w-full  bg-zinc-900 p-4 text-white  hover:border-cyan-30"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
              </div>
        {(loadingState === 'loaded')
              ? <button onClick={() => listNFTForSale()} className="w-full btn-f btn-on span mt-4">
                List NFT
                </button>
              : (
                <Loader />
              )}
      </div>
    </div>
  )
}