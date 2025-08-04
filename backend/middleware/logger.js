const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  // Extract user info if token exists
  let userId = 'Anonymous';
  if (req.header('Authorization')) {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      // Token invalid or expired, keep as Anonymous
    }
  }

  const logEntry = {
    timestamp,
    method,
    url,
    ip,
    userId,
    userAgent,
    body: method === 'POST' || method === 'PUT' || method === 'PATCH' ? req.body : undefined
  };

  // Console log
  console.log(`[${timestamp}] ${method} ${url} - ${ip} - User: ${userId}`);

  // File log
  const logFileName = `access-${new Date().toISOString().split('T')[0]}.log`;
  const logFilePath = path.join(logsDir, logFileName);
  
  fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });

  // Capture response details
  const originalSend = res.send;
  res.send = function(data) {
    const responseLogEntry = {
      timestamp: new Date().toISOString(),
      method,
      url,
      ip,
      userId,
      statusCode: res.statusCode,
      responseTime: Date.now() - req.startTime
    };

    console.log(`[${responseLogEntry.timestamp}] Response: ${method} ${url} - ${res.statusCode} - ${responseLogEntry.responseTime}ms`);
    
    fs.appendFile(logFilePath, JSON.stringify(responseLogEntry) + '\n', (err) => {
      if (err) {
        console.error('Failed to write response to log file:', err);
      }
    });

    originalSend.call(this, data);
  };

  // Add start time for response time calculation
  req.startTime = Date.now();
  
  next();
};

module.exports = loggerMiddleware;
