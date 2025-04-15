
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getOpportunities, updateOpportunityStatus } from '@/services/api';
import { Opportunity, OpportunityStatus } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, User } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const status = searchParams.get('status') as OpportunityStatus | null;

  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      try {
        const response = await getOpportunities(page, limit, status || undefined);
        setOpportunities(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        toast({
          title: 'Error',
          description: 'Failed to load opportunities data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, [page, limit, status, toast]);

  const exportOpportunitiesToCSV = (data: Opportunity[]) => {
    const headers = ['ID', 'Title', 'Organizer', 'Status', 'Created At'];
    const rows = data.map((opportunity) => [
      opportunity.id,
      opportunity.title,
      opportunity.organizer.name,
      opportunity.status,
      new Date(opportunity.createdAt).toLocaleString(),
    ]);
  
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((row) => row.join(',')).join('\n');
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'opportunities.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  const handleStatusChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      newParams.delete('status');
    } else {
      newParams.set('status', value);
    }
    newParams.set('page', '1'); // Reset to first page on filter change
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const handleUpdateStatus = async (id: string, newStatus: OpportunityStatus) => {
    try {
      await updateOpportunityStatus(id, newStatus);
      
      // Optimistic update
      setOpportunities(opportunities.map(opp => 
        opp.id === id 
          ? { ...opp, status: newStatus } 
          : opp
      ));
      
      toast({
        title: 'Status Updated',
        description: `Opportunity status has been changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update the opportunity status.',
        variant: 'destructive',
      });
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'closed', label: 'Closed' },
  ];

  const getStatusBadgeColor = (status: OpportunityStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'closed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return '';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Opportunities Management</h1>
            <p className="text-muted-foreground">
              Manage all opportunities on the ARC platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={status || 'all'}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={() => exportOpportunitiesToCSV(opportunities)}>
              Export as CSV
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-admin-primary" />
              </div>
            ) : opportunities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-2">
                <Calendar className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-lg font-medium">No opportunities found</h3>
                <p className="text-sm text-muted-foreground">
                  {status ? `No opportunities with the status "${status}" found.` : 'No opportunities available.'}
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Organizer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {opportunities.map((opportunity) => (
                        <TableRow key={opportunity.id}>
                          <TableCell className="font-medium">{opportunity.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{opportunity.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {opportunity.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{opportunity.organizer.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(opportunity.status)} variant="secondary">
                              {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(opportunity.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Update Status
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateStatus(opportunity.id, 'pending')}
                                  disabled={opportunity.status === 'pending'}
                                >
                                  Set as Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateStatus(opportunity.id, 'approved')}
                                  disabled={opportunity.status === 'approved'}
                                >
                                  Set as Approved
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateStatus(opportunity.id, 'closed')}
                                  disabled={opportunity.status === 'closed'}
                                >
                                  Set as Closed
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {Math.min((page - 1) * limit + 1, meta.total)} to {Math.min(page * limit, meta.total)} of {meta.total} opportunities
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                      // Show 5 pages centered around current page
                      let pageNum;
                      if (meta.totalPages <= 5) {
                        pageNum = i + 1;
                      } else {
                        const start = Math.max(1, page - 2);
                        const end = Math.min(meta.totalPages, start + 4);
                        pageNum = start + i;
                        if (pageNum > end) return null;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className={pageNum === page ? 'bg-admin-primary hover:bg-admin-primary/90' : ''}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= meta.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default OpportunitiesPage;
