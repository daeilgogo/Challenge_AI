import React, { useEffect, useRef } from 'react';

function MyComponent() {
  const googleTranslateRef = useRef(null);

  useEffect(() => {
    if (googleTranslateRef.current) {
      new window.google.translate.TranslateElement({
        pageLanguage: 'ko',
        layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL
      }, googleTranslateRef.current);
    }
  }, []);

  return (
    <div className='ml-5 w-5/6'>
      <div ref={googleTranslateRef} />
    </div>
  );
}
export default MyComponent
