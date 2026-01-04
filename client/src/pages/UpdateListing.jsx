import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { apiUrl } from '../config';
function UpdateListing() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const params = useParams();
    const [loading, setLoading] = useState(false);  
    const [error, setError] = useState(false);
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    })
    const [uploading, setUploading] = useState(false);
    // console.log(files)
    const [imageUploadError, setImageUploadError] = useState(false);

    useEffect(()=>{
        const listingId = params.listingId;
        const fetchListing = async ()=>{
            const res = await fetch(apiUrl(`/api/listing/get/${listingId}`));
            const data = await res.json();
            if(data.success === false){
                console.log(data.message)
                return;
            }
            setFormData(data);
        }
        fetchListing();
    }, []);

    const handleImageSubmit = ()=> {
        setUploading(true)
            if(files.length > 0 && files.length < 7){
            const promises =[];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
            .then((urls) => {
                setFormData({
                    ...formData,
                    imageUrls: formData.imageUrls.concat(urls)
                })
                setImageUploadError(false);
                setUploading(false);
            })
            .catch((err)=>{
                setImageUploadError('Image upload failed (2 mb max per image)');
                setUploading(false);
                console.log(err)
            })
    }else {
        setImageUploadError('You can only upload 6 images per listing')
        setUploading(false)
    }
    }
            
    const storeImage = async (file)=> {
            try {
                // CLOUDINARY INFO
                const cloudName = "dv8q3oyfj";
                const uploadPreset = "listing_preset";
                const fData = new FormData();
                fData.append('file', file);
                fData.append("upload_preset", uploadPreset);
                const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
                const res =  await fetch(url, {
                    method: 'POST',
                    body: fData
                })
                const data = await res.json();
                console.log(data.secure_url)
                return data.secure_url;
            } catch (error) {
                console.log(error)
            }
        
    }
    const handleDeleteImage = (index)=> {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i)=> i !== index),
        })
    }
    const handleChange = (e)=> {
        if(e.target.id === 'rent' || e.target.id === 'sale'){
            setFormData({
                ...formData,
                type: e.target.id,
            })
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            })
            
        }

        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            })
            
        }
        
    }
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1)
            return setError('You must upload at least one image');
            if (+formData.regularPrice < +formData.discountPrice)
            return setError('Discount price must be lower than regular price');
            setLoading(true);
            setError(false);
            const res = await fetch(apiUrl(`/api/listing/update/${params.listingId}`), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:   JSON.stringify({
                    ...formData,
                })
            })
            const data = await res.json();
            if(data.sucess === false){
                setError(data.message);
            }
            setLoading(false);
            setError(false);
            navigate(`/listing/${data._id}`)
            // console.log(data);
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    }
return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-4' onSubmit={handleUpdate}>
        <div className='flex flex-col gap-4 flex-1'>
            <input
                type='text'
                placeholder='Name'
                className='border p-3 rounded-lg'
                id='name'
                maxLength='62'
                minLength='5'
                required
                onChange={handleChange}
                value={formData.name}
            />
            <textarea
                type='text'
                placeholder='Description'
                className='border p-3 rounded-lg'
                id='description'
                required
                onChange={handleChange}
                value={formData.description}
            />
            <input
                type='text'
                placeholder='Address'
                className='border p-3 rounded-lg'
                id='address'
                required
                onChange={handleChange}
                value={formData.address}
            />
            <div className='flex gap-6 flex-wrap'>
                <div className='flex gap-2'>
                    <input type='checkbox' id='sale' className='w-5' 
                        onChange={handleChange} checked={formData.type === 'sale'}/>
                    <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='rent' className='w-5' 
                        onChange={handleChange} checked={formData.type === 'rent'} />
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='parking' className='w-5'
                        onChange={handleChange}
                        checked={formData.parking} />
                    <span>Parking spot</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='furnished' className='w-5'
                        onChange={handleChange}
                        checked={formData.furnished} />
                    <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='offer' className='w-5'
                        onChange={handleChange}
                        checked={formData.offer} />
                    <span>Offer</span>
                </div>
            </div>
            <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
                <input
                    type='number'
                    id='bedrooms'
                    min='1'
                    max='10'
                    required
                    className='p-3 border border-gray-300 rounded-lg'
                    onChange={handleChange}
                    value={formData.bedrooms}
                />
                <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
                <input
                    type='number'
                    id='bathrooms'
                    min='1'
                    max='10'
                    required
                    className='p-3 border border-gray-300 rounded-lg'
                    onChange={handleChange}
                    value={formData.bathrooms}
                />
                <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
                <input
                    type='number'
                    id='regularPrice'
                    min='50'
                    max='10000000'
                    required
                    className='p-3 border border-gray-300 rounded-lg'
                    onChange={handleChange}
                    value={formData.regularPrice}
                />
                <div className='flex flex-col items-center'>
                    <p>Regular price</p>
                    {formData.type === 'rent' && 
                    <span className='text-xs'>($ / month)</span>}
                </div>
            </div>
            {formData.offer && 
            
            
            <div className='flex items-center gap-2'>
                <input
                    type='number'
                    id='discountPrice'
                    min='0'
                    max='10000000'
                    required
                    className='p-3 border border-gray-300 rounded-lg'
                    onChange={handleChange}
                    value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                    <p>Discounted price</p>
                    {formData.type === 'rent' && 
                    <span className='text-xs'>($ / month)</span>}
                </div>
            </div>
                }
            </div>
        </div>

        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>
                Images:
            <span className='font-normal text-gray-600 ml-2'>
                The first image will be the cover (max 6)
            </span>
            </p>
            <div className='flex gap-4'>
            <input
                className='p-3 border border-gray-300 rounded w-full'
                type='file'
                id='images'
                accept='image/*'
                multiple
                onChange={(e)=>setFiles(e.target.files)}
            />
            <button
                type='button'
                disabled={uploading} 
                onClick={handleImageSubmit}
                className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            </div>
            <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
                <div
                key={url}
                className='flex justify-between p-3 border items-center'
                >
                <img
                    src={url}
                    alt='listing image'
                    className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                    onClick={() => handleDeleteImage(index)}
                    type='button'
                    className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                    Delete
                </button>
                </div>
            ))}
            <p className='text-red-700 text-sm'></p>
            <button 
                disabled={uploading}
                className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80' type='submit'
            >
                {loading ? 'Creating...' : 'Update listing'}
            </button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
        </form>
    </main>
    )
}

export default UpdateListing;