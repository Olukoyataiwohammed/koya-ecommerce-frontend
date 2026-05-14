import React, { useEffect, useState } from 'react'

const words = ["BETTER PRODUCT FRom KY storeS","WHATSAPP inFO !!!","ORDER @ YOUR CONVENIENT ⏰"]
const Animination = () => {
  

  const [index,setIndex] = useState(0);

  useEffect(()=>{
    const interval = setInterval(()=>{
      setIndex(prev => (prev + 1)% words.length);
    },1000)
    return ()=> clearInterval(interval);
  }, [])

 
  return (
    <div className='animination bg-dark d-flex text-success'>
        <h1><i>SPARK....</i></h1>
        <div className='text-light'>
          <i>{words[index]}</i>
        </div>
        
       
    </div>
  )
}

export default Animination