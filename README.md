# QuickShareQR

QuickShareQR is a modern web application that allows seamless file transfers between PC and mobile devices using QR codes. No app installation or account creation required!

![QuickShareQR Logo](https://via.placeholder.com/1200x630/e0f2fe/0369a1?text=QuickShareQR)

## Features

- **PC to Mobile File Transfer**: Upload files, generate QR codes, and instantly share with mobile devices
- **Mobile to PC File Transfer**: Scan a QR code on PC and send files directly from mobile
- **No App Required**: Works entirely in the web browser on both PC and mobile
- **Secure & Fast**: Files are securely stored in Cloudinary and automatically expire after a set period
- **Responsive Design**: Fully optimized for all screen sizes
- **Real-time Updates**: See files appear instantly as they're uploaded

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.io
- **File Storage**: Cloudinary
- **QR Codes**: QRCode React

## Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Cloudinary account

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FILE_EXPIRY_MINUTES=10
CLIENT_URL=http://localhost:3000
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/quickshareqr.git
cd quickshareqr
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

### Sending Files from PC to Mobile

1. Click "Export to Mobile" on the home page
2. Drop a file or click to select a file
3. Once uploaded, a QR code will be generated
4. Scan the QR code with your mobile device
5. The file will automatically download on your mobile device

### Sending Files from Mobile to PC

1. Click "Import from Mobile" on the home page
2. Click "Generate QR Code" to create a unique session
3. Scan the QR code with your mobile device
4. Select files on your mobile device to upload
5. Files will appear automatically on your PC

## Project Structure

```
quickshareqr/
├── backend/             # Express.js backend
│   ├── uploads/         # Temporary file storage
│   ├── server.js        # Main server file
│   └── ...
├── frontend/            # React.js frontend
│   ├── public/          # Public assets
│   ├── src/             # Source files
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   └── ...
└── README.md            # Project documentation
```

## Future Enhancements

- Add file encryption
- Support for folder uploads
- Password protection for shared files
- Direct device-to-device transfer option
- Progressive Web App (PWA) support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Cloudinary](https://cloudinary.com/) for file storage
- [QRCode React](https://github.com/zpao/qrcode.react) for QR code generation
- [Socket.io](https://socket.io/) for real-time communication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations 