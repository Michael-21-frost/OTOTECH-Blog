import { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
import axios from 'axios';
import { useLoader } from "../../_app";
import { ThreeDots } from 'react-loader-spinner'
import { useRouter } from "next/router";
import { phpUrl } from "../../../components/BaseUrl";

export default function AdminComments(){
    const [comments,setcomments]=useState([]);
    const [backup,setbackup]=useState([]);
    const {loading,setloading}=useLoader();
    const [dataLoad,setdataLoad]=useState(false);
    const filterIndex=useRef('');
    const filterComments=Array.from(comments);
    const router=useRouter();
    let limit=useRef(10);
    const months=['January','February','March','April','May','June','July',
  'August','September','October','November','December'];


  function loadComments(){
    setdataLoad(true)
    // axios.get(`/api/comments/getComments?limit=${limit.current}`)
    axios.get(`${phpUrl}/comment/get-comments.php?limit=${limit.current}`,{withCredentials:true})
    .then(res=>{
        let status=res.data.status;
        let data=res.data.data;
        setdataLoad(false)

        if(status==='success'){
            setcomments(data);
            setbackup(data);
            
        }else{
            Swal.fire(
                'Error',
                data,
                'error'
            )
        }
    }).catch(err=>{
        setdataLoad(false)
        Swal.fire(
            'Warning',
            err,
            'error'
        )
    })
  }

    function view(i){
    Swal.fire({
        title:comments[i].user.email,
        html:comments[i].comment,
        icon:'info',
        confirmButtonText:'Close'
    })

    }


function deleteComment(id){
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
            let formData=new FormData();
            formData.append('id',id)
            axios.post(`${phpUrl}/comment/delete-comment.php`,formData,{withCredentials:true})
            .then(res=>{
               let status=res.data.status;
               setloading(false);
               if(status==='success'){
                Swal.fire(
                    'Successful',
                    'Comment Deleted',
                    'success'
                )
                loadComments();
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
      })
  }

function loadLimitComment(){
    limit.current=limit.current+10;
    loadComments();
  }

  function filter(e){
    if(e==='ascend'){
        setcomments(filterComments.sort((a,b)=>a._id < b._id ? 1:-1));
    }else if(e==='articles'){
        setcomments(filterComments.sort((a,b)=>a.user < b.user ? 1:-1));
    }else if(e==='descend'){
        setcomments(filterComments.sort((a,b)=>a._id < b._id ? -1:1));
    }
  }

function filterByUser(e){
    filterIndex.current=e;
    let filterComments2=[];
    for (let i = 0; i < backup.length; i++) {
    if(backup[i].user.email.toLowerCase().includes(filterIndex.current.toLowerCase())){
    filterComments2.push(backup[i]);
    }      
    }
    setcomments(filterComments2);
}

useEffect(()=>{
    loadComments();
  },[]);

    return(
        <>
        
        <div className='mainHeading'>
            <p>Comments</p>
        </div>





<div className='adminfilterscon'>
<div className='adminfilters'>
        <input type='text' placeholder='Search...'
        onChange={(e)=>{filterByUser(e.target.value)}}/>
    </div>
    <div className='adminfilters'>
    <select onChange={(e)=>filter(e.target.value)}>
    <option value='ascend'>Ascending Order</option>
    <option value='descend'>Descending Order</option>
    </select>
    </div>
</div>



<div className='adminstat3con'>
<div className='adminstat3'>
<div className='adminstat3info2'>
<table>





<tbody>

<tr>
<th>Page</th>
<th>User</th>
<th>Commented On</th>
<th>Delete</th>
<th>View</th>
</tr>

{filterComments && filterComments.map((comment,i)=>{
    return(
    <tr key={i}>
    <td>{comment.pageId===null ? 'Invalid' : comment.pageId.title}</td>
    <td>{comment.user===null ? 'Invalid' :comment.user.email}</td>
    <td>{comment.day}th {months[comment.month]}, {comment.year}</td>
    <td><button onClick={()=>deleteComment(comment.id)}>Delete</button></td>
    <td><button onClick={()=>view(i)}>View</button></td>
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

<button onClick={loadLimitComment}>See More</button>
</div>
</div>

        </>
    )
}