"use client"

import { useEffect, useState } from "react"
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type SortingState,
    type ColumnFiltersState,
} from "@tanstack/react-table"

import { ArrowUpDown, Check, X, Trash, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { deleteMessage, getAllMessages } from "@/app/api/api-messages"
import type { MessageModel } from "@/models/MessageModel"
import { formatDateTime } from "@/lib/utils"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import MyToaster from "@/components/ui/toastify-template"

export default function MessageList() {
    const [data, setData] = useState<MessageModel[]>([])
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(0)

    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)

    const [keyWord, setKeyWord] = useState("")
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const [rowSelection, setRowSelection] = useState({})
    const [reset, setReset] = useState(false)
    const [selectedId, setSelectedId] = useState<number[]>([])

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    useEffect(() => {
        getAllMessages(pageIndex, sorting?.[0]?.id, sorting?.[0]?.desc, keyWord?.trim()).then((res) => {
            setData(res.data.content)
            setTotalPages(res.data.totalPages)
            setTotalElements(res.data.totalElements)
            setPageSize(res.data.size)
        })
    }, [pageIndex, sorting, reset])

    const onDelete = (id: number[]) => {
        deleteMessage(id)
            .then(() => { setIsDeleteModalOpen(false); setReset(!reset); setRowSelection({}) })
            .catch(()=>{})
    }

    const columns: ColumnDef<MessageModel>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <div className="px-1">
                    <Input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={table.getIsAllPageRowsSelected()}
                        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <Input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={row.getIsSelected()}
                        onChange={(e) => row.toggleSelected(!!e.target.checked)}
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0">
                    Mã tin nhắn <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0">
                    Ngày tạo <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{formatDateTime(row.getValue("createdAt"))}</div>,
        },
        {
            accessorKey: "isForEveryone",
            header: "Gửi tất cả",
            cell: ({ row }) =>
                row.getValue("isForEveryone") ? (
                    <div className="rounded-full h-6 w-6 bg-green-100 p-1">
                        <Check className="h-4 w-4 text-green-600" />
                    </div>
                ) : (
                    <div className="rounded-full h-6 w-6 bg-red-100 p-1">
                        <X className="h-4 w-4 text-red-600" />
                    </div>
                ),
        },
        {
            accessorKey: "title",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0">
                    Tiêu đề <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("title")}</div>,
        },
        {
            accessorKey: "message",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0">
                    Nội dung <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="max-h-[300px] overflow-auto">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: row.getValue("message")
                                ? row.getValue("message")
                                : "<p class='text-center font-light'><i class='mx-auto'>Không có dữ liệu</i><p>",
                        }}
                        className="w-[700px] break-words"
                    />
                </div>
            ),
        },
        {
            id: "receiverId",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0">
                    ID Nhận <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            accessorFn: (row) => row.receiver?.id,
            cell: ({ row }) => <div>{row.getValue("receiverId") ?? <span className="text-gray-500">[Không có]</span>}</div>,
        },
        {
            id: "senderId",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0">
                    ID Gửi <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            accessorFn: (row) => row.sender?.id,
            cell: ({ row }) => (
                <Badge variant="outline" className="font-normal">
                    {row.getValue("senderId") ?? <span className="text-gray-500">[Không có]</span>}
                </Badge>
            ),
        },
        {
            id: "action",
            cell: ({ row }) => (
                <Button
                    variant={"destructive"}
                    onClick={() => {
                        setSelectedId([row?.getValue("id")])
                        setIsDeleteModalOpen(true)
                    }}
                >
                    <Trash className="w-4 h-4" />
                </Button>
            ),
        },
    ]

    const table = useReactTable({
        data,
        columns,
        pageCount: totalPages,
        manualPagination: true,
        state: {
            pagination: { pageIndex, pageSize },
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        onPaginationChange: (updater) => {
            if (typeof updater === "function") {
                const newState = updater({ pageIndex, pageSize })
                setPageIndex(newState.pageIndex)
            } else {
                setPageIndex(updater.pageIndex)
            }
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
    })

    const selectedIds = Object.entries(rowSelection)
        .filter(([_, selected]) => selected)
        .map(([key]) => data[Number.parseInt(key)].id)

    return (
        <div className="w-full">
            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder="Tìm kiếm id, tiêu đề, nội dung..."
                    value={keyWord}
                    onChange={(e) => setKeyWord(e.currentTarget.value)}
                    className="max-w-sm"
                />
                <Button onClick={() => setReset(!reset)}>
                    <Search className="w-4 h-4" />
                </Button>
            </div>
            <div className="flex items-center justify-between gap-10">
                <p className="italic">
                    <b>Danh sách có tổng: </b>
                    {totalElements}
                </p>
                <div className="text-sm">
                    {selectedIds.length > 0 ? <><span className="font-medium">{selectedIds.length} mục đã chọn</span>&nbsp;<Button onClick={() => { setSelectedId(selectedIds); setIsDeleteModalOpen(true) }} variant={"outline"}>Xóa đã chọn</Button></> : null}
                </div>
            </div>


            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không có dữ liệu.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2">
                    <div className="text-sm text-muted-foreground">
                        Trang {pageIndex + 1} / {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
                        disabled={pageIndex === 0}
                    >
                        Trước
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageIndex((old) => old + 1)}
                        disabled={pageIndex + 1 >= totalPages}
                    >
                        Sau
                    </Button>
                </div>
            </div>
            <DeleteModal
                id={selectedId ?? []}
                handleDelete={onDelete}
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
            />
        </div>
    )
}

interface DeleteModalProps {
    id: number[];
    handleDelete: (id: number[]) => void;
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (open: boolean) => void;
};
function DeleteModal({ id, handleDelete, isDeleteModalOpen, setIsDeleteModalOpen }: DeleteModalProps) {
    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Xác nhận xóa:</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>Bạn có chắc chắn muốn xóa Thông báo có id: {id.join(", ")}</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(id)}>
                        Xóa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
