import axios from 'axios'
axios.defaults.baseURL="http://localhost:3001"
axios.defaults.baseURL="https://porpose-day-git-main-rootrsk.vercel.app"

// https://porpose-day-git-main-rootrsk.vercel.app/
export const getProposal = async(id)=>{
    const {data} = await axios({
        method:'get',
        url:"/get-proposal",
        headers:{
            "Authorization":id
        }
    })
    return data
}

export const loginUser = async(formData)=>{
    const {data} = await axios({
        method:'post',
        url:"/login",
        data:formData
    })
    return data
}

export const updateUserDetails = async(formData)=>{
    const {data} = await axios({
        method:'patch',
        url:"/update-user-details",
        data:formData
    })
    return data
}

export const porposeUrlGenerator = async(formData)=>{
    const {data} = await axios({
        method:'post',
        url:"/generate-proposal-link",
        data:formData
    })
    return data
}

export const updateProposalStatus = async(formData)=>{
    const {data} = await axios({
        method:'patch',
        url:"/update-proposal-status",
        data:formData
    })
    return data
}

