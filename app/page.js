'use client'

import { useRef, useState } from 'react';
import Html5QrcodePlugin from './scanner'
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

const App = (props) => {

  const qrcodeRegionId = "html5qr-code-full-region";

  let [modal, setModal] = useState(false)
  let [found, setFound] = useState(false)

  let [product, setProduct] = useState([])
  let [qtyup, setQtyUp] = useState(null)
  let qrRef = useRef(null)

  const onNewScanResult = (decodedText, decodedResult) => {
    // handle decoded results here
    console.log(decodedText)
    console.log("Found")
    setFound(true)
    axios.get(`https://hellos.playtwo.online/api/product/${decodedText}`).then((res) => {
      console.log(res.data)
      setProduct(res.data)
      setModal(true)
      setQtyUp(res.data[0].qty)
    })
  };

  const updateProduct = (barcode, qty) => {
    axios.patch('https://hellos.playtwo.online/api/update_quantity', {
      barcode: barcode,
      qty: qty
    }).then((res) => {
      console.log(res.data)
      setFound(false)
    })
  }



  return (
    <div>
      <div>
        <Html5QrcodePlugin
          qrCodeSuccessCallback={onNewScanResult}
        />
      </div>

      {modal ? <div className='w-full h-full bg-black/80 fixed left-0 top-0 flex justify-center items-center z-[9999]'>
        <div className='w-[300px] text-black h-[300px] bg-white flex justify-center items-center flex-col gap-[10px]'>
          <div className='flex flex-col justify-center items-center'>
            <p>{product[0].barcode}</p>
            <p>{product[0].name}</p>
          </div>
          <input value={qtyup} onChange={(e) => {
            setQtyUp(e.target.value)
          }} className='border-[1px] border-black'></input>
          <button onClick={() => {
            setModal(false)
            updateProduct(product[0].barcode, Number(qtyup))
          }} className='w-[90%] h-[50px] bg-blue-400 text-white'>อัพเดท</button>
        </div>
      </div> : null}
    </div>
  );
};

export default App