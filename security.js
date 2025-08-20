class SecurityManager {
    constructor() {
        this.maliciousPatterns = [
            /malware/i,
            /virus/i,
            /phishing/i,
            /trojan/i,
            /spyware/i,
            /ransomware/i,
            /exploit/i
        ];

        this.trackerDomains = [
            'google-analytics.com',
            'doubleclick.net',
            'facebook.com',
            'twitter.com',
            'scorecardresearch.com',
            'hotjar.com'
        ];

        this.init();
    }

    init() {
        this.setupContentSecurity();
        this.protectIP();
    }

    setupContentSecurity() {
        // Устанавливаем политику безопасности контента
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self' https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:;";
        document.head.appendChild(meta);
    }

    protectIP() {
        // Методы защиты от IP логгинга
        this.blockWebRTC();
        this.spoofUserAgent();
        this.preventFingerprinting();
    }

    blockWebRTC() {
        // Блокировка WebRTC для предотвращения утечки IP
        const originalRTCPeerConnection = window.RTCPeerConnection;
        window.RTCPeerConnection = function(config) {
            if (config && config.iceServers) {
                config.iceServers = config.iceServers.filter(server => 
                    !server.urls.includes('stun:') && !server.urls.includes('turn:')
                );
            }
            return new originalRTCPeerConnection(config);
        };
    }

    spoofUserAgent() {
        // Смена User-Agent для анонимности
        Object.defineProperty(navigator, 'userAgent', {
            get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });
    }

    preventFingerprinting() {
        // Защита от цифрового отпечатка
        const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
        CanvasRenderingContext2D.prototype.getImageData = function() {
            const data = originalGetImageData.apply(this, arguments);
            // Добавляем шум к данным изображения
            for (let i = 0; i < data.data.length; i += 4) {
                data.data[i] += Math.random() * 10 - 5;
                data.data[i + 1] += Math.random() * 10 - 5;
                data.data[i + 2] += Math.random() * 10 - 5;
            }
            return data;
        };
    }

    scanContent(content) {
        // Сканирование контента на вредоносные паттерны
        const threats = [];
        
        this.maliciousPatterns.forEach(pattern => {
            if (pattern.test(content)) {
                threats.push(`Обнаружен паттерн: ${pattern.source}`);
            }
        });

        return threats;
    }

    isTrackerDomain(domain) {
        return this.trackerDomains.some(tracker => domain.includes(tracker));
    }

    blockRequest(url) {
        const domain = new URL(url).hostname;
        return this.isTrackerDomain(domain);
    }
}

// Инициализация менеджера безопасности
document.addEventListener('DOMContentLoaded', () => {
    window.securityManager = new SecurityManager();
});