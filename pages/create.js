import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient  } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Loader from '../components/Loader'
import Web3Modal from 'web3modal'
import {marketplaceAddress} from '../config'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import imagenes from '../assets/imagenes'
import Image from 'next/image'

//========================================================================================================================
// Credenciales y creación de cliente en Infura (IPFS)
//========================================================================================================================

const projectId = "2LYkcKO1MGYFejEqEBW6HgLmQh2";
const projectSecret = "d4644bd2d2d094d69d99f9b5a74a5b27";
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const client = ipfsHttpClient({
  url: "https://ipfs.infura.io:5001",
  headers:{
    authorization 
  }
})


// * CREATE ITEM PAGE
export default function CreateItem() {
//========================================================================================================================
// lÓGICA 
//========================================================================================================================
    
// ESTADOS
  const [fileUrl, setFileUrl] = useState(null)
  const [loadingState, setLoadingState] = useState('loaded')
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

// Evento en el input al seleccionar una imagen ============================== 
   async function onChange(e) {  
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
        console.log(added.path)
      const url = `https://dream-market.infura-ipfs.io/ipfs/${added.path}`
      console.log(url )
      setFileUrl(url)
    
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

// Subir la imagen al IPFS(Infura) ============================== 
  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* primero, subir a IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://dream-market.infura-ipfs.io/ipfs/${added.path}`
      /* después de cargar el archivo a IPFS, devolver la URL para usarla en la transacción */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

 // Crea el NFT en la blockchain ============================== 
  async function listNFTForSale() {
    try {
      setLoadingState('not-loaded') 
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* a continuación, crea el elemento */
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, price, { value: listingPrice })
    await transaction.wait()
   
    setLoadingState('loaded') 
    router.push('/')
    console.log('Creado correctamente')
    } catch (error) {
      setLoadingState('loaded') 
    }
    
  }
//========================================================================================================================
// HTML 
//========================================================================================================================

  return (
      <div className='flex justify-center px-4 py-32 bg-zinc-900'>
        <div className="flex justify-center w-full max-w-screen-md p-4 md:w-10/12 lg:w-8/12 xl:w-6/12 2xl:w-6/12">
          <div className="flex flex-col w-full ">
          <h1 className='mb-8 text-4xl text-cyan-400 fuente'>Create Item</h1>
            <label  className='text-white '>Name</label>
            <div className='flex items-end w-full p-0 mb-10 border-b border-cyan-400 hover:border-cyan-100'>
            <input
              required
              type="text"
              placeholder='Item name'
              className="w-full p-4 text-white bg-zinc-900 hover:border-cyan-300"
              onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
            />
            </div>
             <label  className='text-white'>Description (Optional)</label>
             <div className='flex items-end w-full p-0 mb-10 border-b border-cyan-400 hover:border-cyan-100'>
              <input
                placeholder='Provided a detailed description of your item'
                className="w-full p-4 text-white bg-zinc-900 hover:border-cyan-300"
                onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
              />
            </div>
             <label  className='text-white'>Price</label>
            <div className='flex items-end w-full p-0 mb-10 border-b border-cyan-400 hover:border-cyan-100'>
              <input
                required
                type='text'
                placeholder=" Price in Eth"
                className="w-11/12 p-4 text-white bg-zinc-900 hover:border-cyan-300"
                onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
              />
              <div className='w-1/12 mb-2 ml-2 text-white bg-zinc-900'>ETH</div>
            </div>
            <label  className='text-white'>Upload file</label>
            <div className='w-full p-8 my-4 text-gray-400 border border-dashed rounded-md border-cyan-400 '>
              <input
                type="file"
                name="Asset"
                className= "file:flex file:bg-blue-600 hover:file:bg-blue-500 file:border-0 file:rounded-full file:text-white file:p-2 file:mr-2'"
                onChange={onChange}
              />
              {
                fileUrl && (
                  <img className="mt-4 rounded " width="350" src={fileUrl} />
                )
              }
              
              
            </div>
            {(loadingState === 'loaded')
                ? <button
                  onClick={listNFTForSale}
                  className="w-full  text-white px-8 py-4 border-2 border-[#02E3E2] rounded-full font-semibold hover:text-[#02E3E2] hover:bg-gray-100 hover:border-gray-100  ">
                      Create NFT
                  </button>
                : (
                  <Loader />
                )}
          </div>
        </div>
      </div>
    
  )
}