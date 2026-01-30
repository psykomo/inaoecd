import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.scss';
import { QuestionnaireService, IFollowUp, IQuestionnaire } from './QuestionnaireService';

export const QuestionnaireDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = React.useState<IQuestionnaire | null>(null);
  const [relatedFollowUps, setRelatedFollowUps] = React.useState<IFollowUp[]>([]);

  React.useEffect(() => {
    if (id) {
      const data = QuestionnaireService.getQuestionnaireById(id);
      if (data) {
        setQuestionnaire(data);
        const followUps = QuestionnaireService.getFollowUps().filter(f => f.questionnaireId === id);
        setRelatedFollowUps(followUps);
      }
    }
  }, [id]);

  if (!questionnaire) {
    return (
      <div className={styles.chartContainer}>
        <h3>Questionnaire not found</h3>
        <button onClick={() => navigate('/questionnaires')} className={styles.navButton}>Back to List</button>
      </div>
    );
  }

  const completionRate = Math.round((questionnaire.answeredQuestions / questionnaire.totalQuestions) * 100) || 0;

  const getStatusStyle = (status: string): any => {
    switch (status) {
      case 'Draft': return { bg: '#F3F2F1', fg: '#323130' };
      case 'Published': return { bg: '#E1DFDD', fg: '#605E5C' };
      case 'Work in Progress': return { bg: '#FFF1CC', fg: '#8A660B' };
      case 'Submit for Review': return { bg: '#D0F5F5', fg: '#006666' };
      case 'Need Revision': return { bg: '#FDE7E9', fg: '#A4262C' };
      case 'Under Review': return { bg: '#EFE2FE', fg: '#5C2D91' };
      case 'Completed': return { bg: '#DFF6DD', fg: '#107C10' };
      case 'Sent to OECD': return { bg: '#C7E0F4', fg: '#0078D4' };
      default: return { bg: '#f3f2f1', fg: '#323130' };
    }
  };

  const statusStyle = getStatusStyle(questionnaire.status);

  return (
    <div className={styles.chartContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className={styles.chartTitle} style={{ margin: 0 }}>Questionnaire Details</h3>
        <button onClick={() => navigate('/questionnaires')} className={styles.navButton} style={{ margin: 0 }}>
          Back to List
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#605e5c', fontSize: '12px', display: 'block' }}>TITLE</label>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>{questionnaire.title}</div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#605e5c', fontSize: '12px', display: 'block' }}>URL</label>
            <div><a href={questionnaire.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0078d4' }}>{questionnaire.url}</a></div>
          </div>

          <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
            <div>
              <label style={{ color: '#605e5c', fontSize: '12px', display: 'block' }}>STATUS</label>
              <span style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                backgroundColor: statusStyle.bg,
                color: statusStyle.fg
              }}>
                {questionnaire.status}
              </span>
            </div>
            <div>
              <label style={{ color: '#605e5c', fontSize: '12px', display: 'block' }}>BATCH ID</label>
              <div style={{ fontWeight: 600 }}>{questionnaire.batchId || 'N/A'}</div>
            </div>
            <div>
              <label style={{ color: '#605e5c', fontSize: '12px', display: 'block' }}>SECTION</label>
              <div style={{ fontWeight: 600 }}>{questionnaire.sectionName}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
            <div>
              <label style={{ color: '#605e5c', fontSize: '12px', display: 'block' }}>DATE RECEIVED</label>
              <div style={{ fontWeight: 600 }}>{new Date(questionnaire.dateReceived).toLocaleDateString()}</div>
            </div>
            <div>
              <label style={{ color: '#605e5c', fontSize: '12px', display: 'block' }}>DEADLINE</label>
              <div style={{ fontWeight: 600, color: '#a4262c' }}>{questionnaire.deadline ? new Date(questionnaire.deadline).toLocaleDateString() : 'N/A'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
            <div>
              <label style={{ color: '#605e5c', fontSize: '12px', display: 'block' }}>DATE COMPLETED</label>
              <div style={{ fontWeight: 600 }}>{questionnaire.dateCompleted ? new Date(questionnaire.dateCompleted).toLocaleDateString() : 'Pending'}</div>
            </div>
            <div>
              <label style={{ color: '#605e5c', fontSize: '12px', display: 'block' }}>DATE SUBMITTED TO OECD</label>
              <div style={{ fontWeight: 600 }}>{questionnaire.dateSubmittedToOECD ? new Date(questionnaire.dateSubmittedToOECD).toLocaleDateString() : 'Pending'}</div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#faf9f8', padding: '20px', borderRadius: '4px' }}>
          <h4 style={{ marginTop: 0, marginBottom: '20px' }}>Completion Progress</h4>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Progress</span>
            <span style={{ fontWeight: 600 }}>{completionRate}%</span>
          </div>
          <div style={{ width: '100%', height: '12px', backgroundColor: '#edebe9', borderRadius: '6px', marginBottom: '20px' }}>
            <div style={{ 
              width: `${completionRate}%`, 
              height: '100%', 
              backgroundColor: '#107c10', 
              borderRadius: '6px',
              transition: 'width 0.5s ease-out'
            }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px', textAlign: 'center', border: '1px solid #edebe9' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#107c10' }}>{questionnaire.answeredQuestions}</div>
              <div style={{ fontSize: '12px', color: '#605e5c' }}>Answered</div>
            </div>
            <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px', textAlign: 'center', border: '1px solid #edebe9' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#a4262c' }}>{questionnaire.unansweredQuestions}</div>
              <div style={{ fontSize: '12px', color: '#605e5c' }}>Unanswered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Follow-ups Section */}
      <div style={{ marginTop: '30px', borderTop: '1px solid #edebe9', paddingTop: '20px' }}>
        <h4 style={{ marginBottom: '15px' }}>Related Follow-ups</h4>
        {relatedFollowUps.length > 0 ? (
          <div style={{ display: 'grid', gap: '15px' }}>
            {relatedFollowUps.map(f => (
              <div key={f.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 600 }}>{f.subject}</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', backgroundColor: '#eee' }}>{f.status}</span>
                </div>
                {f.links && f.links.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {f.links.map(l => (
                      <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" style={{ 
                        fontSize: '11px', 
                        color: '#0078d4',
                        padding: '4px 8px',
                        border: '1px solid #c7e0f4',
                        borderRadius: '4px',
                        backgroundColor: '#f3f9ff',
                        textDecoration: 'none'
                      }}>
                        {l.category === 'OECD Request' ? '📎 ' : '📤 '}{l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#605e5c', fontSize: '13px', fontStyle: 'italic' }}>No follow-ups recorded for this questionnaire.</p>
        )}
      </div>

      <div style={{ marginTop: '30px', borderTop: '1px solid #edebe9', paddingTop: '20px' }}>
        <div style={{ color: '#605e5c', fontSize: '12px' }}>
          Last modified: {new Date(questionnaire.lastModified).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
