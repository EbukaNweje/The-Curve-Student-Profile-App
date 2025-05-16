import React from 'react';
import Logo from '../assets/logo.png';
import Rectangle1 from '../assets/Rectangle1.png';
import Rectangle2 from '../assets/Rectangle2.png';
import Frame from '../assets/Frame3.png';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {UserData} from "../global/features";
import { useDispatch } from 'react-redux';



const CreatePost = () => {
    const stacks = ['Frontend', 'Backend', 'Product Design'];
    const nav = useNavigate();
    const dispatch = useDispatch();
  
    const [displayProfile, setDisplayProfile] = React.useState();
    const [emailVerified, setEmailVerified] = React.useState(false);
    const [emailchecking, setEmailChecking] = React.useState(false);
    const [data, setData] = React.useState({
      name: '',
      email: '',
      dob: '',
      stack: '',
      image: '',
    });
  
    const [disabled, setDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const debounceTimeout = React.useRef(null);
    const [lastVerifiedEmail, setLastVerifiedEmail] = React.useState('');
  
    // Enable/Disable button when fields are valid
    React.useEffect(() => {
      const isValid = validate(false);
      setDisabled(!isValid);
    }, [data, emailVerified]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
  
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
  
      if (name === 'email') {
        if (value === lastVerifiedEmail) {
          return; // Email already verified
        }
  
        setEmailVerified(false);
        setLastVerifiedEmail(''); // ✅ Clear tracked email if it changed
        setEmailChecking(true);
  
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }
  
        debounceTimeout.current = setTimeout(() => {
          if (!value.trim()) {
            setEmailChecking(false);
            return;
          }
  
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            setEmailChecking(false);
            toast.error('Invalid email address');
            return;
          }
  
          verifyEmail(value);
        }, 800);
      }
    };
  
    const handleProfile = (e) => {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
    
      setData({
        ...data,
        image: file, // <-- store the file object
      });
    
      setDisplayProfile(url); // for preview only
    };
    
  
    const verifyEmail = async (emailToVerify) => {
      try {
        const response = await axios.get(
          `https://tca-student-profile-backend.vercel.app/api/v1/verify-student/${emailToVerify}`
        );
        setEmailVerified(true);
        setLastVerifiedEmail(emailToVerify); // ✅ Track verified email
      } catch (error) {
        setEmailVerified(false);
        toast.error(error?.response?.data?.message || 'Email verification failed');
      } finally {
        setEmailChecking(false);
      }
    };
  
    const validate = (showToasts = true) => {
      if (!data.name) {
        showToasts && toast.error('Full name is required');
        return false;
      }
      if (!data.email) {
        showToasts && toast.error('Email address is required');
        return false;
      }
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
        showToasts && toast.error('Invalid email address');
        return false;
      }
      if (!emailVerified) {
        showToasts && toast.error('Please verify your email first');
        return false;
      }
      if (!data.stack) {
        showToasts && toast.error('Select a stack');
        return false;
      }
      if (!stacks.includes(data.stack)) {
        showToasts && toast.error('Invalid stack');
        return false;
      }
      if (!data.dob) {
        showToasts && toast.error('Date of birth is required');
        return false;
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data.dob)) {
        showToasts && toast.error('Invalid date format (yyyy-mm-dd)');
        return false;
      }
      if (data.dob > new Date().toISOString().split('T')[0]) {
        showToasts && toast.error('Date of birth cannot be in the future');
        return false;
      }
      if (!data.image) {
        showToasts && toast.error('Profile picture is required');
        return false;
      }
  
      return true;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!validate(true)) return;
  
      const formDatas = new FormData();
      formDatas.append('name', data.name);
      formDatas.append('email', data.email);
      formDatas.append('dob', data.dob);
      formDatas.append('stack', data.stack);
      formDatas.append('image', data.image);
  
      try {
        setLoading(true);
        const response = await axios.patch(
          'https://tca-student-profile-backend.vercel.app/api/v1/update-profile',
          formDatas
        );
        toast.success('Profile created successfully!');
        dispatch(UserData(response.data.student))
        nav('/student-profile')
        console.log(response.data.student);
        // ✅ Reset form and keep email if it's the same
        setDisplayProfile(null);
        setLastVerifiedEmail(data.email);
        setEmailVerified(true);
  
        setData({
          name: '',
          email: data.email,
          dob: '',
          stack: '',
          image: '',
        });
  
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to create profile');
        setEmailVerified(false);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-white">
      {/* Left Panel */}
      <div className="w-full md:w-[40%] h-[40vh] md:h-screen bg-white flex flex-col">
        <img src={Rectangle1} alt="Rectangle1" className="w-full h-[25%] object-cover" />
        <div className="flex-grow flex items-center justify-center">
          <img src={Logo} alt="Logo" className="w-[40%] object-contain" />
        </div>
        <img src={Rectangle2} alt="Rectangle2" className="w-full h-[25%] object-cover" />
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-[60%] h-full flex flex-col items-center justify-center px-6 py-10 space-y-12">
        <h4 className="text-2xl font-bold">Create Student Profile</h4>
        <div className="flex flex-col items-center w-full max-w-md space-y-8">
          <div className="relative">
            <div className="w-36 h-36 bg-yellow-100 rounded-full flex items-center justify-center border-2 border-yellow-400">
              {displayProfile ? (
                <img src={displayProfile} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <img src={Frame} alt="Frame" className="w-full h-full object-cover rounded-full" />
              )}
            </div>
            <label
              htmlFor="profile"
              className="absolute bottom-2 right-2 bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold border-2 border-white"
            >
              +
            </label>
            <input
              type="file"
              className="hidden"
              onChange={handleProfile}
              id="profile"
            />
          </div>

          {/* Inputs */}
          <div className="w-full space-y-4">
            <div>
              <label className="text-sm font-medium">Full name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                name="name"
                value={data.name}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <label className="text-sm font-medium">Email address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                name="email"
                value={data.email}
                onChange={handleChange}
              />
              <nav className="absolute top-8.5 right-2">
                {data.email ? (
                  emailchecking ? (
                    <ClipLoader size={15} />
                  ) : emailVerified ? (
                    <IoMdCheckmarkCircle size={20} color="green" />
                  ) : (
                    <IoMdCloseCircle size={20} color="red" />
                  )
                ) : null}
              </nav>
            </div>

            <div>
              <label className="text-sm font-medium">Stack</label>
              <select
                name="stack"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={data.stack}
                onChange={handleChange}
              >
                <option value="">Select Stack</option>
                {stacks.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Date of birth</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                name="dob"
                value={data.dob}
                onChange={handleChange}
              />
            </div>

            {/* Create Button */}
            <div className="pt-6">
              <button
                className="w-full bg-yellow-400 text-black font-semibold py-2 px-4 rounded-md hover:bg-yellow-500 transition disabled:bg-amber-100
                disabled:text-gray-400"
                disabled={disabled || loading}
                onClick={handleSubmit}
              >
                {loading ? <ClipLoader color="white" size={20} /> : 'Create Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
