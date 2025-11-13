import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import FlexContainer from '../layout/containers/FlexContainer';
import Text from '../components/Text';
import Card from '../layout/containers/Card';
import Column from '../layout/containers/Column';
import { getJoinRequestsForTree } from '../services/joinRequestService';
import useToastStore from '../store/useToastStore';
import { useAuth } from '../context/AuthContext';
import JoinRequestCard from '../components/PendingRequestCard';
import { Clock } from 'lucide-react';
import { formatArrivalTime } from '../utils/featuresUtils/formatArrivalTime';

const PendingRequestsPage = () => {
  const { treeId } = useParams();
  const { currentUser } = useAuth();
  const addToast = useToastStore(state => state.addToast);
  const { onNotificationClick } = useOutletContext();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && treeId) {
      loadPendingRequests();
    }
  }, [currentUser, treeId]);

  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      const allRequests = await getJoinRequestsForTree(treeId);
      // Filter to only pending requests
      const pendingRequests = allRequests.filter(request => request.status === 'pending');
      setRequests(pendingRequests);
    } catch (error) {
      console.error('Error loading pending requests:', error);
      addToast('Failed to load pending requests', 'error');
    } finally {
      setLoading(false);
    }
  };



  const handleView = (request) => {
    // Open the notification details in the sidebar
    onNotificationClick({
      id: request.JoinRequestId,
      type: "joinRequest",
      title: `Join Request: ${request.name}`,
      description: `New join request from ${request.name} (${request.gender}). ${request.notes ? `Notes: ${request.notes}` : ''}`,
      createdAt: request.createdAt,
      icon: <Clock size={16} />,
      timeLabel: formatArrivalTime({ createdAt: request.createdAt }),
      details: `Join request details: ${request.name}, ${request.gender}, ${request.birthDate || 'No birth date'}, ${request.notes || 'No notes'}. Proof files: ${request.proofFiles.length}`,
      requestData: request // Pass full request data for sidebar
    });
  };

  if (loading) {
    return (
      <FlexContainer direction="vertical" padding="20px" gap="20px" align="center">
        <Text variant="heading2">Loading pending requests...</Text>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer direction="Column" gap="20px">
      <Column padding='0px' margin='0px' gap="20px">
        
          <Text variant="heading2" >
            Review and manage pending requests for your family tree
          </Text>

        {requests.length === 0 ? (
          <Card padding="40px" textAlign="center">
            <Clock size={48} color="var(--color-gray)" />
            <Text variant="heading3" margin="20px 0 10px 0">No Pending Requests</Text>
            <Text variant="body2" color="gray" margin="0 0 20px 0">
              There are currently no pending requests to review.
            </Text>
          </Card>
        ) : (
          <div className="notification-grid">
            {requests.map((request) => (
              <JoinRequestCard
                key={request.id}
                request={request}
                onClick={handleView}
              />
            ))}
          </div>
        )}
      </Column>
    </FlexContainer>
  );
};

export default PendingRequestsPage;
