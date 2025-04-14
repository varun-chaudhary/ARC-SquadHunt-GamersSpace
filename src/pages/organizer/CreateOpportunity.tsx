
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
import { Loader2 } from 'lucide-react';

const opportunitySchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100, { message: 'Title must be less than 100 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }).max(1000, { message: 'Description must be less than 1000 characters' }),
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

            <Button 
              type="submit" 
              className="w-full md:w-auto" 
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
          </form>
        </Form>
      </div>
    </OrganizerLayout>
  );
};

export default CreateOpportunity;
