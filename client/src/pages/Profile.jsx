import { useSelector } from "react-redux"
import { useRef, useState } from "react";
import {
  updateUserStart, updateUserSuccess, updateUserFailure,
  deleteUserStart,
  deleteUserFailure, 
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess
} from '../redux/user/userSlice.js';
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function Profile() {
  const { currentUser, loading, error } = useSelector((state)=>state.user);
  const [imageUrl, setImageUrl] = useState(currentUser.avatar);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const fileRef = useRef();
  const dispatch = useDispatch();

    // CLOUDINARY INFO
  const cloudName = "dv8q3oyfj";
  const uploadPreset = "profile_preset_2";

  const handleImageUpload = async (file) => {
    setUploading(true);

    const fData = new FormData();
    fData.append("file", file);
    fData.append("upload_preset", uploadPreset);

    // Cloudinary upload URL
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const res = await fetch(url, {
      method: "POST",
      body: fData,
    });

    const data = await res.json();

    setUploading(false);

    if (data.secure_url) {
      setImageUrl(data.secure_url); // DISPLAY uploaded image
      setFormData((prevFormData) => ({
        ...prevFormData, 
         avatar: data.secure_url,
      }));
      console.log("Uploaded:", imageUrl);
    }
  };

  const handleChange = (e)=>{
    setFormData({
      ...formData, [e.target.id]:(e.target.value)
    })
  }

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
 const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async()=> {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }
  return (
<div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" hidden ref={fileRef} onChange={(e)=>handleImageUpload(e.target.files[0])}/>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        {/* Uploading feedback */}
        {uploading && (
        <p className="text-center text-slate-600 text-sm">
        Uploading image...
        </p>
        )}
        <input 
          type="text" 
          placeholder='username' 
          id='username'  
          className='border rounded-lg p-3'
          defaultValue={currentUser.username}
          onChange={handleChange}
          />
        <input 
          type="email" 
          placeholder='email' 
          id='email'  
          className='border rounded-lg p-3'
          defaultValue={currentUser.email}
          onChange={handleChange}
          />
        <input 
          type="password" 
          placeholder='password' 
          id='password'  
          className='border rounded-lg p-3'
          onChange={handleChange}
          />
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          className='text-red-700 cursor-pointer'
          onClick={handleDeleteUser}
        >
          Delete account
        </span>
        <span 
          className='text-red-700 cursor-pointer'
          onClick={handleSignOut}
          >
          Sign out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess && 'User is updated successfully!'}
      </p>
      </div>
  )
}

export default Profile