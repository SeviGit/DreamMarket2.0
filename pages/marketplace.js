import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import NFT from '../components/NFTCard'
import Loader from '../components/Loader'
import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function Marketplace() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/KhUvYYgjh5GQmdVxKddi36JOvxJjyT62" )
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenURI = await contract.tokenURI(i.tokenId)
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
  }
  return (
    <div className=' pt-20 min-h-screen bg-zinc-900'>
      <div className="flex flex-col items-center py-10">
      <h1 className='text-4xl text-center text-cyan-300 mb-8 fuente'>MARKETPLACE</h1>
        <div className=' px-10  max-w-screen-xl h-auto  w-full' >
              <h2 className='text-sky-100 text-2xl text-center sm:text-left tracking-widest fuente'>Explore</h2>

            <div className='flex flex-wrap flex-row justify-center sm:justify-start border-t  border-cyan-400'>
              {
                    nfts.map((nft, i) => (
                      <div key={i} >
                      <NFT   nft={nft} />
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
    </div>
    
  )
}