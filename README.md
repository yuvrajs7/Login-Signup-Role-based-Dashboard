git clone https://github.com/your-username/your-repo.git
cd your-repo
cd Back
npm install
cd ../Frontend
npm install
For Backend use node server.js to run the server
For Frontend use npm run dev to start the web page
Make sure to do this after creating your database and cloudinary image database and connecting them to your backend by creating a env file with the following secrets
PORT=5000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
