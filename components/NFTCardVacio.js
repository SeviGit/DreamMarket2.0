import Image from 'next/image'
import imagenes from '../assets/imagenes'

const style = {
    wrapper: `bg-[#303339]  w-[16rem] h-[20rem]  my-4 sm:my-10 mx-5 rounded-2xl overflow-hidden shadow-lg shadow-fuchsia-500  `,
    imgContainer: `h-5/6 w-full overflow-hidden flex items-center`,
    collectionName: `font-semibold p-5  text-grey-100 text-center`,
   
}

const NFTvacio = ({nft}) => {
    
     
    return (
        <div  className={style.wrapper} >
            <div className={style.imgContainer} >
            <Image src={imagenes.logo} />
            </div>   
            <div className={style.collectionName}>
                NO NFT 
            </div>
        </div>       
            
        
    )
    }

export default NFTvacio