# VoiceMemo - PWA Voice Memo App

A beautiful, production-ready Progressive Web App for recording, transcribing, and saving voice memos with cloud sync via Firebase.

## Features

### Core Features
- **Voice Recording**: Tap the circular record button to start/stop recording
- **Real-time Transcription**: Uses Web Speech API for Italian (it-IT) with English fallback
- **Cloud Sync**: All memos automatically saved to Firestore with per-user organization
- **Auto-generated Titles**: First sentence or first 50 characters become the memo title
- **Full-text Search**: Easy access to all your memos, sorted by newest first
- **Download as Text**: Export individual memos as .txt files
- **Delete with Confirmation**: Safe deletion with confirmation modal
- **User Authentication**: Google Sign-in via Firebase Auth

### PWA Features
- **Offline Support**: Service Worker caches the app shell for offline access
- **Installable**: Add to home screen on iOS and Android
- **App-like Experience**: Standalone mode with custom status bar styling
- **Safe Area Support**: Proper handling of notches and home indicators on iPhone
- **Responsive Design**: Optimized for iPhone (375px) to desktop (1920px+)
- **Dark Theme**: Beautiful dark theme with warm orange accents

### Design Highlights
- **Modern Minimal Design**: Clean, spacious interface with dark theme
- **Animated Record Button**: Pulsing animation with smooth transitions
- **Real-time Transcription Display**: See your words appear as you speak
- **Recording Timer**: Duration display with MM:SS format
- **Smooth Animations**: Transitions, modals, and toast notifications
- **Safe Area Insets**: Proper handling of iPhone notches and home indicators

## Setup Instructions

### 1. Firebase Configuration

First, create a Firebase project:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Google Sign-in authentication
4. Create a Firestore database with these rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/memos/{memoId} {
      allow create, read, update, delete: if request.auth.uid == uid;
    }
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

5. Copy your Firebase config and replace placeholders in `index.html`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 2. Deployment

#### Option A: Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select your project
# Deploy the VoiceMemo folder
firebase deploy
```

#### Option B: Any Static Host
Deploy these files to any static hosting (Vercel, Netlify, GitHub Pages, etc.):
- `index.html`
- `manifest.json`
- `sw.js`

### 3. Mobile Installation

#### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Name it "VoiceMemo" and tap Add

#### Android (Chrome)
1. Open the app in Chrome
2. Tap the three dots menu
3. Select "Install app" or "Add to Home Screen"

## File Structure

```
VoiceMemo/
âââ index.html          # Complete app (HTML + CSS + JS)
âââ manifest.json       # PWA manifest
âââ sw.js              # Service Worker for offline support
âââ README.md          # This file
```

## Technology Stack

- **HTML5**: Semantic markup, meta tags for PWA
- **CSS3**: CSS Variables, Grid, Flexbox, Animations, Backdrop filters
- **JavaScript (Vanilla)**: No frameworks, ~900 lines
- **Web APIs**:
  - Speech Recognition API (webkitSpeechRecognition)
  - Web Storage API
  - Service Worker API
  - Fetch API
- **Firebase**:
  - Authentication (Google Sign-in)
  - Firestore (Real-time database)
  - Hosting (optional)

## API References

### Web Speech API
- Supports 'it-IT' (Italian) and 'en-US' (English fallback)
- Continuous recognition for long recordings
- Interim results for real-time display

### Firestore Data Structure
```
users/
  {uid}/
    memos/
      {memoId}/
        title: string
        text: string
        timestamp: date
        duration: string
        createdAt: timestamp
```

## Browser Support

### Desktop
- Chrome 25+
- Firefox 25+ (with limited speech recognition)
- Safari 14.1+
- Edge 15+

### Mobile
- iOS Safari 14.5+
- Android Chrome 25+
- Samsung Internet 4+

## Known Limitations

1. **Speech Recognition**: Not all browsers support speech recognition. Graceful fallback provided.
2. **Offline Sync**: Memos recorded offline are not saved. Network required.
3. **Audio Storage**: Transcription text only (no audio files stored for privacy).
4. **Language**: UI in Italian, speech recognition defaults to Italian.

## Customization

### Change Primary Color
Edit the CSS variable in `index.html`:
```css
:root {
  --primary-color: #FF6B35;  /* Change this */
  --secondary-color: #F7931E;
  --accent-color: #FDB750;
}
```

### Change Language
Modify these lines in the JavaScript:
```javascript
recognition.lang = 'it-IT';  // Change language code
// And update all UI text strings
```

### Add Additional Features
The codebase is modular and commented. Main sections:
- Authentication (lines 700-800)
- Speech Recognition (lines 830-920)
- Firestore Operations (lines 1000-1100)
- UI Utilities (lines 1200-1300)

## Performance

- **Initial Load**: ~45KB (index.html with all CSS/JS embedded)
- **Service Worker Caching**: First load cached for offline use
- **Firebase SDK**: Lazy loaded on first use (~200KB)
- **Real-time Sync**: Firestore listeners with automatic updates

## Privacy & Security

- **No Audio Storage**: Only transcription text is saved
- **User-scoped Data**: Each user can only access their own memos
- **Secure Authentication**: Google Sign-in with OAuth 2.0
- **Firestore Rules**: Enforced server-side access control
- **HTTPS Only**: All Firebase services require HTTPS

## Troubleshooting

### Speech Recognition Not Working
- Check browser support (Chrome/Safari/Edge recommended)
- Enable microphone permissions
- Check that HTTPS is being used (required for Speech API)

### Firebase Errors
- Verify Firebase config is correct
- Check Firestore rules allow your user
- Ensure Google Sign-in is enabled in Firebase Console

### Memos Not Syncing
- Check network connection
- Verify Firestore is accessible
- Check browser console for errors

### PWA Installation Not Available
- Must be served over HTTPS
- manifest.json must be valid
- Service Worker must be registered

## Performance Tips

1. **For Slow Networks**: Service Worker caches the app shell automatically
2. **For Mobile**: Browser caches Firebase responses automatically
3. **Reduce Bundle Size**: Remove unused Firebase SDKs if needed

## Future Enhancements

- [ ] Local storage as backup when offline
- [ ] Audio file storage with compression
- [ ] Multi-language support in UI
- [ ] Voice memos sharing via links
- [ ] Search and filtering
- [ ] Bulk operations (delete, export)
- [ ] Dark/Light theme toggle
- [ ] Voice commands for hands-free operation

## License

MIT License - Feel free to use and modify for your needs.

## Support

For issues or questions, check the browser console (F12) for detailed error messages.

---

Built with love as a production-ready PWA. Enjoy recording your memos!
