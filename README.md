# Law Large - Frontend/Backend Separation

This project is a migration of the law_large application from Glitch to Render with separated frontend and backend.

## Architecture

### Backend (this directory)
- **Framework**: Express.js
- **Deployment**: Render
- **Purpose**: REST API server

### Frontend 
- **Framework**: Knockout.js (static files)
- **Deployment**: Any web hosting or local
- **Purpose**: User interface

## Setup Instructions

### 1. Copy Original Files
Copy your original law_large files into this workspace:
- Frontend files → `public/` directory
- Server logic → integrate into `server.js`

### 2. Backend Development
```bash
npm install
npm run dev  # Development with nodemon
npm start    # Production
```

### 3. Frontend Development
- Edit files in `public/` directory
- Update API calls to point to backend URL

### 4. Deployment
- Backend: Deploy to Render (like F-count backend)
- Frontend: Upload `public/` files to your website

## Migration Status
- [x] Basic project structure created
- [ ] Original law_large code integrated
- [ ] API endpoints implemented
- [ ] Frontend updated for separation
- [ ] Deployed and tested

## Next Steps
1. Copy original law_large files into this workspace
2. Analyze and separate frontend/backend logic
3. Implement API endpoints
4. Update frontend to use REST API
5. Deploy to Render