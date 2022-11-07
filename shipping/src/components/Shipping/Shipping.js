import React, { useState } from 'react';


export default function Shipping() {
  const [value, setValue] = useState('');
  const [weight, setWeight] = useState('');
  const [validShip, setValidShip] = useState(false);
  const getdate = (event) => {

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let separator = "-";

    if (month < 10) { month = '0' + month }
    if (date < 10) { date = '0' + date }


    return `${year}${separator}${month}${separator}${date}`
  }
  const [shipDetail, setShipDetail] = useState({

    SOMT_CusPOID: '',
    SOMT_ShipToCompany: '',
    SOMT_ShipToName: '',
    SOMT_ShipToAddr1: '',
    SOMT_ShipToAddr2: '',
    SOMT_ShipToCity: '',
    SOMT_ShipToState: '',
    SOMT_ShipToCountry: '',
    SOMT_ShipToPostalCode: '',
    SOMT_ShipToPhone: '',
    SOMT_ShipToEmail: '',
    SOMT_ShipToFax: '',
    SOMT_ReturnToName: '',
    SOMT_ReturnToCompany: '',
    SOMT_ReturnToAddr1: '',
    SOMT_ReturnToAddr2: '',
    SOMT_ReturnToCity: '',
    SOMT_ReturnToState: '',
    SOMT_ReturnToCountry: '',
    SOMT_ReturnToPostalCode: '',
    SOMT_BillToRef1: '',
    SOMT_ShipSpecialIns: '',
    SOMT_MsgToCourier: '',
    SOMT_RcvdDate: '',
    SSLT_InsuredValue: '',
    SOST_ShipID: '',
    SOMT_ShipDivID: '',
    CMS_ShipVia: '',
    SOST_ThirdPartyAcct: '',
    SOST_ShipWarehouse: '',
    SOST_CustomRef: '',
    SOST_ShipDate: '',
    SOST_ShipTime: '',
    SOST_ShipUser: '',
    SOST_Status: '',
    SCMT_Method: '',
    SOMT_ShipToDate: getdate()
  });



  const shipmentDetail = async () => {

    const response = await fetch('https://deepbluapi.gocontec.com/app_dev.php/autoreceive/shipment/details/' + value, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic QVVUT1JFQ0VJVkU6YXV0b0AxMjM='
      }
    });
    if (response.status !== 200) {
      throw new Error(`Request failed: ${response.status}`);
    }
    const shippingDetail = await response.json();
    setShipDetail(shippingDetail);
    setValidShip(true)
    localStorage.setItem('shipping_detail', shippingDetail['SOST_CourierMethodID'])
  }

  const onSubmit = async (event) => {

    event.preventDefault(); // Prevent default submission
    try {
      await shipmentDetail();
      setValue('');
    } catch (e) {
      alert(`Registration failed! ${e.message}`);

    }
  }

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return (
    
    <div class="container">
      <form onSubmit={onSubmit}>
        <div><h2>Shipping</h2></div>
        <label>
          <p>Shipping Id</p>
          <input required type="text" value={value} onChange={onChange} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>  
      <div class="inner-container"    >
      <div class="row">
        <div class="column">Ship Id: <span class="display-val">{shipDetail.SOST_ShipID}</span></div>
        <div class="column">Ship Via: <span class="display-val">{shipDetail.SOST_ShipID}</span></div>
      </div>
      <div class="row">
        <div class="column">Company: <span class="display-val"> {shipDetail.SOMT_ShipToCompany}</span></div>
        <div class="column">Ship Date: <input type="date" id="theDate" value={shipDetail.SOMT_ShipToDate} /></div>
      </div>
      <div class="row">
        <div class="column">Contact: <span class="display-val"> {shipDetail.SOMT_ShipToName}</span></div>
         <div class="column">Weight: <input class="low-height" type="text" id="weight" value={weight} /> - lbs </div>
      </div>
      <div class="row">
        <div class="column">Address 1: <span class="display-val"> {shipDetail.SOMT_ShipToAddr1}</span></div>
        <div class="column">Special Service:   <span class="display-val">{shipDetail.SOMT_ShipSpecialIns}</span> </div>
      </div>
      <div class="row">
        <div class="column">Line 1: <span class="display-val"> {shipDetail.SOMT_ShipToAddr2}</span></div>
      </div>
      <div class="row">
        <div class="column">City-State-zip: <span class="display-val"> {shipDetail.SOMT_ShipToAddr2}-{shipDetail.SOMT_ShipToState}-{shipDetail.SOMT_ShipToPostalCode}</span></div>
      </div>
      <div class="row">
        <div class="column">Country: <span class="display-val"> {shipDetail.SOMT_ShipToCountry}</span></div>
      </div>
      <div class="row">
        <div class="column">Phone: <span class="display-val"> {shipDetail.SOMT_ShipToPhone}</span></div>
      </div>
    </div>
    </div>
  );


}