import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.scss';
import { QuestionnaireService, IQuestionnaire } from './QuestionnaireService';

export const QuestionnairesView: React.FC = () => {
  const [questionnaires, setQuestionnaires] = React.useState<IQuestionnaire[]>([]);
  const navigate = useNavigate();

  const loadData = (): void => {
    const data = QuestionnaireService.getQuestionnaires();
    setQuestionnaires([...data]);
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string): void => {
    if (confirm('Are you sure you want to delete this questionnaire?')) {
      QuestionnaireService.deleteQuestionnaire(id);
      loadData();
    }
  };

  const getStatusStyle = (status: string): { bg: string; fg: string } => {
    switch (status) {
      case 'Draft': return { bg: '#F3F2F1', fg: '#323130' }; // Gray
      case 'Published': return { bg: '#E1DFDD', fg: '#605E5C' }; // Darker Gray
      case 'Work in Progress': return { bg: '#FFF1CC', fg: '#8A660B' }; // Amber
      case 'Submit for Review': return { bg: '#D0F5F5', fg: '#006666' }; // Teal
      case 'Need Revision': return { bg: '#FDE7E9', fg: '#A4262C' }; // Red
      case 'Under Review': return { bg: '#EFE2FE', fg: '#5C2D91' }; // Purple
      case 'Completed': return { bg: '#DFF6DD', fg: '#107C10' }; // Green
      case 'Sent to OECD': return { bg: '#C7E0F4', fg: '#0078D4' }; // Blue
      default: return { bg: '#f3f2f1', fg: '#323130' };
    }
  };

  const handleReset = (): void => {
    if (confirm('Are you sure you want to reset all data to default? This will delete your changes.')) {
      localStorage.removeItem('INA_OECD_QUESTIONNAIRES');
      loadData();
    }
  };

  return (
    <div className={styles.chartContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className={styles.chartTitle} style={{ margin: 0 }}>Questionnaires</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleReset} style={{ padding: '8px 16px', border: '1px solid #ddd', background: 'white', borderRadius: '2px', cursor: 'pointer' }}>
            Reset to Default
          </button>
          <button onClick={() => navigate('/questionnaire/new')} className={styles.navButton} style={{ margin: 0 }}>
            + Create New
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Title / URL</th>
              <th style={{ padding: '10px' }}>Section / Batch</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Deadline</th>
              <th style={{ padding: '10px' }}>Questions (T/A/U)</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questionnaires.map((q) => {
              const statusStyle = getStatusStyle(q.status);
              return (
                <tr key={q.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 600 }}>{q.title}</div>
                    <div style={{ fontSize: '11px', color: '#605e5c' }}>{q.url}</div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 600 }}>{q.sectionName}</div>
                    <div style={{ fontSize: '11px', color: '#605e5c' }}>{q.batchId}</div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.fg
                    }}>
                      {q.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 600, color: '#a4262c' }}>
                      {q.deadline ? new Date(q.deadline).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div>
                      <span title="Total">{q.totalQuestions}</span> / 
                      <span title="Answered" style={{ color: '#107c10' }}> {q.answeredQuestions}</span> / 
                      <span title="Unanswered" style={{ color: '#a4262c' }}> {q.unansweredQuestions}</span>
                    </div>
                    <div style={{ width: '100px', height: '4px', backgroundColor: '#eee', marginTop: '5px' }}>
                      <div style={{ 
                        width: `${(q.answeredQuestions / q.totalQuestions) * 100 || 0}%`, 
                        height: '100%', 
                        backgroundColor: '#107c10' 
                      }}></div>
                    </div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link 
                        to={`/questionnaire/${q.id}`}
                        style={{ color: '#0078d4', textDecoration: 'none' }}
                      >
                        View
                      </Link>
                      <Link 
                        to={`/questionnaire/edit/${q.id}`}
                        style={{ color: '#0078d4', textDecoration: 'none' }}
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(q.id)}
                        style={{ color: '#a4262c', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
