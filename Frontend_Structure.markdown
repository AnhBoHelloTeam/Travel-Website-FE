# Cấu trúc dự án Frontend - Phần mềm Quản lý Bán Vé Xe

## Tổng quan
Dự án frontend được xây dựng với **React**, sử dụng **TailwindCSS** cho giao diện, **React Router** cho định tuyến, **i18next** cho đa ngôn ngữ (Tiếng Việt, Tiếng Anh), và **Socket.IO-client** cho chat real-time. Giao diện được thiết kế responsive, tối ưu cho desktop, tablet, mobile, và tuân thủ WCAG cơ bản (ARIA cho sơ đồ ghế). Frontend sẽ tích hợp với backend qua các API RESTful và Socket.IO.

## Cấu trúc thư mục
```
TicketBooking_Frontend/
├── public/
│   ├── index.html             # Main HTML file
│   ├── favicon.ico            # Favicon
│   └── manifest.json          # Web app manifest
├── src/
│   ├── assets/
│   │   ├── images/            # Logo, icons
│   │   └── translations/      # JSON files for i18next (vi.json, en.json)
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.js      # Thanh điều hướng
│   │   │   ├── Footer.js      # Footer
│   │   │   └── Loading.js     # Spinner khi tải dữ liệu
│   │   ├── SearchForm.js      # Form tìm kiếm vé
│   │   ├── SeatMap.js         # Sơ đồ ghế với react-seatmap
│   │   ├── TicketCard.js      # Card hiển thị vé
│   │   ├── ChatBox.js         # Chatbox real-time
│   │   ├── Profile.js         # Trang profile người dùng
│   │   └── BusinessDashboard/ # Dashboard nhà xe
│   │       ├── ScheduleList.js  # Danh sách lịch trình
│   │       ├── BookingList.js   # Danh sách đặt vé
│   │       └── DisputeForm.js   # Form xử lý tranh chấp
│   ├── pages/
│   │   ├── Home.js            # Trang chủ với form tìm kiếm
│   │   ├── Login.js           # Trang đăng nhập
│   │   ├── Register.js        # Trang đăng ký
│   │   ├── Booking.js         # Trang chọn ghế và đặt vé
│   │   ├── Payment.js         # Trang thanh toán
│   │   ├── Profile.js         # Trang quản lý tài khoản
│   │   ├── BusinessRegister.js # Trang đăng ký nhà xe
│   │   └── BusinessDashboard.js # Trang dashboard nhà xe
│   ├── services/
│   │   ├── api.js             # Axios instance cho API calls
│   │   ├── socket.js          # Socket.IO client cho chat
│   │   └── auth.js            # Xử lý đăng nhập/đăng xuất
│   ├── context/
│   │   └── AuthContext.js     # Context cho quản lý trạng thái đăng nhập
│   ├── hooks/
│   │   ├── useFetch.js        # Custom hook cho API calls
│   │   └── useSocket.js       # Custom hook cho Socket.IO
│   ├── styles/
│   │   └── tailwind.css       # TailwindCSS custom styles
│   ├── tests/
│   │   ├── SearchForm.test.js # Unit tests cho form tìm kiếm
│   │   ├── SeatMap.test.js    # Unit tests cho sơ đồ ghế
│   │   └── setup.js           # Cấu hình test
│   ├── App.js                 # Main app component
│   ├── index.js               # Entry point
│   └── i18n.js               # Cấu hình i18next
├── package.json               # Dependencies & scripts
├── tailwind.config.js         # TailwindCSS configuration
├── jest.config.js             # Test configuration
├── .eslintrc.js               # Code linting rules
├── Dockerfile                 # Docker configuration
├── env.example                # Environment variables template
└── README.md                 # Documentation
```

## Tính năng chính
1. **Tìm kiếm & Đặt vé**
   - Form tìm kiếm với autocomplete (điểm đi/đến) và bộ lọc (giá, loại xe).
   - Sơ đồ ghế tương tác với trạng thái (available/booked/locked).
   - Form nhập thông tin khách hàng và tích hợp thanh toán (Momo/VNPAY).

2. **Quản lý tài khoản**
   - Đăng nhập/đăng ký (email/mật khẩu, Google OAuth).
   - Trang profile: cập nhật thông tin, xem lịch sử vé.

3. **Chat real-time**
   - Chatbox hiển thị trạng thái online/offline của nhân viên hỗ trợ.
   - Lưu lịch sử chat và hỗ trợ phản hồi nhanh.

