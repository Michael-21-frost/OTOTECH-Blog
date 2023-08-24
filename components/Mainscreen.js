import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { phpUrl } from "./BaseUrl";

export default function Mainscreen({heading,description,imgLink,page}){
  const [searchResult,setsearchResult]=useState([]);
  const [searchKey,setsearchKey]=useState('');

  useEffect(()=>{
    if (searchKey.length >1){
    try{
      axios.get(`${phpUrl}/main/search.php?key=${searchKey}`)
      .then(res=>{
        let status=res.data.status;
        let data=res.data.data;
        if(status==='success'){
          setsearchResult(data)
        }else{
          return;
        }
      });

    }catch(err){
      Swal.fire(
        'Error Status',
        err,
        'error'
      )
    }
    }else{
      return;
    }
    
  },[searchKey]);

    return(
    <>
      <div className="mainScreenCon" 
      style={{backgroundImage:`${page=='home'?'':'linear-gradient(45deg,rgba(24,24,24,0.6),rgba(24,24,24,0.6))'},url(${imgLink})`}}>
      <div className="mainScreen">
      <div className="main1"><h3>{heading}</h3></div>
      <div className="main2"> <p>
      {description}
      </p></div>

      </div>

      <div className="submain">
      <div className="main3">
      <i className="fa fa-search"></i>
      <input className='filterSearch1' type="text" name="search" placeholder="Search category, blogs, fields ..."
       value={searchKey} onChange={(e)=>setsearchKey(e.target.value)}/>
      </div>
      <div className="main4">
      {
        searchResult&& searchResult.map((searchRes,i)=>{
        if(searchRes!==null){
          return <div key={i}><Link href={searchRes.title ? searchRes.categorySlug+'/' + searchRes.slug : searchRes.slug}><a>{searchRes.title||searchRes.name} <span style={{color:'#ec9735',fontSize:'12px'}}>{searchRes.title?'Article':'Category'}</span></a></Link></div>
        }
      })
      }		
      </div>
      </div>
      </div>

    </>
    )
}