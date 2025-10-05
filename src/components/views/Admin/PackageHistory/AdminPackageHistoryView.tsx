"use client"

import { useState } from "react"
import { Search, Filter, Download, Eye, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Transaction = {
  id: string
  userId: number
  userName: string
  userEmail: string
  userAvatar?: string
  packageName: string
  points: number
  amount: number
  currency: string
  paymentMethod: string
  status: "completed" | "pending" | "failed" | "refunded"
  transactionDate: string
  transactionId: string
}

const initialTransactions: Transaction[] = [
  {
    id: "TXN-001",
    userId: 1,
    userName: "Sarah Johnson",
    userEmail: "sarah.johnson@example.com",
    userAvatar: "/candidate-sarah.jpg",
    packageName: "Popular Pack",
    points: 50,
    amount: 19.99,
    currency: "USD",
    paymentMethod: "Credit Card",
    status: "completed",
    transactionDate: "2025-06-22T10:30:00",
    transactionId: "ch_3NqK8vLkdIwHu7ix0B3n8KJq",
  },
  {
    id: "TXN-002",
    userId: 2,
    userName: "Michael Chen",
    userEmail: "michael.chen@example.com",
    userAvatar: "/candidate-michael.jpg",
    packageName: "Premium Pack",
    points: 250,
    amount: 79.99,
    currency: "USD",
    paymentMethod: "PayPal",
    status: "completed",
    transactionDate: "2025-06-22T09:15:00",
    transactionId: "ch_3NqK8vLkdIwHu7ix0B3n8KJr",
  },
  {
    id: "TXN-003",
    userId: 3,
    userName: "Emma Williams",
    userEmail: "emma.williams@example.com",
    userAvatar: "/candidate-emma.jpg",
    packageName: "Starter Pack",
    points: 10,
    amount: 4.99,
    currency: "USD",
    paymentMethod: "Credit Card",
    status: "completed",
    transactionDate: "2025-06-22T08:45:00",
    transactionId: "ch_3NqK8vLkdIwHu7ix0B3n8KJs",
  },
  {
    id: "TXN-004",
    userId: 4,
    userName: "David Brown",
    userEmail: "david.brown@example.com",
    userAvatar: "/candidate-david.jpg",
    packageName: "Power Pack",
    points: 100,
    amount: 34.99,
    currency: "USD",
    paymentMethod: "Credit Card",
    status: "pending",
    transactionDate: "2025-06-22T08:20:00",
    transactionId: "ch_3NqK8vLkdIwHu7ix0B3n8KJt",
  },
  {
    id: "TXN-005",
    userId: 5,
    userName: "Lisa Anderson",
    userEmail: "lisa.anderson@example.com",
    userAvatar: "/candidate-lisa.jpg",
    packageName: "Popular Pack",
    points: 50,
    amount: 19.99,
    currency: "USD",
    paymentMethod: "Debit Card",
    status: "failed",
    transactionDate: "2025-06-22T07:55:00",
    transactionId: "ch_3NqK8vLkdIwHu7ix0B3n8KJu",
  },
  {
    id: "TXN-006",
    userId: 6,
    userName: "James Wilson",
    userEmail: "james.wilson@example.com",
    userAvatar: "/candidate-james.jpg",
    packageName: "Starter Pack",
    points: 10,
    amount: 4.99,
    currency: "USD",
    paymentMethod: "Credit Card",
    status: "completed",
    transactionDate: "2025-06-21T18:30:00",
    transactionId: "ch_3NqK8vLkdIwHu7ix0B3n8KJv",
  },
  {
    id: "TXN-007",
    userId: 1,
    userName: "Sarah Johnson",
    userEmail: "sarah.johnson@example.com",
    userAvatar: "/candidate-sarah.jpg",
    packageName: "Power Pack",
    points: 100,
    amount: 34.99,
    currency: "USD",
    paymentMethod: "Credit Card",
    status: "refunded",
    transactionDate: "2025-06-21T16:20:00",
    transactionId: "ch_3NqK8vLkdIwHu7ix0B3n8KJw",
  },
  {
    id: "TXN-008",
    userId: 3,
    userName: "Emma Williams",
    userEmail: "emma.williams@example.com",
    userAvatar: "/candidate-emma.jpg",
    packageName: "Premium Pack",
    points: 250,
    amount: 79.99,
    currency: "USD",
    paymentMethod: "PayPal",
    status: "completed",
    transactionDate: "2025-06-21T14:10:00",
    transactionId: "ch_3NqK8vLkdIwHu7ix0B3n8KJx",
  },
]

export default function AdminPackageHistoryView() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const openViewDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsViewDialogOpen(true)
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const totalRevenue = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0)

  const totalTransactions = transactions.length
  const completedTransactions = transactions.filter((t) => t.status === "completed").length
  const pendingTransactions = transactions.filter((t) => t.status === "pending").length

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Package Purchase History</h1>
            <p className="text-gray-600 mt-1">Track all package transactions and purchases</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">$</span>
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Transactions</span>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{totalTransactions}</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Completed</span>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">✓</span>
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{completedTransactions}</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Pending</span>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">⏱</span>
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{pendingTransactions}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              className="pl-10 bg-white border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium text-gray-700">Transaction ID</TableHead>
                <TableHead className="font-medium text-gray-700">User</TableHead>
                <TableHead className="font-medium text-gray-700">Package</TableHead>
                <TableHead className="font-medium text-gray-700">Points</TableHead>
                <TableHead className="font-medium text-gray-700">Amount</TableHead>
                <TableHead className="font-medium text-gray-700">Payment Method</TableHead>
                <TableHead className="font-medium text-gray-700">Date</TableHead>
                <TableHead className="font-medium text-gray-700">Status</TableHead>
                <TableHead className="font-medium text-gray-700 w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={transaction.userAvatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {transaction.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{transaction.userName}</div>
                        <div className="text-xs text-gray-600">{transaction.userEmail}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{transaction.packageName}</TableCell>
                  <TableCell className="text-purple-600 font-medium">{transaction.points}</TableCell>
                  <TableCell className="font-medium">
                    {transaction.currency} ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gray-600">{transaction.paymentMethod}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{formatDate(transaction.transactionDate)}</TableCell>
                  <TableCell>
                    {transaction.status === "completed" && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Completed
                      </Badge>
                    )}
                    {transaction.status === "pending" && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        Pending
                      </Badge>
                    )}
                    {transaction.status === "failed" && (
                      <Badge variant="secondary" className="bg-red-100 text-red-700">
                        Failed
                      </Badge>
                    )}
                    {transaction.status === "refunded" && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Refunded
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openViewDialog(transaction)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Transaction Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Complete information about this transaction</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedTransaction.userAvatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {selectedTransaction.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-lg">{selectedTransaction.userName}</div>
                  <div className="text-sm text-gray-600">{selectedTransaction.userEmail}</div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Transaction ID</Label>
                    <p className="font-mono text-sm mt-1">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Payment ID</Label>
                    <p className="font-mono text-sm mt-1">{selectedTransaction.transactionId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Package</Label>
                    <p className="font-medium mt-1">{selectedTransaction.packageName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Voting Points</Label>
                    <p className="text-xl font-semibold text-purple-600 mt-1">{selectedTransaction.points}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Amount Paid</Label>
                    <p className="text-xl font-semibold mt-1">
                      {selectedTransaction.currency} ${selectedTransaction.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Payment Method</Label>
                    <p className="font-medium mt-1">{selectedTransaction.paymentMethod}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Transaction Date</Label>
                    <p className="mt-1">{formatDate(selectedTransaction.transactionDate)}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Status</Label>
                    <div className="mt-1">
                      {selectedTransaction.status === "completed" && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Completed
                        </Badge>
                      )}
                      {selectedTransaction.status === "pending" && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                          Pending
                        </Badge>
                      )}
                      {selectedTransaction.status === "failed" && (
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          Failed
                        </Badge>
                      )}
                      {selectedTransaction.status === "refunded" && (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          Refunded
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
