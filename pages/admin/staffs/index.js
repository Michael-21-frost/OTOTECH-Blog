import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Swal from "sweetalert2";
import { useLoader } from "../../_app";
import { ThreeDots } from 'react-loader-spinner'
import { useRouter } from "next/router";
import { phpUrl } from "../../../components/BaseUrl";

export default function AdminStaffs(){
    const [staffs,setstaffs]=useState([]);
    const [backup,setbackup]=useState([]);
    const [dataLoad,setdataLoad]=useState(false);
    const {loading,setloading}=useLoader();
    const filterIndex=useRef('');
    const filterStaffs=Array.from(staffs);
    const router=useRouter();
    let limit=useRef(10);
    const months=['January','February','March','April','May','June','July',
  'August','September','October','November','December'];



  function deleteStaff(id){
Swal.fire({
    title: 'Are you sure?',
    text: "Confirm Delete of Comment",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
    setloading(true);
    const formData=new FormData();
    formData.append('id',id)
    axios.post(`${phpUrl}/staff/delete-staff.php`,formData,{withCredentials:true})
    .then(res=>{
       let status=res.data.status;
       setloading(false)
       if(status==='success'){
        Swal.fire(
            'Successful',
            'Staff Deleted',
            'success'
        )
        loadStaffs()
       }else if(status==='Invalid User'||status==='no Cookie'){
               
        router.push(`/login?next=${router.asPath}`)
    }else{
        Swal.fire(
            'Error Occured',
            status,
            'error'
        )
       }
    }).catch(err=>{
        setloading(false)
        Swal.fire(
            'Error Occured',
            err.message,
            'error'
        )
    })
}
      });
  }


  function loadLimitStaff(){
    limit.current=limit.current+10;
    loadStaffs()
  }

  function filter(e){
    if(e==='ascend'){
        setstaffs(filterStaffs.sort((a,b)=>a.id < b.id ? 1:-1));
    }else if(e==='posted'){
        setstaffs(filterStaffs.sort((a,b)=>a.post < b.post ? 1:-1));
    }else if(e==='descend'){
        setstaffs(filterStaffs.sort((a,b)=>a.id < b.id ? -1:1));
    }
  }

function filterByFullName(e){
    filterIndex.current=e;
    let filterStaffs2=[];
    for (let i = 0; i < backup.length; i++) {
    if(backup[i].full_name.toLowerCase().includes(filterIndex.current.toLowerCase())){
    filterStaffs2.push(backup[i]);
    }      
    }
    setstaffs(filterStaffs2);
}





  function loadStaffs(){
    setdataLoad(true)
    axios.get(`${phpUrl}/staff/get-staffs.php?limit=${limit.current}`,{withCredentials: true})
    .then(res=>{
        let status=res.data.status;
        let data=res.data.data;
        setdataLoad(false)
        if(status==='success'){
            setstaffs(data);
            setbackup(data);
            
        }else{
            Swal.fire(
                'Error Occured',
                status,
                'warning'
            )
        }
    }).catch(err=>{
        setdataLoad(false)
        Swal.fire(
            'Error Occured',
            err.message,
            'error'
        )
    })
  }



useEffect(()=>{
    // loadStaffs();
    loadStaffs();
  },[]);

    return(
        <>
        
        <div className='mainHeading'>
            <p>Staffs</p>
            <Link href='staffs/addStaff'>ADD</Link>
        </div>





<div className='adminfilterscon'>
<div className='adminfilters'>
        <input type='text' placeholder='Search...'
        onChange={(e)=>{filterByFullName(e.target.value)}}/>
    </div>
    <div className='adminfilters'>
    <select onChange={(e)=>filter(e.target.value)}>
    <option value='ascend'>Ascending Order</option>
    <option value='descend'>Descending Order</option>
    <option value='post'>Most Posted</option>
    </select>
    </div>
</div>



<div className='adminstat3con'>
<div className='adminstat3'>
<div className='adminstat3info2'>
<table>





<tbody>

<tr>
<th>Profile Image</th>
<th>Full Name</th>
<th>Email</th>
<th>Position</th>
<th>Posts</th>
<th>Opened Date</th>
<th>Edit</th>
<th>Delete</th>
<th>Status</th>
</tr>


{filterStaffs && filterStaffs.map((staff,i)=>{
    return(
    <tr key={i}>
    <td style={{width:'100px',height:'90px',minWidth:'128px'}}>
    <div style={{width:'100%',height:'100%',position:'relative',}}>
    <Image
    src={staff.image}
    alt="Picture of the author"
    layout="fill" 
    objectFit="contain"
    placeholder="blur"
    blurDataURL="/favicon.io"
    priority
    />
    </div>
    </td>
    <td>{staff.full_name}</td>
    <td>{staff.email}</td>
    <td>{staff.position}</td>
    <td>{staff.posts??0}</td>
    <td>{staff.day}th {months[parseInt(staff.month)-1]}, {staff.year}</td>
    <td><Link href={`/admin/staffs/editStaff/${staff.id}`}><i className='fa fa-edit'/></Link></td>
    <td><button onClick={()=>deleteStaff(staff.id)}>Delete</button></td>
    <td>{staff.status}</td>
    </tr>
    )
})}

</tbody>






</table>
</div>
</div>
<div className='adminmorebtn'>
<div>
{dataLoad&&<ThreeDots
height="40" 
width="40" 
radius="9"
color="#945f0f" 
ariaLabel="three-dots-loading"
wrapperStyle={{}}
wrapperClassName=""
visible={true}
/>}
</div>

<button onClick={loadLimitStaff}>See More</button>
</div>
</div>

        </>
    )
}