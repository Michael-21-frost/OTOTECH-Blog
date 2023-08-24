import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react"
import Swal from 'sweetalert2';
import { phpUrl } from "../../../../components/BaseUrl";
import { useLoader } from "../../../_app";

export default function AddCategory(){
    const [imgpreview,setImgpreview]=useState('');
    const [icon,setIcon]=useState('rocket');
    const {loading,setloading}=useLoader();
    const router=useRouter();

    function handleSubmit(e){
        e.preventDefault();
        setloading(true)
        const formData=new FormData(e.target);
        
        axios.post(`${phpUrl}/category/add-category.php`,formData,{withCredentials:true})
        .then(res=>{
            let status=res.data.status;
            setloading(false)
            if(status==='success'){
                Swal.fire(
                    'Successful!',
                    'Category Added',
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
    }

    function imgPreview(e){
        setImgpreview(URL.createObjectURL(e.target.files[0]));
    }


    return(
        <>
        <div className='mainHeading'>
            <p>Add Category</p>
        </div>


        <form onSubmit={handleSubmit}>
        <div className='addcategcon'>
        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Name</p>
            <input type='text' name='name' required='required'/>
            </div>
        </div>
        

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Description</p>
            <textarea type='text' name='description' required='required'/><p>description should not be more than 150 words</p>
        </div>
        </div>


        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Icon</p>
            <select name='icon' value={icon} onChange={(e)=>setIcon(e.target.value)} required='required'>
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

            <input type='file' name='img_link' onChange={imgPreview} required='required'/>

        </div>
        </div>

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Status</p>
            <select name='status'>
            <option value='active'>Activate</option>
            <option value='inactive'>Deactivate</option>
            </select>
            </div>
        </div>
        <div className='admineditbtn'>
        <button >ADD</button>
        </div>
        </div>
        </form>  
        </>
    )
}