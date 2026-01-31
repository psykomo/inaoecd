import * as React from 'react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import styles from './Dashboard.module.scss';

interface IDocumentsViewProps {
  spHttpClient: SPHttpClient;
  siteUrl: string;
}

interface ISPFile {
  Name: string;
  ServerRelativeUrl: string;
  Length: string;
  TimeLastModified: string;
}

export const DocumentsView: React.FC<IDocumentsViewProps> = ({ spHttpClient, siteUrl }) => {
  const [files, setFiles] = React.useState<ISPFile[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchFiles = async (): Promise<void> => {
    try {
      setLoading(true);
      // Using the server-relative URL for the default 'Shared Documents' library
      const endpoint = `${siteUrl}/_api/web/getfolderbyserverrelativeurl('/Shared Documents')/files`;
      
      const response: SPHttpClientResponse = await spHttpClient.get(
        endpoint,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ? errorData.error.message.value : 'Failed to fetch files');
      }

      const data = await response.json();
      setFiles(data.value);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFiles().catch(console.error);
  }, [spHttpClient, siteUrl]);

  const formatBytes = (bytes: string): string => {
    const b = parseInt(bytes);
    if (b === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return parseFloat((b / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) return <div className={styles.chartContainer}>Loading documents...</div>;
  
  if (error) {
    return (
      <div className={styles.chartContainer}>
        <h3 style={{ color: '#a4262c' }}>Error loading documents</h3>
        <p>{error}</p>
        <p style={{ fontSize: '12px', color: '#605e5c' }}>
          Note: Ensure the library exists at <strong>'/Shared Documents'</strong> and you have permissions to access it.
        </p>
        <button onClick={() => fetchFiles()} className={styles.navButton}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className={styles.chartTitle} style={{ margin: 0 }}>Shared Documents</h3>
        <button onClick={() => fetchFiles()} style={{ padding: '8px 16px', border: '1px solid #ddd', background: 'white', borderRadius: '2px', cursor: 'pointer' }}>
          Refresh
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Name</th>
              <th style={{ padding: '10px' }}>Size</th>
              <th style={{ padding: '10px' }}>Modified</th>
            </tr>
          </thead>
          <tbody>
            {files.length > 0 ? files.map((file, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>
                  <a 
                    href={`${siteUrl}/_layouts/15/download.aspx?SourceUrl=${file.ServerRelativeUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: '#0078d4', fontWeight: 600 }}
                  >
                    📄 {file.Name}
                  </a>
                </td>
                <td style={{ padding: '10px', color: '#605e5c' }}>{formatBytes(file.Length)}</td>
                <td style={{ padding: '10px', color: '#605e5c' }}>
                  {new Date(file.TimeLastModified).toLocaleString()}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: '#605e5c' }}>
                  No files found in this folder.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
