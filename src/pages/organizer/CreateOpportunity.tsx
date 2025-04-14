
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { createOpportunity } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import OrganizerLayout from '@/components/organizer/OrganizerLayout';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, MapPin, Users } from 'lucide-react';

const opportunitySchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100, { message: 'Title must be less than 100 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }).max(1000, { message: 'Description must be less than 1000 characters' }),
  eventDate: z.string().min(1, { message: 'Event date is required' }),
  location: z.string().min(5, { message: 'Location must be at least 5 characters' }).max(100, { message: 'Location must be less than 100 characters' }),
  capacity: z.number().min(1, { message: 'Capacity must be at least 1' }).max(1000, { message: 'Capacity must be less than 1000' }),
});

type OpportunityFormValues = z.infer<typeof opportunitySchema>;

const CreateOpportunity: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: '',
      description: '',
      eventDate: '',
      location: '',
      capacity: 10,
    },
  });

  const createOpportunityMutation = useMutation({
    mutationFn: (data: OpportunityFormValues) => createOpportunity({
      ...data,
      organizerId: user?.id,
    }),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Opportunity created successfully and is pending approval',
      });
      navigate('/organizer/opportunities');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create opportunity. Please try again.',
        variant: 'destructive',
      });
      console.error('Error creating opportunity:', error);
    },
  });

  const onSubmit = (data: OpportunityFormValues) => {
    createOpportunityMutation.mutate(data);
  };

  return (
    <OrganizerLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Create New Opportunity</h2>
          <p className="text-gray-500 mt-1">Fill out the form below to create a new opportunity</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter opportunity title" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear and catchy title for your opportunity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input 
                          type="date" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      When will this opportunity/event take place
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input 
                          placeholder="Enter location (City, Venue, or Online)" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Where will this opportunity/event be held
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input 
                          type="number" 
                          min="1" 
                          className="pl-10"
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Maximum number of participants
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your opportunity in detail..." 
                      className="min-h-[200px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description that includes all relevant information
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/organizer/opportunities')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createOpportunityMutation.isPending}
              >
                {createOpportunityMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Opportunity'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </OrganizerLayout>
  );
};

export default CreateOpportunity;
