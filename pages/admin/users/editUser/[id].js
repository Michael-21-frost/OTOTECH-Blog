import { useEffect ,useState} from "react"
import Swal from 'sweetalert2';
import axios from "axios";
import { baseUrl, phpUrl } from "../../../../components/BaseUrl";
import { useLoader } from "../../../_app";
import { useRouter } from "next/router";

export const getServerSideProps=async (context)=>{
    let error=context.query;
    try{
      const res=await axios.get(`${phpUrl}/users/get-user.php?id=${context.params.id}`);

      const data= res.data.data;
      const editFull_name= data.full_name;
      const editEmail= data.email;
      const editId= data.id;
      
      return {
        props:{editFull_name,editId,editEmail,data}
      }    
      
    }catch(err){
      return {
        props:{error:error}
      } 
    }
    
}


export default function EditUser({error,editId,editFull_name,editEmail,data}){

    const {loading,setloading}=useLoader();
    const router=useRouter();

    if(error){
        Swal.fire(
          'Error Occured',
          'Please check your Connection',
          'error'
        )
  }
  
  const [full_name,setfull_name]=useState('');
  const [email,setemail]=useState('');
  const [id,setid]=useState('');

    function handleSubmit(e){
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "Confirm Action On User",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Edit it!'
          }).then((result) => {
            if (result.isConfirmed) {
                setloading(true)
        const formData=new FormData(e.target);
        formData.append('id',id);
        axios.post(`${phpUrl}/users/update-user.php`,formData,{withCredentials:true})
        .then(res=>{
            let status=res.data.status;
            setloading(false);
            if(status==='success'){
                Swal.fire(
                    'Successful!',
                    'User Edited',
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
        setloading(false);
        return;
    }
})
    }



    useEffect(()=>{
        setfull_name(editFull_name);
        setemail(editEmail);
        setid(editId)
    },[])




    
    return(
        <>
        <div className='mainHeading'>
            <p>Edit User</p>
        </div>


        <form onSubmit={handleSubmit}>
        <div className='addcategcon'>
        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Full Name</p>
            <input type='text' name='full_name' value={full_name} onChange={(e)=>setfull_name(e.target.value)}/>
            </div>
        </div>
        
        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Email</p>
            <input type='email' name='email' value={email} onChange={(e)=>setemail(e.target.value)}/>
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