import * as React from 'react';
import styles from './Dashboard.module.scss';
import { QuestionnaireService, MASTER_SECTIONS } from './QuestionnaireService';

export const SummaryView: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'questionnaires' | 'followups'>('questionnaires');
  const questionnaires = QuestionnaireService.getQuestionnaires();
  const followUps = QuestionnaireService.getFollowUps();
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  // Questionnaire Aggregates
  const totalQuestions = questionnaires.reduce((acc, q) => acc + q.totalQuestions, 0);
  const totalAnswered = questionnaires.reduce((acc, q) => acc + q.answeredQuestions, 0);
  const overallProgress = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  // Questionnaire Deadlines
  const overdueQ = questionnaires.filter(q => 
    q.status !== 'Completed' && q.status !== 'Sent to OECD' && 
    q.deadline && new Date(q.deadline) < today
  ).length;
  const soonQ = questionnaires.filter(q => 
    q.status !== 'Completed' && q.status !== 'Sent to OECD' && 
    q.deadline && new Date(q.deadline) >= today && new Date(q.deadline) <= nextWeek
  ).length;

  // Follow-up Aggregates
  const totalFollowUps = followUps.length;
  const closedFollowUps = followUps.filter(f => f.status === 'Closed').length;
  const answeredFollowUps = followUps.filter(f => f.status === 'Answered').length;
  const followUpCompletion = totalFollowUps > 0 ? Math.round(((closedFollowUps + answeredFollowUps) / totalFollowUps) * 100) : 0;

  // Follow-up Deadlines
  const overdueFU = followUps.filter(f => 
    f.status !== 'Closed' && f.status !== 'Answered' && 
    f.deadline && new Date(f.deadline) < today
  ).length;
  const soonFU = followUps.filter(f => 
    f.status !== 'Closed' && f.status !== 'Answered' && 
    f.deadline && new Date(f.deadline) >= today && new Date(f.deadline) <= nextWeek
  ).length;

  // Progress by Section
  const sectionProgress = MASTER_SECTIONS.map(section => {
    const sectionQs = questionnaires.filter(q => q.sectionName === section);
    const sTotal = sectionQs.reduce((acc, q) => acc + q.totalQuestions, 0);
    const sAnswered = sectionQs.reduce((acc, q) => acc + q.answeredQuestions, 0);
    const progress = sTotal > 0 ? Math.round((sAnswered / sTotal) * 100) : 0;
    return { section, progress, count: sectionQs.length };
  }).filter(s => s.count > 0);

  const tabButtonStyle = (isActive: boolean) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    border: 'none',
    background: isActive ? '#0078d4' : '#f3f2f1',
    color: isActive ? 'white' : '#323130',
    borderRadius: '4px',
    fontWeight: 600,
    transition: 'all 0.2s'
  });

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button 
          style={tabButtonStyle(activeTab === 'questionnaires')} 
          onClick={() => setActiveTab('questionnaires')}
        >
          📊 Questionnaire Monitoring
        </button>
        <button 
          style={tabButtonStyle(activeTab === 'followups')} 
          onClick={() => setActiveTab('followups')}
        >
          🔍 Follow-up Monitoring
        </button>
      </div>

      {activeTab === 'questionnaires' ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Top Level Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Overall Stats */}
            <div className={styles.chartContainer} style={{ borderLeft: '4px solid #107c10', margin: 0 }}>
              <h3 className={styles.chartTitle}>Overall Questionnaire Progress</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#107c10" strokeWidth="3" strokeDasharray={`${overallProgress}, 100`} />
                    <text x="18" y="20.35" textAnchor="middle" style={{ fontSize: '8px', fontWeight: 'bold' }}>{overallProgress}%</text>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>{totalAnswered} / {totalQuestions}</div>
                  <div style={{ color: '#605e5c', fontSize: '12px' }}>Total Questions Answered</div>
                </div>
              </div>
            </div>

            {/* Deadline Monitor */}
            <div className={styles.chartContainer} style={{ borderLeft: '4px solid #a4262c', margin: 0 }}>
              <h3 className={styles.chartTitle}>Questionnaire Deadlines</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#fde7e9', borderRadius: '4px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 600, color: '#a4262c' }}>{overdueQ}</div>
                  <div style={{ fontSize: '11px', color: '#a4262c' }}>OVERDUE</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#fff4ce', borderRadius: '4px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 600, color: '#8a660b' }}>{soonQ}</div>
                  <div style={{ fontSize: '11px', color: '#8a660b' }}>DUE SOON (7d)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress by Section */}
          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Progress by Section</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {sectionProgress.length > 0 ? sectionProgress.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px' }}>
                    <span style={{ fontWeight: 600 }}>{item.section} ({item.count} Qs)</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#eee', borderRadius: '4px' }}>
                    <div style={{ width: `${item.progress}%`, height: '100%', backgroundColor: '#0078d4', borderRadius: '4px', transition: 'width 0.5s ease-in-out' }}></div>
                  </div>
                </div>
              )) : <div style={{ color: '#605e5c', fontStyle: 'italic' }}>No data available.</div>}
            </div>
          </div>

          {/* Status Bar Chart */}
          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Questionnaire Status Breakdown</h3>
            <div className={styles.barChart} style={{ height: '150px' }}>
              {[
                { label: 'Draft', color: '#F3F2F1' },
                { label: 'Published', color: '#E1DFDD' },
                { label: 'Work in Progress', color: '#FFF1CC' },
                { label: 'Submit for Review', color: '#D0F5F5' },
                { label: 'Need Revision', color: '#FDE7E9' },
                { label: 'Under Review', color: '#EFE2FE' },
                { label: 'Completed', color: '#DFF6DD' },
                { label: 'Sent to OECD', color: '#C7E0F4' }
              ].map((statusInfo, index) => {
                const count = questionnaires.filter(q => q.status === statusInfo.label).length;
                const percentage = (count / questionnaires.length) * 100 || 0;
                return (
                  <div key={index} className={styles.bar} style={{ height: `${percentage}%`, backgroundColor: statusInfo.color, border: '1px solid #ddd' }} title={`${statusInfo.label}: ${count}`}>
                    <span className={styles.barLabel} style={{ bottom: '-35px', whiteSpace: 'nowrap', fontSize: '10px' }}>
                      {statusInfo.label.split(' ').map(w => w[0]).join('')} ({count})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Top Level Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Follow-up Overall Stats */}
            <div className={styles.chartContainer} style={{ borderLeft: '4px solid #0078d4', margin: 0 }}>
              <h3 className={styles.chartTitle}>Overall Follow-up Progress</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0078d4" strokeWidth="3" strokeDasharray={`${followUpCompletion}, 100`} />
                    <text x="18" y="20.35" textAnchor="middle" style={{ fontSize: '8px', fontWeight: 'bold' }}>{followUpCompletion}%</text>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>{closedFollowUps + answeredFollowUps} / {totalFollowUps}</div>
                  <div style={{ color: '#605e5c', fontSize: '12px' }}>Total Requests Resolved</div>
                </div>
              </div>
            </div>

            {/* Follow-up Deadline Monitor */}
            <div className={styles.chartContainer} style={{ borderLeft: '4px solid #a4262c', margin: 0 }}>
              <h3 className={styles.chartTitle}>Follow-up Deadlines</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#fde7e9', borderRadius: '4px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 600, color: '#a4262c' }}>{overdueFU}</div>
                  <div style={{ fontSize: '11px', color: '#a4262c' }}>OVERDUE</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#fff4ce', borderRadius: '4px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 600, color: '#8a660b' }}>{soonFU}</div>
                  <div style={{ fontSize: '11px', color: '#8a660b' }}>DUE SOON (7d)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Follow-up Status Breakdown */}
          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Follow-up Status Distribution</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {[
                { label: 'Open', color: '#FDE7E9', count: followUps.filter(f => f.status === 'Open').length, desc: 'New from OECD' },
                { label: 'In Progress', color: '#FFF1CC', count: followUps.filter(f => f.status === 'In Progress').length, desc: 'Being worked on' },
                { label: 'Answered', color: '#D0F5F5', count: followUps.filter(f => f.status === 'Answered').length, desc: 'Sent to OECD' },
                { label: 'Closed', color: '#DFF6DD', count: followUps.filter(f => f.status === 'Closed').length, desc: 'Finalized' }
              ].map((s, idx) => (
                <div key={idx} style={{ padding: '15px', backgroundColor: 'white', border: '1px solid #edebe9', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: s.color, borderRadius: '20px', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '1px solid #ddd' }}>
                    {s.count}
                  </div>
                  <div style={{ fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: '11px', color: '#605e5c' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Type Breakdown */}
          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Follow-up Types</h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {['Clarification', 'Additional Question', 'Data Request'].map(type => {
                const count = followUps.filter(f => (f.types || []).indexOf(type as any) !== -1).length;
                return (
                  <div key={type} style={{ flex: 1, minWidth: '150px', padding: '15px', backgroundColor: '#faf9f8', borderRadius: '4px', border: '1px solid #edebe9' }}>
                    <div style={{ fontSize: '12px', color: '#605e5c' }}>{type.toUpperCase()}</div>
                    <div style={{ fontSize: '20px', fontWeight: 600 }}>{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
