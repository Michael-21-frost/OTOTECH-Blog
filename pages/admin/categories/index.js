import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Swal from "sweetalert2";
import { useLoader } from "../../_app";
import { ThreeDots } from 'react-loader-spinner'
import { useRouter } from "next/router";
import { phpUrl } from "../../../components/BaseUrl";

export default function AdminCategories(){
    const [categories,setcategories]=useState([]);
    const [backup,setbackup]=useState([]);
    const [dataLoad,setdataLoad]=useState(false);
    const {loading,setloading}=useLoader();
    const router=useRouter();
    const filterIndex=useRef('');
    const filterCategories=Array.from(categories);
    let limit=useRef(10);
    
    const months=['January','February','March','April','May','June','July',
  'August','September','October','November','December'];



  function deleteCategory(id){
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
            setloading(true)
            const formData=new FormData();
            formData.append('id',id)
    axios.post(`${phpUrl}/category/delete-category.php`,formData,{withCredentials:true})
    .then(res=>{
       let status=res.data.status;
       setloading(false);
       if(status==='success'){
        Swal.fire(
            'Successful',
            'Category Deleted',
            'success'
        )
        phpApi();
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
}
      });
  }

  function loadLimitCategory(){
    limit.current=limit.current+1;
    // loadCategories();
     phpApi();
  }


  function filter(e){
    if(e==='ascend'){
        setcategories(filterCategories.sort((a,b)=>a.id < b.id ? 1:-1));
    }else if(e==='articles'){
        setcategories(filterCategories.sort((a,b)=>a.articles < b.articles ? 1:-1));
    }else if(e==='descend'){
        setcategories(filterCategories.sort((a,b)=>a.id < b.id ? -1:1));
    }
  }


function filterByName(e){
    filterIndex.current=e;
    let filterCategories2=[];
    
    for (let i = 0; i < backup.length; i++) {
    if(backup[i].name.toLowerCase().includes(filterIndex.current.toLowerCase())){
    filterCategories2.push(backup[i]);
    }      
    }
    
    setcategories(filterCategories2);
}


function phpApi(){
    axios.get(`${phpUrl}/category/get-categories.php?limit=${limit.current}`)
    .then(res=>{
        let status=res.data.status;
        let data=res.data.data;
        setdataLoad(false)
        if(status==='success'){
            setcategories(data);
            setbackup(data);
        }else{
            Swal.fire(
                'Error Occured',
                status,
                'warning'
            )
        }

    }).catch(err=>{
        Swal.fire(
            'Error Occured',
            err.message,
            'error'
        ) 
    });
}

useEffect(()=>{
    // loadCategories();
     phpApi();
  },[]);




    return(
        <>
        
        <div className='mainHeading'>
            <p>Categories</p>
            <Link href='categories/addCategory'>ADD</Link>
        </div>





<div className='adminfilterscon'>
<div className='adminfilters'>
        <input type='text' placeholder='Search...'
        onChange={(e)=>{filterByName(e.target.value)}}/>
    </div>
    <div className='adminfilters'>
    <select onChange={(e)=>filter(e.target.value)}>
    <option value='ascend'>Ascending Order</option>
    <option value='descend'>Descending Order</option>
    <option value='articles'>Most Articles</option>
    </select>
    </div>
</div>



<div className='adminstat3con'>
<div className='adminstat3'>
<div className='adminstat3info2'>
<table>





<tbody>

<tr>
<th>Img</th>
<th>Name</th>
<th>icon</th>
<th>no. of Articles</th>
<th>Date</th>
<th>Edit</th>
<th>Delete</th>
<th>Status</th>
</tr>


{filterCategories && filterCategories.map((category,i)=>{
    return(
    <tr key={i}>
    <td style={{width:'100px',height:'90px',minWidth:'128px'}}>
    <div style={{width:'100%',height:'100%',position:'relative',}}>
    <Image
    src={category.image}
    alt="Picture of the author"
    layout="fill" 
    objectFit="contain"
    placeholder="blur"
    blurDataURL="/favicon.io"
    priority
    />
    </div>
     </td>
    <td>{category.name}</td>
    <td>{category.icon}</td>
    <td>{category.articles}</td>
    <td>{category.day}th {months[category.month]}, {category.year}</td>
    <td><Link href={`/admin/categories/editCategory/${category.id}`}><i className='fa fa-edit'/></Link></td>
    <td><button onClick={()=>deleteCategory(category.id)}>Delete</button></td>
    <td>{category.status}</td>
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

<button onClick={loadLimitCategory}>See More</button>
</div>
</div>

        </>
    )
}