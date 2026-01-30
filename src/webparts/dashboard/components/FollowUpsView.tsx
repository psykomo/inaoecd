import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.scss';
import { QuestionnaireService, IFollowUp, IQuestionnaire } from './QuestionnaireService';

export const FollowUpsView: React.FC = () => {
  const [followUps, setFollowUps] = React.useState<IFollowUp[]>([]);
  const [questionnaires, setQuestionnaires] = React.useState<IQuestionnaire[]>([]);
  const navigate = useNavigate();

  const loadData = (): void => {
    setFollowUps(QuestionnaireService.getFollowUps());
    setQuestionnaires(QuestionnaireService.getQuestionnaires());
  };

  React.useEffect(() => {
    loadData();
    
    // Add dummy follow-ups if none exist
    const existing = QuestionnaireService.getFollowUps();
    if (existing.length === 0) {
      const qs = QuestionnaireService.getQuestionnaires();
      const sentToOecd = qs.filter(q => q.status === 'Sent to OECD');
      if (sentToOecd.length > 0) {
        QuestionnaireService.addFollowUp({
          questionnaireId: sentToOecd[0].id,
          subject: 'Clarification on Digital Tax Section',
          types: ['Clarification', 'Data Request'],
          status: 'Open',
          deadline: '2025-02-15',
          description: 'OECD requested more details on the implementation of the new digital tax laws.'
        });
        loadData();
      }
    }
  }, []);

  const handleDelete = (id: string): void => {
    if (confirm('Are you sure you want to delete this follow-up?')) {
      QuestionnaireService.deleteFollowUp(id);
      loadData();
    }
  };

  const getStatusStyle = (status: string): { bg: string; fg: string } => {
    switch (status) {
      case 'Open': return { bg: '#FDE7E9', fg: '#A4262C' };
      case 'In Progress': return { bg: '#FFF1CC', fg: '#8A660B' };
      case 'Answered': return { bg: '#D0F5F5', fg: '#006666' };
      case 'Closed': return { bg: '#DFF6DD', fg: '#107C10' };
      default: return { bg: '#f3f2f1', fg: '#323130' };
    }
  };

  return (
    <div className={styles.chartContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className={styles.chartTitle} style={{ margin: 0 }}>Follow-ups</h3>
        <button onClick={() => navigate('/followup/new')} className={styles.navButton} style={{ margin: 0 }}>
          + Add Follow-up
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Subject / Questionnaire</th>
              <th style={{ padding: '10px' }}>Type</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Date Received / Deadline</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {followUps.length > 0 ? followUps.map((f) => {
              const q = questionnaires.find(item => item.id === f.questionnaireId);
              const statusStyle = getStatusStyle(f.status);
              return (
                <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 600 }}>{f.subject}</div>
                    <div style={{ fontSize: '11px', color: '#605e5c' }}>
                      Ref: {q ? q.title : 'Unknown Questionnaire'}
                    </div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {(f.types || []).map((t, i) => (
                        <span key={i} style={{ 
                          fontSize: '10px', 
                          backgroundColor: '#f3f2f1', 
                          padding: '2px 6px', 
                          borderRadius: '4px' 
                        }}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.fg
                    }}>
                      {f.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ fontSize: '12px' }}>Rec: {new Date(f.dateReceived).toLocaleDateString()}</div>
                    <div style={{ fontSize: '12px', color: '#a4262c', fontWeight: 600 }}>
                      Due: {f.deadline ? new Date(f.deadline).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => navigate(`/followup/edit/${f.id}`)}
                        style={{ color: '#0078d4', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(f.id)}
                        style={{ color: '#a4262c', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#605e5c' }}>
                  No follow-ups found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
