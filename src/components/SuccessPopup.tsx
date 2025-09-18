import React from 'react';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function SuccessPopup({ 
  isOpen, 
  onClose, 
  title = "Success!", 
  message = "Your todo item is created successfully!" 
}: SuccessPopupProps) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
    >
      {/* Main Popup Container */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}
      >
        {/* Decorative Header */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669, #047857)',
            padding: '24px',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          {/* Floating Sparkles */}
          <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
            <Sparkles size={16} color="rgba(255, 255, 255, 0.6)" />
          </div>
          <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
            <Sparkles size={12} color="rgba(255, 255, 255, 0.6)" />
          </div>
          <div style={{ position: 'absolute', bottom: '16px', left: '32px' }}>
            <Sparkles size={8} color="rgba(255, 255, 255, 0.6)" />
          </div>
          <div style={{ position: 'absolute', bottom: '24px', right: '16px' }}>
            <Sparkles size={12} color="rgba(255, 255, 255, 0.6)" />
          </div>
          
          {/* Success Icon with Animation */}
          <div 
            style={{
              position: 'relative',
              margin: '0 auto 16px',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
              }}
            />
            <div 
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)'
              }}
            >
              <CheckCircle size={48} color="white" style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }} />
            </div>
          </div>
          
          {/* Title */}
          <h3 
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 8px',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}
          >
            {title}
          </h3>
        </div>
        
        {/* Content Section */}
        <div style={{ padding: '32px', textAlign: 'center' }}>
          {/* Message */}
          <p 
            style={{
              color: '#374151',
              marginBottom: '32px',
              fontSize: '18px',
              lineHeight: '1.6'
            }}
          >
            {message}
          </p>
          
          {/* Success Checkmark Animation */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'relative' }}>
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div 
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CheckCircle size={32} color="white" />
                </div>
              </div>
              {/* Ripple Effect */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '2px solid #86efac',
                  animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                }}
              />
            </div>
          </div>
          
          {/* Action Button */}
          <Button 
            onClick={onClose}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #059669, #047857, #065f46)',
              color: 'white',
              fontWeight: '600',
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Continue
              <ArrowRight size={20} />
            </span>
          </Button>
          
          {/* Additional Success Message */}
          <p 
            style={{
              fontSize: '14px',
              color: '#6b7280',
              marginTop: '16px',
              margin: '16px 0 0'
            }}
          >
            Your todo has been saved and is now visible in your dashboard
          </p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
