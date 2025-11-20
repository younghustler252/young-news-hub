import { FaClock, FaTimesCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

export const StatusBadge = ({ status }) => {
    if (status === 'pending') {
        return (
            <>
                <span data-tooltip-id="status-tooltip" data-tooltip-content="Pending Approval">
                    <FaClock className="text-yellow-500 w-5 h-5" />
                </span>
                <Tooltip id="status-tooltip" place="top" />
            </>
        );
    }

    if (status === 'rejected') {
        return (
            <>
                <span data-tooltip-id="status-tooltip" data-tooltip-content="Post Rejected">
                    <FaTimesCircle className="text-red-600 w-5 h-5" />
                </span>
                <Tooltip id="status-tooltip" place="top" />
            </>
        );
    }

    return null;
};
