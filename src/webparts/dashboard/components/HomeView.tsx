import * as React from 'react';
import styles from './Dashboard.module.scss';
import { Link } from 'react-router-dom';

export const HomeView: React.FC = () => {
  return (
    <div className={styles.chartContainer}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '28px', color: '[theme:themePrimary, default: #0078d4]', marginBottom: '10px' }}>
          Welcome to INA OECD - POST IM
        </h1>
        <p style={{ fontSize: '16px', color: '[theme:neutralSecondary, default: #605e5c]', maxWidth: '600px', margin: '0 auto 30px' }}>
          Integrated Information Management and Tracking System for OECD Standards and Post-Implementation Reviews.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '40px' }}>
          <Link to="/summary" style={{ textDecoration: 'none' }}>
            <div className={styles.navItem} style={{ border: '1px solid #edebe9', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
              <div style={{ fontWeight: 600 }}>Performance Summary</div>
              <div style={{ fontSize: '12px', color: '#605e5c' }}>Overview of system metrics</div>
            </div>
          </Link>
          <Link to="/questionnaires" style={{ textDecoration: 'none' }}>
            <div className={styles.navItem} style={{ border: '1px solid #edebe9', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📝</div>
              <div style={{ fontWeight: 600 }}>Questionnaires</div>
              <div style={{ fontSize: '12px', color: '#605e5c' }}>Manage active reviews</div>
            </div>
          </Link>
          <Link to="/followups" style={{ textDecoration: 'none' }}>
            <div className={styles.navItem} style={{ border: '1px solid #edebe9', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔍</div>
              <div style={{ fontWeight: 600 }}>Follow ups</div>
              <div style={{ fontSize: '12px', color: '#605e5c' }}>Track OECD requests</div>
            </div>
          </Link>
          <Link to="/documents" style={{ textDecoration: 'none' }}>
            <div className={styles.navItem} style={{ border: '1px solid #edebe9', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📁</div>
              <div style={{ fontWeight: 600 }}>Documents</div>
              <div style={{ fontSize: '12px', color: '#605e5c' }}>Shared library files</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
