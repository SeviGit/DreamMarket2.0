import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { client } from '../sanitydb/lib/sanityClient'
import { CgWebsite } from 'react-icons/cg'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'
import NFTCard from '../components/NFTCard'
import axios from 'axios'
import { ethers } from 'ethers'
import {marketplaceAddress} from '../config'
import { SiEthereum } from 'react-icons/si'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

const style = {
  bannerImageContainer: `h-[40vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem] hidden md:block`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
}

const Collections = () => {
  const router = useRouter()
  const { collectionId } = router.query
  const [collection, setCollection] = useState({})
  const [nfts, setNfts] = useState([])
  const [listings, setListings] = useState([])
  const { name } = router.query
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    fetchNFT()
  }, [name])

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    
    /* crea un proveedor genérico y consulta los artículos de mercado no vendidos */
    const provider = new ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/KhUvYYgjh5GQmdVxKddi36JOvxJjyT62" )
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchMarketItems()

    /*
    * mapa sobre artículos devueltos de contrato inteligente y formato
    * ellos, así como obtener sus metadatos de token
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

  async function fetchNFT() {
    if (!name) return
    name = await axios.get(name)
}
  const fetchCollectionData = async (sanityClient = client) => {
    const query = `*[_type == "marketItems" && title == "${name}"] {
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


    // la consulta devuelve 1 objeto dentro de una array
    await setCollection(collectionData[0])
  }

  useEffect(() => {
    fetchCollectionData()
  }, [collectionId])

  return (
    <div className="flex-col items-center h-min-screen ">
        <div className={style.bannerImageContainer}>
          <img
            className={style.bannerImage}
            src={
              collection?.bannerImageUrl
                ? collection.bannerImageUrl
                : 'https://via.placeholder.com/200'
            }
            alt="banner"
          />
        </div>
        <div className={style.infoContainer}>
            <div className={style.midRow}>
              <img
                className={style.profileImg}
                src={
                  collection?.imageUrl
                    ? collection.imageUrl
                    : 'https://via.placeholder.com/200'
                }
                alt="profile image"
              />
            </div>
            <div className={style.endRow}>
                <div className={style.socialIconsContainer}>
                    <div className={style.socialIconsWrapper}>
                        <div className={style.socialIconsContent}>
                            <div className={style.socialIcon}>
                                <CgWebsite />
                            </div>
                            <div className={style.divider} />
                                <div className={style.socialIcon}>
                                    <AiOutlineInstagram />
                                </div>
                            <div className={style.divider} />
                                <div className={style.socialIcon}>
                                    <AiOutlineTwitter />
                                </div>
                                <div className={style.divider} />
                                    <div className={style.socialIcon}>
                                      <HiDotsVertical />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.midRow}>
                        <div className={style.title}>{collection?.title}</div>
                    </div>
                    <div className={style.midRow}>
                        <div className={style.createdBy}>
                            Created by{' '}
                            <span className="text-[#2081e2]">{collection?.creator}</span>
                        </div>
                    </div>
                    <div className={style.midRow}>
                        <div className={style.statsContainer}>
                            <div className={style.collectionStat}>
                                <div className={style.statValue}>{nfts.length}</div>
                                <div className={style.statName}>items</div>
                            </div>
                        <div className={style.collectionStat}>
                            <div className={style.statValue}>
                                {collection?.allOwners ? collection.allOwners.length : ''}
                            </div>
                            <div className={style.statName}>owner</div>
                          </div>
              <div className={style.collectionStat}>
                <div className={style.statValue}>
                  <SiEthereum/> 
                  {collection?.floorPrice}
                </div>
                <div className={style.statName}>floor price</div>
              </div>
              <div className={style.collectionStat}>
                <div className={style.statValue}>
                <SiEthereum/> 
                  {collection?.volumeTraded}.5K
                </div>
                <div className={style.statName}>volume traded</div>
              </div>
            </div>
          </div>
          <div className={style.midRow}>
            <div className={style.description}>{collection?.description}</div>
          </div>
        </div>

      <div className='flex justify-center w-full '>
        <div className="flex flex-wrap justify-center max-w-screen-xl p-8 my-8 10/12 ">
          {
            nfts.map((nft, i) => (
              <div key={i} >
              <NFTCard nft={nft}/>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Collections