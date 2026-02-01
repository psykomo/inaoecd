import * as React from 'react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import styles from './Dashboard.module.scss';
import { useNavigate } from 'react-router-dom';

interface IUserProfileViewProps {
  spHttpClient: SPHttpClient;
  siteUrl: string;
  userDisplayName: string;
}

interface ISPGroup {
  Id: number;
  Title: string;
  Description: string;
}

interface ISPUser {
  Id: number;
  Title: string;
  Email: string;
  LoginName: string;
}

export const UserProfileView: React.FC<IUserProfileViewProps> = ({ spHttpClient, siteUrl, userDisplayName }) => {
  const [groups, setGroups] = React.useState<ISPGroup[]>([]);
  const [userInfo, setUserInfo] = React.useState<ISPUser | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        setLoading(true);
        
        // Fetch current user details and their groups
        const endpoint = `${siteUrl}/_api/web/currentuser?$expand=groups`;
        
        const response: SPHttpClientResponse = await spHttpClient.get(
          endpoint,
          SPHttpClient.configurations.v1
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user profile data');
        }

        const data = await response.json();
        setUserInfo({
          Id: data.Id,
          Title: data.Title,
          Email: data.Email,
          LoginName: data.LoginName
        });
        setGroups(data.Groups || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData().catch(console.error);
  }, [spHttpClient, siteUrl]);

  if (loading) return <div className={styles.chartContainer}>Loading profile...</div>;

  if (error) {
    return (
      <div className={styles.chartContainer}>
        <h3 style={{ color: '#a4262c' }}>Error loading profile</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className={styles.navButton}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className={styles.chartTitle} style={{ margin: 0 }}>User Profile</h3>
        <button onClick={() => navigate(-1)} className={styles.navButton} style={{ margin: 0, backgroundColor: '#605e5c' }}>
          Back
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* User Info Card */}
        <div style={{ backgroundColor: '#faf9f8', padding: '20px', borderRadius: '4px', border: '1px solid #edebe9' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#0078d4', color: 'white', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', margin: '0 auto 15px' }}>
            {userInfo?.Title ? userInfo.Title.charAt(0).toUpperCase() : '?'}
          </div>
          <h4 style={{ textAlign: 'center', margin: '0 0 5px' }}>{userInfo?.Title}</h4>
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#605e5c', marginBottom: '20px' }}>{userInfo?.Email}</div>
          
          <div style={{ borderTop: '1px solid #edebe9', paddingTop: '15px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '10px', color: '#605e5c', display: 'block' }}>USER ID</label>
              <div style={{ fontSize: '13px' }}>{userInfo?.Id}</div>
            </div>
            <div>
              <label style={{ fontSize: '10px', color: '#605e5c', display: 'block' }}>LOGIN NAME</label>
              <div style={{ fontSize: '11px', wordBreak: 'break-all' }}>{userInfo?.LoginName}</div>
            </div>
          </div>
        </div>

        {/* Groups List */}
        <div>
          <h4 style={{ marginTop: 0 }}>SharePoint Group Memberships</h4>
          <p style={{ fontSize: '13px', color: '#605e5c', marginBottom: '15px' }}>
            You are a member of the following <strong>{groups.length}</strong> groups in this site:
          </p>
          
          <div style={{ display: 'grid', gap: '10px' }}>
            {groups.length > 0 ? groups.map(group => (
              <div key={group.Id} style={{ padding: '12px', border: '1px solid #edebe9', borderRadius: '4px', backgroundColor: 'white' }}>
                <div style={{ fontWeight: 600, color: '#0078d4' }}>{group.Title}</div>
                {group.Description && (
                  <div style={{ fontSize: '12px', color: '#605e5c', marginTop: '4px' }}>{group.Description}</div>
                )}
              </div>
            )) : (
              <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed #ccc', color: '#605e5c' }}>
                No SharePoint groups found for this user.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
