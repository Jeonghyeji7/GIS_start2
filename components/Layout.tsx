import React from 'react'
import Navbar from './Navbar'

const Layout = ({children}:any) => {
  return (
    <div className='layout-container'>
        <Navbar/>
<div className='content'>{children}</div>
<style jsx>{`
    .layout-container{
        width:100%;
        height:100%;
    }
    .content{
        width:100%;
        height:100%;
    }
`}</style>
    </div>
    
  )
}

export default Layout