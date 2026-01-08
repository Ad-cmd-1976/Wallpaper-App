# 🎨 FreePixz — Premium Wallpaper Platform  

<p align="center">
  <a href="https://wallpaper-api.online" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Website-0A66C2?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Live Website" />
  </a>
  <a href="https://github.com/Ad-cmd-1976/Wallpaper_App" target="_blank">
    <img src="https://img.shields.io/badge/View%20Code-181717?style=for-the-badge&logo=github&logoColor=white" alt="View Code" />
  </a>
</p>  

FreePixz is a **full-stack wallpaper marketplace** built with the MERN stack.  
It allows users to browse, search, and securely download wallpapers while offering a **subscription-based Plus model** with premium discounts and locked content.

The application is **fully self-hosted on a VPS**, solving real-world deployment, authentication, and mobile browser cookie issues.

![Project Screenshot](https://github.com/user-attachments/assets/3480f435-38fc-457b-ba13-53d8bba807a6)

---

## ✨ Features  

- Wallpaper gallery with progressive loading  
- Smart search using title & tag matching  
- Custom JWT authentication with HTTP-only cookies  
- Subscription-based Plus system with discounts  
- Secure backend-controlled image downloads  
- Locked wallpapers with access validation  
- Fully responsive UI (desktop, mobile, tablet)  
- Private image storage using AWS S3  

---

## 🛠️ Tech Stack  

### Frontend
- React  
- Zustand  
- TailwindCSS  
- Axios  
- Lucide-react  

### Backend
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  

### Storage
- AWS S3 (Private Buckets)  

### Deployment
- Hostinger KVM VPS (Ubuntu 22.04 LTS)  
- Nginx (static frontend + reverse proxy)  
- PM2 (Node.js process manager)  

---

## 🔐 Security Highlights  

- No public image URLs  
- Authenticated download verification  
- Cookie-based JWT authentication  
- Backend-controlled file streaming  
- No third-party authentication services  

---

## 🚀 Deployment Architecture  

User Browser
   ↓
Nginx (VPS)
   ├── React Frontend (Static Build)
   └── Node.js API (PM2)
           ↓
        MongoDB
           ↓
         AWS S3

✔️ Frontend & backend hosted on the **same VPS**  
✔️ Solved mobile & tablet cookie restrictions
✔️ Production-ready setup 

---

## 📌 Key Learning Outcomes

- VPS deployment & Linux server management
- Nginx reverse proxy & static serving
- Secure file streaming architecture
- Real-world cookie & CORS debugging
- Scalable MERN application design

---

## ⚙️ Local Setup & Installation  

To set up this project locally, follow these steps:
sh
# 1. Clone the repository into your desired directory
git clone https://github.com/Ad-cmd-1976/FreePixz.git

# 2. Navigate into the project's root folder
cd Wallpaper-App

# 3. Create a .env file in the backend directory.
    # Add the following environment variables:
        PORT=8080
        FRONTEND_URL=your_frontend_url
        NODE_ENV=development
        MONGO_URL=your_mongodb_url

        ACCESS_TOKEN_SECRET=your_access_token
        REFRESH_TOKEN_SECRET=your_refresh_token

        GOOGLE_CALLBACK_URL=your_google_callback_url
        GOOGLE_CLIENT_ID=your_google_client_id
        GOOGLE_CLIENT_SECRET=your_google_client_secret

        AWS_ACCESS_KEY_ID=your_aws_access_key_id
        AWS_SECRET_ACCESS_KEY=your_aws_secret_access
        AWS_REGION=your_aws_region
        AWS_BUCKET_NAME=your_aws_bucket_name

        RAZORPAY_KEY_ID=your_razorpay_key_id
        RAZORPAY_KEY_SECRET=your_razorpay_key_secret

        BREVO_API_KEY=your_brevo_api_key
        EMAIL_FROM=your_brevo_sender_email

# 4. Run the application
    # Start the backend
      cd backend
      node server.js
    # Start the frontend
      cd frontend
      npm run dev
# 5. Access the application at localhost:5173

---
