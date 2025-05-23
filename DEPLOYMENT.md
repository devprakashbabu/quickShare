# Deployment Instructions

## Frontend Deployment (Vercel)

1. Push your frontend code to GitHub:
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin <your-frontend-repo-url>
git push -u origin main
```

2. Deploy on Vercel:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Create React App
     - Root Directory: `/` (root of the frontend repository)
     - Build Command: `npm run build`
     - Output Directory: `build`
   
3. Set up environment variables in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://quickshareqr-backend.onrender.com
   REACT_APP_SOCKET_URL=https://quickshareqr-backend.onrender.com
   ```

## Backend Deployment (Render)

1. Push your backend code to a separate repository:
```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git remote add origin <your-backend-repo-url>
git push -u origin main
```

2. Deploy on Render:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" and select "Web Service"
   - Connect your backend GitHub repository
   - Configure the service:
     - Name: quickshareqr-backend
     - Environment: Node
     - Region: Singapore (or your preferred region)
     - Branch: main
     - Root Directory: `/` (root of the backend repository)
     - Build Command: `npm install`
     - Start Command: `node server.js`

3. The environment variables will be automatically configured from your `render.yaml` file, but you can modify them in the Render dashboard if needed:
   ```
   PORT=5000
   MYSQL_URL=your-railway-mysql-url
   MYSQL_DATABASE=railway
   DB_HOST=your-railway-host
   DB_USER=your-railway-user
   DB_PASSWORD=your-railway-password
   DB_NAME=railway
   DB_PORT=your-railway-port
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   CLIENT_URL=https://quickshareqr.vercel.app
   ```

## Project Structure for Deployment

```
frontend/ (separate repository for Vercel)
├── public/
├── src/
├── package.json
├── vercel.json
└── .env

backend/ (separate repository for Render)
├── config/
├── models/
├── uploads/
├── package.json
├── server.js
└── render.yaml
```

## Important Notes

1. Separate Repositories:
   - Frontend and backend should be in separate repositories
   - Each platform (Vercel and Render) will use its respective repository

2. CORS Configuration:
   - The backend is configured to accept requests from the Vercel frontend domain
   - Make sure the `CLIENT_URL` environment variable in the backend matches your Vercel deployment URL

3. Database Configuration:
   - Ensure your Railway MySQL database is properly configured
   - Use the external URL for the database connection (not the internal Railway URL)

4. File Storage:
   - Cloudinary is used for file storage
   - Verify your Cloudinary credentials are correct

## Testing the Deployment

1. Test the frontend:
   - Visit your Vercel deployment URL
   - Verify all pages load correctly
   - Check for any console errors

2. Test the backend:
   - Try uploading files
   - Verify real-time updates work
   - Check database connections
   - Monitor file storage in Cloudinary

3. Test mobile features:
   - Scan QR codes
   - Upload files from mobile
   - Download files to mobile

## Troubleshooting

1. If you encounter CORS issues:
   - Verify the `CLIENT_URL` in backend environment variables
   - Check the CORS configuration in `backend/server.js`

2. If database connection fails:
   - Verify Railway database credentials
   - Check if the database is accessible from Render
   - Use the external connection URL

3. If file uploads fail:
   - Check Cloudinary credentials
   - Verify temporary upload directory permissions
   - Monitor upload size limits 