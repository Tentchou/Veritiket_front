import React from 'react';
import { Link } from 'react-router-dom';

const EventRow = ({ event, isDarkMode }) => {
  const rowClass = isDarkMode 
    ? 'border-slate-800/60 hover:bg-slate-800/40 text-slate-300' 
    : 'border-slate-100 hover:bg-slate-50 text-slate-600';

  const badgeClass = isDarkMode
    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    : 'bg-indigo-50 text-indigo-600 border-indigo-100';

  // Correction : Le nom sera blanc en sombre, et noir en clair
  const textPrimary = isDarkMode ? 'text-slate-100' : 'text-slate-900';

  return (
    <tr className={`border-b transition-colors duration-200 ${rowClass}`}>
      <td className={`py-4 px-6 font-semibold ${textPrimary}`}>
        {event.name}
      </td>
      <td className="py-4 px-6 truncate max-w-[180px]">{event.location}</td>
      <td className="py-4 px-6">
        {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>
      <td className="py-4 px-6">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}`}>
          {event.category}
        </span>
      </td>
      <td className="py-4 px-6 text-right flex justify-end gap-2">
        <Link 
          to={`/dashboard/tickets?eventId=${event.id}`}
          className="px-4 py-2 bg-slate-800 border border-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all no-underline inline-flex items-center gap-2"
        >
          <i className="fa-solid fa-ticket"></i> Billets
        </Link>
        <Link 
          to={`/dashboard?eventId=${event.id}`}
          className="px-4 py-2 bg-indigo-accent/10 hover:bg-indigo-accent text-indigo-400 hover:text-white rounded-xl text-sm font-medium transition-all no-underline inline-flex items-center gap-2"
        >
          <i className="fa-solid fa-chart-simple"></i> Stats
        </Link>
      </td>
    </tr>
  );
};

export default EventRow;