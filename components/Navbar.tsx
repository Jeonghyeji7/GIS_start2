import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className='container'>
        <div>
        <div>안양시 도로굴착공사 위치안내서비스</div>
        <div><Link href="/am">Home</Link></div>
        </div>
        <style jsx>{`
            .container{
                
                background-color: #222;
    border-color: #080808;
    height:50px;
            }
            .container div{
              display:flex;
                flex-direction:row;
            }
        `}</style>
    </div>
  )
}

export default Navbar