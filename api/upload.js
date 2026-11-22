// api/upload.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, fileContent } = req.body;

    if (!fileContent) {
      return res.status(400).json({ error: 'No file content provided' });
    }

    // Get secrets from Vercel Environment Variables
    const repoOwner = process.env.GITHUB_REPO_OWNER;
    const repoName = process.env.GITHUB_REPO_NAME;
    const token = process.env.GITHUB_PAT;

    if (!repoOwner || !repoName || !token) {
      throw new Error('Missing GitHub environment variables in Vercel');
    }

    // Clean the file name and add a timestamp so images don't overwrite each other
    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const targetPath = `uploads/${Date.now()}_${safeFileName}`;

    // Send to GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${targetPath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Serverless-Function'
        },
        body: JSON.stringify({
          message: `Upload ${safeFileName} from TABARE Registration`,
          content: fileContent, // This must be Base64 encoded
          branch: 'main', // If your repository uses 'master', change this to 'master'
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('GitHub API Error:', data);
      throw new Error(data.message || 'GitHub API failed');
    }

    // Return the public URL of the uploaded image
    return res.status(200).json({ url: data.content.download_url });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
