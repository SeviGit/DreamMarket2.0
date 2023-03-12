import { SiEthereum } from 'react-icons/si'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import {marketplaceAddress} from '../config'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

/* Styles */
const style = {
    wrapper: `relative bg-zinc-800 flex-auto z-0 w-[14rem] h-[20rem] sm:w-[16rem] sm:h-[23rem]   rounded-2xl z-10   rounded-2xl sha1`,
    imgContainer: `relative h-[12rem] sm:h-[14rem] w-full bg-zinc-800 overflow-hidden flex justify-center items-center rounded-t-2xl  z-10`,
    nftImg: `w-full object-cover `,
    details: `p-3 relative z-10 bg-zinc-800 h-[8rem] rounded-b-2xl `,
    info: `flex justify-between text-[#e4e8eb] drop-shadow-xl items-center `,
    infoLeft: `flex-0.6 flex-wrap`,
    collectionName: `font-semibold text-sm text-[#8a939b]`,
    assetName: `font-bold text-lg `,
    infoRight: `flex-0.4  `,
    priceTag: `inline-flex items-center font-semibold text-sm text-[#8a939b]`,
    priceValue: `flex items-center text-xl font-bold mt-2`,
    ethLogo: `h-5 mr-2`,
}

// Componente que representa una carta de NFT(Donde se muestra) con sus funciones de comprar

const NFTCard = ({nft}) => {
    const router = useRouter()

    
    async function buyNft(nft) {
        /* necesita que el usuario firme la transacción, por lo que usará Web3Provider y la firmará */
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    
        /* se le pedirá al usuario que pague los precios solicitados para completar la transacción */
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
        const transaction = await contract.createMarketSale(nft.tokenId, {
          value: price
        })
        await transaction.wait()
        window.location.reload(false)
      }


    return (
        <div className='p-0 mx-3 my-5 box '>
            <div className='absolute z-0 w-[14rem] h-[20rem] sm:w-[16rem] sm:h-[23rem] shad2    overflow-hidden rounded-2xl ease-in duration-300 '>
                <div className='bg-gradient-to-r from-[#5c0a56] to-[#e94adf] w-full shadow-lg  h-full' style={{clipPath: 'polygon(0 11%, 100% 73%, 100% 100%, 0% 100%)'}}></div>
            </div>
            <div  className={style.wrapper}>
                <div className={style.imgContainer}>
                    <img src={nft.image} className='duration-500 ease-in ef-img' />
                </div>
                <div className={style.details}>
                    <div className={style.info}>
                        <div className={style.infoLeft}>
                            <div className={style.assetName}>{nft.name}</div>
                            <div className={style.collectionName}>{nft.description}</div>
                        </div>
                        <div className={style.infoRight}>
                            <div className={style.priceTag}>{nft.price} <SiEthereum/></div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <button className='text-white text-sm  py-2 border-2 w-full border-[#02E3E2] rounded-full  hover:text-[#e94adf] hover:bg-gray-300 hover:border-gray-100 mt-2' onClick={() => buyNft(nft)}><span>Buy</span></button>
                    </div>
                </div>
            </div>
        </div>
        
    )
    }

export default NFTCard;