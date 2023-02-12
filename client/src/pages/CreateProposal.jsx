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
        }
        console.log(data)
        console.log("Login")
    }
    const updateHandler = async(e)=>{
        e.preventDefault()
        console.log("Submitted")
        const data = await updateUserDetails({
            cheese_line:cheeseLine,
            terms_and_conditions : terms,
            showname:show
        })
        console.log(data)
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
        console.log("url GEn")
        const data = await porposeUrlGenerator({theOne})
        console.log(data)
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
                            class="form-control"
                        />
                        <input 
                            type="text" 
                            placeholder='Password'
                            value={password}
                            onChange={e=>inputHandler(e,setPassword)}
                            class="form-control"
                        />
                        <button className="btn btn-primary" >
                            {
                                loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>:
                                'Login'
                            }
                            {console.log(loading)}
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
                            class="form-control"
                        />
                        <div>
                            <ul className="terams_and_conditions">
                                <li><h2>Agreements</h2></li>
                                {
                                    terms?.map((term,idx)=>{
                                        return(<li key={idx+1} className="c-l">
                                            <div>
                                                <span>{idx+1}. </span>
                                                {term}    
                                            </div>
                                            
                                            <button 
                                                class="btn btn-danger"
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
                                class="form-control"
                            />
                              
                            <button 
                                class="btn btn-primary"
                                onClick={termAddHandler}
                            >Add Terms and Conditions</button> 
                            <input 
                                type="text" 
                                placeholder='Your Name to be shown'
                                value={show}
                                onChange={e=>inputHandler(e,setShow)}
                                class="form-control"
                            />  
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
                            class="form-control"
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
                                    class="form-control"
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
                </div>
            }
            
        </div>
    )
}

export default CreateProposal