import React from 'react'
import Header from './Header'
import Footer from './Footer'
const Layout = ({children}) => {

//  Plantilla para tener navegador y footers en todas las páginas
 
 
  return (
    
    <div className="w-full content">
        <Header/>
        {children}
        <Footer/>

    </div>
  )
}

export default Layout