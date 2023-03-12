import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import Carrusel1 from '../components/Carrusel1'
import NFT from '../components/NFTCard'
import NFT2 from '../components/CollectionCard'
import Newsletter from '../components/Newsletter'
import Loader from '../components/Loader'
import { useRouter } from 'next/router'
import {marketplaceAddress} from '../config'
import { client } from '../sanitydb/lib/sanityClient'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'


/* Styles */
const style = {
  wrapper: `relative px-2 md:px-10 py-10 max-w-screen-2xl h-auto bg-zinc-900`,
  container: `flex flex-wrap flex-row justify-center border-t  border-cyan-400 w-full `,
  containerNFT: `flex flex-wrap flex-row justify-center border-t  border-cyan-400 w-full `,
  titulo:`text-sky-100 text-2xl text-center xl:text-left tracking-widest  sm:mt-20  fuente`,
}

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    
      /* create a generic provider and query for unsold market items */
      const provider = new ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/KhUvYYgjh5GQmdVxKddi36JOvxJjyT62")
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

  const { collectionId } = router.query
  const [collection, setCollection] = useState([])
  const fetchCollectionData = async (sanityClient = client) => {
    const query = `*[_type == "marketItems" && contractAddress == "0x35209AE9d9478632e99f96c248fDB00c9CB6990b" ] {
      "imageUrl": profileImage.asset->url,
      "bannerImageUrl": bannerImage.asset->url,
      volumeTraded,
      createdBy,
      contractAddress,
      "creator": createdBy->userName,
      title, floorPrice,
      "allOwners": owners[]->,
      description
    }`

    const collectionData = await sanityClient.fetch(query)

    console.log(collectionData, '🔥')

    // the query returns 1 object inside of an array
    await setCollection(collectionData)
  }

  useEffect(() => {
    fetchCollectionData()
  }, [collectionId])
  
  return (
    <div className=' bg-zinc-900'>
          <Carrusel1/>
      <div className='flex justify-center'>
        <div className={style.wrapper}>
       
              <h2 className={style.titulo}>Hot Collections</h2>
              <div className={style.container}>
                   {
                    collection.map((coleccion, i) => (
                      <div key={i} >
                      <NFT2  coleccion={coleccion} />
                      </div>
                    ))
                  } 
                  {/* <Carrusel1 /> */}
              </div>
              <h2 className={style.titulo}>Live Sales</h2>
              <div className={style.containerNFT}>
                  {
                    nfts.map((nft, i) => (
                      <div key={i}>
                      <NFT nft={nft} />
                      </div>                   
                    ))
                  }
              </div>
              {(loadingState === 'not-loaded')
              ? <Loader />
              : (
                <br/>
              )}
              <div className='mx-2 mb-24 max-h-80 md:mx8'>
                <Newsletter/>
              </div>
        </div>
      </div>
    </div>
  )
}
