import MyListedNFTs from '../components/ManageListedNFT'
import MyOwnedNFTs from '../components/ManageOwnNFTs'

export default function MyAssets() {

  return (
    <div className=' pt-20 min-h-screen bg-zinc-900'>
      <div className="flex flex-col items-center py-10">
          <h1 className='text-4xl text-center text-cyan-300 mb-8 fuente'>MY NFTs</h1>
        <div className='  px-10  max-w-screen-xl h-auto  w-full' >
            <h2 className='text-sky-100 text-2xl text-center sm:text-left tracking-widest fuente'>NFTs Owned</h2>
            <div className='flex flex-wrap flex-row justify-center sm:justify-start border-t  border-cyan-400 mb-4' >
              <MyOwnedNFTs/>
            </div>
        </div>  
        <div className='  px-10  max-w-screen-xl h-auto  w-full' >
            <h2 className='text-sky-100 text-2xl text-center sm:text-left tracking-widest fuente'>NFTs Listed</h2>
            <div className='flex flex-wrap flex-row justify-center sm:justify-start border-t  border-cyan-400 mb-4' >
              <MyListedNFTs/>
            </div>
        </div> 
      </div>
    </div>
  )
}