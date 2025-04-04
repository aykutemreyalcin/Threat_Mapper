// === CYBERPUNK THREAT MATRIX v2.0 ===
// Enhanced client-side functionality

// Initialize Socket.IO connection
const socket = io();
const logBox = document.getElementById('log-box');
const threatDots = document.getElementById('threat-dots');
const totalThreats = document.getElementById('total-threats');
const activeThreats = document.getElementById('active-threats');
const portScans = document.getElementById('port-scans');
const bruteForce = document.getElementById('brute-force');
const uptimeDisplay = document.getElementById('uptime');
const updateTime = document.querySelector('.update-time');

// Statistics
let stats = {
  total: 0,
  active: 0,
  portScans: 0,
  bruteForce: 0,
  ddos: 0
};

// Sound effects
const sounds = {
  alert: new Audio('/static/alert.mp3'),
  warning: new Audio('/static/warning.mp3'),
  critical: new Audio('/static/critical.mp3')
};

// Set sound volumes
Object.values(sounds).forEach(sound => {
  sound.volume = 0.3;
});

// Uptime counter
let uptime = 0;
setInterval(() => {
  uptime++;
  const hours = Math.floor(uptime / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((uptime % 3600) / 60).toString().padStart(2, '0');
  const seconds = (uptime % 60).toString().padStart(2, '0');
  uptimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}, 1000);

// Initialize Matrix background
initMatrixBackground();

// Handle new attack events
socket.on('new_attack', (data) => {
  // Update statistics
  stats.total++;
  stats.active++;
  
  if (data.type === 'Port Scan') {
    stats.portScans++;
    portScans.textContent = stats.portScans;
  } else if (data.type === 'Brute Force') {
    stats.bruteForce++;
    bruteForce.textContent = stats.bruteForce;
  } else if (data.type === 'DDoS') {
    stats.ddos++;
  }
  
  totalThreats.textContent = stats.total;
  activeThreats.textContent = stats.active;
  
  // Update timestamp
  const now = new Date();
  updateTime.textContent = now.toLocaleTimeString();
  
  // Create log entry
  const entry = document.createElement('div');
  entry.classList.add('log-entry', data.type.toLowerCase().replace(' ', '-'));
  
  const time = now.toLocaleTimeString();
  entry.innerHTML = `
    <span class="log-time">[${time}]</span>
    <span class="log-type">[${data.type}]</span>
    <span class="log-ip">from ${data.ip}</span>
    <span class="log-detail">→ ${data.detail}</span>
  `;
  
  // Prepend to log box
  logBox.prepend(entry);
  
  // Play sound based on threat type
  if (data.type === 'DDoS') {
    sounds.critical.play();
  } else if (data.type === 'Brute Force') {
    sounds.warning.play();
  } else {
    sounds.alert.play();
  }
  
  // Add threat dot to world map
  addThreatDot(data);
  
  // Limit log size
  if (logBox.children.length > 200) {
    logBox.removeChild(logBox.lastChild);
  }
  
  // Update threat level
  updateThreatLevel();
});

// Add threat dot to world map
function addThreatDot(data) {
  const dot = document.createElement('div');
  dot.classList.add('threat-dot', data.type.toLowerCase().replace(' ', '-'));
  
  // Random position on map
  const left = Math.random() * 90 + 5;
  const top = Math.random() * 90 + 5;
  
  dot.style.left = `${left}%`;
  dot.style.top = `${top}%`;
  
  threatDots.appendChild(dot);
  
  // Remove dot after animation
  setTimeout(() => {
    dot.remove();
    stats.active--;
    activeThreats.textContent = stats.active;
    updateThreatLevel();
  }, 10000);
}

// Update threat level indicator
function updateThreatLevel() {
  const threatLevel = document.querySelector('.threat-level');
  const threatText = document.querySelector('.threat-text');
  
  if (stats.active > 20) {
    threatLevel.className = 'threat-high';
    threatText.textContent = 'CRITICAL';
  } else if (stats.active > 10) {
    threatLevel.className = 'threat-medium';
    threatText.textContent = 'HIGH';
  } else if (stats.active > 5) {
    threatLevel.className = 'threat-medium';
    threatText.textContent = 'MEDIUM';
  } else {
    threatLevel.className = 'threat-low';
    threatText.textContent = 'LOW';
  }
}

// Initialize Matrix code rain background
function initMatrixBackground() {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-canvas';
  document.getElementById('matrix-bg').appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
  const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  const symbols = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
  const alphabet = katakana + latin + nums + symbols;
  
  const fontSize = 16;
  const columns = canvas.width / fontSize;
  const rainDrops = [];
  
  for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
  }
  
  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < rainDrops.length; i++) {
      const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
      
      if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        rainDrops[i] = 0;
      }
      rainDrops[i]++;
    }
  };
  
  setInterval(draw, 30);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Command input functionality
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const command = document.getElementById('command-input').value;
    if (command) {
      processCommand(command);
      document.getElementById('command-input').value = '';
    }
  }
});

function processCommand(command) {
  const response = document.createElement('div');
  response.classList.add('log-entry', 'command-response');
  response.textContent = `> ${command}`;
  logBox.prepend(response);
  
  // Simple command processing
  if (command === 'clear') {
    logBox.innerHTML = '';
  } else if (command === 'help') {
    const helpText = document.createElement('div');
    helpText.classList.add('log-entry', 'command-response');
    helpText.innerHTML = `
      Available commands:<br>
      - clear: Clear the terminal<br>
      - help: Show this help<br>
      - stats: Show current threat statistics<br>
      - scan: Run network scan<br>
      - defend: Enable active defense<br>
    `;
    logBox.prepend(helpText);
  } else if (command === 'stats') {
    const statsText = document.createElement('div');
    statsText.classList.add('log-entry', 'command-response');
    statsText.innerHTML = `
      Current threat statistics:<br>
      - Total threats: ${stats.total}<br>
      - Active threats: ${stats.active}<br>
      - Port scans: ${stats.portScans}<br>
      - Brute force: ${stats.bruteForce}<br>
      - DDoS attacks: ${stats.ddos}<br>
    `;
    logBox.prepend(statsText);
  } else {
    const unknown = document.createElement('div');
    unknown.classList.add('log-entry', 'command-response');
    unknown.textContent = `Unknown command: ${command}`;
    logBox.prepend(unknown);
  }
}
