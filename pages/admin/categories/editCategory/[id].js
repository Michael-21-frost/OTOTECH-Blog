import { useRouter } from "next/router";
import { useState,useEffect } from "react"
import Swal from 'sweetalert2';
import axios from "axios";
import { baseUrl, phpUrl } from "../../../../components/BaseUrl";
import { useLoader } from "../../../_app";

export const getServerSideProps=async (context)=>{
    let error=context.query;
    try{
      // const res=await axios.get(`${baseUrl}/api/categories/getCategory/${context.params.id}`);
      const res=await axios.get(`${phpUrl}/category/get-category.php?id=${context.params.id}`);
    
      const data= res.data.data;
      const editId= data.id;
      const editName= data.name;
      const editDescription=data.description;
      const editIcon= data.icon;
      const editStatus= data.status;
      const editImg= data.image;

      return {
        props:{editId,editName,editDescription,editIcon,editImg,editStatus}
      }    
      
    }catch(err){
      return {
        props:{error:err}
      } 
    }
    
  }



export default function EditCategory({error,editId,editName,editDescription,editIcon,editImg,editStatus}){
    const [name,setname]=useState('');
    const [id,setid]=useState('');
    const [description,setdescription]=useState('');
    const [icon,seticon]=useState('');
    const [status,setstatus]=useState('');
    const {loading,setloading}=useLoader();
    const router=useRouter();

    if(error){
        Swal.fire(
          'Error Occured',
          'Please check your Connection',
          'warning'
        )
  }
    const [imgpreview,setImgpreview]=useState('');

 function handleSubmit(e){
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "Confirm Action On Category",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Edit it!'
          }).then((result) => {
            if (result.isConfirmed) {
                
        const formData=new FormData(e.target);
        formData.append('id',id);

        setloading(true)
        axios.post(`${phpUrl}/category/update-category.php`,formData,{withCredentials:true})
        .then(res=>{
            
            let status=res.data.status;
            setloading(false)
            if(status==='success'){
                Swal.fire(
                    'Successful!',
                    'Category Edited',
                    'success'
                )
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
            setloading(false)
            Swal.fire(
                'Error Occured',
                err.message,
                'error'
            )  
        })
    }else{
        setloading(false)
    }
})
    }
    
    
    function imgPreview(e){
        setImgpreview(URL.createObjectURL(e.target.files[0]));
    }

    useEffect(()=>{
        setid(editId);
        setname(editName);
        setdescription(editDescription);
        seticon(editIcon);
        setstatus(editStatus)
        setImgpreview(editImg);
        
        },[]);

    return(
        <>
        <div className='mainHeading'>
            <p>Edit Category</p>
        </div>


        <form onSubmit={handleSubmit}>
        <div className='addcategcon'>
        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Name</p>
            <input type='text' name='name' value={name} onChange={(e)=>setname(e.target.value)}/>
            </div>
        </div>

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Description</p>
            <textarea type='text' name='description' value={description} onChange={(e)=>setdescription(e.target.value)}/><p>description should not be more than 150 words</p>
        </div>
        </div>


        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Icon</p>
            <select name='icon' value={icon} onChange={(e)=>seticon(e.target.value)}>
            <option value='dollar' defaultValue>Dollars</option>
            <option value='rocket'>Rocket</option>
            <option value='pencil'>Pencil</option>
            <option value='globe'>Globe</option>
            <option value='user'>User</option>
            <option value='clipboard'>ClipBoard</option>
            <option value='phone'>Phone</option>
            <option value='desktop'>Desktop</option>
            <option value='laptop'>Laptop</option>
            <option value='tablet'>Tablet</option>
            <option value='paint-brush'>Paint Brush</option>
            <option value='github'>Github</option>
            <option value='camera'>Camera</option>
            <option value='cloud'>Cloud</option>
            <option value='check'>Check</option>
            <option value='bars'>Bars</option>
            <option value='download'>Download</option>
            <option value='star'>Star</option>
            <option value='comment'>Comment</option>
            <option value='music'>Music</option>
            <option value='heart'>Heart</option>
            <option value='paperclip'>Paper Clip</option>
            <option value='file'>File</option>
            <option value='bell'>Bell</option>
            <option value='gift'>Gift</option>
            <option value='film'>Film</option>
            <option value='list'>List</option>
            <option value='key'>Key</option>
            <option value='eye'>Eye</option>
            <option value='wifi'>Wifi</option>
            <option value='book'>Book</option>
            <option value='server'>Server</option>
            <option value='plug'>Plug</option>
            <option value='barcode'>Barcode</option>
            <option value='bolt'>Bolt</option>
            <option value='plane'>Plane</option>
            <option value='car'>Car</option>
            </select>
            <p>Icon Selected: <i className={`fa fa-${icon}`}/></p>
            </div>
        </div>


        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Thumbnail(Image)</p>

            <div className='previewimg'>
            <img src={imgpreview}/>
            </div>

            <input type='file' name='img_link' onChange={imgPreview}/>

        </div>
        </div>

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Status</p>
            <select name='status' value={status} onChange={(e)=>setstatus(e.target.value)}>
            <option value='active'>Activate</option>
            <option value='inactive'>Deactivate</option>
            </select>
            </div>
        </div>
        <div className='admineditbtn'>
        <button>EDIT</button>
        </div>
        </div>
        </form>  
        </>
    )
}