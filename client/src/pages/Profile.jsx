import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react";

function Profile() {
  const { currentUser } = useSelector((state)=>state.user);
  const [imageUrl, setImageUrl] = useState(currentUser.avatar);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const fileRef = useRef();

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
      console.log("Uploaded:", data.secure_url);
    }
  };

  return (
<div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form  className='flex flex-col gap-4'>
        <input type="file" hidden ref={fileRef} onChange={(e)=>handleImageUpload(e.target.files[0])}/>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />

        {/* Uploading feedback */}
        {uploading && (
        <p className="text-center text-slate-600 text-sm">
        Uploading image...
        </p>
        )}
        <input type="text" placeholder='username' id='username'  className='border rounded-lg p-3'/>
        <input type="email" placeholder='email' id='email'  className='border rounded-lg p-3'/>
        <input type="password" placeholder='password' id='password'  className='border rounded-lg p-3'/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      {/* <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess && 'User is updated successfully!'}
      </p> */}
      </div>
  )
}

export default Profile