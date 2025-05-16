import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import Logo from '../assets/logo.png';
import Frame from '../assets/Frame3.png';
import Bg from '../assets/bg.png';
import './Profile.css'; // Import the CSS file
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { useSelector } from 'react-redux';

const Profile = () => {
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [width, height] = useWindowSize();
  const profileRef = useRef(null);
  const userData = useSelector((state) => state.userInfo);

  console.log(userData)

  const handleDownload = async () => {
    const canvas = await html2canvas(profileRef.current, {
      useCORS: true,
    });
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'profile-card.png';
    link.click();
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
    // nav("/student-profile")
    setShowConfetti(true); // 🎉 trigger confetti
    // Hide after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);

  return (
    <div className="profile-wrapper">
      {showConfetti && <Confetti width={width} height={height} />}
      <div
        ref={profileRef}
        className="profile-card"
        style={{
          backgroundImage: `url(${Bg})`,
        }}
      >
        <img src={Logo} alt="Logo" className="logo" />

       <article className='prfile-image-conainer'>
       <div className="profile-image">
          <img src={userData.imageUrl} alt="Profile" />
        </div>

        <h1 className="profile-name">{userData.name}</h1>
        <p className="profile-cohort">The Curve Africa Cohort {userData.cohort}</p>
        <p className="profile-role">{userData.stack} Trainee</p>

        <div className="social-links">
          <div className="icons">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-linkedin-in"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-twitter"></i>
          </div>
          <p className="handle">@thecurveafrica</p>
        </div>
       </article>
      </div>

      <button onClick={handleDownload} className="download-button">
        Download Profile
      </button>
    </div>
  );
};

export default Profile;
