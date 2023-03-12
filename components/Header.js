import React from 'react';
import Image from 'next/image';
import imagenes from '../assets/imagenes'
import Link from 'next/link';
import { AiOutlineSearch } from 'react-icons/ai'
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { client } from '../sanitydb/lib/sanityClient'
import toast, { Toaster } from 'react-hot-toast'

// Instalar react icons --> npm install react-icons --save


/* En este archivo los  componentes crean lo que es la barra de navegación, 
    Es totalmente responsive, hay uno para pantalla normal y otro para pantalla movil */

// Estilos Tailwind
const style = {
    wrapper: `  backdrop-blur-2xl  w-full px-[1.2rem] h-[66px] lg:h-auto pt-[0.8rem] flex justify-between fuente  fixed top-0 z-40`,
    searchBar: `lg:basis-1/5 blur-none flex  w-96 items-center bg-[#272727] rounded-[0.8rem] hover:bg-[#4c505c] mb-3 hidden lg:flex`,
    searchIcon: `text-[#8a939b] mx-3  text-lg`,
    searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
    containerItems1: `md:basis-1/5 w-96  flex items-end justify-end text-xs  cursor-pointer hidden lg:flex`,
    containerItems2: `md:basis-1/5 w-96 flex items-end justify-start text-xs  cursor-pointer hidden lg:flex`,
    headerItem: `  px-4 text-sm text-[#c8cacd] hover:border-b-2  border-b-fuchsia-600 pb-3 hover:text-white`,
    containerIcon: `lg:basis-1/5 w-96 flex items-center justify-end z-50`,
    // headerLogo: ` absolute inset-x-50% top-0 bg-gradient-to-r from-[#ff48f9] to-blue-500 hidden lg:block  opacity-90`,
    static: `lg:basis-1/5  static grid place-items-center justify-center rounded-[0.8rem] text-center z-10`,
    logo: ``,
    headerIcon: `text-[#8a939b] mx-3 font-bold text-lg px-4 hover:text-white cursor-pointer mb-3 `,
    connet: `text-white sm:text-sm text-[0.6rem] py-1 px-1 sm:px-4 sm:py-2 border-2 border-[#02E3E2] rounded-full  hover:text-[#02E3E2] hover:bg-gray-100 hover:border-gray-100  `,
    wallet: `font-sans text-xs text-[#c8cacd] border border-cyan-300  rounded p-2 hover:border-2 hover:text-white`
}


// Barra de navegación para pantalla movil

