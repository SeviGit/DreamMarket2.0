import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import {marketplaceAddress} from '../config'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

/* Styles */
const style = {
  wrapper: `relative bg-zinc-800 flex-auto w-[16rem] h-[23rem] py-2 my-5  mx-5 rounded-2xl overflow-hidden  shadow-lg hover:shadow-xl ease-in duration-300  shadow-fuchsia-500  hover:shadow-fuchsia-500 `,
  imgContainer: `h-[15rem] w-full overflow-hidden flex justify-center items-center`,
  nftImg: `w-full object-cover`,
  details: `py-1 px-3`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  collectionName: `font-semibold text-sm text-[#8a939b]`,
  assetName: `font-bold text-lg `,
  infoRight: `flex-0.4  `,
  priceTag: `inline-flex items-center font-semibold text-sm text-[#8a939b]`,
  priceValue: `flex items-center text-xl font-bold mt-2`,
  ethLogo: `h-5 mr-2`,
}

// Componente que representa una carta de NFT(Donde se muestra) no tiene función  de comprar


const MyNFTCard = ({nft}) => {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const router = useRouter()
    useEffect(() => {
      loadNFTs()
    }, [])
    async function loadNFTs() {
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
          tokenURI
        }
        return item
      }))
      setNfts(items)
      setLoadingState('loaded') 
    }
    function listNFT(nft) {
      console.log('nft:', nft)
      router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
    }
    return (
      <div  className={style.wrapper}>
        <div className={style.imgContainer}>
          <img src={nft.image} />
        </div>
        <div className={style.details}>
          <div className={style.info}>
              <div className={style.infoLeft}>
                  <div className={style.assetName}>{nft.name}</div>
                  <div className={style.collectionName}>{nft.description}</div>
              </div>
          </div>
                <div className="mt-2 ">
                    <button className="btn-card btn-7" onClick={() => listNFT(nft)}><span>List</span></button>
                </div>
            </div>
        </div>
    )
    }

export default MyNFTCard