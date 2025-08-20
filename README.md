# 🎨 FreePixz - Premium Wallpaper Experience  

<p align="center">
  <a href="https://wallpaper-app-topaz.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-3393FF?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/Ad-cmd-1976/FreePixz" target="_blank">
    <img src="https://img.shields.io/badge/View%20Code-181717?style=for-the-badge&logo=github&logoColor=white" alt="View Code" />
  </a>
</p>  

FreePixz is a full-stack wallpaper application built with the MERN stack. It allows users to browse, search, and download wallpapers while offering subscription-based premium access with exclusive sections and discounts.  

![Project Screenshot](https://github.com/user-attachments/assets/3480f435-38fc-457b-ba13-53d8bba807a6)  

---  

## ✨ Features  

- **Wallpaper Gallery:** Browse and explore high-quality wallpapers.  
- **Smart Search:** Search wallpapers by title and tags.  
- **Secure Authentication:** Custom login system using JWT.  
- **Subscription Model:** Plus users unlock exclusive wallpapers & get premium discounts.  
- **Safe Image Downloads:** Images are streamed securely via backend.  
- **Responsive Design:** Optimized UI across all devices.  
- **Cloud Image Management:** Integrated with Cloudinary (migrating to AWS S3).  

---  

## 🛠️ Tech Stack  

- **Frontend:** React, Zustand, Axios, TailwindCSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Tokens)  
- **Storage:** Cloudinary (AWS S3 planned)  
- **Deployment:** Vercel (Frontend), Render (Backend)

## 🔮 Future Enhancements  

- **Shift to AWS S3 + BunnyCDN** → Faster, scalable storage & caching solution.  
- **Admin Analytics Dashboard** → Track popular wallpapers, downloads, and subscription insights.  
- **Multi-Resolution Downloads** → Offer HD, 4K, and mobile-optimized versions.  
- **AI-Powered Recommendations** → Suggest wallpapers based on user preferences.  
- **User Collections & Favorites** → Allow users to save, like, and organize wallpapers.  

---  

## ⚙️ Setup and Installation  

To set up this project locally, follow these steps:  

```sh
# 1. Clone the repository into your desired directory
git clone https://github.com/Ad-cmd-1976/FreePixz.git

# 2. Navigate into the project's root folder
cd Wallpaper-App

# 3. Create a .env file in the backend directory.
    # Add the following environment variables:

        PORT=8080
        MONGO_URI=your_mongodb_uri

        ACCESS_TOKEN_SECRET=your_access_token_secret
        REFRESH_TOKEN_SECRET=your_refresh_token_secret

        CLOUDINARY_CLOUD_NAME=your_cloudinary_name
        CLOUDINARY_API_KEY=your_cloudinary_api
        CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# 4. Run the application
    # Start the backend
      cd backend
      node server.js
    # Start the frontend
      cd frontend
      npm run dev
# 5. Access the application at localhost:5173