function MobileNav({ open, setOpen }) {
    return (
        <div className={`lg:hidden absolute top-0 left-0 h-[30rem] w-full sm:w-96 border   bg-[#272727] transform ${open ? "-translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out filter drop-shadow-md `}>
            <div className="flex items-center justify-center filter shadow-md  shadow-fuchsia-500 bg-[#272727] h-16 cursor-pointer">
            </div>
            <div className="flex flex-col justify-center px-4 mt-8">
                {/* Buscador */}
                <div className=' flex mb-4  items-center bg-[#4c505c] rounded-[0.8rem] hover:bg-[#696a6e]'>
                    <div className=' text-[#8a939b] flex items-center ml-2 '>
                        <AiOutlineSearch />
                    </div>
                    <input className='h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 font-sans text-[#c8c8c8] ' />
                </div>
                {/* Enlaces a páginas  */}
                <div className='text-center '>
                    <Link href="/" >
                        <div className='px-4 text-xl  text-[#c8cacd] mb-4 hover:text-fuchsia-600' onClick={() => setTimeout(() => { setOpen(!open) }, 100)}>Home</div>
                    </Link>
                    <Link href="/marketplace">
                        <div className='px-4 text-xl  text-[#c8cacd] mb-4 hover:text-fuchsia-600' onClick={() => setTimeout(() => { setOpen(!open) }, 100)}>Marketplace</div>
                    </Link>
                    <Link href="/my-nfts" >
                        <div className='px-4 text-xl  text-[#c8cacd] mb-4 hover:text-fuchsia-600' onClick={() => setTimeout(() => { setOpen(!open) }, 100)}>My NFTs</div>
                    </Link>
                    <Link href="/create" >
                        <div className='px-4 text-xl  text-[#c8cacd] mb-4 hover:text-fuchsia-600' onClick={() => setTimeout(() => { setOpen(!open) }, 100)}>Create</div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

// Barra de navegación para ordenador

const Header = () => {
    
    const [account, setAccount] = useState(null)
    // MetaMask Login/Connect
    const [open, setOpen] = useState(false)
    const web3Handler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0])
        // Get provider de Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // Set signer
        const signer = provider.getSigner()

        window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
        })

        window.ethereum.on('accountsChanged', async function (accounts) {
            setAccount(accounts[0])
            await web3Handler()
        })
    }

    const welcomeUser = (userName, toastHandler = toast) => {
        toastHandler.success(
            `Welcome back${userName !== 'Unnamed' ? ` ${userName}` : ''}!`,
            {
                style: {
                    background: '#04111d',
                    color: '#fff',
                },
            }
        )
    }

    useEffect(() => {
        if (!account) return
            ; (async () => {
                const userDoc = {
                    _type: 'users',
                    _id: account,
                    userName: 'Unnamed',
                    walletAddress: account,
                }

                const result = await client.createIfNotExists(userDoc)

                welcomeUser(result.userName)
            })()
    }, [account])


    return (
        <nav className={style.wrapper}>

            {/* Movile Nav */}
            <MobileNav open={open} setOpen={setOpen} />
            <div className='flex items-center'>
                <div className="relative z-50 flex flex-col items-center justify-between w-8 h-8 cursor-pointer lg:hidden" onClick={() => {
                    setOpen(!open)
                }}>
                    {/*  botón hamburgersa */}
                    <span className={`h-1 w-full bg-white rounded-lg transform transition duration-300 ease-in-out ${open ? "rotate-45 translate-y-3.5" : ""}`} />
                    <span className={`h-1 w-full bg-white rounded-lg transition-all duration-300 ease-in-out ${open ? "w-0" : "w-full"}`} />
                    <span className={`h-1 w-full bg-white rounded-lg transform transition duration-300 ease-in-out ${open ? "-rotate-45 -translate-y-3.5" : ""}`} />
                </div>
                <div className='z-50 flex items-end w-24 mb-1 ml-4 lg:hidden sm:w-52 md:w-80 text-cyan-300 '>
                    <Image src={imagenes.logo_blur} height={45} width={45} />
                    <div className='hidden ml-2 text-sm italic tracking-wide sm:flex md:text-base benyo'>DreamMarket</div>

                </div>
            </div>

            {/* Barra Buscador */}
            <div className={style.searchBar}>
                <div className={style.searchIcon}>
                    <AiOutlineSearch />
                </div>
                <input className={style.searchInput} />
            </div>

            {/* Enlaces a páginas Left*/}
            <div className={style.containerItems1}>
                <Link href="/">
                    <div className={style.headerItem} > HOME </div>
                </Link>
                <Link href="/marketplace">
                    <div className={style.headerItem}> MARKETPLACE </div>
                </Link>
            </div>

            {/* Logo */}
            <div className='flex items-start hidden lg:flex'>
                <Image src={imagenes.logo_blur} height={50} width={50} />
            </div>

            {/* Enlaces a páginas Right*/}
            <div className={style.containerItems2}>
                <Link href="/my-nfts">
                    <div className={style.headerItem}> MY NFTs </div>

                </Link>
                <Link href="/create">
                    <div className={style.headerItem}> CREATE </div>
                </Link>
            </div>

            {/* Button conectar Metamask */}
            <div className={style.containerIcon}>
                {account ? (
                    <Link
                        href={`https://etherscan.io/address/${account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-4 button nav-button btn-sm ">
                        <button className={style.wallet} >
                            {account.slice(0, 5) + '...' + account.slice(38, 42)}
                        </button>
                    </Link>
                ) : (
                    <button className={style.connet} onClick={web3Handler} >Connect Wallet</button>
                )}
            </div>
            <Toaster position="bottom-right" reverseOrder={false} />
        </nav>

    )
}

export default Header;