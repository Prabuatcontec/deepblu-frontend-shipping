import React, { useState } from 'react';


export default function Shipping() {
  const [value, setValue] = useState('');
  const [weight, setWeight] = useState('');
  const [courier, setCourier] = useState('');
  const [returnLab, setReturnLab] = useState('');
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
    SOMT_ShipToDate: getdate(),
    RETURN_LABEL:false
  });



  const shipmentDetail = async () => {

    const response = await fetch('https://deepbluapi.gocontec.com/autoreceive/shipment/details/' + value, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic QVVUT1JFQ0VJVkU6YXV0b0AxMjM='
      }
    });
    if (response.status !== 200) {
      throw new Error(`Request failed: ${response.status}`);
    }
    const shippingDetail = await response.json(); 
    if (courierObject[shippingDetail.SCMT_Method].slice(-3) === "_RL") {
      console.log('went in')
      shippingDetail.SCMT_Method = courierObject[shippingDetail.SCMT_Method].slice(0, -3)
      shippingDetail.RETURN_LABEL = true 
    }  
    setShipDetail(shippingDetail);
    setValidShip(true)
    localStorage.setItem('shipping_detail', shippingDetail['SOST_CourierMethodID'])
    await fedexLogin();

    window.open('http://deepblu.replicocorp.com/shipping_data_collection.php?_axousr=adminnc&_axopass=_axopass&_interface=simple&shipId=' + shippingDetail['SOST_ShipID'], 'Shipment Data Collection', 'height=600,width=800,top=100,left=100');
  }
  const addmin = async () => {
    let s = new Date();
    return s.setMinutes(s.getMinutes() + 55);
  }
  //https://apis-sandbox.fedex.com/ship/v1/shipments
  const fedexLogin = async () => {
    if (localStorage.getItem('fedexTokentime') === null) {
      localStorage.setItem('fedexTokentime', 0)
    }
    let s = new Date();
    if (s.setMinutes(s.getMinutes() + 1) > localStorage.getItem('fedexTokentime')) {

      const response = await fetch('oauth/token', {
        method: 'POST',
        body: new URLSearchParams({
          "grant_type": "client_credentials",
          "client_id": "l7b1806c4c147e43e38f7da9df054870ef",
          "client_secret": "eba5d60fed7c49748bce37abaca99ce5"
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      });
      if (response.status !== 200) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const token = await response.json();
      localStorage.setItem('fedexToken', token['access_token'])
      localStorage.setItem('fedexTokentime', await addmin())
    }
  }

  const onSubmit = async (event) => {

    event.preventDefault(); // Prevent default submission
    try {
      await shipmentDetail();
      setValue('');
    } catch (e) {
      alert(`Registration failedddd! ${e.message}`);

    }
  }
  const courierObject = {

    "Priority Overnight": "PRIORITY_OVERNIGHT",
    "Standard Overnight/RL": "STANDARD_OVERNIGHT_RL",
    "Ground Residential": "GROUND_HOME_DELIVERY",
    "Ground/RL": "FEDEX_GROUND_RL",
    "Ground": "FEDEX_GROUND",
    "2nd Day Air/RL": "FEDEX_2_DAY",
    "SmartPost Parcel Select/RL": "SMART_POST_RL",
    "SmartPost Parcel Select": "SMART_POST"
    // "Ground Residential Bulk":
    // "Priority Overnight Saturday/RL":
    // "Ground Residential/RL":
    // "2-Day/RL":
    // "Ground Residential/RL/SIG":
    // "Ground Commercial/RL":
    // "2-Day":
    // "SmartPost Parcel Select":
    // "SmartPost Parcel Select/RL":
    // "Ground":
    // "Priority Overnight Saturday":
    // "Standard Overnight":
    // "Ground Commercial":
    // "Standard Overnight/RL/Sig":
    // "Next Day":
    // "Priority Overnight/RL": 
  }


  const onShip = async (event) => {

    event.preventDefault(); // Prevent default submission

    if (weight === '' || weight > 1) {
      alert(`Weight should be greater than 0 and less than 1`);
    } else {
      try {

        

        const shipObject = {
          "labelResponseOptions": "LABEL",
          "requestedShipment": {
            "shipper": {
              "contact": {
                "personName": "CONTEC",
                "phoneNumber": 1234567890,
                "companyName": "CONTEC LLC"
              },
              "address": {
                "streetLines": [
                  "1011 State St. "
                ],
                "city": "Schenectady",
                "stateOrProvinceCode": "NY",
                "postalCode": 12307,
                "countryCode": "US"
              }
            },
            "recipients": [
              {
                "contact": {
                  "personName": shipDetail.SOMT_ShipToName,
                  "phoneNumber": shipDetail.SOMT_ShipToPhone,
                  "companyName": shipDetail.SOMT_ShipToCompany
                },
                "address": {
                  "streetLines": [
                    shipDetail.SOMT_ShipToAddr1,
                    shipDetail.SOMT_ReturnToAddr2
                  ],
                  "city": shipDetail.SOMT_ShipToCity,
                  "stateOrProvinceCode": shipDetail.SOMT_ShipToState,
                  "postalCode": shipDetail.SOMT_ShipToPostalCode,
                  "countryCode": shipDetail.SOMT_ShipToCountry
                }
              }
            ],
            "shipDatestamp": getdate(),
            "serviceType": shipDetail.SCMT_Method,
            "packagingType": "YOUR_PACKAGING",
            "pickupType": "USE_SCHEDULED_PICKUP",
            "blockInsightVisibility": false,
            "shippingChargesPayment": {
              "paymentType": "SENDER"
            },
            "shipmentSpecialServices": {
              "specialServiceTypes": [
                "RETURN_SHIPMENT"
              ],
              "returnShipmentDetail": {
                "returnType": "PRINT_RETURN_LABEL"
              }
            },
            "labelSpecification": {
              "imageType": "PDF",
              "labelStockType": "STOCK_4X6"
            },
            "requestedPackageLineItems": [
              {
                "weight": {
                  "value": weight,
                  "units": "LB"
                }
              }
            ]
          },
          "accountNumber": {
            "value": "740561073"
          }
        }

        if (courier == 'SMART_POST') {
          shipObject.requestedShipment.smartPostInfoDetail = {
            "ancillaryEndorsement": "RETURN_SERVICE",
            "hubId": "5015",
            "indicia": "PRESORTED_STANDARD",
            "specialServices": "USPS_DELIVERY_CONFIRMATION"
          }
        }

        const response = await fetch('ship/v1/shipments', {
          method: 'POST',
          body: JSON.stringify(shipObject),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('fedexToken')
          }
        });
        if (response.status !== 200) {
          throw new Error(`Request failed: ${response.status}`);
        }
        const shipDetails = await response.json();
        window.open("data:application/pdf;base64," + shipDetails.output.transactionShipments[0].pieceResponses[0].packageDocuments[0].encodedLabel);
        console.log(shipObject)
      } catch (e) {
        alert(`Registration failed! ${e.message}`);

      }
    }
  }

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onWeight = (event) => {
    console.log(event.target.value)
    setWeight(event.target.value);
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
          <button type="submit">Submit</button> <button type="button" onClick={onShip}>Ship</button>
        </div>
      </form>
      <div class="inner-container"    >
        <div class="row">
          <div class="column"><b>Ship Id:</b> <span class="display-val">{shipDetail.SOST_ShipID}</span></div>
          <div class="column"><b>Ship Via:</b> <span class="display-val">{shipDetail.SOST_ShipID}</span></div>
        </div>
        <div class="row">
          <div class="column"><b>Company:</b> <span class="display-val"> {shipDetail.SOMT_ShipToCompany}</span></div>
          <div class="column"><b>Ship Date:</b> <input type="date" id="theDate" value={shipDetail.SOMT_ShipToDate} /></div>
        </div>
        <div class="row">
          <div class="column"><b>Contact:</b> <span class="display-val"> {shipDetail.SOMT_ShipToName}</span></div>
          <div class="column"><b>Weight:</b> <input class="low-height" type="text" id="weight" value={weight} onChange={onWeight} /> - lbs </div>
        </div>
        <div class="row">
          <div class="column"><b>Address 1:</b> <span class="display-val"> {shipDetail.SOMT_ShipToAddr1}</span></div>
          <div class="column"><b>Special Service:</b>   <span class="display-val">{shipDetail.SOMT_ShipSpecialIns}</span> </div>
        </div>
        <div class="row">
          <div class="column"><b>Line 1:</b> <span class="display-val"> {shipDetail.SOMT_ShipToAddr2}</span></div>
        </div>
        <div class="row">
          <div class="column"><b>City-State-zip:</b> <span class="display-val"> {shipDetail.SOMT_ShipToAddr2}-{shipDetail.SOMT_ShipToState}-{shipDetail.SOMT_ShipToPostalCode}</span></div>
        </div>
        <div class="row">
          <div class="column"><b>Country:</b> <span class="display-val"> {shipDetail.SOMT_ShipToCountry}</span></div>
        </div>
        <div class="row">
          <div class="column"><b>Phone:</b> <span class="display-val"> {shipDetail.SOMT_ShipToPhone}</span></div>
        </div>
      </div>
    </div>
  );


}