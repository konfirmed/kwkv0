"use client";
import React, { useEffect } from 'react';

const GoogleSignInButton: React.FC = () => {
  useEffect(() => {
    (window as any).onSignIn = () => {
      // You can handle the sign-in success here
      console.log('Signed in successfully');
    };
  }, []);

  return (
    <div className="g-signin2" data-onsuccess="onSignIn"></div>
  );
};

export default GoogleSignInButton;