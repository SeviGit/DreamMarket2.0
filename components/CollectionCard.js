import React from 'react'
import { useRouter } from 'next/router'


//Estilos con Tailwind
const style = {
    wrapper: `bg-zinc-900 relative  flex-auto w-[14rem] sm:w-[16rem] my-5 sm:my-10  mx-5 rounded-b-lg overflow-hidden cursor-pointer span`,
    imgContainer: `p-2 w-full overflow-hidden flex-col justify-center items-center  border  hover:bg-zinc-800 rounded-xl`,
    nftImg: `w-full object-cover   overflow-hidden   `,  
    ImageContainer: `h-auto  overflow-hidden flex justify-center items-center rounded-xl `,
    bannerImage: `w-full object-cover h-24`, 
    infoContainer: ` px-4`,
    midRow: `w-full flex justify-center text-white `,
    midRow2: `w-full flex justify-center items-center text-white h-16`,
    profileImg: `w-20 h-20 object-cover rounded-full border-2 border-white mt-[-3rem] `,
    title: ` font-bold mb-4`,
}

/* Componente que se le pasa un parametro de de tipo objeto que contiene
 los datos de una  olleción de NFT y los muestra */


const NFT2 = ({coleccion}) => {
 
    const router = useRouter()

    function goToCollection() {
        router.push(`/collections?name=${coleccion.title}`)
    }
    return (
        <div className={style.wrapper} onClick={goToCollection}>
            <span>
                <div className={style.imgContainer}>
                    <div className="overflow-hidden ">
                        <div className={style.ImageContainer}>
                            <img
                                className={style.bannerImage}
                                src=  {coleccion.bannerImageUrl}
                                alt="banner"
                            />
                        </div>
                        <div className={style.infoContainer}>
                            <div className={style.midRow}>
                                <img
                                    className={style.profileImg}
                                    src= {coleccion.imageUrl}
                                    alt="profile image"
                            />
                            </div>
                        </div>
                    </div>
                    <div className={style.midRow2}>
                        <div className={style.title}>{coleccion.title}</div>
                    </div>
                
                </div>
            </span>
        </div>            
            
        
    )
    }

export default NFT2