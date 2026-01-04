'use client';

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ChatboxWidget() {
  const pathname = usePathname();
  
  // Không hiển thị chatbox ở trang đăng nhập và đăng ký
  const hiddenPaths = ['/DangNhap', '/DangKy'];
  const shouldShowChatbox = !hiddenPaths.includes(pathname);

  useEffect(() => {
    // Thêm CSS responsive cho chatbox
    const style = document.createElement('style');
    style.innerHTML = `
      @media (max-width: 768px) {
        #chatbase-bubble-button {
          bottom: 20px !important;
          right: 20px !important;
          width: 50px !important;
          height: 50px !important;
        }
        #chatbase-bubble-window {
          bottom: 80px !important;
          right: 10px !important;
          left: 10px !important;
          width: calc(100% - 20px) !important;
          max-width: none !important;
          height: 60vh !important;
          max-height: 500px !important;
        }
      }
      @media (max-width: 480px) {
        #chatbase-bubble-button {
          width: 45px !important;
          height: 45px !important;
        }
        #chatbase-bubble-window {
          height: 70vh !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!shouldShowChatbox) {
    return null;
  }

  return (
    <Script
      id="chatbase-widget"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="h7ia1OmeJcpNcdRwaTG6J";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
        `,
      }}
    />
  );
}
