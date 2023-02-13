import axios from 'axios'
import React, { useState } from 'react'
import { loginUser, porposeUrlGenerator, updateUserDetails } from '../utils'

function CreateProposal() {
    const [show,setShow] = useState("")
    const [user,setUser] = useState(null)
    const [terms,setTerms] = useState([])
    const [theOne,setTheOne] = useState("")
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false)
    const [condition,setCondition] = useState("")
    const [cheeseLine,setCheeseLine] = useState("")
    const [instagram,setInstagram] = useState("")
    const [generatedUrl,setGeneratedUrl] = useState("")
    const inputHandler = (e,setterFunction)=>{
        setterFunction(e.target.value)
    }
    const loginHandler = async(e)=>{
        e.preventDefault()
        setLoading(true)
        const data = await loginUser({username,password})
        setLoading(false)
        if(data?.error){
            alert(data?.error)
            return
        }
        if(data?.user && data?.token){
            axios.defaults.headers.common['Authorization'] = data?.token
            localStorage.setItem("token",data?.token)
            localStorage.setItem("user",JSON.stringify(data?.user))
            setUser(data?.user)
            setCheeseLine(data?.user?.cheese_line ?? "")
            setTerms(data?.user?.terms_and_conditions ?? [])
            setShow(data?.user?.showname ?? "")
            setInstagram(data?.user?.instagram??"")
        }
        // console.log(data)
        // console.log("Login")
    }
    const updateHandler = async(e)=>{
        e.preventDefault()
        console.log("Submitted")
        const data = await updateUserDetails({
            cheese_line:cheeseLine,
            terms_and_conditions : terms,
            showname:show,
            instagram
        })
        // console.log(data)
    }
    const termAddHandler = ()=>{
        setTerms(p=>[...p,condition])
        setCondition("")
    }
    const termRemoveHandler = (idx)=>{
        setTerms(p=>p.filter((t,i)=> i!==idx))
    }
    const urlGeneratorHandler = async(e)=>{
        e.preventDefault()
        // console.log("url GEn")
        const data = await porposeUrlGenerator({theOne})
        // console.log(data)
        const hostname = "https://" + window.location.hostname
        const query = "?q=" + data.token
        if(data?.token){
            setGeneratedUrl(hostname+query)
        }
        var text = "Example text to appear on clipboard";
        
    }
    const copyToClickBoard = ()=>{
        navigator.clipboard.writeText(generatedUrl).then(function() {
            alert('Copied To Click Board');
        }, function(err) {
            alert('Could not copy text: ', err);
        });
    }
    
    return (
        <div>
            {
                !user &&
                <div className='login-div'>
                    
                    <form onSubmit={loginHandler}>
                        <h2>Login</h2>
                        <input 
                            type="text" 
                            placeholder='Username'
                            value={username}
                            onChange={e=>inputHandler(e,setUsername)}
                            className="form-control"
                        />
                        <input 
                            type="text" 
                            placeholder='Password'
                            value={password}
                            onChange={e=>inputHandler(e,setPassword)}
                            className="form-control"
                        />
                        <button className="btn btn-primary" >
                            {
                                loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>:
                                'Login'
                            }
                            {/* {console.log(loading)} */}
                        </button>
                        <p>If your account doesn't exist it will create new account.</p>
                    </form>     
                </div>
                
            }
            
            {
                user && 
                <div className='create_new_page'>
                    <h2>Hi {user.username}</h2>
                    <form onSubmit={updateHandler} >
                        <input 
                            type="text" 
                            placeholder='Your Cheese Line'
                            value={cheeseLine}
                            onChange={e=>inputHandler(e,setCheeseLine)}
                            className="form-control"
                        />
                        <div>
                            <ul className="terams_and_conditions">
                                <li><h2>Promises</h2></li>
                                <li className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="flexCheckChecked" 
                                        checked
                                        readOnly
                                    />

                                    <label className="form-check-label">
                                        Show Promises
                                    </label>
                                </li>
                                {
                                    terms?.map((term,idx)=>{
                                        return(<li key={idx+1} className="c-l">
                                            <div>
                                                <span>{idx+1}. </span>
                                                {term}    
                                            </div>
                                            
                                            <button 
                                                className="btn btn-danger"
                                                onClick={()=>termRemoveHandler(idx)}
                                            >X
                                            </button>
                                        </li>)
                                    })
                                }
                            </ul>
                            <input 
                                type="text" 
                                placeholder='Your Condition'
                                value={condition}
                                onChange={e=>inputHandler(e,setCondition)}
                                className="form-control"
                            />
                              
                            <button 
                                className="btn btn-primary"
                                onClick={termAddHandler}
                            >Add Terms and Conditions</button> 
                            <input 
                                type="text" 
                                placeholder='Your Name to be shown'
                                value={show}
                                onChange={e=>inputHandler(e,setShow)}
                                className="form-control"
                            />  
                            <div class="input-group mb-3">
    <div className="input-group-prepend">
        <span className="input-group-text" id="basic-addon3">https://www.instagram.com/</span>
    </div>
    <input 
    onChange={e=>inputHandler(e,setInstagram)}
    value={instagram}

    type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3" />
    </div>
                        </div>
                        
                        <button 
                            className="btn btn-primary"
                            // onClick={updateHandler}
                        >Update Proposal Details</button>
                    </form>   
                    <form onSubmit={urlGeneratorHandler}>
                        <h2>New Proposal</h2>
                        <input 
                            type="text" 
                            placeholder='To Whom You want to purpose'
                            value={theOne}
                            onChange={e=>inputHandler(e,setTheOne)}
                            className="form-control"
                        />
                        <button
                            className="btn btn-primary"
                        >
                            Generate a Propose Link
                        </button>
                        {
                            generatedUrl && 
                            <div>
                                <input 
                                    type="text" 
                                    placeholder='To Whom You want to purpose'
                                    value={generatedUrl}
                                    className="form-control"
                                    disabled
                                />
                                <button 
                                    className="btn btn-primary" 
                                    onClick={copyToClickBoard}
                                >
                                    Copy Url
                                </button>
                            </div>
                        }
                    </form> 
                    <div className="proposal_status">
                        <h2>Your Proposal Status</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Proposal</th>
                                    <th>Promise</th>
                                </tr>

                            </thead>
                            
                            <tbody>
                                {user?.proporsals?.map((prop,idx)=>{
                                    return <tr key={idx+1}>
                                        <td>{prop.by}</td>
                                        <td 
                                            className={`${!prop.proposal?'pending':prop.proposal==='Accepted'?'accepted':'rejected'}`}
                                        >
                                            {prop.proposal}
                                        </td>
                                        <td className={`${!prop.terms_and_conditons?'pending':prop.terms_and_conditons==='Accepted'?'accepted':'rejected'}`}>{prop.terms_and_conditons}</td>
                                    </tr>
                                })}        
                            </tbody>
                        </table>
                        
                    </div>
                </div>
            }
            
        </div>
    )
}

export default CreateProposal