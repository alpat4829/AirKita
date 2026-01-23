// Utility function to load Google Maps script
export const loadGoogleMapsScript = (apiKey) => {
    return new Promise((resolve, reject) => {
        // Check if already loaded and working
        if (window.google && window.google.maps && window.google.maps.Map) {
            console.log('Google Maps already loaded and ready');
            resolve(window.google.maps);
            return;
        }

        // Clean up any existing broken scripts
        const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
        existingScripts.forEach(script => {
            console.log('Removing existing Google Maps script');
            script.remove();
        });
        
        // Clean up window objects
        if (window.google) {
            console.log('Cleaning up existing google object');
            delete window.google;
        }
        if (window.initGoogleMaps) {
            delete window.initGoogleMaps;
        }

        console.log('Loading fresh Google Maps script...');
        
        // Create callback function
        window.initGoogleMaps = () => {
            console.log('Google Maps callback triggered');
            
            // Verify Maps is available
            const checkInterval = setInterval(() => {
                if (window.google && window.google.maps && window.google.maps.Map) {
                    console.log('Google Maps fully initialized');
                    clearInterval(checkInterval);
                    resolve(window.google.maps);
                }
            }, 50);
            
            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                if (!window.google || !window.google.maps || !window.google.maps.Map) {
                    reject(new Error('Google Maps callback triggered but Map constructor still not available'));
                }
            }, 5000);
        };
        
        // Create and load script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
        script.async = true;
        script.defer = true;
        
        script.onerror = (error) => {
            console.error('Failed to load Google Maps script');
            delete window.initGoogleMaps;
            reject(new Error('Failed to load Google Maps script'));
        };
        
        document.head.appendChild(script);
        console.log('Google Maps script added to page');
    });
};

// Format phone number for WhatsApp
export const formatWhatsAppNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // Remove all non-numeric characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If starts with 0, replace with 62 (Indonesia country code)
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1);
    }
    
    // If doesn't start with 62, add it
    if (!cleaned.startsWith('62')) {
        cleaned = '62' + cleaned;
    }
    
    return cleaned;
};

// Create WhatsApp URL
export const getWhatsAppUrl = (phoneNumber, message = '') => {
    const formattedNumber = formatWhatsAppNumber(phoneNumber);
    const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
    return `https://wa.me/${formattedNumber}${encodedMessage}`;
};
