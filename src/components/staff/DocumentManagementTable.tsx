
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Eye, Search, Filter } from "lucide-react";

interface Document {
  id: string;
  type: string;
  recipient: string;
  issuedBy: string;
  issuedDate: string;
  status: string;
  downloadUrl: string;
}

interface DocumentManagementTableProps {
  documents: Document[];
}

export function DocumentManagementTable({ documents }: DocumentManagementTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Document History</CardTitle>
            <CardDescription>View and manage all issued documents</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Issued By</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-mono text-sm">{doc.id}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.recipient}</TableCell>
                <TableCell>{doc.issuedBy}</TableCell>
                <TableCell>{doc.issuedDate}</TableCell>
                <TableCell>
                  <Badge variant={doc.status === 'Active' ? 'default' : 'secondary'}>
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
