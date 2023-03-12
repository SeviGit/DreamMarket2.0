import React from 'react'
import Image from 'next/image'
import imagenes from '../assets/imagenes.js'


const style ={
    wrapper: `relative flex justify-center `,
    container: `flex-row  w-full border-2 border-[#02E3E2] rounded-[20px] bg-[#272727]`,
    newsletter:" md:mx-12 py-8 md:py-12 grid place-content-center px-4 md:px-0",
    newCont:"lg:flex justify-start lg:gap-28",
    newsH2:"font-bold text-3xl sm:text-5xl text-gray-500",
    newsPar:"pt-8 md:pt-4 text-gray-300",
    newsForm:"mt-8 md:flex justify-start md:gap-4",
    newsInput:"placeholder-gray-600 w-full md:w-1/2 p-4 grid place-items-center border rounded-md focus:outline-none",
    newsButton:"w-full md:w-auto  text-white px-8 py-4 border-2 border-[#02E3E2] rounded-full font-semibold hover:text-[#02E3E2] hover:bg-gray-100 hover:border-gray-100   mt-4 md:mt-0 ",
    newsRead:"pt-4 text-xs text-gray-600",
    newsU:"cursor-pointer no-underline hover:underline",
    newsImg:" lg:pt-0 lg:w-1/2 hidden lg:block "
    
}
// Componente que se trata de un Newsletters para poder recibir noticias sobre la página


const Newsletter = () => {
    return (
        <div className={style.wrapper}>           
            <div className={style.container}>
                <div className={style.newsletter}>
                    <div className={style.newCont}>
                        <div className>
                            <h2 className={style.newsH2}>Newsletter</h2>
                            <p className={style.newsPar}>Sign up for our newsletter and get weekly updates. We only send emails about our latest products on the market once a week every Friday.</p>
                            <div className={style.newsForm}>
                                <input type="email" placeholder="Your Email" className={style.newsInput} />
                                <button className={style.newsButton}>Subscribe</button>
                            </div>
                        </div>
                        <div className={style.newsImg}>
                            <Image src={imagenes.logo} alt="street" width={300} height={300} className=" rounded-xl" />
                            
                        </div>        
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Newsletter