
import { MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const FloatingChatButton = () => {
  const navigate = useNavigate();


  const location = useLocation();

const exactPaths = ['/', '/chatbot'];
const startsWithPaths = ['/auth/'];

const shouldHide =
  exactPaths.includes(location.pathname) ||
  startsWithPaths.some(path => location.pathname.startsWith(path));

if (shouldHide) return null;



  return (
    <button
      onClick={() => navigate('/chatbot')}
      className="fixed bottom-6 right-6 z-50 p-4 bg-orange-900 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};

export default FloatingChatButton;
