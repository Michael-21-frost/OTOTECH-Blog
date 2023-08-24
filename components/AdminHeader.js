import Navbar from "./Navbar";
import Link from "next/link";
import NavbarController from './NavbarController'
import { useState } from "react";
import { useLoader } from "../pages/_app";
import axios from "axios";
import { baseUrl } from "./BaseUrl";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

export default function AdminHeader({children}){
  const [navStatus,setnavStatus]=useState(false);
  const { loading, setloading } = useLoader();
  const router=useRouter();
  const next=router.asPath;

  function logout(){
  setloading(true);
  axios.get(`${baseUrl}/api/authentication/logout`)
  .then(res=>{

    let status=res.data.status;
    setloading(false);
    if(status==='success'){

      router.push('/login');

    }else if(status==='Invalid User'){
       
        router.push(`/login?next=${next}`)

    }else{
        Swal.fire(
            'Error!',
            status,
            'warning'
        )  
    }

  }).catch(err=>{
    setloading(false);
    Swal.fire(
        'Error Occured',
        err.message,
        'error'
    )
  })
  }


    return(
        <>
        <header>
      <div className="logoCon" onClick={()=>router.push('/')}><h3>OTOTECH</h3></div>
      <div className="linksCon">
      <Link href='/'>Home</Link>
      <Link href='#'>About Us</Link>
      <Link href='#'>Our Services</Link>
      <Link href='#'>Contact</Link>
      </div>
      <div className="buttonCon">
            <NavbarController navStatus={navStatus} setnavStatus={setnavStatus}/>
      </div>

      </header>






      <Navbar section='Admin' navStatus={navStatus} setnavStatus={setnavStatus} logout={logout}/>
      




      <div className='adminAllCon'>

<div className='navbar2'>
<div className="subNav3">
<div className='navusername'><i className='fa fa-user-circle'/><span>Admin Steven</span></div>
<div className='navlinks'><Link href='/admin' >Dashboard</Link></div>
<div className='navlinks'><Link href='/admin/categories' >Categories</Link></div>
<div className='navlinks'><Link href='/admin/articles' >Articles</Link></div>
<div className='navlinks'><Link href='/admin/comments' >Comments</Link></div>
<div className='navlinks'><Link href='/admin/users' >Users</Link></div>
<div className='navlinks'><Link href='/admin/staffs' >Staffs</Link></div>
<div className='navlinks'><Link href='/admin/analytics' >Analytics</Link></div>
<div className='navlinks'><Link href='/admin/support_system' >Support System</Link></div>
<div className='adminmorebtn' style={{padding:'0'}}><button onClick={logout} style={{width:'100%',background:'transparent',color:'#945f0f',fontFamily:'poppinsMedium',boxShadow:'none',textAlign:'left',fontSize:'15px',padding:'10px 0'}}>Logout</button></div>
</div>
</div>








<div className='mainBody'>
{children}
</div>




</div>
          </>
    )
}
