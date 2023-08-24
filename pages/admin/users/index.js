import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import { useLoader } from "../../_app";
import { ThreeDots } from 'react-loader-spinner'
import { useRouter } from "next/router";
import { phpUrl } from "../../../components/BaseUrl";

export default function AdminUsers(){
    const [users,setusers]=useState([]);
    const [backup,setbackup]=useState([]);
    const [dataLoad,setdataLoad]=useState(false);
    const {loading,setloading}=useLoader();
    const filterIndex=useRef('');
    const filterUsers=Array.from(users);
    const router=useRouter();
    let limit=useRef(10);
    const months=['January','February','March','April','May','June','July',
  'August','September','October','November','December'];


  
  function loadUsers(){
    setdataLoad(true)
    axios.get(`${phpUrl}/users/get-users.php?limit=${limit.current}`,{withCredentials:true})
    .then(res=>{
        let status=res.data.status;
        let data=res.data.data;
        setdataLoad(false)
        if(status==='success'){
            setusers(data);
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
            'Error Occured 2',
            err.message,
            'error'
        )
    })
 }


  
  function deleteUser(id){
    Swal.fire({
        title: 'Are you sure?',
        text: "Confirm Delete of User",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
            setloading(true);
            let formData=new FormData();
            formData.append('id',id)
    axios.post(`${phpUrl}/users/delete-user.php`,formData,{withCredentials:true})
    .then(res=>{
       let status=res.data.status;
       setloading(false)
       if(status==='success'){
        Swal.fire(
            'Successful',
            'User Deleted',
            'success'
        )
        loadUsers()
       }else if(status==='Invalid User'||status==='no Cookie'){
               
        router.push(`/login?next=${router.asPath}`)
    }else{
        Swal.fire(
            'Error Occured',
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
}else{
    setloading(false);
    return;
}
      });
  }


  function loadLimitUser(){
    limit.current=limit.current+10;
    loadUsers()
  }

  function filter(e){
    if(e==='ascend'){
        setusers(filterUsers.sort((a,b)=>a._id < b._id ? 1:-1));
    }else if(e==='comments'){
        setusers(filterUsers.sort((a,b)=>a.comments < b.comments ? 1:-1));
    }else if(e==='descend'){
        setusers(filterUsers.sort((a,b)=>a._id < b._id ? -1:1));
    }
  }

function filterByFullName(e){
    filterIndex.current=e;
    let filterUsers2=[];
    for (let i = 0; i < backup.length; i++) {
    if(backup[i].name.toLowerCase().includes(filterIndex.current.toLowerCase())){
    filterUsers2.push(backup[i]);
    }      
    }
    setusers(filterUsers2);
}



useEffect(()=>{
    loadUsers();
  },[]);




    return(
        <>
        
        <div className='mainHeading'>
            <p>Users</p>
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
    <option value='comments'>Most Commented</option>
    </select>
    </div>
</div>



<div className='adminstat3con'>
<div className='adminstat3'>
<div className='adminstat3info2'>
<table>





<tbody>

<tr>
<th>Full Name</th>
<th>Email</th>
<th>comments</th>
<th>Account Opened On</th>
<th>Edit</th>
<th>Delete</th>
</tr>

{filterUsers && filterUsers.map((user,i)=>{
    return(
    <tr key={i}>
    <td>{user.full_name}</td>
    <td>{user.email}</td>
    <td>{user.comments}</td>
    <td>{user.day}th {months[parseInt(user.month)]}, {user.year}</td>
    <td><Link href={`/admin/users/editUser/${user.id}`}><i className='fa fa-edit'/></Link></td>
    <td><button onClick={()=>deleteUser(user.id)}>Delete</button></td>
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

<button onClick={loadLimitUser}>See More</button>
</div>
</div>

        </>
    )
}