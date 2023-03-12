import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import NFT from './NFTCardList'  
import NFTvacio from './NFTCardVacio'
import Loader from '../components/Loader'
import { useRouter } from 'next/router'
import {
  marketplaceAddress
} from '../config'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function MyNFTs() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    try {
      const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    const data = await marketplaceContract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenURI)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        tokenURI
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  
    } catch (error) {
      setLoadingState('loaded') 

    }
  }
  if (loadingState === 'loaded' && !nfts.length) return (<NFTvacio/>)
  return (
    <div>
      <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i}>
                <NFT nft={nft}/>
              </div>
            ))
          }
        </div>
        {(loadingState === 'not-loaded')
                  ? <Loader />
                  : (
                    <br/>
            )}
      </div>
    </div>
  )
}