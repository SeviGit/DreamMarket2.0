import React from 'react'
import { useEffect, useState } from 'react'
import { BiHeart } from 'react-icons/bi'
import Router from 'next/router'
import Image from 'next/image'
import imagenes from '../assets/imagenes'


const style = {
    wrapper: ` relative  flex-auto w-[16rem] my-4 sm:my-10  mx-5 rounded-b-lg overflow-hidden cursor-pointer `,
    imgContainer: ` w-full overflow-hidden flex justify-center items-center  marco`,
    nftImg: `w-full object-cover   overflow-hidden   `,
    // details: `p-3`,
    // info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
    // infoLeft: `flex-0.6 flex-wrap`,
    // collectionName: `font-semibold text-sm text-[#8a939b]`,
    // assetName: `font-bold text-lg mt-2`,
    // infoRight: `flex-0.4 text-right`,
    // priceTag: `font-semibold text-sm text-[#8a939b]`,
    // priceValue: `flex items-center text-xl font-bold mt-2`,
    // ethLogo: `h-5 mr-2`,
    // likes: `text-[#8a939b] font-bold flex items-center w-full justify-end mt-3`,
    // likeIcon: `text-xl mr-2`,
    bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
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





const NFT2 = () => {
    const [isListed, setIsListed] = useState(false)
    const [price, setPrice] = useState(0)

    // useEffect(() => {
    //     const listing = listings.find((listing) => listing.asset.id === nftItem.id)
    //     if (Boolean(listing)) {
    //     setIsListed(true)
    //     setPrice(listing.buyoutCurrencyValuePerToken.displayValue)
    //     }
    // }, [listings, nftItem])

    return (
        <div
           
            className={style.wrapper}
            onClick={() => {
                Router.push({
                pathname: `/nfts/${nftItem.id}`,
                query: { isListed: isListed },
                })
            }}
            >
            <div className={style.imgContainer}>
                <div className="overflow-hidden">
        
                    <div className={style.bannerImageContainer}>
                        <img
                        className={style.bannerImage}
                        src='https://lh3.googleusercontent.com/5c-HcdLMinTg3LvEwXYZYC-u5nN22Pn5ivTPYA4pVEsWJHU1rCobhUlHSFjZgCHPGSmcGMQGCrDCQU8BfSfygmL7Uol9MRQZt6-gqA=h600'
                        
                        alt="banner"
                        />
                    </div>
                    <div className={style.infoContainer}>
                        <div className={style.midRow}>
                            <img
                            className={style.profileImg}
                            src=
                            'https://lh3.googleusercontent.com/lHexKRMpw-aoSyB1WdFBff5yfANLReFxHzt1DOj_sg7mS14yARpuvYcUtsyyx-Nkpk6WTcUPFoG53VnLJezYi8hAs0OxNZwlw6Y-dmI=s130'
                            
                            alt="profile image"
                        />
                        </div>
                    </div>
                </div>
            </div>

            <div className={style.midRow}>
                <div className={style.title}>La colleciom</div>
            </div>
            <div className={style.midRow}>
                <div className={style.createdBy}>
                Created by{' '}
                <span className="text-[#2081e2]">By Pablo</span>
                </div>
            </div>
        </div>            
            
        
    )
    }

export default NFT2