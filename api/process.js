module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, input, options = {} } = req.body;

    if (!action || !input) {
      return res.status(400).json({ error: 'Missing action or input' });
    }

    let result;
    const { urlSafe = false, padding = true, lineWrap = 0 } = options;

    if (action === 'encode') {
      // Encode text to Base64
      let encoded = Buffer.from(input, 'utf8').toString('base64');

      // URL-safe option
      if (urlSafe) {
        encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_');
      }

      // Remove padding if requested
      if (!padding) {
        encoded = encoded.replace(/=+$/, '');
      }

      // Line wrapping
      if (lineWrap > 0) {
        encoded = encoded.match(new RegExp(`.{1,${lineWrap}}`, 'g')).join('\n');
      }

      result = {
        success: true,
        output: encoded,
        inputLength: input.length,
        outputLength: encoded.length,
        encodingRatio: `${((encoded.length / input.length) * 100).toFixed(1)}%`
      };
    } else if (action === 'decode') {
      // Decode Base64 to text
      let decoded = input;

      // Convert URL-safe back to standard
      if (urlSafe) {
        decoded = decoded.replace(/-/g, '+').replace(/_/g, '/');
      }

      // Add padding if missing
      const paddingNeeded = (4 - (decoded.length % 4)) % 4;
      if (paddingNeeded > 0) {
        decoded += '='.repeat(paddingNeeded);
      }

      const output = Buffer.from(decoded, 'base64').toString('utf8');

      result = {
        success: true,
        output: output,
        inputLength: input.length,
        outputLength: output.length
      };
    } else if (action === 'encode-file') {
      // Handle file upload (base64 string from client)
      const fileData = input.data || input;
      let encoded = fileData;

      if (urlSafe) {
        encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_');
      }

      result = {
        success: true,
        output: encoded,
        filename: input.filename || 'file.txt',
        fileSize: input.size || 0,
        encodedLength: encoded.length
      };
    } else if (action === 'decode-file') {
      // Decode base64 to file
      let decoded = input;

      if (urlSafe) {
        decoded = decoded.replace(/-/g, '+').replace(/_/g, '/');
      }

      const paddingNeeded = (4 - (decoded.length % 4)) % 4;
      if (paddingNeeded > 0) {
        decoded += '='.repeat(paddingNeeded);
      }

      const buffer = Buffer.from(decoded, 'base64');

      result = {
        success: true,
        data: buffer.toString('base64'),
        size: buffer.length,
        isBinary: true
      };
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: 'Processing failed',
      message: error.message,
      success: false
    });
  }
};
