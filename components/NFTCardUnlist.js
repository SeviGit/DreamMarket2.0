import { SiEthereum } from 'react-icons/si'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
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


const UnlistNFTCard = ({nft}) => {
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
                <div className={style.infoRight}>

                    <div className={style.priceTag}>{nft.price} <SiEthereum/></div>
                </div>
                </div>
                <div className="mt-2">                
                    <button className='btn-card btn-7' onClick={() => buyNft(nft)}><span>Unlist</span></button>
                </div> 
            </div>
        </div>
    )
    }

export default UnlistNFTCard;