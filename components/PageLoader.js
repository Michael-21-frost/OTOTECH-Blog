import { ThreeDots } from 'react-loader-spinner'

export default function PageLoader({res}){

    return(
        <>
        <div className="loaderCon">
        <ThreeDots
        height="80" 
        width="80" 
        radius="9"
        color="#945f0f" 
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
        />
        </div>
        </>
    )
}