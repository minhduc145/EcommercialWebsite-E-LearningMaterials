"use client"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationDemoProps {
    totalPages: number
    initialPage?: number
    currentPage?: number
    onPageChange?: (page: number) => void
}

export default function PaginationCluster({ totalPages = 10, initialPage = 1, currentPage, onPageChange }: PaginationDemoProps) {
    const actualPage = currentPage ?? initialPage

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return
        onPageChange?.(page)
    }

    // Calculate which page buttons to show
    const getPageButtons = () => {
        const maxButtons = 5
        const pageButtons = []

        if (totalPages <= maxButtons) {
            // If total pages is less than or equal to max buttons, show all pages
            for (let i = 1; i <= totalPages; i++) {
                pageButtons.push(i)
            }
        } else{
            // Always show first page
            pageButtons.push(1)

            if (actualPage <= 3) {
                // If current page is near the start
                pageButtons.push(2, 3, 4)
                pageButtons.push(null) // Ellipsis
            } else if (actualPage >= totalPages - 2) {
                // If current page is near the end
                pageButtons.push(null) // Ellipsis
                pageButtons.push(totalPages - 3, totalPages - 2, totalPages - 1)
            } else {
                // If current page is in the middle
                pageButtons.push(null) // Ellipsis
                pageButtons.push(actualPage - 1, actualPage, actualPage + 1)
                pageButtons.push(null) // Ellipsis
            }

            // Always show last page
            pageButtons.push(totalPages)
        }

        return pageButtons
    }

    const pageButtons = getPageButtons()

    return (
        <Pagination className="select-none">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(actualPage - 1)
                        }}
                        className={actualPage === 1 ? "pointer-events-none opacity-50" : ""}
                        aria-disabled={actualPage === 1}
                    />
                </PaginationItem>

                {pageButtons.map((page, index) =>
                    page === null ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handlePageChange(page)
                                }}
                                isActive={actualPage === page}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ),
                )}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(actualPage + 1)
                        }}
                        className={actualPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        aria-disabled={actualPage === totalPages}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