4. **Dashboard nhà xe**
   - Quản lý lịch trình, danh sách đặt vé, trạng thái ghế.
   - Form đăng ký nhà xe và xử lý tranh chấp.

5. **Giao diện & Hiệu năng**
   - Responsive design với TailwindCSS.
   - Lazy loading cho sơ đồ ghế và danh sách lịch trình.
   - Đa ngôn ngữ với i18next.
   - Accessibility: ARIA labels cho sơ đồ ghế.

## Cài đặt và chạy dự án
### 1. Cài đặt dependencies
```bash
cd TicketBooking_Frontend
npm install
```

### 2. Cấu hình environment
```bash
cp env.example .env
# Chỉnh sửa file .env với thông tin API backend
```

**Ví dụ file .env:**
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_SOCKET_URL=http://localhost:3000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Chạy ứng dụng
```bash
# Development
npm start

# Production (build)
npm run build
```

### 4. Testing
```bash
# Chạy tests
npm test

# Test với coverage
npm run test:coverage
```

## File index.html
```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quản lý Bán Vé Xe</title>
  <script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

## File App.js
```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import BusinessRegister from './pages/BusinessRegister';
import BusinessDashboard from './pages/BusinessDashboard';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking/:scheduleId" element={<Booking />} />
            <Route path="/payment/:ticketId" element={<Payment />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/business/register" element={<BusinessRegister />} />
            <Route path="/business/dashboard" element={<BusinessDashboard />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;
```

## File SearchForm.js
```javascript
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../hooks/useFetch';

function SearchForm() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    vehicleType: ''
  });
  const { data, loading, error } = useFetch('/api/tickets/search', searchParams);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gọi API tìm kiếm
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded">
      <div className="mb-4">
        <label htmlFor="from" className="block text-sm font-medium text-gray-700">
          {t('search.from')}
        </label>
        <input
          type="text"
          id="from"
          value={searchParams.from}
          onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          aria-label={t('search.from')}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="to" className="block text-sm font-medium text-gray-700">
          {t('search.to')}
        </label>
        <input
          type="text"
          id="to"
          value={searchParams.to}
          onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          aria-label={t('search.to')}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          {t('search.date')}
        </label>
        <input
          type="date"
          id="date"
          value={searchParams.date}
          onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          aria-label={t('search.date')}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? t('search.loading') : t('search.submit')}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}

export default SearchForm;
```

## File ChatBox.js
```javascript
import { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useTranslation } from 'react-i18next';

function ChatBox() {
  const { t } = useTranslation();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
    return () => socket?.off('message');
  }, [socket]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('message', { content: input, sender: 'user' });
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg p-4">
      <div className="h-64 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <p className="inline-block p-2 rounded bg-gray-100">{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border-gray-300 rounded-l-md"
          aria-label={t('chat.input')}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white p-2 rounded-r-md"
        >
          {t('chat.send')}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
```

## File package.json
```json
{
  "name": "ticket-booking-frontend",
  "version": "1.0.0",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "jest",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "react-i18next": "^12.0.0",
    "i18next": "^22.0.0",
    "axios": "^1.2.0",
    "socket.io-client": "^4.5.0",
    "react-seatmap": "^1.0.0",
    "tailwindcss": "^3.2.0"
  },
  "devDependencies": {
    "react-scripts": "^5.0.0",
    "jest": "^29.3.1",
    "@testing-library/react": "^13.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "eslint": "^8.30.0"
  }
}
```

## File i18n.js
```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './assets/translations/vi.json';
import en from './assets/translations/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en }
    },
    lng: 'vi',
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

## File tailwind.config.js
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: []
};
```

## Lưu ý
- **Responsive Design**: TailwindCSS được sử dụng để đảm bảo giao diện hoạt động tốt trên desktop, tablet, mobile.
- **Accessibility**: Sơ đồ ghế sử dụng ARIA labels, đảm bảo tuân thủ WCAG cơ bản.
- **Hiệu năng**: Lazy loading được áp dụng cho danh sách lịch trình và sơ đồ ghế để tối ưu thời gian tải.
- **Tích hợp API**: Sử dụng Axios cho các API calls, Socket.IO-client cho chat real-time.
- **Đa ngôn ngữ**: i18next hỗ trợ Tiếng Việt và Tiếng Anh, dễ mở rộng thêm ngôn ngữ khác.

Frontend đã sẵn sàng để tích hợp với backend. Các components được thiết kế để tái sử dụng và tương thích với API endpoints đã định nghĩa.