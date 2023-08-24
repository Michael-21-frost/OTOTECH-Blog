import Link from "next/link";
import { useState, useEffect } from "react";
import axios from 'axios';
import Swal from "sweetalert2";
import { phpUrl } from "./BaseUrl";

export default function Footer(){
  const [phone_number,setphone_number]=useState({status:'',link:''})
  const [gmail,setgmail]=useState({status:'',link:''})
  const [linkedin,setlinkedin]=useState({status:'',link:''})
  const [whatsapp,setwhatsapp]=useState({status:'',link:''})
  const [facebook,setfacebook]=useState({status:'',link:''})
  const [google_chat,setgoogle_chat]=useState({status:'',link:''});

  
  function loadSupport(){
    axios.get(`${phpUrl}/support/get-supports.php`)
    .then(res=>{
        let data=res.data.data;
        if(res.data.status==='success'){
            setphone_number(JSON.parse(data.phone_number))
            setgmail(JSON.parse(data.gmail))
            setfacebook(JSON.parse(data.facebook))
            setwhatsapp(JSON.parse(data.whatsapp))
            setgoogle_chat(JSON.parse(data.google_chat))
            setlinkedin(JSON.parse(data.linkedin))
        }else{
            Swal.fire(
                'Error',
                res.data.status,
                'warning'
            )
        }
    }).catch(err=>{
        console.log(err)
        Swal.fire(
            'Error',
            'Error Occured at Axios',
            'warning'
        )           
    });
}


    useEffect(()=>{
      loadSupport();
    },[]);

    return(
        <>
  <footer>
    <div className='footerCon'>
      <div className='footerLinksCon'>
        <h4>OTOTECH Industries</h4>
        <p> For more enquires and service placement please feel free to
           contact us through the following Social media's.</p>
           <ul>
           {facebook && facebook.status==='inactive' ? '' :<li><Link href={'https://'+facebook.link}><i className='fa fa-facebook'></i></Link></li>}
           {phone_number && phone_number.status==='inactive' ? '' :<li><Link href={'https://'+phone_number.link}><i className='fa fa-phone'></i></Link></li>}
           {linkedin && linkedin.status==='inactive' ? '' :<li><Link href={'https://'+linkedin.link}><i className='fa fa-linkedin'></i></Link></li>}
           {whatsapp && whatsapp.status==='inactive' ? '' :<li><Link href={'https://'+whatsapp.link}><i className='fa fa-whatsapp'></i></Link></li>}
           {google_chat && google_chat.status==='inactive' ? '' :<li><Link href={'https://'+google_chat.link}><i className='fa fa-google'></i></Link></li>}
           {gmail && gmail.status==='inactive' ? '' :<li><Link href={'https://'+gmail.link}><i className='fa fa-envelope'></i></Link></li>}
           </ul>
      </div>

      <div className='footerLinksCon'>
        <h4>Additional Pages</h4>
        <ol>
        <li><Link href='#'>About Us</Link></li>
        <li><Link href='#'>How We Work</Link></li>
        <li><Link href='#'>Quick Support</Link></li>
        <li><Link href='#'>Privacy Policy</Link></li>
        </ol>
      </div>

      <div className='footerLinksCon'>
        <h4>Useful Links</h4>
        <ol>
        <li><Link href='#'>Page Privacy</Link></li>
        <li><Link href='#'>Lincences and Registration</Link></li>
        </ol>
      </div>
      
      <div className='footerLinksCon'>
        <h4>Contact Us</h4>
        <form>
        <input type='text' placeholder='Full Name'/>
        <input type='email' placeholder='E-Mail Address'/>
        <textarea placeholder='Your Message'>

        </textarea>
        <button disabled>SEND MESSAGE</button>
        </form>
      </div>
    </div>
  </footer>
  <div className='footerCon2'><p>Copyright © 2022 OTOTECH Industries.</p></div>
        </>
    )
}
