import { Link } from 'react-router-dom';

const EventRow = ({ event, isDarkMode }) => {
  const rowClass = isDarkMode 
    ? 'hover:bg-slate-800/40 text-slate-300' 
    : 'hover:bg-slate-50/80 text-slate-600';

  const badgeClass = isDarkMode
    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    : 'bg-indigo-50 text-indigo-600 border-indigo-100';

  const textPrimary = isDarkMode ? 'text-slate-100' : 'text-slate-900';

  return (
    <tr className={`transition-colors duration-200 group ${rowClass}`}>
      <td className="py-4 px-6">
        <p className={`font-bold text-sm sm:text-base ${textPrimary} truncate max-w-[200px]`}>
          {event.name}
        </p>
      </td>
      <td className="py-4 px-6 truncate max-w-[150px] text-sm">
        <div className="flex items-center gap-2 opacity-80">
          <i className="fa-solid fa-location-dot text-xs"></i>
          <span className="truncate">{event.location}</span>
        </div>
      </td>
      <td className="py-4 px-6 text-sm font-medium opacity-90">
        {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>
      <td className="py-4 px-6">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${badgeClass}`}>
          {event.category}
        </span>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
          <Link 
            to={`/dashboard/tickets?eventId=${event.id}`}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all no-underline inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-ticket text-indigo-500"></i> <span className="hidden sm:inline">Billets</span>
          </Link>
          <Link 
            to={`/dashboard?eventId=${event.id}`}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-indigo-50 hover:bg-indigo-500 text-indigo-600 hover:text-white dark:bg-indigo-500/10 dark:hover:bg-indigo-500 dark:text-indigo-400 dark:hover:text-white rounded-lg text-xs font-bold transition-all no-underline inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-chart-simple"></i> <span className="hidden sm:inline">Stats</span>
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default EventRow;