function ActivityLog({ activities }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Activity Log</h2>
      </div>

      <ul className="activity-log">
        {activities.length === 0 ? (
          <li className="empty-state">No recent activity.</li>
        ) : (
          activities.map((activity) => (
            <li key={activity.id} className={`activity-item ${activity.type}`}>
              {activity.text}
            </li>
          ))
        )}
      </ul>
    </section>
  )
}

export default ActivityLog
