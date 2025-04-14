
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getOpportunities, joinOpportunity, getPlayerJoinedOpportunities } from '@/services/api';
import PlayerLayout from '@/components/player/PlayerLayout';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, User, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow, format } from 'date-fns';

const OpportunityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: allOpportunities, isLoading: isLoadingOpportunity } = useQuery({
    queryKey: ['opportunities'],
    queryFn: () => getOpportunities(1, 100),
  });

  const { data: joinedOpportunities, isLoading: isLoadingJoined } = useQuery({
    queryKey: ['player-joined-opportunities', user?.id],
    queryFn: () => user ? getPlayerJoinedOpportunities(user.id, 1, 100) : Promise.resolve({ data: [], meta: { total: 0, page: 1, limit: 100, totalPages: 0 } }),
    enabled: !!user,
  });

  const opportunity = allOpportunities?.data.find(opp => opp.id === id);
  
  // Check if the player has already joined this opportunity
  const hasJoined = joinedOpportunities?.data.some(opp => opp.id === id);

  const joinMutation = useMutation({
    mutationFn: () => {
      if (user && id) {
        return joinOpportunity(id, user.id);
      }
      throw new Error('User or opportunity ID is missing');
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'You have successfully joined this opportunity!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to join this opportunity. Please try again.',
        variant: 'destructive',
      });
      console.error('Error joining opportunity:', error);
    },
  });

  const handleJoin = () => {
    joinMutation.mutate();
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoadingOpportunity || isLoadingJoined) {
    return (
      <PlayerLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg font-medium">Loading...</span>
        </div>
      </PlayerLayout>
    );
  }

  if (!opportunity) {
    return (
      <PlayerLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Opportunity Not Found</h2>
          <p className="text-gray-500 mb-8">The opportunity you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </PlayerLayout>
    );
  }

  return (
    <PlayerLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <div className="ml-auto">
            {hasJoined || joinMutation.isSuccess ? (
              <div className="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Joined</span>
              </div>
            ) : (
              <Button 
                onClick={handleJoin} 
                disabled={joinMutation.isPending}
              >
                {joinMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Join Now'
                )}
              </Button>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800">{opportunity.title}</h1>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <User className="h-4 w-4 mr-1" />
            <span>Organized by {opportunity.organizer.name}</span>
            <span className="mx-2">•</span>
            <Calendar className="h-4 w-4 mr-1" />
            <span>Posted {formatDistanceToNow(new Date(opportunity.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="whitespace-pre-line">{opportunity.description}</p>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Organizer Information</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium">{opportunity.organizer.name}</h3>
            <p className="text-sm text-gray-500">{opportunity.organizer.email}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          {hasJoined || joinMutation.isSuccess ? (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                You've Joined This Opportunity
              </h3>
              <p className="text-green-600 mt-1">
                You're all set! The organizer will contact you with more details.
              </p>
            </div>
          ) : (
            <Button 
              className="w-full"
              onClick={handleJoin} 
              disabled={joinMutation.isPending}
            >
              {joinMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join This Opportunity'
              )}
            </Button>
          )}
        </div>
      </div>
    </PlayerLayout>
  );
};

export default OpportunityDetails;
